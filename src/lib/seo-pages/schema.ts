import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import { buildSoftwareApplicationSchema } from "@/lib/seo/schema";
import { seoPath } from "./routes";
import type { SeoPage } from "./types";

/** JSON-LD for programmatic pages: Article, BreadcrumbList, FAQPage, HowTo, SoftwareApplication. */

export function breadcrumbSchema(crumbs: { href: string; label: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${SITE_URL}${c.href === "/" ? "" : c.href}`,
    })),
  };
}

export function faqSchema(faq: { question: string; answer: string }[]) {
  if (faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function articleSchema(page: SeoPage) {
  const url = `${SITE_URL}${seoPath(page)}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    datePublished: page.publishedAt,
    dateModified: page.updatedAt ?? page.publishedAt,
    image: page.images.length > 0 ? page.images.slice(0, 3).map((i) => i.url) : [`${url}/opengraph-image`],
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: [page.targetKeyword, ...page.secondaryKeywords].join(", "),
    citation: page.sources.map((s) => s.url),
  };
}

export function howToSchema(page: SeoPage) {
  if (page.type !== "howto") return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.title,
    description: page.description,
    totalTime: `PT${page.timeMinutes}M`,
    tool: [{ "@type": "HowToTool", name: `${page.appName} for Mac` }],
    supply: page.requirements.map((r) => ({ "@type": "HowToSupply", name: r })),
    step: page.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.menuPath?.length ? `${s.text} (${s.menuPath.join(" > ")})` : s.text,
      url: `${SITE_URL}${seoPath(page)}#step-${i + 1}`,
      ...(s.image !== undefined && page.images[s.image] ? { image: page.images[s.image].url } : {}),
    })),
  };
}

export function softwareSchema() {
  return buildSoftwareApplicationSchema();
}

export function schemasFor(page: SeoPage, crumbs: { href: string; label: string }[]) {
  return [articleSchema(page), breadcrumbSchema(crumbs), faqSchema(page.faq), howToSchema(page), softwareSchema()].filter(
    Boolean,
  ) as Record<string, unknown>[];
}
