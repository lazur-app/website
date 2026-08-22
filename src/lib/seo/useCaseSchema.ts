import type { UseCasePage } from "@/lib/use-cases";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";

export function buildUseCaseFaqSchema(page: UseCasePage) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildUseCaseHowToSchema(page: UseCasePage) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.howto.name,
    description: page.description,
    step: page.howto.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function buildUseCaseArticleSchema(page: UseCasePage) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    datePublished: page.publishedAt,
    dateModified: page.updatedAt ?? page.publishedAt,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
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
      "@id": `${SITE_URL}/use-cases/${page.slug}`,
    },
  };
}
