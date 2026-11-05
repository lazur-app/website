// @ts-check
/**
 * Keyword-enriched images, the SRCo image-seo pattern, with Pixabay as the photo source:
 *   1. Search Pixabay (PIXABAY_API_KEY, safesearch on). Searches are cached for 24h
 *      (content/seo/_plan/pixabay-cache.json) and the X-RateLimit-* headers are respected
 *      (100 requests per 60s), backing off when the window runs out.
 *   2. Reuse: if the same keyword+query was fetched and stored before, the stored image is reused
 *      (no download, no upload). Photo ids already used on another page are skipped otherwise.
 *   3. Download largeImageURL (never hotlinked), re-encode (max 1600px wide, mozjpeg), strip metadata.
 *   4. Rename to a keyword slug: how-to-make-a-pivot-table-1-3f9a2c.jpg
 *   5. Write keywords into EXIF (ImageDescription, Artist, Copyright), XMP (dc:subject, dc:description,
 *      dc:creator, AltTextAccessibility) and IPTC (2:25 keywords, 2:120 caption, 2:80 by-line).
 *   6. Store through a pluggable adapter (store()):
 *        - Vercel Blob when BLOB_READ_WRITE_TOKEN is set (the daily job's default),
 *        - public/content-images/<type>/<slug>/ for local runs and the few sample pages.
 *      In CI (GITHUB_ACTIONS) the job refuses public/ unless CONTENT_ALLOW_PUBLIC_IMAGES=1.
 *   7. Return { url, width, height, alt, caption, keywords, credit } for the page JSON.
 * Credit on the page: "Image by <user> from Pixabay", linked to the photo page.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { buildIptc, injectIptc } from "./iptc.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../..");
const PLAN = path.join(ROOT, "content/seo/_plan");
const USED_FILE = path.join(PLAN, "pixabay-used.json");
const CACHE_FILE = path.join(PLAN, "pixabay-cache.json");
const STORED_FILE = path.join(PLAN, "images-stored.json");
const DAY = 24 * 60 * 60 * 1000;

/** @param {string} s */
export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);

/** @param {string} file @param {any} fallback */
function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}
/** @param {string} file @param {any} value */
function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 1) + "\n");
}

/** Fail fast with a clear message before any work starts. */
export function checkImageEnv() {
  if (!process.env.PIXABAY_API_KEY) throw new Error("PIXABAY_API_KEY is not set. Get a key at https://pixabay.com/api/docs/ (see CONTENT-AUTOMATION.md).");
  if (!process.env.BLOB_READ_WRITE_TOKEN && process.env.GITHUB_ACTIONS && process.env.CONTENT_ALLOW_PUBLIC_IMAGES !== "1") {
    throw new Error("No remote image storage configured (BLOB_READ_WRITE_TOKEN). The daily job does not write images into the repo.");
  }
}

// Rate limit: Pixabay allows 100 requests per 60 seconds and reports what is left in headers.
let remaining = 100;
let resetAt = 0;
/** @param {number} ms */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * @param {string} query
 * @returns {Promise<any[]>}
 */
export async function searchPixabay(query) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) throw new Error("PIXABAY_API_KEY is not set");
  const cache = readJson(CACHE_FILE, {});
  const hit = cache[query];
  if (hit && Date.now() - hit.at < DAY) return hit.hits;

  if (remaining <= 2 && Date.now() < resetAt) await sleep(resetAt - Date.now() + 500);
  const u = new URL("https://pixabay.com/api/");
  u.searchParams.set("key", key);
  u.searchParams.set("q", query.slice(0, 100));
  u.searchParams.set("image_type", "photo");
  u.searchParams.set("orientation", "horizontal");
  u.searchParams.set("safesearch", "true");
  u.searchParams.set("min_width", "1200");
  u.searchParams.set("per_page", "30");
  const res = await fetch(u);
  remaining = Number(res.headers.get("x-ratelimit-remaining") ?? remaining - 1);
  resetAt = Date.now() + Number(res.headers.get("x-ratelimit-reset") ?? 60) * 1000;
  if (res.status === 429) {
    await sleep(Math.max(5000, resetAt - Date.now()));
    return searchPixabay(query);
  }
  if (!res.ok) throw new Error(`Pixabay ${res.status} for "${query}"`);
  const data = await res.json();
  const hits = (data.hits ?? []).map((/** @type {any} */ h) => ({
    id: h.id,
    pageURL: h.pageURL,
    user: h.user,
    user_id: h.user_id,
    largeImageURL: h.largeImageURL,
    webformatURL: h.webformatURL,
    width: h.imageWidth,
    tags: h.tags,
  }));
  cache[query] = { at: Date.now(), hits };
  writeJson(CACHE_FILE, cache);
  return hits;
}

/**
 * Re-encode and write metadata.
 * @param {Buffer} input
 * @param {{ title: string, alt: string, caption?: string, keywords: string[], creator: string, sourceUrl: string }} meta
 */
