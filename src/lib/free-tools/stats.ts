/**
 * Anonymous score stats for the free tools that produce a score (click speed, pronunciation,
 * dictation practice). Type-only imports: runs in the Cloudflare Worker (KV) and locally.
 *
 * Each finished test adds its score to this week's numbers: count, sum and a histogram. Writes go
 * to one of 8 shards so busy weeks don't overwrite each other; reads add the shards up. A device
 * can add one score per tool a minute, and values are clamped to a sane range, so the
 * numbers can't be flooded. Nothing personal is stored.
 */
import type { KV } from "./limiter";

export type ScoreSpec = { unit: string; min: number; max: number; step: number };

export const SCORE_SPECS: Record<string, ScoreSpec> = {
  "click-speed-test": { unit: "CPS", min: 0, max: 25, step: 0.5 },
  "pronunciation-checker": { unit: "%", min: 0, max: 100, step: 5 },
  "dictation-practice": { unit: "%", min: 0, max: 100, step: 5 },
};

/** Below this many tests we don't show "you beat X%": the number wouldn't mean anything yet. */
export const MIN_TESTS = 30;
const SHARDS = 8;
const WEEK_TTL = 60 * 60 * 24 * 21;

type Bucket = { n: number; sum: number; hist: number[] };
export type ScoreStats = { n: number; avg: number; hist: number[]; step: number; min: number; unit: string };

/** ISO-ish week id, e.g. 2026-W48. */
export function weekId(d = new Date()): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = t.getUTCFullYear();
  const w = Math.ceil(((t.getTime() - Date.UTC(y, 0, 1)) / 86_400_000 + 1) / 7);
  return `${y}-W${String(w).padStart(2, "0")}`;
}

const bins = (s: ScoreSpec) => Math.round((s.max - s.min) / s.step) + 1;
const empty = (s: ScoreSpec): Bucket => ({ n: 0, sum: 0, hist: Array(bins(s)).fill(0) });

async function readWeek(kv: KV, tool: string, s: ScoreSpec, week: string): Promise<Bucket> {
  const parts = await Promise.all(Array.from({ length: SHARDS }, (_, i) => kv.get(`st:${week}:${tool}:${i}`)));
  const total = empty(s);
  for (const raw of parts) {
    if (!raw) continue;
    const b = JSON.parse(raw) as Bucket;
    total.n += b.n;
    total.sum += b.sum;
    b.hist.forEach((v, i) => (total.hist[i] = (total.hist[i] ?? 0) + v));
  }
  return total;
}

/** This week's stats; adds last week's when this week is still young. */
export async function readStats(kv: KV, tool: string): Promise<ScoreStats | null> {
  const s = SCORE_SPECS[tool];
  if (!s) return null;
  const now = await readWeek(kv, tool, s, weekId());
  let b = now;
  if (now.n < MIN_TESTS) {
    const prev = await readWeek(kv, tool, s, weekId(new Date(Date.now() - 7 * 86_400_000)));
    b = { n: now.n + prev.n, sum: now.sum + prev.sum, hist: now.hist.map((v, i) => v + (prev.hist[i] ?? 0)) };
  }
  return { n: b.n, avg: b.n ? Math.round((b.sum / b.n) * 10) / 10 : 0, hist: b.hist, step: s.step, min: s.min, unit: s.unit };
}

/** Adds one finished test. Returns false when the score was ignored (unknown tool, bad value, too soon). */
export async function recordScore(kv: KV, tool: string, value: number, dev: string): Promise<boolean> {
  const s = SCORE_SPECS[tool];
  if (!s || !Number.isFinite(value) || value < s.min || value > s.max) return false;
  const gate = `sr:${dev}:${tool}`;
  if (await kv.get(gate)) return false;
  await kv.put(gate, "1", { expirationTtl: 60 }); // one score per device per tool a minute
  const shard = Math.floor(Math.random() * SHARDS);
  const key = `st:${weekId()}:${tool}:${shard}`;
  const raw = await kv.get(key);
  const b: Bucket = raw ? JSON.parse(raw) : empty(s);
  b.n += 1;
  b.sum += value;
  const i = Math.min(b.hist.length - 1, Math.max(0, Math.round((value - s.min) / s.step)));
  b.hist[i] = (b.hist[i] ?? 0) + 1;
  await kv.put(key, JSON.stringify(b), { expirationTtl: WEEK_TTL });
  return true;
}

/** Share of this period's tests that scored lower than `value` (0-100). */
export function beatPercent(st: ScoreStats, value: number): number {
  if (!st.n) return 0;
  const i = Math.round((value - st.min) / st.step);
  let below = 0;
  for (let k = 0; k < Math.min(i, st.hist.length); k++) below += st.hist[k];
  return Math.round((below / st.n) * 100);
}
