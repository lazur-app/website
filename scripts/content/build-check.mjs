#!/usr/bin/env node
// @ts-check
/**
 * `next build` that also works inside Claude Code cloud sessions. Their network proxy breaks Next's
 * Google Fonts download, so if the build fails in next/font, this fetches the font CSS itself
 * (as a browser would), hands it to Next via NEXT_FONT_GOOGLE_MOCKED_RESPONSES and builds again.
 * Vercel builds normally; this is only the pre-push check.
 *   node scripts/content/build-check.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const mockFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "fontmock-")), "mock.cjs");

/** @param {Record<string, string>} env */
function build(env) {
  const r = spawnSync("npx", ["next", "build", "--webpack"], { env: { ...process.env, ...env }, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return { ok: r.status === 0, out: `${r.stdout}\n${r.stderr}` };
}

let r = build({});
if (r.ok) {
  console.log("build ok");
  process.exit(0);
}
if (!/next\/font|Google Fonts|fonts\.googleapis/.test(r.out)) {
  console.error(r.out.slice(-4000));
  process.exit(1);
}

/** @type {Record<string, string>} */
const mock = {};
fs.writeFileSync(mockFile, "module.exports = {}");
for (let i = 0; i < 6; i++) {
  r = build({ NEXT_FONT_GOOGLE_MOCKED_RESPONSES: mockFile });
  if (r.ok) {
    console.log("build ok (font CSS fetched outside Next)");
    process.exit(0);
  }
  const url = r.out.match(/Missing mocked response for URL: (\S+)/)?.[1];
  if (!url) break;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  mock[url] = await res.text();
  fs.writeFileSync(mockFile, `module.exports = ${JSON.stringify(mock)}`);
}
console.error(r.out.slice(-4000));
process.exit(1);
