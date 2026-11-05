// @ts-check
/**
 * Code checks on every generated item (SRCo's guard.ts pattern). A page that fails an "error" check
 * is sent back to the model once with the list; if it still fails it goes to refused.jsonl and is
 * not published. Hand-written pages are checked by the same code in seo-lint.mjs.
 */
import { checkDeep } from "../../../src/lib/content/rules.mjs";
import { allText, covers, keywordHits } from "../../../src/lib/content/keywords.mjs";
import { LAZUR, LAZUR_CAPABILITY_IDS } from "../../../src/lib/content/lazur-facts.mjs";

/**
 * @typedef {{ errors: string[], warnings: string[] }} GuardResult
 * @typedef {{ allowedPaths: Set<string>, existingTitles?: Set<string>, minImages?: number, type: string }} GuardCtx
 */

/** @param {string} u */
const host = (u) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};
/** @param {string} h */
const rootDomain = (h) => h.split(".").slice(-2).join(".");

/** Lazur prices that may appear anywhere: plan monthly, annual per month, annual totals, trial. */
const LAZUR_PRICES = new Set([0, ...LAZUR.plans.flatMap((p) => [p.monthly, p.annualPerMonth]), 180, 1152]);

/**
 * @param {any} page
 * @param {GuardCtx} ctx
 * @returns {GuardResult}
 */