export async function encodeWithMetadata(input, meta) {
  const esc = (/** @type {string} */ s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const credit = `Image by ${meta.creator} from Pixabay`;
  const xmp = `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/">
<dc:title><rdf:Alt><rdf:li xml:lang="x-default">${esc(meta.title)}</rdf:li></rdf:Alt></dc:title>
<dc:description><rdf:Alt><rdf:li xml:lang="x-default">${esc(meta.alt)}</rdf:li></rdf:Alt></dc:description>
<dc:subject><rdf:Bag>${meta.keywords.map((k) => `<rdf:li>${esc(k)}</rdf:li>`).join("")}</rdf:Bag></dc:subject>
<dc:creator><rdf:Seq><rdf:li>${esc(meta.creator)}</rdf:li></rdf:Seq></dc:creator>
<dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${esc(credit)}</rdf:li></rdf:Alt></dc:rights>
<photoshop:Credit>${esc(`${meta.creator} / Pixabay`)}</photoshop:Credit>
<photoshop:Source>${esc(meta.sourceUrl)}</photoshop:Source>
<Iptc4xmpCore:AltTextAccessibility><rdf:Alt><rdf:li xml:lang="x-default">${esc(meta.alt)}</rdf:li></rdf:Alt></Iptc4xmpCore:AltTextAccessibility>
</rdf:Description></rdf:RDF></x:xmpmeta>
<?xpacket end="w"?>`;

  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 74, mozjpeg: true, progressive: true })
    .withExif({
      IFD0: {
        ImageDescription: meta.alt.slice(0, 250),
        Artist: meta.creator,
        Copyright: `${credit} (${meta.sourceUrl})`,
        Software: "lazur.app content pipeline",
      },
    })
    .withXmp(xmp)
    .toBuffer({ resolveWithObject: true });

  const withIptc = injectIptc(
    data,
    buildIptc({ keywords: meta.keywords, caption: meta.caption ?? meta.alt, title: meta.title, byline: meta.creator, credit: "Pixabay", source: "Pixabay", copyright: credit }),
  );
  return { buffer: withIptc, width: info.width, height: info.height };
}

/**
 * Storage adapter. Add another backend (R2, S3, ...) here: take a path and bytes, return a public URL.
 * @param {string} pathname e.g. howto/make-a-pivot-table-in-excel/how-to-make-a-pivot-table-1-3f9a2c.jpg
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
export async function store(pathname, buffer) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`content-images/${pathname}`, buffer, {
      access: "public",
      contentType: "image/jpeg",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  }
  if (process.env.GITHUB_ACTIONS && process.env.CONTENT_ALLOW_PUBLIC_IMAGES !== "1") {
    throw new Error("Refusing to write images into public/ from the daily job. Set BLOB_READ_WRITE_TOKEN.");
  }
  const file = path.join(ROOT, "public/content-images", pathname);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buffer);
  return `/content-images/${pathname}`;
}

/**
 * Fetch, enrich and store the images for one page.
 * @param {{ type: string, slug: string, keyword: string, extraKeywords: string[], queries: { query: string, alt: string, caption?: string }[] }} job
 * @returns {Promise<import("../../../src/lib/seo-pages/types").SeoImage[]>}
 */
export async function imagesForPage(job) {
  const used = new Set(readJson(USED_FILE, []));
  /** @type {Record<string, any>} */
  const stored = readJson(STORED_FILE, {});
  /** @type {import("../../../src/lib/seo-pages/types").SeoImage[]} */
  const out = [];
  const base = slugify(job.keyword).split("-").slice(0, 7).join("-");
  const takenHere = new Set();

  for (const [i, q0] of job.queries.entries()) {
    let q = q0;
    const keywords = [...new Set([job.keyword, ...job.extraKeywords, q.query, "Mac", "Lazur"])].filter(Boolean);
    const reuseKey = `${job.type}/${job.slug}|${q.query}`;
    if (stored[reuseKey]) {
      out.push({ ...stored[reuseKey], alt: q.alt, caption: q.caption });
      continue;
    }
    const hits = await searchPixabay(q.query);
    const photo = hits.find((h) => !used.has(h.id) && !takenHere.has(h.id) && h.width >= 1200) ?? hits.find((h) => !takenHere.has(h.id));
    if (!photo) continue;
    takenHere.add(photo.id);
    // "{tags}" in alt/caption becomes what is actually in the photo, from Pixabay's tags.
    const tags = String(photo.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 3);
    const seen = tags.length ? `${tags[0][0].toUpperCase()}${tags[0].slice(1)}${tags.length > 1 ? `, ${tags.slice(1).join(" and ")}` : ""}` : "Photo";
    q = { ...q, alt: q.alt.replace("{tags}", seen), caption: q.caption?.replace("{tags}", seen) };
    const res = await fetch(photo.largeImageURL || photo.webformatURL);
    if (!res.ok) continue;
    const input = Buffer.from(await res.arrayBuffer());
    const { buffer, width, height } = await encodeWithMetadata(input, {
      title: `${job.keyword} (${i + 1})`,
      alt: q.alt,
      caption: q.caption,
      keywords,
      creator: photo.user,
      sourceUrl: photo.pageURL,
    });
    const hash = crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 6);
    const name = `${base}-${i + 1}-${hash}.jpg`;
    const url = await store(`${job.type}/${job.slug}/${name}`, buffer);
    used.add(photo.id);
    /** @type {import("../../../src/lib/seo-pages/types").SeoImage} */
    const image = {
      url,
      width,
      height,
      alt: q.alt,
      caption: q.caption,
      keywords,
      credit: { name: photo.user, url: `https://pixabay.com/users/${photo.user}-${photo.user_id}/`, source: "Pixabay", sourceUrl: photo.pageURL },
    };
    stored[reuseKey] = image;
    out.push(image);
  }
  writeJson(USED_FILE, [...used].sort((a, b) => a - b));
  writeJson(STORED_FILE, stored);
  return out;
}
