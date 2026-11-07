#!/usr/bin/env node
// @ts-check
/**
 * One-off: move every content image from Vercel Blob to Cloudflare R2.
 *
 * The Hobby Blob store was suspended (usage limit), so its files can't be downloaded. Instead each
 * image is rebuilt from its source: the page's credit.sourceUrl gives the Pixabay photo id, the
 * photo is fetched again through the Pixabay API, re-encoded with the same keyword metadata, and
 * uploaded to R2 under the SAME path (content-images/<type>/<slug>/<name>.jpg). Then every content
 * file has the Blob host replaced with R2_PUBLIC_URL (https://images.lazur.app).
 *
 *   node scripts/content/migrate-images-to-r2.mjs --dry-run   # count only, no network
 *   node scripts/content/migrate-images-to-r2.mjs             # rebuild + upload + rewrite
 *
 * Needs PIXABAY_API_KEY and the R2_* variables (see lib/r2.mjs). Safe to re-run: progress is kept in
 * content-runs/migrate-r2/done.json and finished images are skipped.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { encodeWithMetadata } from "./lib/images.mjs";
import { r2Configured, r2Put, r2PublicUrl } from "./lib/r2.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const BLOB_HOST = "https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com";
const DRY = process.argv.includes("--dry-run");
const STATE_DIR = path.join(ROOT, "content-runs/migrate-r2");
const DONE_FILE = path.join(STATE_DIR, "done.json");
const FAIL_FILE = path.join(STATE_DIR, "failed.json");

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  /** @type {string[]} */
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(json|md|mdx)$/.test(e.name)) out.push(p);
  }
  return out;
}

/** Collect image objects ({url, alt, credit.sourceUrl, ...}) from any parsed structure. */
/** @param {any} node @param {Map<string, any>} into */
function collect(node, into) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) return node.forEach((n) => collect(n, into));
  if (typeof node.url === "string" && node.url.startsWith(BLOB_HOST) && node.credit?.sourceUrl) {
    if (!into.has(node.url)) into.set(node.url, node);
  }
  for (const v of Object.values(node)) collect(v, into);
}

const files = walk(path.join(ROOT, "content")).filter((f) => fs.readFileSync(f, "utf8").includes(BLOB_HOST));
/** @type {Map<string, any>} */
const images = new Map();
for (const f of files) {
  const text = fs.readFileSync(f, "utf8");
  try {
    collect(f.endsWith(".json") ? JSON.parse(text) : matter(text).data, images);
  } catch (e) {
    console.warn(`skip parse ${path.relative(ROOT, f)}: ${/** @type {Error} */ (e).message}`);
  }
}
/** every distinct Blob URL that appears anywhere, with or without metadata */
const allUrls = new Set();
for (const f of files) for (const m of fs.readFileSync(f, "utf8").matchAll(/https:\/\/lfobmih1tpj3sgpo\.public\.blob\.vercel-storage\.com\/[^\s"'<>)]+/g)) allUrls.add(m[0]);
const noMeta = [...allUrls].filter((u) => !images.has(u));
console.log(`files with Blob URLs: ${files.length}; distinct URLs: ${allUrls.size}; with source metadata: ${images.size}; without: ${noMeta.length}`);
if (noMeta.length) console.log("without metadata (not rebuilt):\n  " + noMeta.slice(0, 20).join("\n  "));
if (DRY) process.exit(0);

if (!process.env.PIXABAY_API_KEY) throw new Error("PIXABAY_API_KEY is not set");
if (!r2Configured()) throw new Error("R2 is not configured (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)");

fs.mkdirSync(STATE_DIR, { recursive: true });
/** @type {Record<string, string>} */
const done = fs.existsSync(DONE_FILE) ? JSON.parse(fs.readFileSync(DONE_FILE, "utf8")) : {};
/** @type {Record<string, string>} */
const failed = {};
const save = () => {
  fs.writeFileSync(DONE_FILE, JSON.stringify(done, null, 1) + "\n");
  fs.writeFileSync(FAIL_FILE, JSON.stringify(failed, null, 1) + "\n");
};

// Pixabay: 100 requests / 60 s. Keep a simple token bucket well under that.
let remaining = 90;
let windowEnd = Date.now() + 60_000;
const sleep = (/** @type {number} */ ms) => new Promise((r) => setTimeout(r, ms));
async function pixabayById(/** @type {string} */ id) {
  if (Date.now() > windowEnd) { remaining = 90; windowEnd = Date.now() + 60_000; }
  if (remaining <= 0) { await sleep(windowEnd - Date.now() + 500); remaining = 90; windowEnd = Date.now() + 60_000; }
  remaining--;
  const u = new URL("https://pixabay.com/api/");
  u.searchParams.set("key", /** @type {string} */ (process.env.PIXABAY_API_KEY));
  u.searchParams.set("id", id);
  const res = await fetch(u);
  if (res.status === 429) { await sleep(30_000); return pixabayById(id); }
  if (!res.ok) throw new Error(`Pixabay ${res.status}`);
  const hit = (await res.json()).hits?.[0];
  if (!hit) throw new Error("photo no longer on Pixabay");
  return hit;
}

const todo = [...images.entries()].filter(([url]) => !done[url]);
console.log(`to rebuild: ${todo.length} (already done: ${Object.keys(done).length})`);
let n = 0;
async function worker() {
  for (;;) {
    const next = todo.shift();
    if (!next) return;
    const [url, img] = next;
    const key = url.slice(BLOB_HOST.length + 1); // content-images/...
    try {
      const id = String(img.credit.sourceUrl).match(/-(\d+)\/?$/)?.[1];
      if (!id) throw new Error(`no photo id in ${img.credit.sourceUrl}`);
      const hit = await pixabayById(id);
      const res = await fetch(hit.largeImageURL || hit.webformatURL);
      if (!res.ok) throw new Error(`download ${res.status}`);
      const kw = Array.isArray(img.keywords) && img.keywords.length ? img.keywords.map(String) : [];
      const idx = key.match(/-(\d+)-[0-9a-f]{6}\.jpg$/)?.[1] ?? "1";
      const { buffer } = await encodeWithMetadata(Buffer.from(await res.arrayBuffer()), {
        title: `${kw[0] ?? img.alt} (${idx})`,
        alt: String(img.alt ?? ""),
        caption: img.caption ? String(img.caption) : undefined,
        keywords: kw,
        creator: String(img.credit.name ?? hit.user),
        sourceUrl: String(img.credit.sourceUrl),
      });
      done[url] = await r2Put(key, buffer);
    } catch (e) {
      failed[url] = /** @type {Error} */ (e).message;
    }
    if (++n % 25 === 0) { save(); console.log(`${n} processed, ${Object.keys(failed).length} failed`); }
  }
}
await Promise.all([1, 2, 3, 4].map(worker));
save();

// Rewrite the host everywhere. Paths are identical, so a plain host swap is exact.
const base = r2PublicUrl();
let rewritten = 0;
for (const f of files) {
  const text = fs.readFileSync(f, "utf8");
  const next = text.split(BLOB_HOST).join(base);
  if (next !== text) { fs.writeFileSync(f, next); rewritten++; }
}
console.log(`rebuilt ${Object.keys(done).length}/${images.size}, failed ${Object.keys(failed).length}, files rewritten ${rewritten}`);
if (Object.keys(failed).length) console.log(`failures in ${path.relative(ROOT, FAIL_FILE)}`);
