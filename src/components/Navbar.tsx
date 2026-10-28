"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/components/AuthProvider";
import { PersonaSwitcher } from "@/components/buddy/PersonaSwitcher";

const navLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/blog", label: "Blog" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A quiet text header: no pill, no fill at the top of the page, so the hero's Download button
 * stays the one dark thing. Once you scroll it picks up a frosted background and a hairline.
 */
export function Navbar() {
  const pathname = usePathname();
  const { user, loading, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (href: string) =>
    `text-[14px] transition-colors ${pathname.startsWith(href) ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow] duration-300 ${
        scrolled || open ? "bg-[var(--background)]/80 shadow-[0_1px_0_rgba(28,25,23,0.06)] backdrop-blur-xl" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-9">
          <Link href="/" className="flex items-center gap-1.5" aria-label="Lazur home">
            <Image src="/logo.png" alt="" width={20} height={20} />
            <span className="text-[17px] font-bold tracking-[-0.03em] text-[var(--foreground)]">lazur</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {pathname === "/" ? <PersonaSwitcher /> : null}
          <div className="hidden items-center gap-5 md:flex">
            {loading ? null : isAuthenticated && user ? (
              <UserMenu user={user} />
            ) : (
              <Link href="/login" className={`${linkClass("/login")} ml-3`}>
                Log in
              </Link>
            )}
            <Link
              href="/download"
              className="rounded-full border border-[var(--border-strong)] px-4 py-1.5 text-[14px] font-medium text-[var(--foreground)] transition-colors hover:bg-black/[0.04]"
            >
              Download
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-full text-[var(--foreground-muted)] hover:bg-black/[0.04] md:hidden"
          >
            {open ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-5 pb-5">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} className="py-2 text-[16px] font-medium text-[var(--foreground)]">
                  {l.label}
                </Link>
              ))}
              {loading ? null : isAuthenticated && user ? (
                <UserMenu user={user} variant="mobile" onNavigate={() => setOpen(false)} />
              ) : (
                <Link href="/login" className="py-2 text-[16px] font-medium text-[var(--foreground-muted)]">
                  Log in
                </Link>
              )}
              <Link href="/download" className="mt-2 rounded-full bg-[var(--foreground)] py-3 text-center text-[15px] font-semibold text-white">
                Download for Mac
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
