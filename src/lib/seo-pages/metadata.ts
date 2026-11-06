import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/constants";
import { seoPath } from "./routes";
import type { SeoPage } from "./types";

/** Metadata for a programmatic page. The OG image comes from the route's opengraph-image.tsx. */
export function seoMetadata(page: SeoPage): Metadata {
  const canonical = `${SITE_URL}${seoPath(page)}`;
  return {
    title: `${page.metaTitle} | Lazur`,
    description: page.description,
    keywords: [page.targetKeyword, ...page.secondaryKeywords],
    // The markdown copy (same content, for LLMs) is announced as an alternate format.
    alternates: { canonical, types: { "text/markdown": `${canonical}.md` } },
    openGraph: {
      title: page.metaTitle,
      description: page.description,
      type: "article",
      url: canonical,
      publishedTime: page.publishedAt,
      modifiedTime: page.updatedAt ?? page.publishedAt,
    },
    twitter: { card: "summary_large_image", title: page.metaTitle, description: page.description },
  };
}
