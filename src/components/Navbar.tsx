"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/components/AuthProvider";
import { PersonaSwitcher } from "@/components/buddy/PersonaSwitcher";

const navLinks = [
  { href: "/pricing", label: "Pricing" },
  // What Lazur sees, sends and keeps lives in the privacy policy for now.
  { href: "/privacy", label: "Trust" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A floating, frosted pill at the top of the viewport: logo on the left, Pricing and Trust in the
 * middle, Download on the right. On phones the links fold into a menu under the pill.
 */
export function Navbar() {
  const pathname = usePathname();
  const { user, loading, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const linkClass = (href: string) =>
    `rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors ${
      pathname.startsWith(href) ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
    }`;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:pt-4">
      <div className="pointer-events-auto mx-auto w-full max-w-3xl rounded-[28px] border border-white/60 bg-white/60 shadow-[0_8px_30px_rgba(28,25,23,0.08)] backdrop-blur-xl backdrop-saturate-150">
        <div className="relative flex h-14 items-center justify-between pl-5 pr-2">
          <Link href="/" className="flex items-center gap-1.5" aria-label="Lazur home">
            <Image src="/logo.png" alt="" width={20} height={20} />
            <span className="text-[17px] font-bold tracking-[-0.03em] text-[var(--foreground)]">lazur</span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex" aria-label="Main">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href)}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            {pathname === "/" ? <span className="hidden lg:block"><PersonaSwitcher /></span> : null}
            {loading ? null : isAuthenticated && user ? (
              <span className="hidden md:block"><UserMenu user={user} /></span>
            ) : (
              <Link href="/login" className={`${linkClass("/login")} hidden md:block`}>
                Log in
              </Link>
            )}
            <Link
              href="/download"
              className="rounded-full bg-[var(--foreground)] px-4 py-2 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Download
            </Link>
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
              <div className="flex flex-col gap-1 border-t border-black/[0.06] px-5 pb-4 pt-2">
                {navLinks.map((l) => (
                  <Link key={l.href} href={l.href} className="py-2 text-[16px] font-medium text-[var(--foreground)]">
                    {l.label}
                  </Link>
                ))}
                {pathname === "/" ? <div className="-ml-2.5 py-1"><PersonaSwitcher /></div> : null}
                {loading ? null : isAuthenticated && user ? (
                  <UserMenu user={user} variant="mobile" onNavigate={() => setOpen(false)} />
                ) : (
                  <Link href="/login" className="py-2 text-[16px] font-medium text-[var(--foreground-muted)]">
                    Log in
                  </Link>
                )}
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
