import type { ReactNode } from "react";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { ArticleLayout } from "@/components/seo-pages/ArticleLayout";
import { ImageFigure } from "@/components/seo-pages/ImageFigure";
import { PageHero } from "@/components/seo-pages/PageHero";
import { CtaBand, FaqList, PhotoCredits, SourcesList, TldrBox } from "@/components/seo-pages/Primitives";
import { RelatedGrid } from "@/components/seo-pages/RelatedGrid";
import { SeoPageFrame } from "@/components/seo-pages/SeoPageFrame";
import { StatStrip } from "@/components/seo-pages/StatStrip";
import { getRelatedPosts, type BlogPost } from "@/lib/blog";
import { relatedForPost } from "@/lib/seo-pages/links";
import { breadcrumbSchema } from "@/lib/seo-pages/schema";

/** Blog post page, on the same design system as the programmatic SEO pages. */
export function BlogPostLayout({ post, schema, children }: { post: BlogPost; schema: Record<string, unknown>[]; children: ReactNode }) {
  const related = getRelatedPosts(post.slug);
  const relatedGroups = relatedForPost(post);
  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: `/blog/${post.slug}`, label: post.title },
  ];
  return (
    <SeoPageFrame schema={[...schema, breadcrumbSchema(crumbs)]}>
      <PageHero
        crumbs={crumbs}
        kicker={post.category}
        title={post.title}
        intro={post.description}
        updatedAt={post.updatedAt ?? post.publishedAt}
        meta={[post.author, `${post.readingTimeMinutes} min read`]}
        visual={post.heroImage ? <ImageFigure image={post.heroImage} priority /> : undefined}
      />
      <ArticleLayout source={`blog-${post.slug}`} related={relatedGroups}>
      <article>
        <TldrBox items={post.tldr} title="TL;DR" />
        {post.stats.length > 0 ? (
          <div className="mt-10">
            <StatStrip stats={post.stats} />
          </div>
        ) : null}
        <div className="mt-10">{children}</div>
        <FaqList items={post.faq} id="blog-faq" title="FAQ" />
        <SourcesList sources={post.sources} />
        <PhotoCredits images={[post.heroImage]} />
      </article>
      </ArticleLayout>
      <div className="px-4 sm:px-6">
        <CtaBand source={`blog-${post.slug}`} />
      </div>
      <RelatedGrid groups={relatedGroups} />
      {related.length > 0 ? (
        <section className="seo-wrap mt-16">
          <h2 className="seo-h2">More from the blog</h2>
          <div className="mt-2 divide-y divide-[var(--border)]">
            {related.map((p) => (
              <BlogPostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      ) : null}
    </SeoPageFrame>
  );
}
