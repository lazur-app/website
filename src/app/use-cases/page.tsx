import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { EditorialIndexRow } from "@/components/editorial/EditorialIndexRow";
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

      <main className="relative mx-auto w-full max-w-4xl px-6 pb-20 pt-24 md:px-8 md:pt-28">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
          Use cases
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--foreground)] md:text-[3.25rem]">
          Finished writing, in the app you are in.
        </h1>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-[#5c564f] md:text-[17px]">
          Dictation Mode writes what you said. Command Mode does what you
          meant. Same shortcut on Mac, different job per surface.
        </p>

        <div className="mt-6 divide-y divide-[var(--border)]">
          {pages.map((page) => (
            <EditorialIndexRow
              key={page.slug}
              href={`/use-cases/${page.slug}`}
              kicker={
                page.mode === "command" ? "Command Mode" : "Dictation Mode"
              }
              title={page.title}
              description={page.description}
              cta="See the example"
              meta={
                <>
                  <p>{page.appName}</p>
                  <p className="mt-2">{page.readingTimeMinutes} min read</p>
                </>
              }
            />
          ))}
        </div>

        <p className="mt-10 text-[15px] leading-relaxed text-[#5c564f]">
          Leaving another dictation app?{" "}
          <Link
            href="/compare"
            className="font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/20 underline-offset-2 hover:decoration-[var(--foreground)]"
          >
            See how Lazur compares
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
