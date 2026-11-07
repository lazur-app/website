import type { BlogPost } from "@/lib/blog/types";
import { HOMEPAGE_FAQ } from "@/lib/seo/faq";
import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/constants";

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://www.instagram.com/heylazur",
      "https://x.com/heylazur",
      "https://www.linkedin.com/company/lazur-app",
    ],
  };
}

/** Site name in Google results ("Lazur" instead of the domain). */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en",
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

/** The homepage demo film (src/components/buddy/DemoVideo.tsx). */
export function buildDemoVideoSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Lazur demo: an AI buddy that works in any Mac app",
    description:
      "You ask out loud; Lazur points on screen, rewrites, types, fixes code, totals a sheet, and researches in Chrome in the background.",
    thumbnailUrl: ["https://releases.lazur.app/videos/lazur-demo-v3-poster.jpg"],
    contentUrl: "https://releases.lazur.app/videos/lazur-demo-v3.mp4",
    uploadDate: "2026-11-05T00:00:00+05:30",
    duration: "PT37S",
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
  };
}

export function buildSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "macOS",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    downloadUrl: `${SITE_URL}/download`,
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "3-day Pro trial, no credit card required",
      },
      {
        "@type": "Offer",
        price: "18.00",
        priceCurrency: "USD",
        description: "Pro plan, monthly",
      },
      {
        "@type": "Offer",
        price: "120.00",
        priceCurrency: "USD",
        description: "Power plan, monthly",
      },
    ],
  };
}

export function buildFaqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOMEPAGE_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.link
          ? `${item.answer} ${item.link.label}: ${SITE_URL}${item.link.href}`
          : item.answer,
      },
    })),
  };
}

export function buildArticleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.targetKeyword,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".blog-tldr", ".blog-prose"],
    },
  };
}

export function buildBlogFaqSchema(post: BlogPost) {
  if (post.faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildBlogHowToSchema(post: BlogPost) {
  if (!post.howto) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: post.howto.name,
    description: post.description,
    step: post.howto.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
