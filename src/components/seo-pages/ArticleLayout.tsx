import Link from "next/link";
import type { ReactNode } from "react";
import { toolsForTopic } from "@/lib/free-tools/match";
import type { RelatedGroups } from "@/lib/seo-pages/links";
import { ContentReadSentinel } from "./ContentAnalytics";
import { RailCta } from "./Primitives";
import { TocRail } from "./TocRail";

/**
 * Body of every SEO page and blog post: the article on the left and, on wide screens, a sticky
 * side rail with the table of contents, the Lazur card and a few related pages. On phones the rail
 * is hidden and the article runs full width. Same grid as the hero, so both line up.
 */
export function ArticleLayout({ children, source, related = [], topic = "" }: { children: ReactNode; source?: string; related?: RelatedGroups; topic?: string }) {
  const links = related.flatMap((g) => g.links).slice(0, 5);
  // Free tools that fit this page (links into the tool subdomains).
  const tools = toolsForTopic(topic);
  return (
    <div className="seo-article">
      <div className="seo-article__main">
        {children}
        {tools.length > 0 ? (
          <nav aria-labelledby="free-tools-for-this" className="mt-12 rounded-[20px] border-[1.5px] border-[#1c1917] bg-white p-5">
            <p id="free-tools-for-this" className="text-[17px] font-bold tracking-[-0.01em] text-[var(--foreground)]">
              Free tools for this
            </p>
            <ul className="mt-3 space-y-2">
              {tools.map((t) => (
                <li key={t.href}>
                  <a href={t.href} className="font-semibold underline decoration-[var(--foreground)]/25 underline-offset-4 hover:decoration-[var(--foreground)]">
                    {t.name}
                  </a>
                  <span className="text-[var(--foreground-muted)]">: {t.tagline}</span>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        <ContentReadSentinel />
      </div>
      <aside className="seo-article__rail" aria-label="Page tools">
        <div className="seo-article__sticky">
          <TocRail />
          <RailCta source={source} />
          {tools.length > 0 ? (
            <nav aria-label="Free tools" className="seo-railcard">
              <p className="seo-railcard__label">Free tools</p>
              <ul className="seo-raillinks">
                {tools.map((t) => (
                  <li key={t.href}>
                    <a href={t.href}>{t.name}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {links.length > 0 ? (
            <nav aria-label="Related pages" className="seo-railcard">
              <p className="seo-railcard__label">Related</p>
              <ul className="seo-raillinks">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.title}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
