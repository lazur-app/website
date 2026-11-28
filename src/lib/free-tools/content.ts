import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Written content for the free tools: one file per tool at content/free-tools/pages/<tool>.json.
 * `main` sits under the tool on its home page; `pages` are the keyword pages at <tool>.lazur.app/<slug>,
 * chosen from Google data (scripts/free-tools-keywords.mjs). Checked by scripts/free-tools-validate.mjs.
 * Server only (reads files).
 */
export type ContentSection = { heading: string; body: string };
export type ContentFaq = { q: string; a: string };
export type ContentImage = { src: string; width: number; height: number; alt: string; credit: string; creditUrl: string };

export type ToolPageContent = {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  /** One or two sentences right under the H1: the direct, factual answer to the search. */
  claim: string;
  sections: ContentSection[];
  faq: ContentFaq[];
  imageQuery: string;
  imageAlt: string;
  image?: ContentImage;
};

export type ToolContent = {
  tool: string;
  main: { claim: string; sections: ContentSection[]; imageQuery: string; imageAlt: string; image?: ContentImage };
  pages: ToolPageContent[];
};

const DIR = path.join(process.cwd(), "content", "free-tools", "pages");
const cache = new Map<string, ToolContent | null>();

export function getToolContent(tool: string): ToolContent | null {
  if (cache.has(tool)) return cache.get(tool) ?? null;
  const file = path.join(DIR, `${tool.replace(/[^a-z0-9-]/g, "")}.json`);
  const data = existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as ToolContent) : null;
  cache.set(tool, data);
  return data;
}

export function getToolPage(tool: string, slug: string): ToolPageContent | null {
  return getToolContent(tool)?.pages.find((p) => p.slug === slug) ?? null;
}
