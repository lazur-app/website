import "server-only";

import { LAZUR_CAPABILITIES } from "@/lib/content/lazur-facts.mjs";
import type { BlogPost } from "@/lib/blog/types";
import { SITE_URL } from "@/lib/seo/constants";
import { seoPath } from "./routes";
import type { SeoBlock, SeoPage } from "./types";

/**
 * Plain-markdown copies of every page, served at <page URL>.md and listed in /llms.txt. Answer
 * engines and LLM crawlers read these without layout, scripts or images getting in the way. Same
 * content as the HTML page, same canonical URL (sent as a Link header), so it is not a second page.
 */

const abs = (href: string) => (href.startsWith("/") ? `${SITE_URL}${href}` : href);
const linkify = (text: string) => text.replace(/\]\((\/[^)\s]*)\)/g, (_, p: string) => `](${abs(p)})`);

function blocksMd(blocks: SeoBlock[], page: SeoPage): string[] {
  const out: string[] = [];
  for (const b of blocks) {
    switch (b.type) {
      case "paragraph":
        out.push(linkify(b.text));
        break;
      case "heading":
        out.push(`${b.level === 3 ? "###" : "##"} ${b.text}`);
        break;
      case "list":
        out.push(b.items.map((it, i) => `${b.ordered ? `${i + 1}.` : "-"} ${linkify(it)}`).join("\n"));
        break;
      case "callout":
        out.push(`> **${b.title ?? (b.tone === "tip" ? "Tip" : b.tone === "warning" ? "Heads up" : "Note")}:** ${linkify(b.text)}`);
        break;
      case "table":
        out.push(
          [`| ${b.headers.join(" | ")} |`, `| ${b.headers.map(() => "---").join(" | ")} |`, ...b.rows.map((r) => `| ${r.join(" | ")} |`)].join("\n") +
            (b.caption ? `\n\n_${b.caption}_` : ""),
        );
        break;
      case "image": {
        const img = page.images[b.index];
        if (img) out.push(`![${img.alt}](${abs(img.url)})`);
        break;
      }
      case "stats":
        if (page.stats.length) out.push(page.stats.map((s) => `- **${s.value}** ${s.label}${s.sourceUrl ? ` ([source](${s.sourceUrl}))` : ""}`).join("\n"));
        break;
      case "chart":
        if (page.chart)
          out.push(
            `**${page.chart.title}**\n\n` +
              page.chart.bars.map((x) => `- ${x.label}: ${x.value}${page.chart?.unit ? ` ${page.chart.unit}` : ""}`).join("\n") +
              (page.chart.sourceUrl ? `\n\nSource: ${page.chart.sourceUrl}` : ""),
          );
        break;
      case "lazur":
        break;
    }
  }
  return out;
}

