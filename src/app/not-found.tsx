import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";

export const metadata: Metadata = {
  title: "Page not found | Lazur",
  robots: { index: false },
};

const links = [
  { href: "/download", label: "Download for Mac" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/support", label: "Support" },
];

export default function NotFound() {
  return (
    <MarketingPageShell>
      <Navbar />
      <main className="relative flex min-h-[70vh] items-center justify-center px-4 pb-20 pt-28 sm:px-6 md:pt-32">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--foreground)]/45">
            404
          </p>
          <h1 className="font-display mt-4 text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl">
            Lazur looked everywhere.
            <br />
            This page isn&apos;t here.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[var(--foreground)]/60">
            The link may be old or mistyped. Here are a few places that do exist.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition-opacity hover:opacity-85"
            >
              Back to home
            </Link>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-[var(--foreground)]/15 px-5 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)]/5"
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
