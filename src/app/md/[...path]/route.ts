import { getPostBySlug } from "@/lib/blog";
import {
  getAlternativesPage,
  getAppPage,
  getComparePage,
  getHowTo,
  getProblemPage,
  getRoleAppPage,
  getRolePage,
} from "@/lib/seo-pages/load";
import { pageToMarkdown, postToMarkdown } from "@/lib/seo-pages/markdown";
import type { SeoPage } from "@/lib/seo-pages/types";
import { SITE_URL } from "@/lib/seo/constants";

/**
 * Markdown copy of any content page. next.config rewrites /<page>.md to /md/<page>, so
 * https://www.lazur.app/how-to/x.md works. The Link header points back at the HTML page as canonical.
 */
export const revalidate = 86400;

function find(path: string[]): { md: string; canonical: string } | null {
  const [a, b, c, d] = path;
  let page: SeoPage | undefined;
  if (a === "blog" && b && !c) {
    const post = getPostBySlug(b);
    return post ? { md: postToMarkdown(post), canonical: `/blog/${b}` } : null;
  }
  if (a === "how-to" && b && !c) page = getHowTo(b);
  else if (a === "apps" && b && !c) page = getAppPage(b);
  else if (a === "for" && b && !c) page = getRolePage(b);
  else if (a === "for" && b && c === "problems" && d) page = getProblemPage(b, d);
  else if (a === "for" && b && c && !d) page = getRoleAppPage(b, c);
  else if (a === "compare" && b && !c) page = getComparePage(b);
  else if (a === "alternatives" && b && !c) page = getAlternativesPage(b);
  if (!page) return null;
  return { md: pageToMarkdown(page), canonical: `/${path.join("/")}` };
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const hit = find((await params).path);
  if (!hit) return new Response("Not found\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(hit.md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: `<${SITE_URL}${hit.canonical}>; rel="canonical"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
