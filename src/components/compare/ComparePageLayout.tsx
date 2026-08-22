import Link from "next/link";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { BlogCta } from "@/components/blog/BlogCta";
import { CompareTable } from "@/components/compare/CompareTable";
import { CompareRelatedLinks } from "@/components/compare/CompareRelatedLinks";
import type { ComparisonPage } from "@/lib/compare";
import { formatBlogDate } from "@/lib/blog/format";

type ComparePageLayoutProps = {
  page: ComparisonPage;
  children: ReactNode;
};

export function ComparePageLayout({ page, children }: ComparePageLayoutProps) {
  const lastUpdated = page.updatedAt ?? page.publishedAt;

  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />

      <main className="relative pb-20 pt-24 md:pt-28">
        <header className="mx-auto w-full max-w-[44rem] px-6 text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Comparison
          </p>
          <h1 className="mt-4 font-display text-[2rem] font-semibold leading-[1.12] tracking-[-0.035em] text-[var(--foreground)] md:text-[2.75rem]">
            {page.title}
          </h1>
          <p className="mt-5 text-[17px] leading-[1.65] text-[#5c564f] md:text-[18px]">
            {page.description}
          </p>
          <p className="mt-6 text-[14px] text-[var(--foreground-muted)]">
            Lazur Team
            <span className="mx-2 text-[var(--foreground-faint)]" aria-hidden>
              ·
            </span>
            <time dateTime={lastUpdated}>{formatBlogDate(lastUpdated)}</time>
            <span className="mx-2 text-[var(--foreground-faint)]" aria-hidden>
              ·
            </span>
            {page.readingTimeMinutes} min read
          </p>
        </header>

        <article className="mx-auto mt-12 w-full max-w-[42rem] px-6">
          <div className="blog-tldr mb-10 rounded-[1.25rem] border border-[var(--border)] bg-[var(--background-deep)]/60 px-5 py-5 md:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
              TL;DR
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--foreground)] md:text-[16px]">
              {page.tldr.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <h2 className="font-display text-[1.45rem] font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[1.6rem]">
            Feature comparison
          </h2>
          <div className="mt-4">
            <CompareTable
              rows={page.table}
              competitorName={page.competitorName}
            />
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-display text-[17px] font-semibold text-[var(--foreground)]">
                Choose Lazur if…
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[#5c564f]">
                {page.chooseLazur.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-[17px] font-semibold text-[var(--foreground)]">
                Choose {page.competitorName} if…
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[#5c564f]">
                {page.chooseCompetitor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="blog-prose mt-10">{children}</div>

          <section className="mt-12" aria-labelledby="compare-faq-heading">
            <h2
              id="compare-faq-heading"
              className="font-display text-[1.45rem] font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[1.6rem]"
            >
              FAQ
            </h2>
            <dl className="mt-5 divide-y divide-[var(--border)]">
              {page.faq.map((item) => (
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
        </article>

        <div className="mx-auto mt-14 w-full max-w-[42rem] px-6">
          <BlogCta />
        </div>

        <CompareRelatedLinks page={page} />

        <p className="mx-auto mt-2 w-full max-w-4xl px-6">
          <Link
            href="/compare"
            className="text-[14px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
          >
            ← All comparisons
          </Link>
        </p>
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
