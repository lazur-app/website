// @ts-check
/**
 * Shared plumbing for the generators: where files live, what already exists, the daily manifest,
 * the refused-items log and a small concurrency pool.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../..");

/** Folder per page type (mirrors src/lib/seo-pages/routes.ts CONTENT_DIRS). */
export const DIRS = {
  howto: "content/seo/howto",
  app: "content/seo/apps",
  role: "content/seo/roles",
  "role-app": "content/seo/role-apps",
  problem: "content/seo/problems",
  compare: "content/seo/compare",
  alternatives: "content/seo/alternatives",
  blog: "content/blog",
};

/** URL per page (mirrors seoPath in src/lib/seo-pages/routes.ts). @param {any} p */
export function urlFor(p) {
  switch (p.type) {
    case "howto":
      return `/how-to/${p.slug}`;
    case "app":
      return `/apps/${p.slug}`;
    case "role":
      return `/for/${p.slug}`;
    case "role-app":
      return `/for/${p.role}/${p.app}`;
    case "problem":
      return `/for/${p.role}/problems/${p.slug}`;
    case "compare":
      return `/compare/${p.slug}`;
    case "alternatives":
      return `/alternatives/${p.slug}`;
    case "blog":
      return `/blog/${p.slug}`;
  }
  return "/";
}

/** File name per page. @param {any} p */
export const fileFor = (p) =>
  path.join(ROOT, DIRS[/** @type {keyof typeof DIRS} */ (p.type)], p.type === "role-app" ? `${p.role}--${p.app}.json` : p.type === "problem" ? `${p.role}--${p.slug}.json` : p.type === "blog" ? `${p.slug}.md` : `${p.slug}.json`);

/** @param {string} type @returns {any[]} */
export function readType(type) {
  const dir = path.join(ROOT, DIRS[/** @type {keyof typeof DIRS} */ (type)]);
  if (!fs.existsSync(dir)) return [];
  if (type === "blog") {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_") && f.toLowerCase() !== "readme.md")
      .map((f) => {
        const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
        return { ...data, type: "blog", slug: f.replace(/\.md$/, ""), body: content, file: path.join(dir, f) };
      });
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .map((f) => ({ ...JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")), type, file: path.join(dir, f) }));
}

export const ALL_TYPES = ["howto", "app", "role", "role-app", "problem", "compare", "alternatives", "blog"];

/** Every page on the site, for links, dedupe and the lint. */
export function readAll() {
  return ALL_TYPES.flatMap((t) => readType(t));
}

/** Paths a page may link to: every existing page, hubs, tools and the core pages. */
export function allowedPaths() {
  const s = new Set(["/", "/exclusive-access", "/download", "/pricing", "/blog", "/compare", "/alternatives", "/apps", "/how-to", "/for", "/tools", "/changelog", "/privacy", "/support", "/terms"]);
  for (const t of ["typing-speed-test", "speaking-vs-typing-test", "typing-tax-calculator", "dictation-accuracy-checker"]) s.add(`/tools/${t}`);
  for (const p of readAll()) s.add(urlFor(p));
  for (const p of readType("howto")) s.add(`/how-to/app/${p.app}`);
  for (const p of readType("problem")) s.add(`/for/${p.role}/problems`);
  return s;
}

/** @param {any} page */
export function savePage(page) {
  const file = fileFor(page);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { file: _f, imageQueries: _q, ...clean } = page;
  fs.writeFileSync(file, JSON.stringify(clean, null, 2) + "\n");
  return file;
}

/** Date in New York, the day boundary the daily job uses. */
export function nyDate(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export const today = () => nyDate();

/**
 * Resumable run state: content-runs/daily-<date>/manifest.json.
 * @param {string} runDir
 */
export function openManifest(runDir) {
  fs.mkdirSync(runDir, { recursive: true });
  const file = path.join(runDir, "manifest.json");
  /** @type {{ date: string, startedAt: string, updatedAt: string, targets: Record<string, number>, items: Record<string, { type: string, status: "done"|"refused"|"failed", file?: string, url?: string, at: string, reason?: string, attempts: number }> }} */
  const state = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, "utf8"))
    : { date: path.basename(runDir).replace("daily-", ""), startedAt: new Date().toISOString(), updatedAt: "", targets: {}, items: {} };
  const save = () => {
    state.updatedAt = new Date().toISOString();
    fs.writeFileSync(file, JSON.stringify(state, null, 2) + "\n");
  };
  /** @param {string} type */
  const doneCount = (type) => Object.values(state.items).filter((i) => i.type === type && i.status === "done").length;
  /** @param {string} key */
  const settled = (key) => {
    const it = state.items[key];
    return Boolean(it && (it.status === "done" || it.status === "refused" || it.attempts >= 2));
  };
  return { state, save, doneCount, settled, file };
}

/**
 * @param {string} runDir
 * @param {Record<string, unknown>} row
 */
export function logRefused(runDir, row) {
  fs.mkdirSync(runDir, { recursive: true });
  fs.appendFileSync(path.join(runDir, "refused.jsonl"), JSON.stringify({ at: new Date().toISOString(), ...row }) + "\n");
}

/**
 * Run tasks with at most `n` in flight.
 * @template T
 * @param {number} n
 * @param {(() => Promise<T>)[]} tasks
 */
export async function pool(n, tasks) {
  /** @type {T[]} */
  const results = [];
  let i = 0;
  const workers = Array.from({ length: Math.max(1, n) }, async () => {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  });
  await Promise.all(workers);
  return results;
}

/** Parse --key=value flags. @param {string[]} argv */
export function flags(argv) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const a of argv) {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    if (m) out[m[1]] = m[2] ?? "true";
  }
  return out;
}

/** @param {string} file */
export function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

/** @param {string} file @param {any[]} rows */
export function writeJsonl(file, rows) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, rows.map((r) => JSON.stringify(r)).join("\n") + (rows.length ? "\n" : ""));
}
