"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { GlowCta } from "./GlowCta";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/components/AuthProvider";

const navLinks = [
  { href: "/pricing", label: "Pricing", match: "/pricing" },
  { href: "/blog", label: "Blog", match: "/blog" },
  { href: "/use-cases", label: "Use cases", match: "/use-cases" },
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
  closed: { opacity: 0, y: -6, transition: { duration: 0.12, ease: EASE } },
};

/** The notch at rest, between the menus and the status items (the homepage's hero draws its own). */
function RestingNotch() {
  return (
    <span
      className="pointer-events-none absolute left-1/2 top-0 h-9 w-44 -translate-x-1/2 rounded-b-[16px] bg-black"
      aria-hidden
    />
  );
}

/** Right side of the menu bar: Lazur's own icon, Wi-Fi, battery and the time, like a real Mac. */
function StatusItems() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" }).replace(",", ""));
    const first = window.setTimeout(tick, 0);
    const t = window.setInterval(tick, 15_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(t);
    };
  }, []);
  const icon = "h-[14px] w-auto text-[var(--foreground)]/75";
  return (
    <div className="flex items-center gap-3.5 text-[13px] font-medium text-[var(--foreground)]/80" aria-hidden>
      <Image src="/logo.png" alt="" width={15} height={15} className="opacity-80" />
      <svg viewBox="0 0 20 14" className={icon} fill="currentColor">
        <path d="M10 13.2l2.2-2.6a3.3 3.3 0 00-4.4 0zM5.3 8a7 7 0 019.4 0l1.4-1.6a9.2 9.2 0 00-12.2 0zM1.4 4.4a12.8 12.8 0 0117.2 0L20 2.8a15 15 0 00-20 0z" />
      </svg>
      <svg viewBox="0 0 26 13" className={icon} fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="1" y="1" width="21" height="11" rx="3" />
        <rect x="3" y="3" width="15" height="7" rx="1.5" fill="currentColor" stroke="none" />
        <path d="M24 5v3" strokeLinecap="round" />
      </svg>
      <span className="min-w-[5.5rem] text-right tabular-nums">{time}</span>
    </div>
  );
}

/** `notch={false}` on pages that draw their own notch (the homepage hero). */
export function Navbar({ notch = true }: { notch?: boolean }) {
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

      {/* A Mac menu bar: menus on the left, the notch in the middle, status items on the right. */}
      <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={`menubar w-full ${scrolled || panelExpanded ? "menubar--scrolled" : ""}`}
      >
        <div className="relative flex h-9 items-center justify-between gap-4 px-4 md:px-5">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-1.5" aria-label="Lazur home">
              <Image src="/logo.png" alt="" width={18} height={18} className="shrink-0" />
              <span className="text-[13.5px] font-bold tracking-[-0.02em] text-[var(--foreground)]">Lazur</span>
            </Link>
            <nav className="hidden items-center gap-5 lg:flex" aria-label="Main">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.match, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-[5px] px-1.5 py-0.5 text-[13px] font-medium transition-colors ${
                      active
                        ? "bg-[var(--foreground)]/[0.07] text-[var(--foreground)]"
                        : "text-[var(--foreground)]/75 hover:bg-[var(--foreground)]/[0.06] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {notch ? <RestingNotch /> : null}

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-4 lg:flex">
              <StatusItems />
              {loading ? (
                <span className="h-3 w-14 rounded-full bg-[var(--foreground)]/5" />
              ) : isAuthenticated && user ? (
                <UserMenu user={user} />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-[13px] font-medium text-[var(--foreground)]/75 transition-colors hover:text-[var(--foreground)]"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/download"
                    className="rounded-full bg-[var(--foreground)] px-3 py-1 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-85"
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
              className="overflow-hidden border-t border-[var(--border)] bg-white/90 backdrop-blur-xl lg:hidden"
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
