import Link from "next/link";
import type { ReactNode } from "react";
import type { RelatedGroups } from "@/lib/seo-pages/links";
import { RailCta } from "./Primitives";
import { TocRail } from "./TocRail";

/**
 * Body of every SEO page and blog post: the article on the left and, on wide screens, a sticky
 * side rail with the table of contents, the Lazur card and a few related pages. On phones the rail
 * is hidden and the article runs full width. Same grid as the hero, so both line up.
 */
export function ArticleLayout({ children, source, related = [] }: { children: ReactNode; source?: string; related?: RelatedGroups }) {
  const links = related.flatMap((g) => g.links).slice(0, 5);
  return (
    <div className="seo-article">
      <div className="seo-article__main">{children}</div>
      <aside className="seo-article__rail" aria-label="Page tools">
        <div className="seo-article__sticky">
          <TocRail />
          <RailCta source={source} />
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
