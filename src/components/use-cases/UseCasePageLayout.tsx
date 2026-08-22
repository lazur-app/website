import Link from "next/link";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { SoftCard } from "@/components/SoftCard";
import { BlogCta } from "@/components/blog/BlogCta";
import { UseCaseDemoCard } from "@/components/use-cases/UseCaseDemo";
import { getAllUseCases, getUseCaseBySlug, type UseCasePage } from "@/lib/use-cases";

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function UseCasePageLayout({
  page,
  children,
}: {
  page: UseCasePage;
  children: ReactNode;
}) {
  const lastUpdated = page.updatedAt ?? page.publishedAt;
  const related = page.relatedSlugs
    .map((slug) => getUseCaseBySlug(slug))
    .filter(Boolean) as UseCasePage[];
  const extras = getAllUseCases()
    .filter((item) => item.slug !== page.slug && !page.relatedSlugs.includes(item.slug))
    .slice(0, 1);
  const links = [...related, ...extras].slice(0, 3);

  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />

      <main className="relative mx-auto max-w-3xl px-6 pb-16 pt-24 md:pt-28">
        <Link
          href="/use-cases"
          className="text-[13px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
        >
          ← All use cases
        </Link>

        <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
          {page.appName}
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
          <time dateTime={lastUpdated}>Updated {formatDate(lastUpdated)}</time>
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
            <UseCaseDemoCard demo={page.demo} mode={page.mode} />
          </div>

          <section className="mt-8">
            <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--foreground)]">
              {page.howto.name}
            </h2>
            <ol className="mt-4 space-y-4">
              {page.howto.steps.map((step, i) => (
                <li key={step.name} className="grid grid-cols-[auto_1fr] gap-3">
                  <span className="font-display text-[13px] tabular-nums text-[var(--foreground-faint)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold tracking-tight text-[var(--foreground)]">
                      {step.name}
                    </p>
                    <p className="mt-1 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <article className="mt-8 space-y-5 md:space-y-6">{children}</article>

          <section className="mt-10" aria-labelledby="use-case-faq-heading">
            <h2
              id="use-case-faq-heading"
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

          <aside className="mt-10 border-t border-[var(--border)] pt-8">
            <h2 className="font-display text-lg font-semibold tracking-tight text-[var(--foreground)]">
              More use cases
            </h2>
            <ul className="mt-4 space-y-2">
              {links.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/use-cases/${item.slug}`}
                    className="text-[14px] font-medium text-[var(--brand-ink)] underline decoration-[var(--brand)]/30 underline-offset-2 transition-colors hover:text-[var(--brand)]"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/compare"
                  className="text-[14px] font-medium text-[var(--brand-ink)] underline decoration-[var(--brand)]/30 underline-offset-2 transition-colors hover:text-[var(--brand)]"
                >
                  How Lazur compares
                </Link>
              </li>
            </ul>
          </aside>
        </SoftCard>
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
