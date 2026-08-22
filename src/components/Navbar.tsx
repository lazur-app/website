"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { GlowCta } from "./GlowCta";
import { LogoWordmark } from "./LogoWordmark";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/components/AuthProvider";

const navLinks = [
  { href: "/pricing", label: "Pricing", match: "/pricing" },
  { href: "/blog", label: "Blog", match: "/blog" },
  { href: "/use-cases", label: "Use cases", match: "/use-cases" },
  { href: "/compare", label: "Compare", match: "/compare" },
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
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-[rgba(28,25,23,0.22)] md:hidden"
          />
        )}
      </AnimatePresence>

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(1rem,env(safe-area-inset-top))] sm:px-4 md:px-6 md:pt-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={`nav-glass-pill mx-auto w-full max-w-5xl ${
          mobileOpen
            ? "overflow-hidden rounded-[22px]"
            : "overflow-visible rounded-full"
        } ${scrolled || mobileOpen ? "nav-glass-pill--scrolled" : ""}`}
      >
        <div className="flex h-[48px] items-center justify-between gap-4 px-5 md:px-6">
          <LogoWordmark height={32} />

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 lg:flex"
            aria-label="Main"
          >
            {navLinks.map((link) => {
              const active = isActive(pathname, link.match, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[13px] font-medium transition-colors ${
                    active
                      ? "text-[var(--foreground)]"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-4 lg:flex">
              {loading ? (
                <span className="h-3 w-14 rounded-full bg-[var(--foreground)]/5" />
              ) : isAuthenticated && user ? (
                <UserMenu user={user} />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-[13px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
                  >
                    Log in
                  </Link>
                  <GlowCta href="/download" size="sm">
                    Try Lazur Free
                  </GlowCta>
                </>
              )}
            </div>

            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)] lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-[18px] w-[18px]" strokeWidth={1.75} />
              ) : (
                <Menu className="h-[18px] w-[18px]" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden border-t border-[var(--border)]/50 lg:hidden"
            >
              <nav className="flex flex-col px-5 pb-5 pt-2" aria-label="Mobile">
                {navLinks.map((link) => {
                  const active = isActive(pathname, link.match, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`py-2.5 text-[15px] font-medium ${
                        active
                          ? "text-[var(--foreground)]"
                          : "text-[var(--foreground-muted)]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="mt-2 flex flex-col gap-3 border-t border-[var(--border)]/50 pt-3">
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
                        onClick={() => setMobileOpen(false)}
                        className="py-1 text-[15px] font-medium text-[var(--foreground-muted)]"
                      >
                        Log in
                      </Link>
                      <GlowCta
                        href="/download"
                        block
                        onClick={() => setMobileOpen(false)}
                      >
                        Try Lazur Free
                      </GlowCta>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
    </>
  );
}
