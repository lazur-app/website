#!/usr/bin/env node
// @ts-check
/**
 * Post-deploy check: open a few live pages of every type, collect every image they render, and
 * fail if any image does not come back 200. Catches things like the image optimizer quota (402)
 * that broke every content photo on 2026-11-09.
 *   node scripts/content/image-smoke.mjs [--base=https://www.lazur.app] [--per-type=3]
 */
import { flags } from "./lib/core.mjs";

const f = flags(process.argv.slice(2));
const base = (f.base ?? "https://www.lazur.app").replace(/\/$/, "");
const perType = Number(f["per-type"] ?? 3);

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https:\/\/www\.lazur\.app/, base));
const groups = {
  howto: urls.filter((u) => /\/how-to\/[^/]+$/.test(u)),
  app: urls.filter((u) => /\/apps\/[^/]+$/.test(u)),
  role: urls.filter((u) => /\/for\/[^/]+$/.test(u)),
  "role-app": urls.filter((u) => /\/for\/[^/]+\/(?!problems)[^/]+$/.test(u)),
  problem: urls.filter((u) => /\/problems\/[^/]+$/.test(u)),
  compare: urls.filter((u) => /\/(compare|alternatives)\/[^/]+$/.test(u)),
  blog: urls.filter((u) => /\/blog\/[^/]+$/.test(u)),
  hubs: [`${base}/how-to`, `${base}/apps`, `${base}/for`, `${base}/compare`, `${base}/blog`],
};

let bad = 0;
let checked = 0;
for (const [type, list] of Object.entries(groups)) {
  for (const page of list.slice(0, perType)) {
    const html = await (await fetch(page)).text();
    const srcs = new Set(
      [...html.matchAll(/<img[^>]+src="([^"]+)"/g)]
        .map((m) => m[1].replace(/&amp;/g, "&"))
        .filter((s) => /content-images|blob\.vercel-storage|images\.lazur\.app|_next\/image\?url=http/.test(s)),
    );
    for (const src of srcs) {
      const abs = src.startsWith("/") ? base + src : src;
      const res = await fetch(abs, { method: "GET" });
      checked++;
      if (res.status !== 200 || !/^image\//.test(res.headers.get("content-type") ?? "")) {
        bad++;
        console.log(`BROKEN ${res.status} ${res.headers.get("x-vercel-error") ?? ""} ${abs}  (on ${page})`);
      }
    }
    console.log(`${type.padEnd(9)} ${srcs.size} images  ${page}`);
  }
}
console.log(`\nimage-smoke: ${checked} images checked, ${bad} broken`);
process.exit(bad ? 1 : 0);
