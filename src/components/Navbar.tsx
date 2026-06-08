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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-6 pt-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-6xl"
      >
        {/* Command dock — ~56px inner height, Wispr-scale proportions */}
        <div
          className={`overflow-hidden rounded-[var(--radius-nav)] border border-[var(--border)] bg-[var(--surface-solid)]/90 backdrop-blur-xl transition-shadow duration-300 ${
            scrolled || mobileOpen
              ? "shadow-[var(--shadow-soft)]"
              : "shadow-[0_8px_40px_rgba(28,25,23,0.05)]"
          } ${mobileOpen ? "rounded-b-none border-b-0" : ""}`}
        >
          <div className="grid min-h-[var(--nav-inner-height)] grid-cols-[1fr_auto] items-center gap-3 px-4 py-2 md:grid-cols-[auto_1fr_auto] md:gap-4 md:px-5">
            <LogoWordmark className="shrink-0" height={36} />

            {/* Center nav track */}
            <nav
              className="col-span-2 hidden justify-center md:col-span-1 md:flex"
              aria-label="Main"
            >
              <div className="inline-flex items-center gap-0.5 rounded-lg bg-[var(--background-deep)]/80 p-1 ring-1 ring-[var(--border)]">
                {navLinks.map((link) => {
                  const active = isActive(pathname, link.match, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative rounded-lg px-3 py-1.5 text-[var(--text-sm)] font-medium transition-colors lg:px-4 ${
                        active
                          ? "text-[var(--foreground)]"
                          : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-lg bg-[var(--surface-solid)] shadow-sm ring-1 ring-[var(--border)]"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Actions cluster */}
            <div className="flex items-center justify-end gap-2">
              <div className="hidden items-center rounded-lg border border-[var(--border)] bg-[var(--background)]/60 p-1 md:flex">
                {loading ? (
                  <span className="h-8 w-28 rounded-lg bg-[var(--background-deep)]" />
                ) : isAuthenticated && user ? (
                  <div className="px-2">
                    <UserMenu user={user} />
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="rounded-lg px-3 py-1.5 text-[var(--text-sm)] font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-solid)] hover:text-[var(--foreground)]"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/download"
                      className="btn-primary !min-h-9 px-4 py-1.5 text-[var(--text-sm)] font-semibold"
                    >
                      Download
                    </Link>
                  </>
                )}
              </div>

              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((o) => !o)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)]/70 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)] md:hidden"
              >
                {mobileOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile panel — continues the dock */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-b-2xl border border-t-0 border-[var(--border)] bg-[var(--surface-solid)]/95 shadow-[var(--shadow-soft)] backdrop-blur-xl md:hidden"
            >
              <nav className="p-3" aria-label="Mobile">
                <div className="grid grid-cols-2 gap-1.5">
                  {navLinks.map((link) => {
                    const active = isActive(pathname, link.match, link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`rounded-xl px-4 py-2.5 text-[var(--text-sm)] font-medium transition-colors ${
                          active
                            ? "bg-[var(--brand-soft)] text-[var(--brand-ink)]"
                            : "bg-[var(--background-deep)]/60 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-3 flex flex-col gap-2 border-t border-[var(--border)] pt-3">
                  {loading ? null : isAuthenticated && user ? (
                    <UserMenu
                      user={user}
                      variant="mobile"
                      onNavigate={() => setMobileOpen(false)}
                    />
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-center text-[var(--text-sm)] font-medium text-[var(--foreground-muted)]"
                      >
                        Log in
                      </Link>
                      <Link
                        href="/download"
                        className="btn-primary px-4 py-3 text-center text-[var(--text-sm)] font-semibold"
                      >
                        Download for Mac
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
