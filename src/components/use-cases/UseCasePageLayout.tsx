import Link from "next/link";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { BlogCta } from "@/components/blog/BlogCta";
import { EditorialIndexRow } from "@/components/editorial/EditorialIndexRow";
import { UseCaseDemoCard } from "@/components/use-cases/UseCaseDemo";
import {
  getAllUseCases,
  getUseCaseBySlug,
  type UseCasePage,
} from "@/lib/use-cases";
import { formatBlogDate } from "@/lib/blog/format";

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
    .filter(
      (item) => item.slug !== page.slug && !page.relatedSlugs.includes(item.slug),
    )
    .slice(0, 1);
  const links = [...related, ...extras].slice(0, 3);

  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />

      <main className="relative pb-20 pt-24 md:pt-28">
        <header className="mx-auto w-full max-w-[44rem] px-6 text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            {page.appName}
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

          <UseCaseDemoCard demo={page.demo} mode={page.mode} />

          <h2 className="mt-12 font-display text-[1.45rem] font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[1.6rem]">
            {page.howto.name}
          </h2>
          <ol className="mt-5 space-y-5">
            {page.howto.steps.map((step, i) => (
              <li key={step.name} className="grid grid-cols-[auto_1fr] gap-3">
                <span className="pt-0.5 font-display text-[13px] tabular-nums text-[var(--foreground-faint)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-display text-[17px] font-semibold text-[var(--foreground)]">
                    {step.name}
                  </p>
                  <p className="mt-1 text-[16px] leading-[1.75] text-[#3d3834]">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="blog-prose mt-10">{children}</div>

          <section className="mt-12" aria-labelledby="use-case-faq-heading">
            <h2
              id="use-case-faq-heading"
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

        {links.length > 0 ? (
          <section className="mx-auto mt-16 w-full max-w-4xl px-6">
            <h2 className="font-display text-lg font-semibold tracking-tight text-[var(--foreground)]">
              More use cases
            </h2>
            <div className="mt-2 divide-y divide-[var(--border)]">
              {links.map((item) => (
                <EditorialIndexRow
                  key={item.slug}
                  href={`/use-cases/${item.slug}`}
                  kicker={
                    item.mode === "command" ? "Intent Mode" : "Dictation Mode"
                  }
                  title={item.title}
                  description={item.description}
                  cta="See the example"
                  meta={
                    <>
                      <p>{item.appName}</p>
                      <p className="mt-2">{item.readingTimeMinutes} min read</p>
                    </>
                  }
                />
              ))}
            </div>
            <p className="mt-2">
              <Link
                href="/use-cases"
                className="text-[14px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
              >
                ← All use cases
              </Link>
            </p>
          </section>
        ) : null}
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
