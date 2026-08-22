import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogRenderer } from "@/components/blog/BlogRenderer";
import { UseCasePageLayout } from "@/components/use-cases/UseCasePageLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllUseCaseSlugs, getUseCaseBySlug } from "@/lib/use-cases";
import {
  buildUseCaseArticleSchema,
  buildUseCaseFaqSchema,
  buildUseCaseHowToSchema,
} from "@/lib/seo/useCaseSchema";
import { SITE_URL } from "@/lib/seo/constants";

type UseCaseSlugProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllUseCaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: UseCaseSlugProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getUseCaseBySlug(slug);

  if (!page) {
    return { title: "Use case not found | Lazur" };
  }

  const canonical = `${SITE_URL}/use-cases/${slug}`;

  return {
    title: `${page.title} | Lazur`,
    description: page.description,
    alternates: { canonical },
    keywords: page.targetKeyword,
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

export default async function UseCaseSlugPage({ params }: UseCaseSlugProps) {
  const { slug } = await params;
  const page = getUseCaseBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={[
          buildUseCaseArticleSchema(page),
          buildUseCaseFaqSchema(page),
          buildUseCaseHowToSchema(page),
        ]}
      />
      <UseCasePageLayout page={page}>
        <BlogRenderer blocks={page.blocks} />
      </UseCasePageLayout>
    </>
  );
}
