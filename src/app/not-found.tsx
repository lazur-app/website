import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { NotFoundScene } from "@/components/NotFoundScene";

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
      <main className="relative flex min-h-[80vh] items-center justify-center px-4 pb-20 pt-28 sm:px-6 md:pt-32">
        <div className="mx-auto w-full max-w-2xl text-center">
          <NotFoundScene />
          <h1 className="font-display mt-10 text-4xl font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] sm:text-5xl">
            This page isn&apos;t here.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[var(--foreground)]/60">
            The link may be old or mistyped. Lazur can&apos;t find it either, but it can take you home.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-85"
            >
              Take me home
            </Link>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-[var(--foreground)]/15 bg-white/60 px-5 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)]/5"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
