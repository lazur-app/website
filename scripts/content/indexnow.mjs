#!/usr/bin/env node
// @ts-check
/**
 * Tell search engines about new and updated pages right away (IndexNow: Bing, Yandex, Seznam,
 * Naver; Bing's index also feeds ChatGPT search and Copilot). Google does not use IndexNow; it reads
 * the sitemap (submit https://www.lazur.app/sitemap.xml once in Google Search Console).
 *
 *   node scripts/content/indexnow.mjs                 # pages written today (New York date)
 *   node scripts/content/indexnow.mjs --date=2026-11-06
 *   node scripts/content/indexnow.mjs --all           # every content page (use after a big change)
 *
 * The key is public by design: it is served at https://www.lazur.app/<key>.txt (public/<key>.txt).
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, flags, nyDate, readAll, urlFor } from "./lib/core.mjs";

export const INDEXNOW_KEY = "4d9e5d20dc78423295ad56f8454fb6e7";
const SITE = "https://www.lazur.app";

const f = flags(process.argv.slice(2));
/** @type {string[]} */
let paths = [];
if (f.all) {
  paths = readAll().map(urlFor);
} else {
  const file = path.join(ROOT, "content-runs", `daily-${f.date ?? nyDate()}`, "manifest.json");
  if (!fs.existsSync(file)) {
    console.log("indexnow: no run today, nothing to send");
    process.exit(0);
  }
  const m = JSON.parse(fs.readFileSync(file, "utf8"));
  paths = Object.values(m.items).filter((/** @type {any} */ i) => i.status === "done" && i.url).map((/** @type {any} */ i) => i.url);
}
const urls = [...new Set(paths)].map((p) => SITE + p);
if (urls.length === 0) {
  console.log("indexnow: nothing to send");
  process.exit(0);
}
for (let i = 0; i < urls.length; i += 10000) {
  const batch = urls.slice(i, i + 10000);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: "www.lazur.app", key: INDEXNOW_KEY, keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`, urlList: batch }),
  });
  console.log(`indexnow: sent ${batch.length} urls, HTTP ${res.status}`);
}
