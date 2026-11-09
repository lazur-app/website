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
import { DAILY_REFRESH, DEFAULT_DAILY_COUNTS, RAMP, TYPE_WEIGHTS } from "../../src/lib/content/sources.mjs";
import { ROOT, flags, nyDate, openManifest, pool, readType } from "./lib/core.mjs";
import { SPECS, generateOne } from "./lib/pipeline.mjs";
import { checkImageEnv } from "./lib/images.mjs";
import { checkModelEnv, overDailyBudget, todayTotals } from "./lib/agent.mjs";
import { wordCount } from "../../src/lib/content/keywords.mjs";
import { MIN_WORDS } from "../../src/lib/content/rules.mjs";

const f = flags(process.argv.slice(2));
const date = f.date ?? nyDate();
const runDir = path.join(f.out ? path.resolve(f.out) : ROOT, "content-runs", `daily-${date}`);
const concurrency = Number(f.concurrency ?? process.env.CONTENT_CONCURRENCY ?? 6);
const deadline = Date.now() + Number(f["max-minutes"] ?? 50) * 60_000;
const images = f["no-images"] !== "true" && f.images !== "false";
const outRoot = f.out ? path.resolve(f.out) : undefined;
if (outRoot) {
  // Preview runs never touch the real queues or the real discovered-roles file.
  process.env.CONTENT_PLAN_DIR = path.join(outRoot, "content/seo/_plan");
  const rolesCopy = path.join(outRoot, "roles-discovered.mjs");
  if (!fs.existsSync(rolesCopy)) {
    fs.mkdirSync(outRoot, { recursive: true });
    fs.copyFileSync(path.join(ROOT, "src/lib/content/roles-discovered.mjs"), rolesCopy);
  }
  process.env.CONTENT_ROLES_FILE ??= rolesCopy;
}

/** @type {Record<string, number>} */
const counts = {};
const TYPES = Object.keys(TYPE_WEIGHTS);
const manual = TYPES.some((k) => f[k] !== undefined) || Boolean(f.only);
const live = process.env.CONTENT_AGENT_FAKE !== "1" && !outRoot;
let source = "";

/** Split a daily total across types by TYPE_WEIGHTS. @param {number} total */
const split = (total) => {
  /** @type {Record<string, number>} */
  const out = {};
  let left = total;
  TYPES.forEach((k, i) => {
    const n = i === TYPES.length - 1 ? left : Math.round(total * TYPE_WEIGHTS[/** @type {keyof typeof TYPE_WEIGHTS} */ (k)]);
    out[k] = Math.max(0, n);
    left -= out[k];
  });
  return out;
};

if (manual) {
  for (const k of TYPES) counts[k] = f[k] !== undefined ? Number(f[k]) : f.only ? 0 : DEFAULT_DAILY_COUNTS[/** @type {keyof typeof DEFAULT_DAILY_COUNTS} */ (k)];
  if (f.only) for (const k of f.only.split(",")) counts[k] = Number(f[k] ?? DEFAULT_DAILY_COUNTS[/** @type {keyof typeof DEFAULT_DAILY_COUNTS} */ (k)] ?? 0);
  source = "flags";
} else if (process.env.CONTENT_DAILY_COUNTS) {
  const v = process.env.CONTENT_DAILY_COUNTS.trim();
  if (/^\d+$/.test(v)) Object.assign(counts, split(Number(v)));
  else for (const k of TYPES) counts[k] = Number(JSON.parse(v)[k] ?? 0);
  source = "CONTENT_DAILY_COUNTS";
} else {
  // The ramp: week 1 starts on the first real run and is written down once.
  const rampFile = path.join(ROOT, "content-runs", "ramp.json");
  /** @type {{ startDate: string }} */
  let ramp = fs.existsSync(rampFile) ? JSON.parse(fs.readFileSync(rampFile, "utf8")) : { startDate: date };
  if (live && !fs.existsSync(rampFile)) {
    fs.mkdirSync(path.dirname(rampFile), { recursive: true });
    fs.writeFileSync(rampFile, JSON.stringify({ startDate: date, note: "Week 1 of the automatic ramp. Delete this file to restart the ramp." }, null, 2) + "\n");
  }
  const day = Math.floor((Date.parse(`${date}T12:00:00Z`) - Date.parse(`${ramp.startDate}T12:00:00Z`)) / 86400_000);
  const step = [...RAMP].reverse().find((r) => day >= r.fromDay) ?? RAMP[0];
  Object.assign(counts, split(step.total));
  source = `ramp day ${day + 1} (started ${ramp.startDate}): ${step.total}/day`;
}
const refreshCount = Number(f.refresh ?? (manual ? 0 : DAILY_REFRESH));

