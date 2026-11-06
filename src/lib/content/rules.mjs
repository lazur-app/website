// @ts-check
/**
 * Writing rules for every page Lazur publishes, generated or hand-written.
 *
 * One source of truth, used in three places:
 *   1. The prompts (scripts/content/lib/prompts.mjs pastes WRITING_RULES_PROMPT into every write call).
 *   2. The code guards (scripts/content/lib/guards.mjs runs checkText on every string of an item and
 *      refuses or retries it).
 *   3. The repo lint (scripts/content/seo-lint.mjs runs the same checks on everything in content/).
 *
 * Plain .mjs so Node scripts and the Next.js app can both import it without a build step.
 */

/**
 * Words and phrases that make copy read as machine-written or as marketing filler.
 * Matched case-insensitively on word boundaries. Keep entries lowercase.
 */
export const BANNED_PHRASES = [
  // AI tells
  "delve",
  "delves",
  "delving",
  "unlock",
  "unlocks",
  "unlocking",
  "unleash",
  "unleashes",
  "unleashing",
  "seamless",
  "seamlessly",
  "elevate",
  "elevates",
  "elevating",
  "empower",
  "empowers",
  "empowering",
  "game-changer",
  "game changer",
  "game-changing",
  "revolutionize",
  "revolutionizes",
  "revolutionary",
  "cutting-edge",
  "cutting edge",
  "state-of-the-art",
  "leverage",
  "leverages",
  "leveraging",
  "robust",
  "harness",
  "harnesses",
  "harnessing",
  "supercharge",
  "supercharges",
  "supercharged",
  "streamline",
  "streamlines",
  "streamlined",
  "streamlining",
  "in today's fast-paced world",
  "fast-paced world",
  "in today's digital age",
  "digital age",
  "ever-evolving",
  "ever-changing landscape",
  "landscape",
  "realm",
  "tapestry",
  "navigate the complexities",
  "navigating the complexities",
  "it's worth noting",
  "it is worth noting",
  "worth noting that",
  "embark",
  "embarks",
  "embarking",
  "journey",
  "testament",
  "boost productivity",
  "boost your productivity",
  "productivity boost",
  "effortless",
  "effortlessly",
  "in conclusion",
  "to conclude",
  "in summary",
  "furthermore",
  "moreover",
  "additionally,",
  "nevertheless",
  "notably",
  "crucial",
  "pivotal",
  "paramount",
  "vital role",
  "plays a key role",
  "plays a crucial role",
  "a myriad of",
  "myriad",
  "plethora",
  "multifaceted",
  "holistic",
  "synergy",
  "synergies",
  "paradigm",
  "paradigm shift",
  "transformative",
  "next-level",
  "next level",
  "take it to the next level",
  "world-class",
  "best-in-class",
  "bespoke",
  "meticulous",
  "meticulously",
  "intricate",
  "intricacies",
  "foster",
  "fosters",
  "fostering",
  "bolster",
  "underscore",
  "underscores",
  "showcase",
  "showcases",
  "showcasing",
  "dive into",
  "dive deep",
  "deep dive",
  "let's dive",
  "dive in",
  "look no further",
  "whether you're a",
  "in the world of",
  "when it comes to",
  "at the end of the day",
  "the power of",
  "harness the power",
  "unlock the power",
  "unlock the potential",
  "full potential",
  "a testament to",
  "stands as",
  "serves as a",
  "rest assured",
  "needless to say",
  "it goes without saying",
  "in this article",
  "in this guide, we",
  "in this blog post",
  "buckle up",
  "without further ado",
  "elevate your",
  "a breeze",
  "breeze through",
  "hassle-free",
  "skyrocket",
  "turbocharge",
  "groundbreaking",
  "innovative",
  "unparalleled",
  "unprecedented",
  "comprehensive guide",
  "ultimate guide",
  "seamless experience",
  "user-friendly",
  "intuitive interface",
  "boasts",
  "game changing",
  "magic",
  "magical",
  "superpower",
  "superpowers",
];

/** Sentence openers that read as filler. Matched at the start of a sentence. */
export const BANNED_OPENERS = [
  "imagine",
  "picture this",
  "ever wondered",
  "have you ever",
  "in conclusion",
  "overall,",
  "ultimately,",
  "great question",
  "certainly",
  "absolutely",
  "sure!",
];

/**
 * Claims we never make about Lazur without a source we control. The generator is told to avoid these,
 * and a hit refuses the item.
 */
