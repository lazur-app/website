#!/usr/bin/env node
// @ts-check
/**
 * Screenshot one page of each SEO type, mobile and desktop, plus an OG image.
 *   npx next start -p 3100 &   then   node scripts/content/screenshots.mjs [--base=http://localhost:3100] [--out=docs/seo-screenshots]
 * Uses the Playwright + Chromium that is preinstalled in Claude Code cloud sessions (or your own).
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { flags } from "./lib/core.mjs";

// require() so a globally installed playwright (NODE_PATH) works too.
const { chromium } = createRequire(import.meta.url)("playwright");
const f = flags(process.argv.slice(2));
const base = f.base ?? "http://localhost:3100";
const out = path.resolve(f.out ?? "docs/seo-screenshots");
fs.mkdirSync(out, { recursive: true });

const PAGES = [
  ["howto", "/how-to/make-a-pivot-table-in-excel"],
  ["app", "/apps/excel"],
  ["role", "/for/lawyers"],
  ["role-app", "/for/founders/gmail"],
  ["compare", "/compare/lazur-vs-wispr-flow"],
  ["alternatives", "/alternatives/wispr-flow"],
  ["tool", "/tools/typing-tax-calculator"],
  ["blog", "/blog/how-to-dictate-on-mac"],
  ["hub-howto", "/how-to"],
];

const browser = await chromium.launch();
for (const [name, url] of PAGES) {
  for (const [label, viewport] of /** @type {const} */ ([
    ["desktop", { width: 1440, height: 900 }],
    ["mobile", { width: 390, height: 844 }],
  ])) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(base + url, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    await page.screenshot({ path: path.join(out, `${name}-${label}.jpg`), fullPage: true, type: "jpeg", quality: 70 });
    console.log(`${name} ${label}${overflow > 0 ? `  HORIZONTAL OVERFLOW ${overflow}px` : ""}`);
    await page.close();
  }
}
const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await og.goto(`${base}/how-to/make-a-pivot-table-in-excel/opengraph-image`);
await og.screenshot({ path: path.join(out, "og-howto.jpg"), type: "jpeg", quality: 80 });
await browser.close();
console.log(`saved to ${out}`);
