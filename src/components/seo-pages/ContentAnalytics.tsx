"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTrackInView } from "@/hooks/useTrackInView";
import { track } from "@/lib/productAnalytics";

/**
 * Named analytics for every SEO page, blog post, hub and tool page (see SeoPageFrame), from one
 * delegated click listener on <main>, so the thousands of server-rendered pages need no per-link
 * client components. Clicks are classified by the design-system class they land in (CTA band, rail,
 * related grid, TOC, FAQ, sources…). Only URLs and our own static copy are sent, never typed text.
 */

type ContentRef = { content_type: string; slug: string };

const TYPES: Record<string, string> = {
  blog: "blog",
  "how-to": "how_to",
  apps: "app",
  compare: "compare",
  alternatives: "alternatives",
  tools: "tool",
};

/** /how-to/x → {how_to, x}; /for/r/problems/s → {problem, r/s}; index pages → {hub, <path>}. */
export function describeContent(pathname: string): ContentRef {
  const parts = pathname.split("/").filter(Boolean);
  const [root = "", ...rest] = parts;
  if (root === "for") {
    if (rest.length === 1) return { content_type: "role", slug: rest[0] };
    if (rest.length === 2 && rest[1] !== "problems") return { content_type: "role_app", slug: rest.join("/") };
    if (rest.length === 3 && rest[1] === "problems") return { content_type: "problem", slug: `${rest[0]}/${rest[2]}` };
  } else if (rest.length === 1 && TYPES[root]) {
    return { content_type: TYPES[root], slug: rest[0] };
  }
  return { content_type: "hub", slug: parts.join("/") };
}

/** CTA locations: `hero` = first-screen row under the intro, `sticky_bar` = bottom bar after 35%
 * scroll, `cta_band` = closing CTA at the end of the article. */
const CTA_AREAS: [string, string][] = [
  [".seo-herocta", "hero"],
  [".seo-sticky", "sticky_bar"],
  [".seo-cta", "cta_band"],
  [".seo-railcard--cta", "rail_card"],
  [".seo-nudge", "inline_nudge"],
  [".seo-faster", "faster_with_lazur"],
];

const RELATED_AREAS: [string, string][] = [
  [".seo-related", "related_grid"],
  [".seo-raillinks", "rail_related"],
  ["[data-analytics-section]", ""],
  [".seo-chip", "chips"],
  [".seo-hubcard", "cards"],
];

const LINK_AREAS: [string, string][] = [
  [".seo-hero, .seo-hub-head", "hero"],
  [".seo-sources", "sources"],
  [".seo-stats", "stat_source"],
  [".seo-chart", "chart_source"],
  [".seo-products", "pricing_source"],
  [".seo-photo-credits", "photo_credits"],
  [".seo-faq", "faq"],
];

/** Sections whose first appearance on screen is worth counting (impressions for the CTAs). */
const VIEWED_SECTIONS: [string, string][] = [
  [".seo-cta", "cta_band"],
  [".seo-faster", "faster_with_lazur"],
  [".seo-table--compare", "compare_grid"],
  [".seo-faq", "faq"],
  [".seo-related", "related_grid"],
  [".seo-tool", "tool"],
];

function areaOf(el: Element, areas: [string, string][]) {
  for (const [selector, name] of areas) {
    const hit = el.closest(selector);
    if (hit) return name || hit.getAttribute("data-analytics-section") || "section";
  }
  return null;
}

function textOf(el: Element | null | undefined) {
  return (el?.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 120);
}

/** Title of the nearest group around a link: the related-grid group, hub section or rail card. */
function sectionOf(a: Element) {
  for (let el = a.parentElement; el && el.tagName !== "MAIN"; el = el.parentElement) {
    const heading = el.querySelector(":scope > h2, :scope > h3, :scope > div > h2, :scope > .seo-railcard__label");
    if (heading) return textOf(heading);
  }
  return undefined;
}

function linkTarget(a: HTMLAnchorElement) {
  const href = a.getAttribute("href") ?? "";
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return { link_type: "email", url: "mailto" };
  if (href.startsWith("#")) return { link_type: "anchor", url: href };
  if (a.host && a.host !== window.location.host) return { link_type: "outbound", url: a.href };
  return { link_type: "internal", url: a.pathname + a.search + a.hash };
}

