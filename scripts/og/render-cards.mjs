// Renders the link-preview cards from /lab/og into public/og/ at each platform's size.
// Needs `npm run dev` running and Google Chrome installed:  node scripts/og/render-cards.mjs [http://localhost:3000]
// Output: public/og/<page>-<size>.jpg, e.g. home-og.jpg (Open Graph 1200x630), home-x.jpg (X 1200x675), home-square.jpg.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const BASE = process.argv[2] ?? "http://localhost:3000";
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = path.join(process.cwd(), "public/og");
const PAGES = ["home", "team", "download", "pricing"];
const SIZES = { og: [1200, 630], x: [1200, 675], square: [1200, 1200] };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "og-chrome-"));
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ["--headless=new", "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });

let tabs;
for (let i = 0; i < 50 && !tabs; i++) {
  try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await sleep(200); }
}
const ws = new WebSocket(tabs.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = {};
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });

fs.mkdirSync(OUT, { recursive: true });
await send("Page.enable");
for (const page of PAGES) {
  for (const [name, [w, h]] of Object.entries(SIZES)) {
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: `${BASE}/lab/og?v=${page}&w=${w}&h=${h}` });
    await sleep(3500); // fonts, images and the stickers settle
    const shot = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: w, height: h, scale: 1 } });
    const file = path.join(OUT, `${page}-${name}.jpg`);
    await sharp(Buffer.from(shot.result.data, "base64")).jpeg({ quality: 82, mozjpeg: true }).toFile(file);
    console.log(file, `${Math.round(fs.statSync(file).size / 1024)} KB`);
  }
}
ws.close();
chrome.kill();
await sleep(300);
fs.rmSync(profile, { recursive: true, force: true });
process.exit(0); // the Chrome child keeps the event loop alive otherwise
