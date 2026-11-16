import type { ReactNode } from "react";
import { formatBlogDateLong } from "@/lib/blog/format";
import { CTA_GENERIC_LABEL, downloadHref } from "./ctaCopy";
import { HeroCta } from "./HeroCta";
import { InlineText } from "./InlineText";
import { Breadcrumbs, Kicker } from "./Primitives";

/**
 * Top of every SEO page: breadcrumbs, kicker, H1 written to match the query, the two-sentence answer,
 * a first-screen CTA row matched to the page's intent, a meta line (updated date, what it was
 * checked against), and a visual on the right. `cta.label` is the button text (generic download
 * copy when omitted); `cta.suffix` is shown after it on wider screens only.
 */
export function PageHero({
  crumbs,
  kicker,
  title,
  intro,
  updatedAt,
  meta = [],
  visual,
  cta = {},
}: {
  crumbs: { href: string; label: string }[];
  kicker: string;
  title: string;
  intro: string;
  updatedAt: string;
  meta?: string[];
  visual?: ReactNode;
  cta?: { label?: string; suffix?: string; source?: string };
}) {
  return (
    <header className={`seo-hero ${visual ? "seo-hero--split" : ""}`}>
      <div className="seo-hero__copy">
        <Breadcrumbs items={crumbs} />
        <Kicker>{kicker}</Kicker>
        <h1 className="seo-h1">{title}</h1>
        <p className="seo-hero__intro">
          <InlineText text={intro} />
        </p>
        <HeroCta label={cta.label ?? CTA_GENERIC_LABEL} suffix={cta.suffix} href={downloadHref(cta.source)} />
        <p className="seo-hero__meta">
          <span>
            Updated <time dateTime={updatedAt}>{formatBlogDateLong(updatedAt)}</time>
          </span>
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </p>
      </div>
      {visual ? <div className="seo-hero__visual">{visual}</div> : null}
    </header>
  );
}
