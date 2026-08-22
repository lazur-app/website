import Link from "next/link";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { BlogCta } from "@/components/blog/BlogCta";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { formatBlogDate, getRelatedPosts, type BlogFaqItem } from "@/lib/blog";

type BlogPostLayoutProps = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  category: string;
  readingTimeMinutes: number;
  tldr: string[];
  faq: BlogFaqItem[];
  children: ReactNode;
};

export function BlogPostLayout({
  slug,
  title,
  description,
  publishedAt,
  author,
  category,
  readingTimeMinutes,
  tldr,
  faq,
  children,
}: BlogPostLayoutProps) {
  const related = getRelatedPosts(slug);

  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />

      <main className="relative pb-20 pt-24 md:pt-28">
        <header className="mx-auto w-full max-w-[44rem] px-6 text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            {category}
          </p>
          <h1 className="mt-4 font-display text-[2rem] font-semibold leading-[1.12] tracking-[-0.035em] text-[var(--foreground)] md:text-[2.75rem]">
            {title}
          </h1>
          <p className="mt-5 text-[17px] leading-[1.65] text-[#5c564f] md:text-[18px]">
            {description}
          </p>
          <p className="mt-6 text-[14px] text-[var(--foreground-muted)]">
            {author}
            <span className="mx-2 text-[var(--foreground-faint)]" aria-hidden>
              ·
            </span>
            <time dateTime={publishedAt}>{formatBlogDate(publishedAt)}</time>
            <span className="mx-2 text-[var(--foreground-faint)]" aria-hidden>
              ·
            </span>
            {readingTimeMinutes} min read
          </p>
        </header>

        <article className="mx-auto mt-12 w-full max-w-[42rem] px-6">
          {tldr.length > 0 ? (
            <div className="blog-tldr mb-10 rounded-[1.25rem] border border-[var(--border)] bg-[var(--background-deep)]/60 px-5 py-5 md:px-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
                TL;DR
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--foreground)] md:text-[16px]">
                {tldr.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {children}

          {faq.length > 0 ? (
            <section className="mt-12" aria-labelledby="blog-faq-heading">
              <h2
                id="blog-faq-heading"
                className="font-display text-[1.45rem] font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[1.6rem]"
              >
                FAQ
              </h2>
              <dl className="mt-5 divide-y divide-[var(--border)]">
                {faq.map((item) => (
                  <div key={item.question} className="py-5 first:pt-2">
                    <dt className="font-display text-[17px] font-semibold text-[var(--foreground)]">
                      {item.question}
                    </dt>
                    <dd className="mt-2 text-[16px] leading-[1.75] text-[#3d3834]">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </article>

        <div className="mx-auto mt-14 w-full max-w-[42rem] px-6">
          <BlogCta />
        </div>

        {related.length > 0 ? (
          <section className="mx-auto mt-16 w-full max-w-4xl px-6">
            <h2 className="font-display text-lg font-semibold tracking-tight text-[var(--foreground)]">
              More from the blog
            </h2>
            <div className="mt-2 divide-y divide-[var(--border)]">
              {related.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
            <p className="mt-2">
              <Link
                href="/blog"
                className="text-[14px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
              >
                ← All posts
              </Link>
            </p>
          </section>
        ) : null}
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
