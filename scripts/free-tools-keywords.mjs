// Picks 10 extra pages per free tool from real Google data (Serper), and saves a SERP snapshot
// (top results + People Also Ask) for each chosen keyword so the writers can match search intent.
//
// Run: node scripts/free-tools-keywords.mjs [subdomain ...]     (no args = every tool)
// Out: content/free-tools/keywords.json
//
// Serper has no monthly volume, so candidates are scored on demand signals Google itself shows:
//   - autocomplete position (Google suggests the most searched completions first)
//   - how many different seed queries surface the same phrase
//   - appearing in Google's "related searches"
// Then: drop the main phrase, near-duplicates, off-topic and competitor-brand phrases, and keep
// at most 2 pages per kind of intent (platform, device, use case …) so the 10 pages differ.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);
const KEY = env.SERPER_API_KEY;
if (!KEY) throw new Error("SERPER_API_KEY missing in .env.local");

const OUT = "content/free-tools/keywords.json";
const tools = JSON.parse(readFileSync("src/lib/free-tools/data.generated.json", "utf8"));
// --fill: for tools with fewer than 10 pages, dig deeper (Google autocomplete for "<phrase> a" … "z",
// plus the related searches of the pages already chosen) and add pages until there are 10.
const FILL = process.argv.includes("--fill");
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const out = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
mkdirSync("content/free-tools", { recursive: true });

let calls = 0;
async function serper(endpoint, body) {
  calls++;
  for (let i = 0; i < 3; i++) {
    const res = await fetch(`https://google.serper.dev/${endpoint}`, {
      method: "POST",
      headers: { "X-API-KEY": KEY, "content-type": "application/json" },
      body: JSON.stringify({ gl: "us", hl: "en", ...body }),
    });
    if (res.ok) return res.json();
    if (res.status === 429 || res.status >= 500) await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    else throw new Error(`serper ${endpoint} ${res.status} ${await res.text()}`);
  }
  return {};
}

const BRANDS = /\b(grammarly|quillbot|otter|rev\.com|descript|loom|obs|turnitin|zerogpt|gptzero|copyleaks|wordtune|jasper|canva|notta|fireflies|tactiq|speechify|naturalreaders|elevenlabs|ilovepdf|smallpdf|adobe|tunnelbear|webcammictest|onlinemictest|clickspeedtester|monkeytype)\b/i;
const OFFTOPIC = /\b(job|jobs|salary|meaning|definition|synonym|wikipedia|reddit|download apk|crack|torrent|course|certification|stock|company|login|sign in|near me)\b/i;

const SYN = [[/\bwithout\b/g, "no"], [/\bmicrophone\b/g, "mic"], [/\bcamera\b/g, "webcam"], [/\bspeech\b/g, "voice"], [/\btester\b/g, "test"], [/\bchecker\b/g, "check"]];
const norm = (s) =>
  SYN.reduce((x, [re, to]) => x.replace(re, to), s.toLowerCase())
    .replace(/[^a-z0-9ऀ-෿ ]+/g, " ")
    .replace(/\b(online|free|the|a|an|for|to|of|in|on|with|and|my)\b/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.replace(/(ies)$/, "y").replace(/s$/, ""))
    .sort()
    .join(" ");

/** Rough intent bucket, so we don't pick 6 near-identical "for windows" pages. */
function intent(k) {
  if (/\b(windows|win ?1[01]|mac|macbook|macos|iphone|ipad|android|chromebook|linux|pc|laptop|ios)\b/.test(k)) return "platform";
  if (/\b(headphone|headset|earphone|airpod|earbud|monitor|tv|webcam|keyboard|mouse|speaker|bluetooth|usb)\b/.test(k)) return "device";
  if (/\b(zoom|teams|discord|meet|skype|whatsapp|instagram|tiktok|youtube|linkedin|gmail|outlook|excel|sheets|word|docs|chatgpt)\b/.test(k)) return "app";
  if (/\b(how|what|why|can|does|is)\b/.test(k)) return "question";
  if (/\b(student|teacher|kid|work|business|job|resume|essay|email|meeting|interview|podcast|lecture|class)\b/.test(k)) return "use-case";
  if (/\b(hindi|tamil|telugu|marathi|bengali|gujarati|malayalam|kannada|punjabi|urdu|spanish|french|arabic|german|english|sinhala|chinese|japanese)\b/.test(k)) return "language";
  return "feature";
}

