#!/usr/bin/env node
// @ts-check
/**
 * Lint every page against the same rules the generator enforces (SRCo's seo-lint pattern).
 *
 *   node scripts/content/seo-lint.mjs            # errors fail (exit 1), warnings print
 *   node scripts/content/seo-lint.mjs --quiet    # only the summary and errors
 *   node scripts/content/seo-lint.mjs --type=howto
 *
 * Runs in CI before the daily job commits, and is safe to run any time locally.
 */
import { allowedPaths, flags, readAll } from "./lib/core.mjs";
import { guardPage } from "./lib/guards.mjs";

const f = flags(process.argv.slice(2));
const paths = allowedPaths();
const pages = readAll().filter((p) => !f.type || p.type === f.type);
let errorCount = 0;
let warnCount = 0;
/** @type {Map<string, string>} */
const keywords = new Map();

for (const p of pages) {
  // Hand-written blog posts from before the long-tail H1 rule warn instead of failing; the refresh job rewrites them.
  // Pages written before the 2,000-word rule warn on length until the refresh job rewrites them
  // (the refresh picks the thinnest pages first). Anything the pipeline writes must pass.
  const handWritten = !p.generator || /^hand/.test(String(p.generator.by ?? ""));
  const ctx = { type: p.type, allowedPaths: paths, legacyH1: p.type === "blog" && !p.generator, legacyLength: handWritten };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { file, ...page } = p;
  const subject =
    p.type === "blog"
      ? {
          title: page.title,
          metaTitle: page.title,
          description: page.description,
          targetKeyword: page.targetKeyword,
          intro: String(page.body).trim().split(/\n\s*\n/)[0],
          tldr: page.tldr ?? [],
          faq: page.faq ?? [],
          howto: page.howto,
          stats: page.stats ?? [],
          sources: page.sources ?? [{ title: "legacy post without sources", url: "https://www.lazur.app" }],
          images: page.images ?? [],
          body: page.body,
        }
      : page;
  const r = guardPage(subject, ctx);

  const kw = String(page.targetKeyword ?? "").toLowerCase();
  if (kw) {
    const other = keywords.get(kw);
    if (other) r.errors.push(`target keyword "${kw}" is also used by ${other}`);
    else keywords.set(kw, `${p.type}/${p.slug}`);
  }

  errorCount += r.errors.length;
  warnCount += r.warnings.length;
  if (r.errors.length || (!f.quiet && r.warnings.length)) {
    console.log(`\n${p.type}/${p.slug}`);
    for (const e of r.errors) console.log(`  ERROR ${e}`);
    if (!f.quiet) for (const w of r.warnings) console.log(`  warn  ${w}`);
  }
}

console.log(`\nseo-lint: ${pages.length} pages, ${errorCount} errors, ${warnCount} warnings`);
// Report only, unless content checks are on (CONTENT_CHECKS=on) or --strict is passed.
process.exit(errorCount > 0 && (process.env.CONTENT_CHECKS === "on" || f.strict) ? 1 : 0);