// Fail fast on missing keys before any model call is spent.
if (images) checkImageEnv();
try {
  checkModelEnv();
} catch (e) {
  console.error(/** @type {Error} */ (e).message);
  process.exit(1);
}

const manifest = openManifest(runDir);
manifest.state.targets = { ...counts, refresh: refreshCount };
manifest.save();

console.log(`content daily ${date} [${source}]: ${JSON.stringify(counts)} refresh=${refreshCount} concurrency=${concurrency} images=${images}${process.env.CONTENT_AGENT_FAKE === "1" ? " (FAKE model)" : ""}`);

let stoppedForBudget = false;
/** @type {Set<number>} usage.jsonl lines already counted toward a page */
const countedLines = new Set();

/** Sum the cost of today's model calls made for one page, counting each call once. @param {string} key */
function itemCost(key) {
  const file = path.join(runDir, "usage.jsonl");
  if (!fs.existsSync(file)) return 0;
  let sum = 0;
  fs.readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (!line || countedLines.has(i)) return;
      try {
        const row = JSON.parse(line);
        const label = String(row.label ?? "");
        if (label.startsWith(`${key}:`) || label.startsWith(`${key}|`)) {
          sum += Number(row.cost_usd ?? 0);
          countedLines.add(i);
        }
      } catch {
        /* torn line */
      }
    });
  return sum;
}

/** @param {string} type @param {import("./lib/pipeline.mjs").Target} t @param {any} [existing] */
async function runItem(type, t, existing) {
  if (Date.now() > deadline) return;
  if (manifest.settled(t.key)) return;
  if (process.env.CONTENT_AGENT_FAKE !== "1" && overDailyBudget(runDir)) {
    stoppedForBudget = true;
    return;
  }
  const spec = SPECS[type];
  const started = Date.now();
  const r = await generateOne(spec, t, { runDir, images, outRoot, existing });
  const prev = manifest.state.items[t.key];
  // Deferred (search budget used up for today) does not count as an attempt: it runs again later.
  const attempts = (prev?.attempts ?? 0) + (r.status === "deferred" ? 0 : 1);
  // What this page cost: every model call made for it (labels start with the page key).
  const cost = itemCost(t.key) + (prev?.cost_usd ?? 0);
  manifest.state.items[t.key] = { type: existing ? "refresh" : type, status: r.status, file: r.file, url: r.url, reason: r.reason, at: new Date().toISOString(), attempts, cost_usd: Number(cost.toFixed(5)) };
  manifest.save();
  console.log(`${r.status.padEnd(7)} ${t.key} ${((Date.now() - started) / 1000).toFixed(0)}s${r.reason ? `  ${r.reason}` : ""}`);
}

