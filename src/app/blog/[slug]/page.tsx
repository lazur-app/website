import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { BlogRenderer } from "@/components/blog/BlogRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo/constants";
import { buildArticleSchema } from "@/lib/seo/schema";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found | Lazur" };
  }

  const canonical = `${SITE_URL}/blog/${slug}`;

  return {
    title: `${post.title} | Lazur Blog`,
    description: post.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: canonical,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd data={buildArticleSchema(post)} />
      <BlogPostLayout
        title={post.title}
        description={post.description}
        publishedAt={post.publishedAt}
        author={post.author}
        category={post.category}
        readingTimeMinutes={post.readingTimeMinutes}
      >
        <BlogRenderer blocks={post.blocks} />
      </BlogPostLayout>
    </>
  );
}
