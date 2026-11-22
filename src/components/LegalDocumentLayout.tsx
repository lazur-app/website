import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";

type LegalSection = {
  title: string;
  content: ReactNode;
  /** Anchor for deep links, e.g. /privacy#extension */
  id?: string;
};

type LegalDocumentLayoutProps = {
  label: string;
  title: string;
  updated: string;
  intro?: ReactNode;
  sections: LegalSection[];
};

/**
 * Privacy, terms and support: a centred header in the homepage's type, then the document as one
 * ink-outlined sheet with left-aligned text at a comfortable reading width.
 */
export function LegalDocumentLayout({
  label,
  title,
  updated,
  intro,
  sections,
}: LegalDocumentLayoutProps) {
  return (
    <MarketingPageShell>
      <ReferralCapture />
      <Navbar />

      <main className="relative px-4 pb-24 pt-32 sm:px-6 md:pt-40">
        <header className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
            {label}
          </p>
          <h1 className="mt-4 font-sans text-[clamp(2.4rem,5.4vw,4.6rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[var(--foreground)]">
            {title}
          </h1>
          <p className="mt-4 rounded-full border-[1.5px] border-[#1c1917] bg-white px-4 py-1 text-[13px] font-medium text-[var(--foreground)]">
            Last updated: {updated}
          </p>
        </header>

        <article className="mx-auto mt-12 max-w-[760px] rounded-[28px] border-[1.5px] border-[#1c1917] bg-white px-4 py-8 shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] sm:px-8 md:px-12 md:py-12">
          {intro ? (
            <div className="mb-12 rounded-[12px] border-[1.5px] border-[#1c1917] bg-[var(--background)] px-4 py-4 text-[16px] leading-relaxed text-[var(--foreground)] sm:px-6">
              {intro}
            </div>
          ) : null}
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.title} id={section.id} className="scroll-mt-32">
                <h2 className="text-[clamp(1.25rem,2.2vw,1.5rem)] font-bold leading-[1.15] tracking-[-0.03em] text-[var(--foreground)]">
                  {section.title}
                </h2>
                <div className="mt-4 text-[16px] leading-[1.65] text-[var(--foreground-muted)]">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
