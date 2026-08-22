import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { EditorialIndexRow } from "@/components/editorial/EditorialIndexRow";
import { getAllComparisons } from "@/lib/compare";
import { formatBlogDateLong } from "@/lib/blog/format";
import { SITE_URL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Compare Lazur, AI Voice Dictation Alternatives for Mac",
  description:
    "Compare Lazur with Wispr Flow, Aqua Voice, MacWhisper, Google Voice Typing, Super Whisper, Willow Voice, and Apple Dictation.",
  alternates: {
    canonical: `${SITE_URL}/compare`,
  },
};

export default function CompareHubPage() {
  const comparisons = getAllComparisons();

  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />

      <main className="relative mx-auto w-full max-w-4xl px-6 pb-20 pt-24 md:px-8 md:pt-28">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
          Comparisons
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--foreground)] md:text-[3.25rem]">
          How Lazur compares
        </h1>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-[#5c564f] md:text-[17px]">
          Honest head-to-heads for voice writing on Mac. Finished text, not raw
          transcripts. For Cursor, Slack, Gmail, and ChatGPT, start with the{" "}
          <Link
            href="/use-cases"
            className="font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/20 underline-offset-2 hover:decoration-[var(--foreground)]"
          >
            use-case pages
          </Link>
          .
        </p>

        <div className="mt-6 divide-y divide-[var(--border)]">
          {comparisons.map((page) => {
            const date = page.updatedAt ?? page.publishedAt;
            return (
              <EditorialIndexRow
                key={page.slug}
                href={`/compare/${page.slug}`}
                kicker="Comparison"
                title={page.title}
                description={page.description}
                cta="Read comparison"
                meta={
                  <>
                    <time dateTime={date}>{formatBlogDateLong(date)}</time>
                    <p className="mt-2">{page.competitorName}</p>
                  </>
                }
              />
            );
          })}
        </div>

        <p className="mt-10 text-[15px] leading-relaxed text-[#5c564f]">
          Prefer a roundup?{" "}
          <Link
            href="/blog/best-ai-dictation-apps-2026"
            className="font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/20 underline-offset-2 hover:decoration-[var(--foreground)]"
          >
            Best AI dictation apps in 2026
          </Link>
          , or{" "}
          <Link
            href="/download"
            className="font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/20 underline-offset-2 hover:decoration-[var(--foreground)]"
          >
            download for Mac
          </Link>
          .
        </p>
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
