// Checks every content/free-tools/pages/<tool>.json before it ships.
// Run: node scripts/free-tools-validate.mjs [subdomain ...]   -> exit 1 if anything is wrong
// Errors must be fixed. Warnings (numbers that look like statistics) are for a human to confirm.
import { existsSync, readFileSync, readdirSync } from "node:fs";

const KW = JSON.parse(readFileSync("content/free-tools/keywords.json", "utf8"));
const only = process.argv.slice(2);
const files = readdirSync("content/free-tools/pages").filter((f) => f.endsWith(".json") && (!only.length || only.includes(f.replace(".json", ""))));

const BANNED = [
  "in today's", "delve", "game-changer", "game changer", "seamless", "unlock", "elevate", "leverage", "robust", "cutting-edge",
  "revolutioni", "look no further", "whether you're", "it's important to note", "it is important to note", "dive into", "navigate the",
  "realm", "landscape", "harness", "effortless", "best-in-class", "world-class", "ultimate guide", "in conclusion", "furthermore",
  "moreover", "embark", "tapestry", "testament", "supercharge", "empower", "boost your productivity", "say goodbye", "hassle-free",
];
const OK_LINK = /^(\/[a-z0-9-]*|https:\/\/([a-z0-9-]+\.)?lazur\.app(\/[^\s)]*)?|https:\/\/(support\.apple\.com|support\.google\.com|support\.microsoft\.com|support\.zoom\.com|support\.discord\.com|developer\.mozilla\.org)\/[^\s)]*)$/;

const words = (s) => (s.match(/[A-Za-z0-9ऀ-෿'’]+/g) ?? []).length;
let errors = 0;
let warnings = 0;

function checkText(where, text, errs, warns) {
  const low = text.toLowerCase();
  for (const b of BANNED) if (low.includes(b)) errs.push(`${where}: banned phrase "${b}"`);
  if (/[—]/.test(text)) errs.push(`${where}: em dash`);
  if (/\s–\s/.test(text)) errs.push(`${where}: en dash used as a dash`);
  for (const m of text.matchAll(/\]\(([^)]+)\)/g)) if (!OK_LINK.test(m[1])) errs.push(`${where}: link not allowed (${m[1]})`);
  if (/<[a-z]/i.test(text)) errs.push(`${where}: HTML tag`);
  for (const m of text.matchAll(/\b\d[\d,.]*\s?(%|percent|million|billion|times faster)/gi)) warns.push(`${where}: statistic "${m[0]}" (check it is real)`);
}

function checkSections(where, sections, minWords, maxWords, errs, warns) {
  if (!Array.isArray(sections) || sections.length < 3 || sections.length > 7) errs.push(`${where}: needs 3-7 sections (has ${sections?.length ?? 0})`);
  let total = 0;
  const seen = new Set();
  for (const [i, s] of (sections ?? []).entries()) {
    if (!s.heading || !s.body) errs.push(`${where} section ${i + 1}: missing heading or body`);
    if (seen.has(s.heading)) errs.push(`${where}: duplicate heading "${s.heading}"`);
    seen.add(s.heading);
    if (s.heading && s.heading.length > 80) errs.push(`${where}: heading too long "${s.heading}"`);
    total += words(s.body ?? "");
    checkText(`${where} "${s.heading}"`, `${s.heading}\n${s.body}`, errs, warns);
  }
  if (total < minWords || total > maxWords) errs.push(`${where}: ${total} words (want ${minWords}-${maxWords})`);
}

for (const f of files) {
  const tool = f.replace(".json", "");
  const errs = [];
  const warns = [];
  let c;
  try {
    c = JSON.parse(readFileSync(`content/free-tools/pages/${f}`, "utf8"));
  } catch (e) {
    console.log(`✗ ${tool}: invalid JSON (${e.message})`);
    errors++;
    continue;
  }
  if (c.tool !== tool) errs.push(`"tool" should be "${tool}"`);
  const m = c.main ?? {};
  if (!m.claim || m.claim.length < 60 || m.claim.length > 240) errs.push(`main.claim must be 60-240 chars (has ${m.claim?.length ?? 0})`);
  if (m.claim) checkText("main.claim", m.claim, errs, warns);
  checkSections("main", m.sections, 380, 850, errs, warns);
  if (!m.imageQuery || !m.imageAlt) errs.push("main: imageQuery and imageAlt are required");

  const planned = new Map((KW[tool]?.pages ?? []).map((p) => [p.slug, p.keyword]));
  const pages = c.pages ?? [];
  // A writer may skip up to 2 planned keywords the tool cannot answer honestly (and must say why).
  if (pages.length < planned.size - 2) errs.push(`only ${pages.length} pages (planned ${planned.size}; at most 2 may be skipped)`);
  const slugs = new Set();
  for (const p of pages) {
    const w = `page ${p.slug}`;
    if (!planned.has(p.slug)) errs.push(`${w}: slug not in keywords.json`);
    if (slugs.has(p.slug)) errs.push(`${w}: duplicate slug`);
    slugs.add(p.slug);
    if (p.keyword !== planned.get(p.slug)) errs.push(`${w}: keyword should be "${planned.get(p.slug)}"`);
    if (!p.title?.endsWith(" | Lazur") || p.title.length > 70) errs.push(`${w}: title must end " | Lazur" and be ≤ 70 chars (${p.title?.length ?? 0})`);
    if (!p.description || p.description.length < 110 || p.description.length > 165) errs.push(`${w}: description must be 110-165 chars (${p.description?.length ?? 0})`);
    if (!p.h1 || p.h1.length > 70) errs.push(`${w}: h1 missing or > 70 chars`);
    if (!p.claim || p.claim.length < 60 || p.claim.length > 240) errs.push(`${w}: claim must be 60-240 chars (${p.claim?.length ?? 0})`);
    for (const k of ["title", "description", "h1", "claim"]) if (p[k]) checkText(`${w} ${k}`, p[k].replace(/ – /g, " "), errs, warns);
    checkSections(w, p.sections, 420, 950, errs, warns);
    if (!Array.isArray(p.faq) || p.faq.length < 3 || p.faq.length > 5) errs.push(`${w}: needs 3-5 FAQ`);
    for (const q of p.faq ?? []) {
      const n = words(q.a ?? "");
      if (!q.q || n < 20 || n > 100) errs.push(`${w} FAQ "${q.q}": answer ${n} words (want 20-100)`);
      checkText(`${w} FAQ`, `${q.q}\n${q.a}`, errs, warns);
    }
    if (!p.imageQuery || !p.imageAlt) errs.push(`${w}: imageQuery and imageAlt are required`);
  }
  errors += errs.length;
  warnings += warns.length;
  console.log(`${errs.length ? "✗" : "✓"} ${tool}: ${pages.length} pages, ${errs.length} errors, ${warns.length} warnings`);
  for (const e of errs) console.log(`    error   ${e}`);
  for (const w of warns) console.log(`    warning ${w}`);
}
console.log(`\n${files.length} files, ${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
