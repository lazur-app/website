import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { SoftCard } from "@/components/SoftCard";
import { getAllComparisons } from "@/lib/compare";
import { SITE_URL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Compare Lazur — AI Voice Dictation Alternatives for Mac",
  description:
    "Compare Lazur with Wispr Flow, Super Whisper, Willow Voice, and Apple Dictation. Find the best AI voice dictation app for your Mac workflow.",
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

      <main className="relative mx-auto max-w-3xl px-6 pb-16 pt-24 md:pt-28">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
          Comparisons
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[2.75rem] md:leading-[1.1]">
          How Lazur compares
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--foreground-muted)] md:text-base">
          Honest head-to-head guides for AI voice dictation on Mac. Lazur focuses
          on ambient writing — Smart Rewrite that turns speech into finished
          text, not raw transcripts.
        </p>

        <div className="mt-10 space-y-4">
          {comparisons.map((page) => (
            <SoftCard key={page.slug} className="p-6">
              <Link href={`/compare/${page.slug}`} className="group block">
                <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--brand-ink)]">
                  {page.title}
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                  {page.description}
                </p>
                <p className="mt-3 text-[13px] font-medium text-[var(--brand-ink)]">
                  Read comparison →
                </p>
              </Link>
            </SoftCard>
          ))}
        </div>

        <SoftCard hover={false} className="mt-8 p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
            Not sure where to start?
          </h2>
          <p className="mt-2 text-[14px] text-[var(--foreground-muted)]">
            Read our roundup of the best AI dictation apps in 2026, or download
            Lazur free and test it on your real workflow.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/blog/best-ai-dictation-apps-2026"
              className="btn-outline-dark px-5 py-2 text-[13px]"
            >
              Best dictation apps 2026
            </Link>
            <Link href="/download" className="btn-dark px-5 py-2 text-[13px]">
              Download for Mac
            </Link>
          </div>
        </SoftCard>
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
