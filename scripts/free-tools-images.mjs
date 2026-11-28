// Adds a real photo from Pexels to every free-tool page that has an imageQuery but no image yet.
// Run: node scripts/free-tools-images.mjs [subdomain ...]
// Pexels allows 200 requests an hour: the script reads the rate-limit headers and waits when needed,
// so it can run in the background and resume. Each photo is used once across all pages.
// Photos are served from Pexels' CDN with their photographer credited under the image.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);
const KEY = env.PEXELS_API_KEY;
if (!KEY) throw new Error("PEXELS_API_KEY missing in .env.local");
const DIR = "content/free-tools/pages";
const only = process.argv.slice(2);
const files = readdirSync(DIR).filter((f) => f.endsWith(".json") && (!only.length || only.includes(f.replace(".json", ""))));

// Photos already used anywhere, so no two pages share one.
const used = new Set();
for (const f of readdirSync(DIR).filter((x) => x.endsWith(".json"))) {
  const c = JSON.parse(readFileSync(`${DIR}/${f}`, "utf8"));
  for (const x of [c.main, ...(c.pages ?? [])]) if (x?.image?.src) used.add(x.image.src.split("?")[0]);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function search(query) {
  for (;;) {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=15`, { headers: { Authorization: KEY } });
    if (res.status === 429) {
      const reset = Number(res.headers.get("x-ratelimit-reset") ?? 0) * 1000;
      const wait = Math.max(60_000, reset - Date.now() + 5_000);
      console.log(`  rate limited, waiting ${Math.round(wait / 60000)} min`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error(`pexels ${res.status}`);
    const left = Number(res.headers.get("x-ratelimit-remaining") ?? 99);
    if (left < 3) {
      const reset = Number(res.headers.get("x-ratelimit-reset") ?? 0) * 1000;
      console.log(`  ${left} requests left this hour, pausing until reset`);
      await sleep(Math.max(60_000, reset - Date.now() + 5_000));
    }
    return (await res.json()).photos ?? [];
  }
}

function toImage(photo, alt) {
  const w = 1200;
  const h = Math.round((photo.height / photo.width) * w);
  return { src: `${photo.src.original}?auto=compress&cs=tinysrgb&w=${w}`, width: w, height: h, alt, credit: photo.photographer, creditUrl: photo.url };
}

for (const f of files) {
  const path = `${DIR}/${f}`;
  const c = JSON.parse(readFileSync(path, "utf8"));
  let added = 0;
  for (const x of [c.main, ...(c.pages ?? [])]) {
    if (!x || x.image || !x.imageQuery) continue;
    let photos = await search(x.imageQuery);
    if (!photos.length) photos = await search(x.imageQuery.split(" ").slice(0, 2).join(" "));
    const pick = photos.find((p) => !used.has(p.src.original));
    if (!pick) continue;
    used.add(pick.src.original);
    x.image = toImage(pick, x.imageAlt || x.imageQuery);
    added++;
    writeFileSync(path, JSON.stringify(c, null, 1) + "\n");
  }
  console.log(`${f.replace(".json", "")}: ${added} photos added`);
}
