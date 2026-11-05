// @ts-check
/**
 * Keyword hits: where a page's target keyword shows up. Recorded on every page (keywordHits) and
 * checked by the guards: the keyword's words must be in the title and description.
 */

const STOP = new Set(["a", "an", "the", "in", "on", "to", "for", "of", "and", "or", "how", "with", "your", "my", "is", "do", "i", "vs"]);

/** @param {string} s */
export const norm = (s) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9+#]+/g, " ")
    .trim();

/** Significant words of a keyword ("how to make a pivot table in excel on mac" gives make, pivot, table, excel, mac). @param {string} kw */
export const keyWords = (kw) =>
  norm(kw)
    .split(" ")
    .filter((w) => w && !STOP.has(w));

/** True when every significant word appears ("tables" matches "table"). @param {string} text @param {string} kw */
export function covers(text, kw) {
  const hay = ` ${norm(text)} `;
  return keyWords(kw).every((w) => hay.includes(` ${w}`));
}

/** @param {string} text @param {string} phrase */
export function countPhrase(text, phrase) {
  const p = norm(phrase);
  if (!p) return 0;
  const hay = norm(text);
  let n = 0;
  let i = hay.indexOf(p);
  while (i !== -1) {
    n++;
    i = hay.indexOf(p, i + p.length);
  }
  return n;
}

/**
 * @param {{ title: string, metaTitle?: string, description: string, intro?: string, targetKeyword: string, secondaryKeywords?: string[] }} page
 * @param {string} bodyText all prose of the page joined
 */
export function keywordHits(page, bodyText) {
  const kw = page.targetKeyword;
  /** @type {Record<string, number>} */
  const secondary = {};
  for (const s of page.secondaryKeywords ?? []) secondary[s] = countPhrase(bodyText, s);
  return {
    target: kw,
    inTitle: covers(`${page.metaTitle ?? ""} ${page.title}`, kw),
    inH1: covers(page.title, kw),
    inDescription: covers(page.description, kw),
    inIntro: covers(page.intro ?? "", kw),
    bodyCount: countPhrase(bodyText, kw),
    secondary,
  };
}

/** All human-readable text of a page, for counting. @param {unknown} v @returns {string} */
export function allText(v) {
  if (typeof v === "string") return /^(https?:|\/)/.test(v) ? "" : v;
  if (Array.isArray(v)) return v.map(allText).join(" ");
  if (v && typeof v === "object")
    return Object.entries(v)
      .filter(([k]) => !/url|slug|keywordHits|generator|images/i.test(k))
      .map(([, x]) => allText(x))
      .join(" ");
  return "";
}
