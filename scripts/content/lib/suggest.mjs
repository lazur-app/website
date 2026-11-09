// @ts-check
/**
 * Free demand signals for topic planning: Google's autocomplete endpoint (what people actually
 * type), cached for 7 days in content/seo/_plan/suggest-cache.json. No API key, no search fee.
 * Planners pick topics from these with an ungrounded model call, so planning costs no searches.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./core.mjs";

const cacheFile = () => path.join(process.env.CONTENT_PLAN_DIR || path.join(ROOT, "content/seo/_plan"), "suggest-cache.json");
/** @param {number} ms */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** @param {string} q @returns {Promise<string[]>} */
async function suggestOne(q) {
  const u = `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(u, { headers: { "User-Agent": "Mozilla/5.0 (Macintosh) lazur.app content planner" } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.[1]) ? data[1].map(String) : [];
  } catch {
    return [];
  }
}

/**
 * Autocomplete suggestions for each seed, plus seed + each letter a to z for depth.
 * @param {string[]} seeds
 * @param {{ letters?: boolean }} [opts]
 * @returns {Promise<string[]>}
 */
export async function suggestions(seeds, opts = {}) {
  if (process.env.CONTENT_AGENT_FAKE === "1") return seeds;
  /** @type {Record<string, { at: number, s: string[] }>} */
  let cache = {};
  try {
    cache = JSON.parse(fs.readFileSync(cacheFile(), "utf8"));
  } catch {
    cache = {};
  }
  const queries = seeds.flatMap((s) => (opts.letters ? [s, ..."abcdefghijklmnopqrstuvwxyz".split("").map((l) => `${s} ${l}`)] : [s]));
  const out = new Set();
  for (const q of queries) {
    const hit = cache[q];
    let list;
    if (hit && Date.now() - hit.at < 7 * 86400_000) list = hit.s;
    else {
      list = await suggestOne(q);
      cache[q] = { at: Date.now(), s: list };
      await sleep(150);
    }
    for (const s of list) out.add(s);
  }
  fs.mkdirSync(path.dirname(cacheFile()), { recursive: true });
  fs.writeFileSync(cacheFile(), JSON.stringify(cache));
  return [...out];
}
