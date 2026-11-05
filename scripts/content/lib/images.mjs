// @ts-check
/**
 * Keyword-enriched images, the SRCo image-seo pattern:
 *   1. Search Pexels (PEXELS_API_KEY) for the query the writer gave, skip photos used before.
 *   2. Download, re-encode (max 1600px wide, mozjpeg), strip the original metadata.
 *   3. Rename to a keyword slug: excel-pivot-table-mac-1-3f9a2c.jpg
 *   4. Write keywords into EXIF (ImageDescription, Artist, Copyright), XMP (dc:subject, dc:description,
 *      dc:creator, dc:rights) and IPTC (2:25 keywords, 2:120 caption, 2:80 by-line).
 *   5. Upload to Vercel Blob (BLOB_READ_WRITE_TOKEN), public, cached for a year.
 *   6. Return { url, width, height, alt, caption, keywords, credit } for the page JSON.
 *
 * CONTENT_IMAGES_MODE=local writes to public/seo-img/ instead of Blob (test runs on a branch only).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { buildIptc, injectIptc } from "./iptc.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../..");
const USED_FILE = path.join(ROOT, "content/seo/_plan/pexels-used.json");

/** @param {string} s */
export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);

function loadUsed() {
  try {
    return new Set(JSON.parse(fs.readFileSync(USED_FILE, "utf8")));
  } catch {
    return new Set();
  }
}
/** @param {Set<number>} used */
function saveUsed(used) {
  fs.mkdirSync(path.dirname(USED_FILE), { recursive: true });
  fs.writeFileSync(USED_FILE, JSON.stringify([...used].sort((a, b) => a - b)));
}

/**
 * @param {string} query
 * @returns {Promise<any[]>}
 */
export async function searchPexels(query) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) throw new Error("PEXELS_API_KEY is not set");
  const u = new URL("https://api.pexels.com/v1/search");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "20");
  u.searchParams.set("orientation", "landscape");
  const res = await fetch(u, { headers: { Authorization: key } });
  if (!res.ok) throw new Error(`Pexels ${res.status} for "${query}"`);
  const data = await res.json();
  return data.photos ?? [];
}

/**
 * Pick the first photo not used anywhere on the site yet.
 * @param {string} query
 * @param {Set<number>} used
 */
async function pickPhoto(query, used) {
  const photos = await searchPexels(query);
  const fresh = photos.filter((p) => !used.has(p.id) && p.width >= 1200);
  return fresh[0] ?? null;
}

/**
 * Re-encode and write metadata.
 * @param {Buffer} input
 * @param {{ title: string, alt: string, caption?: string, keywords: string[], creator: string, sourceUrl: string }} meta
 */
export async function encodeWithMetadata(input, meta) {
  const esc = (/** @type {string} */ s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const xmp = `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/">
<dc:title><rdf:Alt><rdf:li xml:lang="x-default">${esc(meta.title)}</rdf:li></rdf:Alt></dc:title>
<dc:description><rdf:Alt><rdf:li xml:lang="x-default">${esc(meta.alt)}</rdf:li></rdf:Alt></dc:description>
<dc:subject><rdf:Bag>${meta.keywords.map((k) => `<rdf:li>${esc(k)}</rdf:li>`).join("")}</rdf:Bag></dc:subject>
<dc:creator><rdf:Seq><rdf:li>${esc(meta.creator)}</rdf:li></rdf:Seq></dc:creator>
<dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${esc(`Photo by ${meta.creator} on Pexels`)}</rdf:li></rdf:Alt></dc:rights>
<photoshop:Credit>${esc(`${meta.creator} / Pexels`)}</photoshop:Credit>
<photoshop:Source>${esc(meta.sourceUrl)}</photoshop:Source>
<Iptc4xmpCore:AltTextAccessibility><rdf:Alt><rdf:li xml:lang="x-default">${esc(meta.alt)}</rdf:li></rdf:Alt></Iptc4xmpCore:AltTextAccessibility>
</rdf:Description></rdf:RDF></x:xmpmeta>
<?xpacket end="w"?>`;

  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true })
    .withExif({
      IFD0: {
        ImageDescription: meta.alt.slice(0, 250),
        Artist: meta.creator,
        Copyright: `Photo by ${meta.creator} on Pexels (${meta.sourceUrl})`,
        Software: "lazur.app content pipeline",
      },
    })
    .withXmp(xmp)
    .toBuffer({ resolveWithObject: true });

  const withIptc = injectIptc(
    data,
    buildIptc({ keywords: meta.keywords, caption: meta.caption ?? meta.alt, title: meta.title, byline: meta.creator, credit: "Pexels", source: "Pexels", copyright: `Photo by ${meta.creator} on Pexels` }),
  );
  return { buffer: withIptc, width: info.width, height: info.height };
}

/**
 * @param {string} pathname
 * @param {Buffer} buffer
 * @returns {Promise<string>} public URL
 */
async function store(pathname, buffer) {
  if (process.env.CONTENT_IMAGES_MODE === "local") {
    const file = path.join(ROOT, "public/seo-img", pathname);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, buffer);
    return `/seo-img/${pathname}`;
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN is not set (or use CONTENT_IMAGES_MODE=local on a test branch)");
  const { put } = await import("@vercel/blob");
  const blob = await put(`seo/${pathname}`, buffer, {
    access: "public",
    contentType: "image/jpeg",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return blob.url;
}

/**
 * Fetch, enrich and upload the images for one page.
 * @param {{ type: string, slug: string, keyword: string, extraKeywords: string[], queries: { query: string, alt: string, caption?: string }[] }} job
 * @returns {Promise<import("../../../src/lib/seo-pages/types").SeoImage[]>}
 */
export async function imagesForPage(job) {
  const used = loadUsed();
  /** @type {import("../../../src/lib/seo-pages/types").SeoImage[]} */
  const out = [];
  const base = slugify(job.keyword).split("-").slice(0, 7).join("-");
  for (const [i, q] of job.queries.entries()) {
    const photo = await pickPhoto(q.query, used);
    if (!photo) continue;
    const res = await fetch(`${photo.src.original}?auto=compress&cs=tinysrgb&w=2000`);
    if (!res.ok) continue;
    const input = Buffer.from(await res.arrayBuffer());
    const keywords = [...new Set([job.keyword, ...job.extraKeywords, ...q.query.split(/\s*,\s*/), "Mac", "Lazur"])].filter(Boolean);
    const { buffer, width, height } = await encodeWithMetadata(input, {
      title: `${job.keyword} (${i + 1})`,
      alt: q.alt,
      caption: q.caption,
      keywords,
      creator: photo.photographer,
      sourceUrl: photo.url,
    });
    const hash = crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 6);
    const name = `${base}-${i + 1}-${hash}.jpg`;
    const url = await store(`${job.type}/${job.slug}/${name}`, buffer);
    used.add(photo.id);
    out.push({
      url,
      width,
      height,
      alt: q.alt,
      caption: q.caption,
      keywords,
      credit: { name: photo.photographer, url: photo.photographer_url, source: "Pexels", sourceUrl: photo.url },
    });
  }
  saveUsed(used);
  return out;
}
