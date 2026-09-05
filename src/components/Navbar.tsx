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

/** Site-wide expo-out easing, keeps nav motion consistent with the landing page. */
const EASE = [0.16, 1, 0.3, 1] as const;

const menuList = {
  open: { transition: { staggerChildren: 0.04, delayChildren: 0.07 } },
  closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

const menuItem = {
  open: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
  closed: { opacity: 0, y: -6, transition: { duration: 0.12, ease: "easeOut" } },
};

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  /**
   * Stays true through the collapse animation. Without this the pill would
   * un-clip and round off while the panel is still animating out, letting a
   * square-cornered sheet spill past the rounded corners.
   */
  const [panelExpanded, setPanelExpanded] = useState(false);

  useEffect(() => {
    if (mobileOpen) setPanelExpanded(true);
  }, [mobileOpen]);

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

  // Once the desktop nav takes over, the panel is display:none but still open,
  // which would keep the pill clipped and cut off the account dropdown.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (desktop.matches) setMobileOpen(false);
    };
    onChange();
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
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
            transition={{ duration: 0.32, ease: EASE }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-[rgba(28,25,23,0.22)] backdrop-blur-[2px] lg:hidden"
          />
        )}
      </AnimatePresence>

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-[max(1rem,env(safe-area-inset-top))] sm:px-4 md:px-6 md:pt-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={`nav-glass-pill mx-auto w-full max-w-5xl ${
          panelExpanded
            ? "overflow-hidden rounded-[22px]"
            : "overflow-visible rounded-full"
        } ${scrolled || panelExpanded ? "nav-glass-pill--scrolled" : ""}`}
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
              <span className="relative block h-[18px] w-[18px]">
                <motion.span
                  className="absolute inset-0"
                  aria-hidden
                  animate={{
                    opacity: mobileOpen ? 0 : 1,
                    rotate: mobileOpen ? -90 : 0,
                    scale: mobileOpen ? 0.65 : 1,
                  }}
                  transition={{ duration: 0.26, ease: EASE }}
                >
                  <Menu className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </motion.span>
                <motion.span
                  className="absolute inset-0"
                  aria-hidden
                  animate={{
                    opacity: mobileOpen ? 1 : 0,
                    rotate: mobileOpen ? 0 : 90,
                    scale: mobileOpen ? 1 : 0.65,
                  }}
                  transition={{ duration: 0.26, ease: EASE }}
                >
                  <X className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </motion.span>
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence onExitComplete={() => setPanelExpanded(false)}>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.36, ease: EASE }}
              className="overflow-hidden border-t border-[var(--border)]/50 lg:hidden"
            >
              <motion.nav
                className="flex flex-col px-5 pb-5 pt-2"
                aria-label="Mobile"
                variants={menuList}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {navLinks.map((link) => {
                  const active = isActive(pathname, link.match, link.href);
                  return (
                    <motion.div key={link.href} variants={menuItem}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block py-2.5 text-[15px] font-medium ${
                          active
                            ? "text-[var(--foreground)]"
                            : "text-[var(--foreground-muted)]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  variants={menuItem}
                  className="mt-2 flex flex-col gap-3 border-t border-[var(--border)]/50 pt-3"
                >
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
                        className="block py-1 text-[15px] font-medium text-[var(--foreground-muted)]"
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
                </motion.div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
    </>
  );
}