export const LAZUR_CLAIM_PATTERNS = [
  // invented user counts / social proof
  /\b(thousands|millions|hundreds) of (users|people|teams|customers|professionals)\b[^.]{0,40}\blazur\b/i,
  /\blazur\b[^.]{0,60}\b(used|trusted|loved) by\b/i,
  /\blazur\b[^.]{0,60}\b\d[\d,.]*\+?\s*(users|customers|teams|companies|downloads)\b/i,
  /\b\d[\d,.]*\+?\s*(users|customers|teams|companies)\b[^.]{0,40}\b(use|chose|switched to|rely on) lazur\b/i,
  // invented results about Lazur
  /\blazur\b[^.]{0,80}\b(saves?|cuts?|reduces?)\b[^.]{0,30}\b\d+\s*(%|percent|hours?|minutes?)\b/i,
  /\b\d+\s*(%|percent|x)\s*(faster|more productive)\b[^.]{0,40}\bwith lazur\b/i,
  // testimonials
  /\b(says|said)\s+[A-Z][a-z]+\s+[A-Z][a-z]+,\s+(a|an|the)\s+[a-z]+\s+(at|from)\b/,
  // partnerships / endorsements
  /\b(partner(ed|ship)?|integrat(ed|ion)) with\b[^.]{0,30}\b(microsoft|apple|google|figma|notion|slack|adobe|openai|anthropic)\b/i,
  /\b(official|certified|endorsed)\b[^.]{0,20}\b(partner|integration|plugin|add-in|extension)\b/i,
  // things Lazur cannot do (it guides, points, explains, drafts, dictates; it does not operate other apps' UIs)
  /\blazur\b[^.]{0,40}\b(clicks (the|on|that|this|it|buttons?)|clicks? .{0,20}for you|edits? your|modif(y|ies) your|builds? the|creates? the (pivot|chart|table|formula|file|frame|component|slide))\b/i,
  /\blazur\b[^.]{0,30}\b(plugin|add-in|add-on|extension) for (excel|word|figma|notion|slack|xcode|photoshop|powerpoint)\b/i,
  /\blazur\b[^.]{0,30}\b(works|runs) (on|for) (windows|iphone|ipad|android|linux)\b/i,
];

/** Dashes used as punctuation. Hyphens inside words (e-mail, 3-day) are fine; ranges use "to". */
export const DASH_PATTERNS = [
  { re: /—/, label: "em dash (—)" },
  { re: /–/, label: "en dash (–)" },
  { re: /\s-{1,2}\s/, label: "spaced hyphen used as a dash" },
];

/** Other surface tells. */
export const STYLE_PATTERNS = [
  { re: /!\s/, label: "exclamation mark", max: 0 },
  { re: /…|\.\.\./, label: "ellipsis", max: 0 },
  { re: /;\s/, label: "semicolon", max: 2 },
  { re: /\b(very|really|truly|incredibly|extremely)\b/i, label: "intensifier", max: 2 },
];

export const MAX_SENTENCE_WORDS = 32;

/** Every page carries at least this many words of real prose (counted by code, not by the model). */
export const MIN_WORDS = 2000;

/**
 * Pasted into every write prompt. Keep it in sync with the checks above (the guard enforces them).
 */
export const WRITING_RULES_PROMPT = `WRITING RULES (code checks every string; a break gets the item sent back or refused):
- Answer the search query in the first two sentences. Then the detail.
- Length: at least ${2000} words of useful prose on every page (code counts it and refuses shorter pages). Get there with depth, not padding: more sections, worked examples, real numbers, edge cases, mistakes people make, what to do next. Never repeat a point to fill space.
- Plain, specific, human. Write like a helpful colleague who uses a Mac every day. Second person ("you").
- Short sentences. Average under 16 words, never over ${MAX_SENTENCE_WORDS}.
- Concrete over abstract: real app names, real menu paths written as Menu > Submenu > Item, real keyboard shortcuts (⌘ ⌥ ⌃ ⇧), real version numbers.
- The H1 (title) is long tail and keyword rich: it contains the exact target keyword phrase, in order, plus qualifiers that match intent (Mac, the version or year, the outcome, who it is for). 8 to 16 words. Example: "How to make a pivot table in Excel on Mac: step by step for Microsoft 365".
- Other headings match what people search, not clever lines. Put secondary keywords in H2s where they fit naturally.
- No em dashes or en dashes at all. Not as punctuation, not for ranges ("3 to 5", not "3–5"). Use a comma, a period, or "to".
- No exclamation marks, no ellipses, at most two semicolons per page.
- Never use these words or phrases: ${BANNED_PHRASES.filter((p) => !p.includes(",")).slice(0, 80).join(", ")}, and similar marketing filler.
- Do not open sentences with: ${BANNED_OPENERS.join(", ")}.
- No "In conclusion", no summary paragraph that repeats the page.
- Every number needs a source in the sources list (title + URL you actually opened). If you cannot source it, leave it out.
- Never invent customers, testimonials, quotes, user counts, ratings, or results about Lazur. Never claim a partnership or an official integration.
- Lazur guides, points, explains, answers out loud, drafts and types text. It does not click buttons or operate other apps for you. Write "ask Lazur to walk you through it" or "Lazur circles the button", never "Lazur builds the pivot table for you".
- Competitor facts (price, platforms, features) only from the competitor's own site or docs, with the URL. Say "check their pricing page" if unsure. No invented prices.`;

