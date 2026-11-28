/**
 * Daily limit for the AI free tools. No imports on purpose: the same file runs in the Cloudflare
 * Worker (edge/src/index.ts, backed by KV, the real limit) and in the Next route (in-memory, for
 * local testing and as a backstop).
 *
 *  - 3 free runs a day per device (cookie `lz_dev`, shared across all *.lazur.app tools).
 *  - Leaving an email unlocks 3 more that day (6 a day on that device from then on).
 *  - Sending feedback from the Lazur Mac app (signed in with that email) gives a 20-day pass:
 *    50 runs a day. The 50 is stated only in the terms (lazur.app/terms#free-tools).
 *  - A looser per-IP ceiling (5x) catches people who clear cookies, without punishing shared offices.
 * Failed runs are refunded, so an error never costs the visitor a run.
 */
export type KV = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
};

export const FREE_RUNS = 3;
export const UNLOCKED_RUNS = 6;
export const PASS_RUNS = 50;
export const PASS_DAYS = 20;
export const IP_FACTOR = 5;
const DAY_TTL = 60 * 60 * 36;

export type Who = { dev: string; ip: string };
export type Stage = "free" | "unlocked" | "pass";
export type Standing = { left: number; limit: number; unlocked: boolean; stage: Stage; email: string | null; passUntil: string | null };

export const todayUTC = () => new Date().toISOString().slice(0, 10);

const devKey = (day: string, w: Who) => `n:${day}:d:${w.dev}`;
const ipKey = (day: string, w: Who) => `n:${day}:i:${w.ip}`;
const num = async (kv: KV, key: string) => Number((await kv.get(key)) ?? 0) || 0;

export async function standing(kv: KV, w: Who, day = todayUTC()): Promise<Standing & { devN: number; ipN: number }> {
  const [u, p, email] = await Promise.all([kv.get(`u:${w.dev}`), kv.get(`p:${w.dev}`), kv.get(`d:${w.dev}`)]);
  const pass = p && p > new Date().toISOString() ? p : null;
  const unlocked = u !== null;
  const stage: Stage = pass ? "pass" : unlocked ? "unlocked" : "free";
  const limit = pass ? PASS_RUNS : unlocked ? UNLOCKED_RUNS : FREE_RUNS;
  const [devN, ipN] = await Promise.all([num(kv, devKey(day, w)), num(kv, ipKey(day, w))]);
  const left = Math.max(0, Math.min(limit - devN, limit * IP_FACTOR - ipN));
  return { left, limit, unlocked, stage, email, passUntil: pass, devN, ipN };
}

/** Uses one run if there is one left. */
export async function consume(kv: KV, w: Who, day = todayUTC()): Promise<{ ok: boolean } & Standing> {
  const s = await standing(kv, w, day);
  const base = { limit: s.limit, unlocked: s.unlocked, stage: s.stage, email: s.email, passUntil: s.passUntil };
  if (s.left <= 0) return { ok: false, left: 0, ...base };
  await Promise.all([kv.put(devKey(day, w), String(s.devN + 1), { expirationTtl: DAY_TTL }), kv.put(ipKey(day, w), String(s.ipN + 1), { expirationTtl: DAY_TTL })]);
  return { ok: true, left: s.left - 1, ...base };
}

/** Gives a run back (the tool failed, so it shouldn't count). */
export async function refund(kv: KV, w: Who, day = todayUTC()): Promise<void> {
  const [d, i] = await Promise.all([num(kv, devKey(day, w)), num(kv, ipKey(day, w))]);
  await Promise.all([kv.put(devKey(day, w), String(Math.max(0, d - 1)), { expirationTtl: DAY_TTL }), kv.put(ipKey(day, w), String(Math.max(0, i - 1)), { expirationTtl: DAY_TTL })]);
}

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

/** Saves the email and unlocks more runs on this device. */
export async function signUp(
  kv: KV,
  w: Who,
  email: string,
  tool: string,
  extra: { country?: string } = {},
  day = todayUTC(),
): Promise<{ ok: true; left: number } | { ok: false; message: string }> {
  const clean = email.trim().toLowerCase();
  if (!EMAIL.test(clean)) return { ok: false, message: "That email doesn't look right. Check it and try again." };
  const tries = await num(kv, `s:${day}:${w.ip}`);
  if (tries >= 20) return { ok: false, message: "Too many tries. Please try again tomorrow." };
  await kv.put(`s:${day}:${w.ip}`, String(tries + 1), { expirationTtl: DAY_TTL });
  await kv.put(`e:${clean}`, JSON.stringify({ tool, at: new Date().toISOString(), country: extra.country ?? null, dev: w.dev }));
  await kv.put(`u:${w.dev}`, "1", { expirationTtl: 60 * 60 * 24 * 365 });
  await kv.put(`d:${w.dev}`, clean, { expirationTtl: 60 * 60 * 24 * 365 });
  const s = await standing(kv, w, day);
  return { ok: true, left: s.left };
}

/**
 * Gives the 20-day pass once the visitor has sent feedback from the Lazur app. `hasFeedback`
 * asks the Lazur backend about the email they signed up with (null = couldn't check).
 */
export async function claimPass(
  kv: KV,
  w: Who,
  hasFeedback: (email: string) => Promise<boolean | null>,
): Promise<{ ok: true; passUntil: string; left: number } | { ok: false; message: string }> {
  const email = await kv.get(`d:${w.dev}`);
  if (!email) return { ok: false, message: "Leave your email first, then send us feedback from the Lazur app with that same email." };
  const has = await hasFeedback(email);
  if (has === null) return { ok: false, message: "We couldn't check right now. Please try again in a minute." };
  if (!has) return { ok: false, message: `We haven't got feedback from ${email} yet. Open Lazur, sign in with ${email}, and send us a note from the app.` };
  const until = new Date(Date.now() + PASS_DAYS * 86_400_000).toISOString();
  await kv.put(`p:${w.dev}`, until, { expirationTtl: PASS_DAYS * 86_400 });
  await kv.put(`pe:${email}`, until, { expirationTtl: PASS_DAYS * 86_400 });
  const s = await standing(kv, w);
  return { ok: true, passUntil: until, left: s.left };
}

/**
 * Asks the Lazur backend whether this email has sent feedback from the app.
 * GET {apiBase}/internal/free-tools/feedback-status?email=… with header x-internal-key.
 * Returns null when it can't tell (not configured, network error), so the visitor can try again.
 */
export async function checkFeedback(email: string, apiBase: string | undefined, key: string | undefined): Promise<boolean | null> {
  if (!apiBase || !key) return null;
  try {
    const res = await fetch(`${apiBase.replace(/\/$/, "")}/internal/free-tools/feedback-status?email=${encodeURIComponent(email)}`, { headers: { "x-internal-key": key } });
    if (!res.ok) return null;
    const d = (await res.json()) as { has_feedback?: boolean };
    return d.has_feedback === true;
  } catch {
    return null;
  }
}

/** A small in-memory KV for tests and local development. */
export function memoryKV(): KV & { dump(): Map<string, string> } {
  const m = new Map<string, string>();
  return {
    async get(k) {
      return m.get(k) ?? null;
    },
    async put(k, v) {
      m.set(k, v);
    },
    dump: () => m,
  };
}