// New pages, one type at a time so planners do not race.
// A type with nothing left to write (all apps covered, say) hands its share to the next type.
let carry = 0;
for (const [flag, base] of Object.entries(counts)) {
  const spec = SPECS[flag];
  const target = base + carry;
  carry = 0;
  if (!spec || target <= 0) continue;
  const missing = target - manifest.doneCount(flag);
  if (missing <= 0) continue;
  let targets;
  try {
    targets = (await spec.next(missing + 5)).filter((t) => !manifest.settled(t.key)).slice(0, missing);
  } catch (e) {
    console.error(`planner for ${flag} failed: ${/** @type {Error} */ (e).message}`);
    carry = missing;
    continue;
  }
  if (!manual && targets.length < missing) carry = missing - targets.length;
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
  for (const p of readType("problem")) add("problems", p, { role: p.role, slug: p.slug, task: p.problem, title: p.title, targetKeyword: p.targetKeyword });
  for (const p of [...readType("compare"), ...readType("alternatives")])
    add("compare", p, { kind: p.kind, pageType: p.type, slug: p.slug, title: p.title, keyword: p.targetKeyword, products: p.products.filter((/** @type {any} */ x) => !x.isLazur).map((/** @type {any} */ x) => x.slug) });
  for (const p of readType("blog")) add("blog", p, { slug: p.slug, title: p.title, targetKeyword: p.targetKeyword ?? p.title });
  // Thin pages (under the word minimum) first, whatever their age; then anything older than 30 days.
  const thin = (/** @type {any} */ c) => wordCount(c.existing) < MIN_WORDS;
  const stale = candidates
    .filter((c) => thin(c) || c.at < nyDate(new Date(Date.now() - 30 * 86400_000)))
    .sort((a, b) => Number(thin(b)) - Number(thin(a)) || a.at.localeCompare(b.at));
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
  `Content ${date}: ${n("done")} written, ${n("refused")} refused, ${n("failed")} failed, ${n("deferred")} deferred`,
  "",
  ...Object.keys(SPECS).map((flag) => `- ${flag}: ${manifest.doneCount(flag)}/${counts[flag] ?? 0}`),
  "",
  ...items.filter(([, i]) => i.status === "done").map(([k, i]) => `${k} ${i.url ?? ""}`),
];
fs.writeFileSync(path.join(runDir, "summary.md"), lines.join("\n") + "\n");
console.log("\n" + lines.slice(0, 2 + Object.keys(SPECS).length).join("\n"));
if (Date.now() > deadline) console.log("stopped at the time limit; the next run resumes.");
if (stoppedForBudget) console.log("stopped at the daily spend limit (CONTENT_MAX_USD_PER_DAY); tomorrow resumes.");
const totals = todayTotals(runDir);
const doneCount = n("done");
console.log(`model spend today: $${totals.usd.toFixed(2)}, search queries today: ${totals.searches}${doneCount ? `, about $${(totals.usd / doneCount).toFixed(3)} a page` : ""}`);

// Cost ledger for every day so far: content-runs/COSTS.md (committed with the content).
{
  const base = path.dirname(runDir);
  const days = fs
    .readdirSync(base)
    .filter((d) => /^daily-\d{4}-\d{2}-\d{2}$/.test(d))
    .sort();
  const rows = days.map((d) => {
    const t = todayTotals(path.join(base, d));
    let pages = 0;
    try {
      pages = Object.values(JSON.parse(fs.readFileSync(path.join(base, d, "manifest.json"), "utf8")).items).filter((/** @type {any} */ i) => i.status === "done").length;
    } catch {
      /* no manifest yet */
    }
    return { day: d.replace("daily-", ""), pages, usd: t.usd, searches: t.searches };
  });
  const total = rows.reduce((a, r) => ({ pages: a.pages + r.pages, usd: a.usd + r.usd, searches: a.searches + r.searches }), { pages: 0, usd: 0, searches: 0 });
  const md = [
    "# Content job costs",
    "",
    "Model and search spend at Google list prices, summed from usage.jsonl (every call is logged with its cost). Pages are the ones written that day; each page's own cost is in that day's manifest.json.",
    "",
    "| Day | Pages | Searches | Cost | Per page |",
    "| --- | ---: | ---: | ---: | ---: |",
    ...rows.map((r) => `| ${r.day} | ${r.pages} | ${r.searches} | $${r.usd.toFixed(2)} | ${r.pages ? `$${(r.usd / r.pages).toFixed(3)}` : "-"} |`),
    `| **Total** | **${total.pages}** | **${total.searches}** | **$${total.usd.toFixed(2)}** | ${total.pages ? `**$${(total.usd / total.pages).toFixed(3)}**` : "-"} |`,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(base, "COSTS.md"), md);
}
