import Link from "next/link";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { ReferralCapture } from "@/components/ReferralCapture";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { SoftCard } from "@/components/SoftCard";

type LegalSection = {
  title: string;
  content: ReactNode;
};

type LegalDocumentLayoutProps = {
  label: string;
  title: string;
  updated: string;
  intro?: ReactNode;
  sections: LegalSection[];
};

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

      <main className="relative mx-auto max-w-3xl px-6 pb-16 pt-24 md:pt-28">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
          {label}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[2.5rem]">
          {title}
        </h1>
        <p className="mt-2 text-[14px] text-[var(--foreground-muted)]">
          Last updated: {updated}
        </p>

        <SoftCard hover={false} className="mt-8 p-6 md:p-8">
          {intro ? (
            <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--background-deep)]/40 px-5 py-4 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
              {intro}
            </div>
          ) : null}
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-lg font-semibold tracking-tight text-[var(--foreground)]">
                  {section.title}
                </h2>
                <div className="mt-2 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </SoftCard>
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