const GENERIC = new Set(["test", "tester", "checker", "check", "generator", "tool", "online", "free", "to", "and", "from", "with", "the", "a", "of", "maker", "converter"]);
const EXTRA_SYN = { mic: ["microphone"], webcam: ["camera", "cam"], voice: ["speech"], dictation: ["dictate"], email: ["mail"], excel: ["spreadsheet", "sheets"], regex: ["regular expression"], words: ["word"] };
/** The phrase's own words a candidate must contain (or a synonym), so "how to mic…" can't turn into "microwave". */
function relevant(k, phrase) {
  const words = phrase.toLowerCase().split(/\s+/);
  const core = words.filter((w) => !GENERIC.has(w));
  const list = (core.length ? core : words).flatMap((w) => [w, ...(EXTRA_SYN[w] ?? [])]);
  return list.some((w) => new RegExp(`\\b${w.replace(/[^a-z0-9 ]/g, "")}${w.length > 4 ? "" : "\\b"}`).test(k));
}

function slugFor(keyword, phrase) {
  const drop = new Set(phrase.toLowerCase().split(/\s+/).concat(["online", "free", "the", "a", "an", "for", "with", "and", "to", "my", "how", "check", "use", "do", "is", "on", "in", "of", "i", "can", "you", "your"]));
  const rest = keyword
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w && !drop.has(w));
  const s = rest.join("-").slice(0, 48).replace(/-+$/, "");
  return s || null;
}

async function snapshot(keyword) {
  const d = await serper("search", { q: keyword, num: 8 });
  return {
    top: (d.organic ?? []).slice(0, 6).map((o) => ({ title: o.title, link: o.link, snippet: o.snippet })),
    paa: (d.peopleAlsoAsk ?? []).slice(0, 5).map((p) => p.question),
    related: (d.relatedSearches ?? []).slice(0, 6).map((r) => r.query),
  };
}

if (FILL) {
  for (const t of tools) {
    const cur = out[t.subdomain];
    if (!cur || cur.pages.length >= 10 || (only.length && !only.includes(t.subdomain))) continue;
    const phrase = cur.phrase;
    const cand = new Map();
    const add = (k, score, source) => {
      k = k.toLowerCase().trim().replace(/\s+/g, " ");
      const words = k.split(" ").length;
      if (!k || words < 2 || words > 7 || k.length > 60 || BRANDS.test(k) || OFFTOPIC.test(k) || !relevant(k, phrase)) return;
      const c = cand.get(k) ?? { score: 0, sources: new Set() };
      c.score += score;
      c.sources.add(source);
      cand.set(k, c);
    };
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    const ac = await Promise.all(letters.map((l) => serper("autocomplete", { q: `${phrase} ${l}` }).then((d) => (d.suggestions ?? []).map((s) => s.value))));
    ac.forEach((list) => list.forEach((v, i) => add(v, 6 - i * 0.5, "autocomplete-az")));
    for (const p of cur.pages) (p.serp?.related ?? []).forEach((r, i) => add(r, 4 - i * 0.5, "related"));
    // People Also Ask questions are real searches too, and make good answer pages.
    for (const q of [...(cur.mainSerp?.paa ?? []), ...cur.pages.flatMap((p) => p.serp?.paa ?? [])]) add(q.replace(/\?$/, ""), 3, "paa");
    const ranked = [...cand.entries()].map(([k, c]) => ({ k, score: Math.round((c.score + (c.sources.size - 1) * 5) * 10) / 10, sources: [...c.sources] })).sort((a, b) => b.score - a.score);

    const seenNorm = new Set([norm(phrase), ...cur.pages.map((p) => norm(p.keyword))]);
    const perIntent = {};
    for (const p of cur.pages) perIntent[p.intent] = (perIntent[p.intent] ?? 0) + 1;
    const added = [];
    for (const x of ranked) {
      if (cur.pages.length + added.length >= 10) break;
      const n = norm(x.k);
      if (seenNorm.has(n)) continue;
      const slug = slugFor(x.k, phrase);
      if (!slug || cur.pages.some((c) => c.slug === slug) || added.some((c) => c.slug === slug)) continue;
      const it = intent(x.k);
      if ((perIntent[it] ?? 0) >= (it === "language" ? 10 : 3)) continue;
      perIntent[it] = (perIntent[it] ?? 0) + 1;
      seenNorm.add(n);
      added.push({ keyword: x.k, slug, intent: it, score: x.score, sources: x.sources });
    }
    for (const c of added) c.serp = await snapshot(c.keyword);
    cur.pages.push(...added);
    writeFileSync(OUT, JSON.stringify(out, null, 1));
    console.log(`${t.subdomain}: +${added.length} → ${cur.pages.length} pages  [${added.map((c) => c.slug).join(", ")}]`);
  }
  console.log("serper calls:", calls);
  process.exit(0);
}

