#!/usr/bin/env node
// @ts-check
/**
 * The daily content job (SRCo's content-daily pattern). Run hourly by
 * .github/workflows/content-daily.yml; each run picks up where the last one stopped.
 *
 *   node scripts/content/daily.mjs                      # default counts from sources.mjs
 *   node scripts/content/daily.mjs --howto=10 --apps=0  # per-type counts
 *   node scripts/content/daily.mjs --refresh=20         # also rewrite the 20 stalest pages
 *   CONTENT_AGENT_FAKE=1 node scripts/content/daily.mjs --howto=2 --no-images --out=/tmp/preview
 *
 * State: content-runs/daily-<New York date>/{manifest.json, usage.jsonl, refused.jsonl, summary.md}.
 * Counts are per day: a second run on the same date only writes what is still missing.
 */
import fs from "node:fs";
import path from "node:path";
import { DEFAULT_DAILY_COUNTS } from "../../src/lib/content/sources.mjs";
import { ROOT, flags, nyDate, openManifest, pool, readType } from "./lib/core.mjs";
import { SPECS, generateOne } from "./lib/pipeline.mjs";

const f = flags(process.argv.slice(2));
const date = f.date ?? nyDate();
const runDir = path.join(f.out ? path.resolve(f.out) : ROOT, "content-runs", `daily-${date}`);
const concurrency = Number(f.concurrency ?? process.env.CONTENT_CONCURRENCY ?? 4);
const deadline = Date.now() + Number(f["max-minutes"] ?? 50) * 60_000;
const images = f["no-images"] !== "true" && f.images !== "false";
const outRoot = f.out ? path.resolve(f.out) : undefined;
if (outRoot) process.env.CONTENT_PLAN_DIR = path.join(outRoot, "content/seo/_plan");

/** @type {Record<string, number>} */
const counts = {};
for (const [k, v] of Object.entries(DEFAULT_DAILY_COUNTS)) counts[k] = f[k] !== undefined ? Number(f[k]) : f["only"] ? 0 : v;
if (f.only) for (const k of f.only.split(",")) counts[k] = Number(f[k] ?? DEFAULT_DAILY_COUNTS[/** @type {keyof typeof DEFAULT_DAILY_COUNTS} */ (k)] ?? 0);
const refreshCount = Number(f.refresh ?? 0);

const manifest = openManifest(runDir);
manifest.state.targets = { ...counts, refresh: refreshCount };
manifest.save();

console.log(`content daily ${date}: ${JSON.stringify(counts)} refresh=${refreshCount} concurrency=${concurrency} images=${images}${process.env.CONTENT_AGENT_FAKE === "1" ? " (FAKE model)" : ""}`);

/** @param {string} type @param {import("./lib/pipeline.mjs").Target} t @param {any} [existing] */
async function runItem(type, t, existing) {
  if (Date.now() > deadline) return;
  if (manifest.settled(t.key)) return;
  const spec = SPECS[type];
  const started = Date.now();
  const r = await generateOne(spec, t, { runDir, images, outRoot, existing });
  const prev = manifest.state.items[t.key];
  manifest.state.items[t.key] = { type: existing ? "refresh" : type, status: r.status, file: r.file, url: r.url, reason: r.reason, at: new Date().toISOString(), attempts: (prev?.attempts ?? 0) + 1 };
  manifest.save();
  console.log(`${r.status.padEnd(7)} ${t.key} ${((Date.now() - started) / 1000).toFixed(0)}s${r.reason ? `  ${r.reason}` : ""}`);
}

// New pages, one type at a time so planners do not race.
for (const [flag, target] of Object.entries(counts)) {
  const spec = SPECS[flag];
  if (!spec || target <= 0) continue;
  const missing = target - manifest.doneCount(flag);
  if (missing <= 0) continue;
  let targets;
  try {
    targets = (await spec.next(missing + 5)).filter((t) => !manifest.settled(t.key)).slice(0, missing);
  } catch (e) {
    console.error(`planner for ${flag} failed: ${/** @type {Error} */ (e).message}`);
    continue;
  }
  await pool(
    concurrency,
    targets.map((t) => () => runItem(flag, t)),
  );
}

// Refresh: the stalest existing pages, rewritten against fresh research.
if (refreshCount > 0) {
  /** @type {{ flag: string, t: any, existing: any, at: string }[]} */
  const candidates = [];
  const add = (/** @type {string} */ flag, /** @type {any} */ p, /** @type {any} */ t) => candidates.push({ flag, t: { ...t, key: `refresh:${p.type}:${p.slug}` }, existing: p, at: String(p.updatedAt ?? p.publishedAt ?? "2000-01-01") });
  for (const p of readType("howto")) add("howto", p, { slug: p.slug, app: p.app, task: p.task, targetKeyword: p.targetKeyword });
  for (const p of readType("app")) add("apps", p, { app: p.app, keyword: p.targetKeyword });
  for (const p of readType("role")) add("roles", p, { role: p.role, keyword: p.targetKeyword });
  for (const p of readType("role-app")) add("role-apps", p, { role: p.role, app: p.app, keyword: p.targetKeyword });
  for (const p of [...readType("compare"), ...readType("alternatives")])
    add("compare", p, { kind: p.kind, pageType: p.type, slug: p.slug, title: p.title, keyword: p.targetKeyword, products: p.products.filter((/** @type {any} */ x) => !x.isLazur).map((/** @type {any} */ x) => x.slug) });
  for (const p of readType("blog")) add("blog", p, { slug: p.slug, title: p.title, targetKeyword: p.targetKeyword ?? p.title });
  const stale = candidates.sort((a, b) => a.at.localeCompare(b.at)).filter((c) => c.at < nyDate(new Date(Date.now() - 30 * 86400_000)));
  await pool(
    concurrency,
    stale.slice(0, refreshCount).map((c) => () => runItem(c.flag, c.t, c.existing)),
  );
}

// Summary for the commit message and the Actions log.
const items = Object.entries(manifest.state.items);
/** @param {string} s */
const n = (s) => items.filter(([, i]) => i.status === s).length;
const lines = [
  `Content ${date}: ${n("done")} written, ${n("refused")} refused, ${n("failed")} failed`,
  "",
  ...Object.keys(SPECS).map((flag) => `- ${flag}: ${manifest.doneCount(flag)}/${counts[flag] ?? 0}`),
  "",
  ...items.filter(([, i]) => i.status === "done").map(([k, i]) => `${k} ${i.url ?? ""}`),
];
fs.writeFileSync(path.join(runDir, "summary.md"), lines.join("\n") + "\n");
console.log("\n" + lines.slice(0, 2 + Object.keys(SPECS).length).join("\n"));
if (Date.now() > deadline) console.log("stopped at the time limit; the next run resumes.");
