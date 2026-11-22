"use client";

import Link from "next/link";
import Image from "next/image";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/components/AuthProvider";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { track } from "@/lib/productAnalytics";

/**
 * An ink-outlined white bar across the top of the page, in the homepage's look: the logo on the left, a few links in the
 * middle (wide screens), and the Mac download button on the right. Signed-in visitors also get their account menu.
 */
const LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Changelog", href: "/changelog" },
  { label: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const { user, loading, isAuthenticated } = useAuth();
  const downloadLabel = "Meet my companion";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-3 md:pt-4">
      <div className="pointer-events-auto mx-auto w-full max-w-6xl rounded-[20px] border-[1.5px] border-[#1c1917] bg-white shadow-[0_2px_0_rgba(28,25,23,0.9)]">
        <div className="flex h-16 items-center justify-between gap-4 pl-4 pr-2 md:h-[72px] md:gap-6 md:pl-6 md:pr-3">
          <Link
            href="/"
            className="flex min-h-[44px] items-center gap-2"
            aria-label="Lazur home"
            onClick={() => track("nav_link_clicked", { location: "navbar", label: "Logo", destination: "/" })}
          >
            <Image src="/logo.png" alt="" width={28} height={28} />
            <span className="text-[22px] font-bold tracking-[-0.03em] text-[var(--foreground)] md:text-[24px]">lazur</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => track("nav_link_clicked", { location: "navbar", label: l.label, destination: l.href })}
                className="rounded-full px-3.5 py-2 text-[15px] font-medium tracking-[-0.01em] text-[var(--foreground-muted)] transition-colors hover:bg-[#f3f1ec] hover:text-[var(--foreground)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {!loading && isAuthenticated && user ? <UserMenu user={user} /> : null}
            <Link
              href="/download"
              onClick={() => track("cta_clicked", { location: "navbar", label: downloadLabel, destination: "/download" })}
              aria-label={downloadLabel}
              className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full bg-[#1c1917] px-4 text-[15px] font-bold tracking-[-0.01em] text-white transition-colors hover:bg-black md:min-h-[48px] md:px-6 md:text-[16px]"
            >
              <AppleIcon className="-mt-0.5 h-3.5 w-3.5" />
              Meet my companion
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