const wordRe = (phrase) =>
  new RegExp(`(^|[^a-z0-9'])${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=$|[^a-z0-9])`, "i");

const BANNED_RES = BANNED_PHRASES.map((p) => ({ phrase: p, re: wordRe(p) }));

/**
 * Strip markdown link targets, URLs and inline code so URLs and code do not trip the checks.
 * @param {string} text
 */
export function proseOnly(text) {
  return String(text ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/^\s*\|?[\s:|-]*-{3,}[\s:|-]*$/gm, " ") // markdown table separator rows
    .replace(/^(\s*)[-*+]\s+/gm, "$1") // markdown list markers
    .replace(/^---$/gm, " ")
    .replace(/\|\s*-{1,2}\s*(?=\|)/g, "| "); // "-" as an empty table cell
}

/**
 * @typedef {{ rule: string, detail: string, severity: "error" | "warn" }} TextIssue
 */

/**
 * Check one piece of prose. Returns issues; "error" refuses an item, "warn" is reported.
 * @param {string} raw
 * @param {{ allowLazurClaims?: boolean, field?: string }} [opts]
 * @returns {TextIssue[]}
 */
export function checkText(raw, opts = {}) {
  /** @type {TextIssue[]} */
  const issues = [];
  const text = proseOnly(raw);
  if (!text.trim()) return issues;
  const where = opts.field ? ` in ${opts.field}` : "";

  for (const { re, label } of DASH_PATTERNS) {
    const m = text.match(re);
    if (m) {
      const at = Math.max(0, (m.index ?? 0) - 30);
      issues.push({ rule: "dash", detail: `${label}${where}: "...${text.slice(at, at + 60).trim()}..."`, severity: "error" });
    }
  }

  for (const { phrase, re } of BANNED_RES) {
    if (re.test(text)) {
      issues.push({ rule: "banned-phrase", detail: `"${phrase}"${where}`, severity: "error" });
    }
  }

  const sentences = text
    .split(/(?<=[.?!])\s+|\n+/)
    .map((s) => s.replace(/^[\s>*#\-\d.|]+/, "").trim())
    .filter(Boolean);
  for (const s of sentences) {
    const lower = s.toLowerCase();
    for (const opener of BANNED_OPENERS) {
      if (lower.startsWith(opener)) {
        issues.push({ rule: "banned-opener", detail: `sentence starts with "${opener}"${where}`, severity: "error" });
      }
    }
    const words = s.split(/\s+/).filter(Boolean).length;
    if (words > MAX_SENTENCE_WORDS && !s.includes("|")) {
      issues.push({ rule: "long-sentence", detail: `${words} words${where}: "${s.slice(0, 80)}..."`, severity: "warn" });
    }
  }

  for (const { re, label, max } of STYLE_PATTERNS) {
    const count = (text.match(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g")) ?? []).length;
    if (count > max) {
      issues.push({ rule: "style", detail: `${count}x ${label}${where} (max ${max})`, severity: max === 0 ? "error" : "warn" });
    }
  }

  if (!opts.allowLazurClaims) {
    for (const re of LAZUR_CLAIM_PATTERNS) {
      const m = text.match(re);
      // "Lazur does not click inside Excel" is the honest version, not a claim.
      if (m && !/\b(not|never|cannot|no)\b|n't/i.test(m[0])) {
        issues.push({ rule: "claim", detail: `unsupported claim${where}: "${m[0].slice(0, 90)}"`, severity: "error" });
      }
    }
  }

  return issues;
}

/**
 * Walk any JSON value and check every string that reads as prose (skips URLs, slugs, dates, ids).
 * @param {unknown} value
 * @param {string} [path]
 * @returns {TextIssue[]}
 */
export function checkDeep(value, path = "") {
  /** @type {TextIssue[]} */
  const out = [];
  const skipKey = /(^|\.)(url|href|slug|site|sourceUrl|pricingSourceUrl|app|role|type|kind|keywords|secondaryKeywords|targetKeyword|publishedAt|updatedAt|reviewedAt|checkedAt|accessedAt|pricingCheckedAt|generator|keywordHits|capability|shell|width|height|credit|id|tone|icon)$/;
  if (typeof value === "string") {
    if (/^(https?:|\/)/.test(value) || /^[a-z0-9-]+$/.test(value)) return out;
    return checkText(value, { field: path || "text" });
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => out.push(...checkDeep(v, `${path}[${i}]`)));
    return out;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      const p = path ? `${path}.${k}` : k;
      if (skipKey.test(p)) continue;
      out.push(...checkDeep(v, p));
    }
  }
  return out;
}
