import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo/constants";
import {
  buildArticleSchema,
  buildBlogFaqSchema,
  buildBlogHowToSchema,
} from "@/lib/seo/schema";

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
    title: `${post.title} | Lazur`,
    description: post.description,
    keywords: post.targetKeyword ? [post.targetKeyword] : undefined,
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

  const faqSchema = buildBlogFaqSchema(post);
  const howtoSchema = buildBlogHowToSchema(post);

  return (
    <>
      <JsonLd data={buildArticleSchema(post)} />
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
      {howtoSchema ? <JsonLd data={howtoSchema} /> : null}
      <BlogPostLayout
        slug={post.slug}
        title={post.title}
        description={post.description}
        publishedAt={post.publishedAt}
        author={post.author}
        category={post.category}
        readingTimeMinutes={post.readingTimeMinutes}
        tldr={post.tldr}
        faq={post.faq}
      >
        <BlogMarkdown source={post.body} />
      </BlogPostLayout>
    </>
  );
}
