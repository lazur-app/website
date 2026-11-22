"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { useIsMacVisitor } from "@/hooks/useIsMacVisitor";
import { track } from "@/lib/productAnalytics";
import { describeContent } from "./ContentAnalytics";
import { downloadHref } from "./ctaCopy";

const DISMISS_KEY = "lazur:seo-sticky-cta-dismissed";
/** Share of the page the reader has to scroll through before the bar slides in. */
const SHOW_AT = 0.35;

function readDismissed() {
  try {
    return window.sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function lineFor(contentType: string) {
  if (contentType === "tool") return "Talk instead of typing, in any Mac app.";
  if (contentType === "compare" || contentType === "alternatives") return "Try Lazur on your own Mac, free for 3 days.";
  return "Lazur does this for you on your Mac.";
}

/**
 * Bottom bar that slides in once the reader is ~35% down an SEO page (never on load). Dismissible
 * for the rest of the session; hidden while the hero CTA is on screen and once the closing CTA band
 * comes into view. Mac visitors get a download button, everyone else "Email me the Mac link".
 * Mounted once by SeoPageFrame inside <main>, so ContentClickTracker reports its link clicks as
 * `content_cta_clicked` / `sticky_bar` (via `.seo-sticky`).
 */
export function StickyCta() {
  const pathname = usePathname();
  const page = describeContent(pathname);
  if (page.content_type === "hub") return null;
  return <StickyCtaBar key={pathname} contentType={page.content_type} slug={page.slug} />;
}

function StickyCtaBar({ contentType, slug }: { contentType: string; slug: string }) {
  const isMac = useIsMacVisitor();
  const [reached, setReached] = useState(false);
  // Safe to read on the first render: nothing visible renders until the platform is known.
  const [dismissed, setDismissed] = useState(readDismissed);
  const [blocked, setBlocked] = useState(false);
  const shownRef = useRef(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Scroll depth. Stops listening once the threshold is crossed.
  useEffect(() => {
    if (dismissed) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SHOW_AT) {
        setReached(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [dismissed]);

  // Stay out of the way of the other CTAs: while the hero CTA is on screen, and from the moment the
  // closing CTA band enters the viewport (or has been scrolled past) onwards.
  useEffect(() => {
    if (!reached || typeof IntersectionObserver === "undefined") return;
    const main = barRef.current?.closest("main");
    if (!main) return;
    const hero = main.querySelector(".seo-herocta");
    const end = Array.from(main.querySelectorAll(".seo-cta")).at(-1) ?? null;
    const state = new Map<Element, boolean>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const hide = entry.target === end ? entry.isIntersecting || entry.boundingClientRect.top < 0 : entry.isIntersecting;
        state.set(entry.target, hide);
      }
      setBlocked(Array.from(state.values()).some(Boolean));
    });
    if (hero) observer.observe(hero);
    if (end) observer.observe(end);
    return () => observer.disconnect();
  }, [reached]);

  const visible = isMac !== null && reached && !dismissed && !blocked;

  useEffect(() => {
    if (!visible || shownRef.current) return;
    shownRef.current = true;
    track("sticky_cta_shown", { content_type: contentType, slug, variant: "download", platform: isMac ? "mac" : "not_mac" });
  }, [visible, contentType, slug, isMac]);

  const dismiss = () => {
    setDismissed(true);
    track("sticky_cta_dismissed", { content_type: contentType, slug });
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Private mode or blocked storage: dismissed for this page view only.
    }
  };

  if (isMac === null) return <div ref={barRef} hidden />;

  const closeButton = (
    <button
      type="button"
      onClick={dismiss}
      aria-label="Dismiss"
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[var(--foreground-muted)] transition-colors hover:bg-[var(--foreground)]/[0.06] hover:text-[var(--foreground)]"
    >
      <X size={16} aria-hidden />
    </button>
  );

  return (
    <div
      ref={barRef}
      inert={!visible}
      aria-hidden={!visible}
      className={`seo-sticky fixed inset-x-4 bottom-[calc(16px+env(safe-area-inset-bottom))] z-[90] mx-auto rounded-[20px] border-[1.5px] border-[#1c1917] bg-white shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] motion-safe:transition-[opacity,transform] motion-safe:duration-300 sm:bottom-[calc(24px+env(safe-area-inset-bottom))] max-w-[34rem] ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      {isMac !== null ? (
        <div className="flex items-center gap-3 py-2 pl-4 pr-2">
          <p className="line-clamp-2 min-w-0 flex-1 text-[14px] font-semibold leading-snug tracking-[-0.01em] text-[var(--foreground)] sm:text-[15px]">{lineFor(contentType)}</p>
          <Link
            href={downloadHref(`sticky-${contentType}-${slug}`)}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#1c1917] px-4 text-[14px] font-bold text-white transition-colors hover:bg-black"
          >
            <AppleIcon className="h-3.5 w-3.5" /> Download for Mac
          </Link>
          {closeButton}
        </div>
      ) : null}
    </div>
  );
}
