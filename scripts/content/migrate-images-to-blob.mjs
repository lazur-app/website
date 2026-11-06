#!/usr/bin/env node
// @ts-check
/**
 * One-off: move images stored in public/content-images/ (samples made before Blob existed) to
 * Vercel Blob under the same path, rewrite every page and blog post that points at them, and
 * update the image cache. Then public/content-images can be deleted.
 *   BLOB_READ_WRITE_TOKEN=... node scripts/content/migrate-images-to-blob.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { ROOT } from "./lib/core.mjs";

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is not set");
const dir = path.join(ROOT, "public/content-images");
/** @param {string} d @returns {string[]} */
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = fs.existsSync(dir) ? walk(dir).filter((f) => f.endsWith(".jpg")) : [];
/** @type {Map<string, string>} */
const map = new Map();
for (const f of files) {
  const rel = path.relative(dir, f).split(path.sep).join("/");
  const blob = await put(`content-images/${rel}`, fs.readFileSync(f), { access: "public", contentType: "image/jpeg", addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 31536000, token });
  map.set(`/content-images/${rel}`, blob.url);
}
console.log(`uploaded ${map.size} images`);

const targets = [...walk(path.join(ROOT, "content/seo")).filter((f) => f.endsWith(".json")), ...walk(path.join(ROOT, "content/blog")).filter((f) => f.endsWith(".md"))];
let changed = 0;
for (const f of targets) {
  const before = fs.readFileSync(f, "utf8");
  let after = before;
  for (const [from, to] of map) after = after.split(from).join(to);
  if (after !== before) {
    fs.writeFileSync(f, after);
    changed++;
  }
}
console.log(`repointed ${changed} files`);
