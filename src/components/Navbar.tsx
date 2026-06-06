"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LogoWordmark } from "./LogoWordmark";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/components/AuthProvider";

const navLinks = [
  { href: "/#smart-rewrite", label: "Smart Rewrite", match: "/" },
  { href: "/#transformation", label: "Demo", match: "/" },
  { href: "/pricing", label: "Pricing", match: "/pricing" },
  { href: "/leaderboard", label: "Leaderboard", match: "/leaderboard" },
];

function isActive(pathname: string, match: string, href: string) {
  if (href.startsWith("/#")) return false;
  return pathname === match || pathname.startsWith(`${match}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 md:px-6">
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="glass mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 shadow-[var(--shadow-soft)] transition-all duration-300 md:px-5 md:py-3"
      >
        <LogoWordmark className="shrink-0" textClassName="text-[1.5rem]" />

        <div className="hidden items-center md:flex md:flex-1 md:justify-center">
          <div className="flex items-center gap-0.5 rounded-full border border-[var(--border)] bg-[var(--surface-solid)]/80 p-1 shadow-sm backdrop-blur-sm">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.match, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                    active
                      ? "text-[var(--foreground)]"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-sm ring-1 ring-[var(--border)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden items-center md:flex">
          {loading ? (
            <span className="h-9 w-[7.5rem] rounded-full bg-[var(--background-deep)]" />
          ) : isAuthenticated && user ? (
            <UserMenu user={user} />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="btn-ghost rounded-full px-4 py-2 text-[13px] font-semibold"
              >
                Log in
              </Link>
              <Link
                href="/#refer"
                className="btn-primary rounded-full px-5 py-2.5 text-[13px] font-semibold"
              >
                Refer a friend
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] text-[var(--foreground)] md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass mx-auto mt-2 max-w-5xl overflow-hidden rounded-2xl border border-[var(--border)] p-3 shadow-[var(--shadow-soft)] md:hidden"
          >
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.match, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-xl px-4 py-3 text-[15px] font-medium transition-colors ${
                      active
                        ? "bg-[var(--brand-soft)] text-[var(--brand-ink)]"
                        : "text-[var(--foreground-muted)] hover:bg-[var(--background-deep)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-2 border-t border-[var(--border)] pt-2">
              {loading ? null : isAuthenticated && user ? (
                <UserMenu
                  user={user}
                  variant="mobile"
                  onNavigate={() => setMobileOpen(false)}
                />
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/login"
                    className="rounded-xl px-4 py-3 text-center text-[15px] font-semibold text-[var(--foreground-muted)] hover:bg-[var(--background-deep)]"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/#refer"
                    className="btn-primary rounded-xl px-4 py-3 text-center text-[15px] font-semibold"
                  >
                    Refer a friend
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
