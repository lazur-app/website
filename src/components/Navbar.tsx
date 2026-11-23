"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/components/AuthProvider";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { WindowsIcon } from "@/components/icons/WindowsIcon";
import { FounderSticker } from "@/components/landing/FounderSticker";
import { useIsWindowsVisitor, WINDOWS_WAITLIST_LABEL } from "@/hooks/useIsWindowsVisitor";
import { track } from "@/lib/productAnalytics";

/**
 * An ink-outlined white bar across the top of the page, in the homepage's look: the logo on the left, a few links in the
 * middle (wide screens), and the Mac download button on the right. Signed-in visitors also get their account menu.
 *
 * On phones the button shrinks to a round black Apple (or Windows) button next to a menu button; the menu opens inside
 * the bar itself, which grows into a card of big links with the download button across the bottom and one of us waving.
 */
const LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Changelog", href: "/changelog" },
  { label: "Team", href: "/team" },
  { label: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const { user, loading, isAuthenticated } = useAuth();
  const windows = useIsWindowsVisitor();
  const downloadLabel = windows ? WINDOWS_WAITLIST_LABEL : "Meet my companion";
  const PlatformIcon = windows ? WindowsIcon : AppleIcon;
  const pathname = usePathname();
  // The menu remembers the page it was opened on, so it closes by itself on navigation (and on Escape, below).
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean | ((was: boolean) => boolean)) =>
    setOpenOn((on) => ((typeof next === "function" ? next(on === pathname) : next) ? pathname : null));
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-3 md:pt-4">
      <div className="pointer-events-auto mx-auto w-full max-w-6xl overflow-hidden rounded-[20px] border-[1.5px] border-[#1c1917] bg-white shadow-[0_2px_0_rgba(28,25,23,0.9)]">
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
            {/* Wide screens: the full pill. */}
            <Link
              href="/download"
              onClick={() => track("cta_clicked", { location: "navbar", label: downloadLabel, destination: "/download" })}
              aria-label={downloadLabel}
              className="hidden min-h-[48px] items-center gap-2 whitespace-nowrap rounded-full bg-[#1c1917] px-6 text-[16px] font-bold tracking-[-0.01em] text-white transition-colors hover:bg-black md:inline-flex"
            >
              <PlatformIcon className="-mt-0.5 h-3.5 w-3.5" />
              {downloadLabel}
            </Link>
            {/* Phones: a round black button with the platform's mark, and the menu button. */}
            <Link
              href="/download"
              onClick={() => track("cta_clicked", { location: "navbar_mobile", label: downloadLabel, destination: "/download" })}
              aria-label={downloadLabel}
              className="grid h-11 w-11 place-items-center rounded-full bg-[#1c1917] text-white shadow-[0_2px_0_rgba(28,25,23,0.35)] transition-transform active:scale-95 md:hidden"
            >
              <PlatformIcon className={windows ? "h-[17px] w-[17px]" : "-mt-0.5 h-[19px] w-[19px]"} />
            </Link>
            <button
              type="button"
              onClick={() => {
                if (!open) track("nav_menu_opened", { location: "navbar_mobile" });
                setOpen((o) => !o);
              }}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-[#1c1917] bg-white transition-colors active:bg-[#f3f1ec] md:hidden"
            >
              {/* Two lines that cross into an X. */}
              <span className={`absolute h-[2px] w-[18px] rounded-full bg-[#1c1917] transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
              <span className={`absolute h-[2px] w-[18px] rounded-full bg-[#1c1917] transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.nav
              id="mobile-menu"
              aria-label="Main"
              key="menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden"
            >
              <div className="relative border-t-[1.5px] border-dashed border-[#1c1917]/20 px-5 pb-5 pt-3">
                <ul>
                  {LINKS.map((l, i) => (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + i * 0.04, duration: 0.25 }}
                    >
                      <Link
                        href={l.href}
                        onClick={() => {
                          track("nav_link_clicked", { location: "navbar_mobile", label: l.label, destination: l.href });
                          setOpen(false);
                        }}
                        className="flex min-h-[48px] items-center text-[26px] font-bold tracking-[-0.04em] text-[var(--foreground)] active:text-[#e11d48]"
                      >
                        {l.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                {/* One of us, waving from the corner of the menu. */}
                <FounderSticker who="vaidik" pose="wave" size={96} className="!absolute bottom-[84px] right-4" />
                <Link
                  href="/download"
                  onClick={() => {
                    track("cta_clicked", { location: "navbar_menu", label: downloadLabel, destination: "/download" });
                    setOpen(false);
                  }}
                  className="mt-4 flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#1c1917] text-[16px] font-bold text-white"
                >
                  <PlatformIcon className="-mt-0.5 h-4 w-4" />
                  {downloadLabel}
                </Link>
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
