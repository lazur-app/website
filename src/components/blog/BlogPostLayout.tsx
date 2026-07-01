import Link from "next/link";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { SoftCard } from "@/components/SoftCard";
import { BlogCta } from "@/components/blog/BlogCta";

type BlogPostLayoutProps = {
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  category: string;
  readingTimeMinutes: number;
  children: ReactNode;
};

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPostLayout({
  title,
  description,
  publishedAt,
  author,
  category,
  readingTimeMinutes,
  children,
}: BlogPostLayoutProps) {
  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />

      <main className="relative mx-auto max-w-3xl px-6 pb-16 pt-24 md:pt-28">
        <Link
          href="/blog"
          className="text-[13px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
        >
          ← Back to blog
        </Link>

        <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
          {category}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[2.5rem] md:leading-[1.12]">
          {title}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--foreground-muted)] md:text-base">
          {description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--foreground-faint)]">
          <span>{author}</span>
          <span aria-hidden>·</span>
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{readingTimeMinutes} min read</span>
        </div>

        <SoftCard hover={false} className="mt-8 p-6 md:p-8">
          <article>{children}</article>
          <BlogCta />
        </SoftCard>
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
