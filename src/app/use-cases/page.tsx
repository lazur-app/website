import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { SoftCard } from "@/components/SoftCard";
import { getAllUseCases } from "@/lib/use-cases";
import { SITE_URL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Lazur use cases, Cursor, Slack, Gmail, ChatGPT",
  description:
    "Voice writing on Mac in the apps you already use. Cursor prompts, Slack updates, Gmail replies, and ChatGPT briefs without leftover editing.",
  alternates: {
    canonical: `${SITE_URL}/use-cases`,
  },
};

export default function UseCasesHubPage() {
  const pages = getAllUseCases();

  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />

      <main className="relative mx-auto max-w-3xl px-6 pb-16 pt-24 md:pt-28">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
          Use cases
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[2.75rem] md:leading-[1.1]">
          Finished writing, in the app you are in.
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--foreground-muted)] md:text-base">
          Dictation Mode writes what you said. Command Mode does what you
          meant. Same shortcut on Mac, different job per surface.
        </p>

        <div className="mt-10 space-y-4">
          {pages.map((page) => (
            <SoftCard key={page.slug} className="p-6">
              <Link href={`/use-cases/${page.slug}`} className="group block">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
                  {page.appName}
                  <span className="mx-2 text-[var(--border-strong)]">·</span>
                  {page.mode === "command" ? "Command Mode" : "Dictation Mode"}
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--brand-ink)]">
                  {page.title}
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                  {page.description}
                </p>
                <p className="mt-3 text-[13px] font-medium text-[var(--brand-ink)]">
                  See the example →
                </p>
              </Link>
            </SoftCard>
          ))}
        </div>

        <SoftCard hover={false} className="mt-8 p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
            Compare the category
          </h2>
          <p className="mt-2 text-[14px] text-[var(--foreground-muted)]">
            If you are leaving Wispr Flow, Apple Dictation, or Google Voice
            Typing, start with a head-to-head.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/compare" className="btn-outline-dark px-5 py-2 text-[13px]">
              All comparisons
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
