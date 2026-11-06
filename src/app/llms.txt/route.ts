import fs from "fs";
import path from "path";
import { getAllPosts } from "@/lib/blog";
import {
  getAlternativesPages,
  getAppPages,
  getComparePages,
  getHowTos,
  getProblemPages,
  getRoleAppPages,
  getRolePages,
} from "@/lib/seo-pages/load";
import { seoPath } from "@/lib/seo-pages/routes";
import type { SeoPage } from "@/lib/seo-pages/types";
import { SITE_URL } from "@/lib/seo/constants";
import { TOOLS } from "@/lib/tools";

/**
 * /llms.txt: the hand-written product summary (content/llms/header.md) followed by every content
 * page, generated at build time so new pages appear on the next deploy. Links point at the
 * markdown copies (<url>.md), which are easier for LLMs to read.
 */
export const dynamic = "force-static";

const line = (title: string, href: string, desc?: string) => `- [${title}](${SITE_URL}${href}.md)${desc ? `: ${desc}` : ""}`;
const section = (title: string, pages: SeoPage[]) =>
  pages.length ? `## ${title}\n\n${pages.map((p) => line(p.title, seoPath(p), p.description)).join("\n")}\n` : "";

export function GET() {
  const header = fs.readFileSync(path.join(process.cwd(), "content/llms/header.md"), "utf8").trim();
  const body = [
    header,
    section("Comparisons", [...getComparePages(), ...getAlternativesPages()]),
    section("Lazur in each Mac app", getAppPages()),
    section("Lazur by job", getRolePages()),
    section("Problems people in each job have, and fixes", getProblemPages()),
    section("Job and app", getRoleAppPages()),
    section("How-to guides for Mac apps", getHowTos()),
    `## Blog\n\n${getAllPosts().map((p) => line(p.title, `/blog/${p.slug}`, p.description)).join("\n")}\n`,
    `## Free tools\n\n${TOOLS.map((t) => `- [${t.name}](${SITE_URL}/tools/${t.slug}): ${t.description}`).join("\n")}\n`,
  ]
    .filter(Boolean)
    .join("\n\n");
  return new Response(body + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