function handleClick(target: Element) {
  const page = describeContent(window.location.pathname);

  const summary = target.closest(".seo-faq summary");
  if (summary) {
    const wasOpen = (summary.parentElement as HTMLDetailsElement | null)?.open ?? false;
    track(wasOpen ? "faq_closed" : "faq_opened", { ...page, location: "content", question: textOf(summary) });
    return;
  }

  const a = target.closest("a");
  if (!a) {
    const cell = target.closest(".seo-table--compare td, .seo-table--compare th");
    if (cell) {
      const row = cell.closest("tr");
      const table = cell.closest("table");
      const col = cell instanceof HTMLTableCellElement ? cell.cellIndex : -1;
      track("compare_grid_interacted", {
        ...page,
        action: "click",
        feature: textOf(row?.querySelector("th")),
        product: col > 0 ? textOf(table?.querySelectorAll("thead th")[col]) : undefined,
      });
    }
    return;
  }

  const { link_type, url } = linkTarget(a);
  const label = textOf(a);

  if (a.closest(".seo-toc")) {
    track("toc_link_clicked", { ...page, heading: label, url });
    return;
  }
  if (a.closest(".seo-crumbs")) {
    track("nav_link_clicked", { ...page, location: "breadcrumb", label, destination: url });
    return;
  }

  const cta = areaOf(a, CTA_AREAS);
  if (cta) {
    track("content_cta_clicked", { ...page, location: cta, label, destination: url });
    return;
  }

  const related = link_type === "internal" ? areaOf(a, RELATED_AREAS) : null;
  if (related) {
    const section = sectionOf(a);
    if (page.content_type === "hub") {
      const more = !a.classList.contains("seo-hubcard");
      track("hub_item_clicked", { hub: page.slug, item: url, item_type: more ? "more" : "card", section });
    } else {
      track("related_content_clicked", { from_type: page.content_type, from_slug: page.slug, to_url: url, location: related, section });
    }
    return;
  }

  // Hub pages: the "All 24 →" style links next to each section heading.
  if (page.content_type === "hub" && link_type === "internal" && a.closest(".seo-wrap")) {
    track("hub_item_clicked", { hub: page.slug, item: url, item_type: "more", section: sectionOf(a) });
    return;
  }

  track("content_link_clicked", { ...page, location: areaOf(a, LINK_AREAS) ?? "body", link_type, url, label });
}

/** Mounted once per page by SeoPageFrame, inside <main>. Renders an empty marker span. */
export function ContentClickTracker() {
  const ref = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const main = ref.current?.closest("main");
    if (!main) return;

    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element) handleClick(e.target);
    };

    // Horizontal scroll of the comparison table (phones), once per page. Scroll does not bubble,
    // so listen in the capture phase.
    let scrolled = false;
    const onScroll = (e: Event) => {
      if (scrolled || !(e.target instanceof Element) || !e.target.querySelector(".seo-table--compare")) return;
      scrolled = true;
      track("compare_grid_interacted", { ...describeContent(window.location.pathname), action: "scroll" });
    };

    main.addEventListener("click", onClick);
    main.addEventListener("scroll", onScroll, true);

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      const names = new Map<Element, string>();
      for (const [selector, name] of VIEWED_SECTIONS) {
        const el = main.querySelector(selector);
        if (el) names.set(el, name);
      }
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            observer.unobserve(entry.target);
            track("section_viewed", { ...describeContent(window.location.pathname), location: names.get(entry.target) });
          }
        },
        { rootMargin: "0px 0px -25% 0px" },
      );
      names.forEach((_, el) => observer.observe(el));
      io = observer;
    }

    return () => {
      main.removeEventListener("click", onClick);
      main.removeEventListener("scroll", onScroll, true);
      io?.disconnect();
    };
  }, [pathname]);

  return <span ref={ref} hidden />;
}

/** End-of-article marker: fires content_read once when the reader gets to it. */
export function ContentReadSentinel() {
  const ref = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  useTrackInView(ref, "content_read", describeContent(pathname));
  return <span ref={ref} aria-hidden className="block" />;
}
