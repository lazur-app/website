import Link from "next/link";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { SoftCard } from "@/components/SoftCard";
import { BlogCta } from "@/components/blog/BlogCta";
import { CompareTable } from "@/components/compare/CompareTable";
import { CompareRelatedLinks } from "@/components/compare/CompareRelatedLinks";
import type { ComparisonPage } from "@/lib/compare";

type ComparePageLayoutProps = {
  page: ComparisonPage;
  children: ReactNode;
};

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ComparePageLayout({ page, children }: ComparePageLayoutProps) {
  const lastUpdated = page.updatedAt ?? page.publishedAt;

  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />

      <main className="relative mx-auto max-w-3xl px-6 pb-16 pt-24 md:pt-28">
        <Link
          href="/compare"
          className="text-[13px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
        >
          ← All comparisons
        </Link>

        <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
          Comparison
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[2.5rem] md:leading-[1.12]">
          {page.title}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--foreground-muted)] md:text-base">
          {page.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--foreground-faint)]">
          <span>Lazur Team</span>
          <span aria-hidden>·</span>
          <time dateTime={lastUpdated}>
            Updated {formatDate(lastUpdated)}
          </time>
          <span aria-hidden>·</span>
          <span>{page.readingTimeMinutes} min read</span>
        </div>

        <SoftCard hover={false} className="mt-8 p-6 md:p-8">
          <div className="rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-soft)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-ink)]">
              TL;DR
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
              {page.tldr.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--foreground)]">
              Feature comparison
            </h2>
            <div className="mt-4">
              <CompareTable
                rows={page.table}
                competitorName={page.competitorName}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-display text-[15px] font-semibold text-[var(--foreground)]">
                Choose Lazur if…
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                {page.chooseLazur.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-display text-[15px] font-semibold text-[var(--foreground-muted)]">
                Choose {page.competitorName} if…
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                {page.chooseCompetitor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <article className="mt-8 space-y-5 md:space-y-6">{children}</article>

          <section className="mt-10" aria-labelledby="compare-faq-heading">
            <h2
              id="compare-faq-heading"
              className="font-display text-xl font-semibold tracking-tight text-[var(--foreground)]"
            >
              FAQ
            </h2>
            <dl className="mt-4 divide-y divide-[var(--border)]">
              {page.faq.map((item) => (
                <div key={item.question} className="py-5 first:pt-2">
                  <dt className="font-display text-[16px] font-semibold text-[var(--foreground)]">
                    {item.question}
                  </dt>
                  <dd className="mt-2 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <BlogCta />
          <CompareRelatedLinks page={page} />
        </SoftCard>
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