export function pageToMarkdown(page: SeoPage): string {
  const url = `${SITE_URL}${seoPath(page)}`;
  const parts: string[] = [`# ${page.title}`, `> ${page.description}`, `URL: ${url}\nUpdated: ${page.updatedAt ?? page.publishedAt}`, linkify(page.intro)];
  if (page.tldr.length) parts.push(`## Quick answer\n\n${page.tldr.map((t) => `- ${linkify(t)}`).join("\n")}`);

  if (page.type === "howto") {
    parts.push(`Applies to: ${page.appliesTo}. Time: ${page.timeMinutes} min. Difficulty: ${page.difficulty}.`);
    if (page.requirements.length) parts.push(`## What you need\n\n${page.requirements.map((r) => `- ${r}`).join("\n")}`);
    parts.push(
      `## How to ${page.task} in ${page.appName} on a Mac\n\n` +
        page.steps
          .map((s, i) => `${i + 1}. **${s.name}.**${s.menuPath?.length ? ` (${s.menuPath.join(" > ")})` : ""}${s.shortcut ? ` Shortcut: ${s.shortcut}.` : ""} ${linkify(s.text)}${s.tip ? ` Tip: ${linkify(s.tip)}` : ""}`)
          .join("\n"),
    );
  }
  if (page.type === "problem") {
    parts.push(`## What ${page.problem} costs you\n\n${page.costs.map((c) => `- **${c.title}.** ${linkify(c.text)}`).join("\n")}`);
    parts.push(`## Why it happens\n\n${page.causes.map((c, i) => `${i + 1}. **${c.title}.** ${linkify(c.text)}`).join("\n")}`);
    parts.push(`## How to fix it\n\n${page.fixes.map((c) => `- **${c.title}.** ${linkify(c.text)}`).join("\n")}`);
  }
  if (page.type === "role") parts.push(`## Where the day goes\n\n${page.painPoints.map((p) => `- **${p.title}.** ${linkify(p.text)}`).join("\n")}`);
  if (page.type === "compare" || page.type === "alternatives") {
    const names = page.products.map((p) => p.name);
    parts.push(
      `## Side by side\n\n| Feature | ${names.join(" | ")} |\n| --- | ${names.map(() => "---").join(" | ")} |\n${page.table.map((r) => `| ${r.feature} | ${r.values.join(" | ")} |`).join("\n")}`,
    );
    parts.push(`**Our take:** ${page.verdict}`);
    parts.push(page.products.map((p) => `### ${p.name}\n\n${p.summary}\n\n- Price: ${p.pricing}${p.pricingSourceUrl ? ` (${p.pricingSourceUrl}${p.pricingCheckedAt ? `, checked ${p.pricingCheckedAt}` : ""})` : ""}\n- Runs on: ${p.platforms}`).join("\n\n"));
  }

  parts.push(...blocksMd(page.blocks, page));

  if (page.type === "howto" && page.shortcuts.length) parts.push(`## Shortcuts\n\n${page.shortcuts.map((s) => `- ${s.action}: ${s.keys}`).join("\n")}`);
  if (page.type === "howto" && page.troubleshooting.length) parts.push(`## If it does not work\n\n${page.troubleshooting.map((t) => `- **${t.problem}** ${linkify(t.fix)}`).join("\n")}`);

  const asks = page.type === "app" ? page.asks : page.type === "role-app" ? page.tasks : page.type === "problem" ? page.lazurHelps : page.type === "role" ? page.day : [];
  const demo = page.type === "howto" ? page.lazur : page.type === "app" ? page.demos[0] : "demo" in page ? page.demo : undefined;
  if (demo || asks.length) {
    parts.push(
      `## With Lazur\n\nLazur is a voice assistant for the Mac that lives in the notch. Hold ⌥ ⌘ and ask; it sees your screen, answers out loud, points at buttons and walks you through apps. Hold fn to dictate. Free for 3 days, then $18/month: ${SITE_URL}/download\n\n` +
        [demo ? `- “${demo.spoken}”: ${demo.result} (${LAZUR_CAPABILITIES[demo.capability].label})` : "", ...asks.map((a) => `- “${a.say}”: ${a.result}`)].filter(Boolean).join("\n"),
    );
  }
  if (page.type === "problem" && page.plan.length) parts.push(`## A plan you can start this week\n\n${page.plan.map((p) => `- **${p.label}: ${p.title}.** ${linkify(p.text)}`).join("\n")}`);
  if (page.faq.length) parts.push(`## FAQ\n\n${page.faq.map((f) => `### ${f.question}\n\n${linkify(f.answer)}`).join("\n\n")}`);
  if (page.sources.length) parts.push(`## Sources\n\n${page.sources.map((s, i) => `${i + 1}. [${s.title}](${s.url})${s.publisher ? `, ${s.publisher}` : ""}${s.accessedAt ? `, checked ${s.accessedAt}` : ""}`).join("\n")}`);
  return parts.join("\n\n") + "\n";
}

export function postToMarkdown(post: BlogPost): string {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const parts = [`# ${post.title}`, `> ${post.description}`, `URL: ${url}\nUpdated: ${post.updatedAt ?? post.publishedAt}`];
  if (post.tldr.length) parts.push(`## TL;DR\n\n${post.tldr.map((t) => `- ${t}`).join("\n")}`);
  parts.push(linkify(post.body));
  if (post.faq.length) parts.push(`## FAQ\n\n${post.faq.map((f) => `### ${f.question}\n\n${f.answer}`).join("\n\n")}`);
  if (post.sources.length) parts.push(`## Sources\n\n${post.sources.map((s, i) => `${i + 1}. [${s.title}](${s.url})`).join("\n")}`);
  return parts.join("\n\n") + "\n";
}