export function guardPage(page, ctx) {
  /** @type {string[]} */
  const errors = [];
  /** @type {string[]} */
  const warnings = [];

  // 1. Writing rules on every prose string.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { generator, keywordHits: _hits, images, sources, ...prose } = page;
  for (const issue of checkDeep(prose)) (issue.severity === "error" ? errors : warnings).push(`${issue.rule}: ${issue.detail}`);
  for (const img of images ?? [])
    for (const issue of checkDeep({ alt: img.alt, caption: img.caption })) (issue.severity === "error" ? errors : warnings).push(`image ${issue.rule}: ${issue.detail}`);

  // 2. Keyword targeting.
  if (page.targetKeyword) {
    if (!covers(`${page.metaTitle ?? ""} ${page.title}`, page.targetKeyword)) errors.push(`keyword: title/metaTitle misses words of "${page.targetKeyword}"`);
    if (!covers(page.description, page.targetKeyword)) warnings.push(`keyword: description misses words of "${page.targetKeyword}"`);
  }
  if (page.description && (page.description.length < 100 || page.description.length > 165)) warnings.push(`description is ${page.description.length} chars (aim 120 to 160)`);
  if (page.metaTitle && page.metaTitle.length > 65) warnings.push(`metaTitle is ${page.metaTitle.length} chars (aim under 60)`);

  // 3. Every number is sourced.
  const sourceUrls = new Set((sources ?? []).map((/** @type {any} */ s) => s.url));
  if ((sources ?? []).length === 0) errors.push("sources: none");
  for (const s of page.stats ?? []) {
    if (!s.sourceUrl) errors.push(`stat "${s.value}" has no source`);
    else if (!sourceUrls.has(s.sourceUrl)) errors.push(`stat "${s.value}" source is not in the sources list`);
  }
  if (page.chart && !sourceUrls.has(page.chart.sourceUrl)) errors.push("chart source is not in the sources list");
  for (const s of sources ?? []) if (!/^https:\/\//.test(s.url)) errors.push(`source not https: ${s.url}`);

  // 4. Internal links must exist.
  const text = JSON.stringify(prose);
  for (const m of text.matchAll(/\]\((\/[^)\s"]*)\)/g)) {
    const p = m[1].split("#")[0].split("?")[0];
    if (!ctx.allowedPaths.has(p)) errors.push(`link to unknown page ${p}`);
  }

  // 5. Lazur demos only use real capabilities, and Lazur's prices match.
  const demos = [page.lazur, page.demo, ...(page.demos ?? [])].filter(Boolean);
  const asks = [...(page.asks ?? []), ...(page.tasks ?? []), ...(page.day ?? [])];
  for (const d of [...demos, ...asks]) {
    if (!LAZUR_CAPABILITY_IDS.includes(d.capability)) errors.push(`unknown Lazur capability "${d.capability}"`);
  }
  for (const d of demos) {
    if ((d.capability === "point" || d.capability === "guide") && !d.pointsAt) warnings.push("point/guide demo without pointsAt");
    if ((d.capability === "draft" || d.capability === "dictate") && !d.output) warnings.push("draft/dictate demo without output");
  }
  for (const m of text.matchAll(/lazur[^"$.]{0,50}\$\s?(\d[\d,]*)/gi)) {
    const n = Number(m[1].replace(/,/g, ""));
    if (!LAZUR_PRICES.has(n)) errors.push(`Lazur price $${n} does not match pricing`);
  }
  for (const p of page.products ?? []) {
    if (!p.isLazur) continue;
    for (const m of String(p.pricing).matchAll(/\$\s?(\d[\d,]*)/g)) {
      const n = Number(m[1].replace(/,/g, ""));
      if (!LAZUR_PRICES.has(n)) errors.push(`Lazur price $${n} does not match pricing`);
    }
  }

  // 6. Type-specific checks.
  if (ctx.type === "howto") {
    if ((page.steps ?? []).length < 3) errors.push("howto: fewer than 3 steps");
    if (page.lazur && !["point", "guide", "explain"].includes(page.lazur.capability)) warnings.push("howto: lazur demo should point, guide or explain");
    if (!/\b(mac|macos)\b/i.test(`${page.title} ${page.intro}`)) warnings.push("howto: title/intro does not say Mac");
    if (!page.appliesTo) errors.push("howto: appliesTo missing");
  }
  if (ctx.type === "compare" || ctx.type === "alternatives") {
    for (const p of page.products ?? []) {
      if (p.isLazur) continue;
      if (/\$|€|£|\d+\s*\/\s*mo/.test(p.pricing)) {
        if (!p.pricingSourceUrl) errors.push(`${p.name}: price without pricingSourceUrl`);
        else if (host(p.site) && rootDomain(host(p.pricingSourceUrl)) !== rootDomain(host(p.site))) {
          warnings.push(`${p.name}: price source ${host(p.pricingSourceUrl)} is not their own site`);
        }
        if (!p.pricingCheckedAt) errors.push(`${p.name}: price without pricingCheckedAt`);
      }
    }
    const width = (page.products ?? []).length;
    for (const r of page.table ?? []) if (r.values.length !== width) errors.push(`table row "${r.feature}" has ${r.values.length} values for ${width} products`);
  }

  // 7. FAQ and duplicates.
  const qs = (page.faq ?? []).map((/** @type {any} */ f) => f.question.toLowerCase());
  if (new Set(qs).size !== qs.length) errors.push("faq: duplicate questions");
  if (ctx.existingTitles?.has(String(page.title).toLowerCase())) errors.push(`duplicate title "${page.title}"`);

  // 8. Images.
  const min = ctx.minImages ?? 0;
  if ((images ?? []).length < min) errors.push(`images: ${images?.length ?? 0} of ${min} required`);
  for (const img of images ?? []) {
    if (!img.alt || img.alt.length < 10) errors.push("image without alt text");
    if (img.credit?.source === "Pexels" && !img.credit.name) errors.push("Pexels image without photographer credit");
  }

  // Keyword hits are recorded either way.
  page.keywordHits = keywordHits(page, allText(prose));
  if (page.keywordHits.bodyCount === 0 && !page.keywordHits.inIntro) warnings.push("keyword phrase never appears in the intro or body");

  return { errors, warnings };
}

/** One-line summary for logs. @param {GuardResult} r */
export const guardSummary = (r) => `${r.errors.length} errors, ${r.warnings.length} warnings${r.errors.length ? `: ${r.errors.slice(0, 3).join(" | ")}` : ""}`;
