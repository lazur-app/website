import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogRenderer } from "@/components/blog/BlogRenderer";
import { ComparePageLayout } from "@/components/compare/ComparePageLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getAllComparisonSlugs,
  getComparisonBySlug,
} from "@/lib/compare";
import {
  buildCompareArticleSchema,
  buildCompareFaqSchema,
} from "@/lib/seo/compareSchema";
import { SITE_URL } from "@/lib/seo/constants";

type ComparePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ComparePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparisonBySlug(slug);

  if (!page) {
    return { title: "Comparison not found | Lazur" };
  }

  const canonical = `${SITE_URL}/compare/${slug}`;

  return {
    title: `${page.title} | Lazur`,
    description: page.description,
    alternates: { canonical },
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article",
      url: canonical,
      publishedTime: page.publishedAt,
      modifiedTime: page.updatedAt ?? page.publishedAt,
    },
  };
}

export default async function CompareSlugPage({ params }: ComparePageProps) {
  const { slug } = await params;
  const page = getComparisonBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={[buildCompareArticleSchema(page), buildCompareFaqSchema(page)]}
      />
      <ComparePageLayout page={page}>
        <BlogRenderer blocks={page.blocks} />
      </ComparePageLayout>
    </>
  );
}
