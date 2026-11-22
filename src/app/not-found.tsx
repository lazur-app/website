import type { Metadata } from "next";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { NotFoundScene } from "@/components/NotFoundScene";
import { HandUnderline } from "@/components/buddy/HandLoop";

export const metadata: Metadata = {
  title: "Page not found | Lazur",
  robots: { index: false },
};

const links = [
  { href: "/pricing", label: "Pricing" },
  { href: "/download", label: "Download" },
  { href: "/support", label: "Support" },
];

export default function NotFound() {
  return (
    <MarketingPageShell>
      <Navbar />
      <main className="relative flex min-h-[80vh] items-center justify-center px-4 pb-24 pt-32 sm:px-6 md:pt-40">
        <div className="mx-auto w-full max-w-2xl text-center">
          <NotFoundScene />
          <h1 className="mt-12 font-sans text-[clamp(2.4rem,5.4vw,4.6rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[var(--foreground)]">
            This page{" "}
            <span className="relative inline-block whitespace-nowrap">
              isn&apos;t here.
              <HandUnderline show color="#e11d48" delay={0.4} duration={0.9} offset={2} />
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-[clamp(1rem,1.4vw,1.12rem)] font-medium leading-snug text-[var(--foreground-muted)]">
            The link may be old or mistyped. Lazur can&apos;t find it either, but it can take you home.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <TrackedLink
              href="/"
              eventProps={{ location: "not_found", label: "Take me home", destination: "/" }}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-[1.5px] border-[#1c1917] bg-white px-6 text-[15px] font-bold text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(28,25,23,0.9)]"
            >
              Take me home
            </TrackedLink>
            {links.map((l) => (
              <TrackedLink
                key={l.href}
                href={l.href}
                eventProps={{ location: "not_found", label: l.label, destination: l.href }}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full px-4 text-[15px] font-semibold text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-4 transition-colors hover:decoration-[var(--foreground)]"
              >
                {l.label}
              </TrackedLink>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