for (const t of tools) {
  if (only.length ? !only.includes(t.subdomain) : out[t.subdomain]) continue;
  const phrase = t.h1.replace(/\{Language\}/g, "").trim().toLowerCase() || t.name.toLowerCase();
  const LANGS = ["hindi", "tamil", "telugu", "marathi", "bengali", "gujarati", "malayalam", "kannada", "punjabi", "urdu", "spanish", "french", "arabic", "english", "sinhala"];
  const seeds = t.title.includes("{Language}")
    ? [phrase, ...LANGS.map((l) => `${l} ${phrase}`)]
    : [phrase, `${phrase} for`, `${phrase} on`, `${phrase} with`, `best ${phrase}`, `free ${phrase}`, ...(phrase.includes("mic ") ? [phrase.replace("mic ", "microphone ")] : []), ...(phrase.includes("webcam") ? [phrase.replace("webcam", "camera")] : [])];
  const cand = new Map(); // keyword -> {score, seeds:Set, sources:Set}
  const add = (k, score, source) => {
    k = k.toLowerCase().trim().replace(/\s+/g, " ");
    const words = k.split(" ").length;
    if (!k || words < 2 || words > 7 || k.length > 60 || BRANDS.test(k) || OFFTOPIC.test(k) || !relevant(k, phrase)) return;
    const c = cand.get(k) ?? { score: 0, seeds: new Set(), sources: new Set() };
    c.score += score;
    c.sources.add(source);
    cand.set(k, c);
  };

  const ac = await Promise.all(seeds.map((q) => serper("autocomplete", { q }).then((d) => ({ q, list: (d.suggestions ?? []).map((s) => s.value) }))));
  for (const { q, list } of ac) list.forEach((v, i) => { add(v, 10 - i, "autocomplete"); cand.get(v.toLowerCase().trim().replace(/\s+/g, " "))?.seeds.add(q); });
  const main = await serper("search", { q: phrase, num: 10 });
  (main.relatedSearches ?? []).forEach((r, i) => add(r.query, 8 - i * 0.5, "related"));
  // The naming doc's own extra-page ideas count too (they came from Google suggestions on 2026-11-26).
  for (const p of t.pages) add(`${phrase} ${p.replace(/-/g, " ")}`, 4, "naming-doc");

  // Rank: base score + bonus for being surfaced by several seeds / several sources.
  const ranked = [...cand.entries()]
    .map(([k, c]) => ({ k, score: Math.round((c.score + (c.seeds.size - 1) * 4 + (c.sources.size - 1) * 5) * 10) / 10, sources: [...c.sources] }))
    .filter((x) => norm(x.k) !== norm(phrase) && x.k.split(" ").length >= 2)
    .sort((a, b) => b.score - a.score);

  const seenNorm = new Set([norm(phrase)]);
  const perIntent = {};
  const chosen = [];
  for (const x of ranked) {
    if (chosen.length >= 10) break;
    const n = norm(x.k);
    if (seenNorm.has(n)) continue;
    const slug = slugFor(x.k, phrase);
    if (!slug || chosen.some((c) => c.slug === slug)) continue;
    const it = intent(x.k);
    const cap = it === "language" ? 10 : 2;
    if ((perIntent[it] ?? 0) >= cap) continue;
    perIntent[it] = (perIntent[it] ?? 0) + 1;
    seenNorm.add(n);
    chosen.push({ keyword: x.k, slug, intent: it, score: x.score, sources: x.sources });
  }

  // SERP snapshot per chosen keyword: what ranks now and what people ask.
  for (const c of chosen) {
    const d = await serper("search", { q: c.keyword, num: 8 });
    c.serp = {
      top: (d.organic ?? []).slice(0, 6).map((o) => ({ title: o.title, link: o.link, snippet: o.snippet })),
      paa: (d.peopleAlsoAsk ?? []).slice(0, 5).map((p) => p.question),
      related: (d.relatedSearches ?? []).slice(0, 6).map((r) => r.query),
    };
  }
  out[t.subdomain] = {
    phrase,
    mainSerp: {
      top: (main.organic ?? []).slice(0, 8).map((o) => ({ title: o.title, link: o.link, snippet: o.snippet })),
      paa: (main.peopleAlsoAsk ?? []).slice(0, 6).map((p) => p.question),
    },
    candidates: ranked.length,
    pages: chosen,
  };
  writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log(`${t.subdomain}: ${chosen.length} pages from ${ranked.length} candidates  [${chosen.map((c) => c.slug).join(", ")}]`);
}
console.log("serper calls:", calls);
