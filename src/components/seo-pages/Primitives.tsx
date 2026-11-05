import Link from "next/link";
import type { ReactNode } from "react";
import { GlowCta } from "@/components/GlowCta";
import { AppleIcon } from "@/components/icons/AppleIcon";
import type { SeoFaq, SeoSource } from "@/lib/seo-pages/types";
import { InlineText } from "./InlineText";

/** Small shared pieces of the SEO page design system. See docs/DESIGN-SYSTEM.md. */

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="seo-kicker">{children}</p>;
}

export function SectionHeading({ id, children, sub }: { id?: string; children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-5">
      <h2 id={id} className="seo-h2 scroll-mt-28">
        {children}
      </h2>
      {sub ? <p className="mt-2 text-[15px] leading-relaxed text-[var(--foreground-muted)]">{sub}</p> : null}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="seo-crumbs">
      <ol>
        {items.map((item, i) => (
          <li key={item.href + i}>
            {i < items.length - 1 ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Kbd({ keys }: { keys: string }) {
  const parts = keys.split(/\s*\+\s*|\s+(?=[⌘⌥⌃⇧])/).filter(Boolean);
  return (
    <span className="inline-flex flex-wrap items-center gap-1 align-middle">
      {parts.map((k, i) => (
        <kbd key={k + i} className="seo-kbd">
          {k}
        </kbd>
      ))}
    </span>
  );
}

export function MenuPath({ path }: { path: string[] }) {
  return (
    <span className="seo-menupath" aria-label={path.join(" then ")}>
      {path.map((p, i) => (
        <span key={p + i} className="inline-flex items-center">
          {i > 0 ? <span className="mx-1 text-[var(--foreground-faint)]" aria-hidden>›</span> : null}
          <span className="seo-menupath__item">{p}</span>
        </span>
      ))}
    </span>
  );
}

export function TldrBox({ items, title = "Quick answer" }: { items: string[]; title?: string }) {
  if (items.length === 0) return null;
  return (
    <div className="blog-tldr seo-tldr">
      <p className="seo-label">{title}</p>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <InlineText text={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Callout({ tone, title, text }: { tone: "tip" | "note" | "warning"; title?: string; text: string }) {
  return (
    <aside className={`seo-callout seo-callout--${tone}`}>
      <p className="seo-label">{title ?? (tone === "tip" ? "Tip" : tone === "warning" ? "Heads up" : "Note")}</p>
      <p className="mt-1.5">
        <InlineText text={text} />
      </p>
    </aside>
  );
}

export function FaqList({ items, id = "faq", title = "Questions people ask" }: { items: SeoFaq[]; id?: string; title?: string }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={id} className="seo-section">
      <SectionHeading id={id}>{title}</SectionHeading>
      <div className="seo-faq">
        {items.map((item, i) => (
          <details key={item.question} open={i === 0}>
            <summary>{item.question}</summary>
            <p>
              <InlineText text={item.answer} />
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function SourcesList({ sources }: { sources: SeoSource[] }) {
  if (sources.length === 0) return null;
  return (
    <section aria-labelledby="sources" className="seo-section">
      <h2 id="sources" className="seo-label !text-[12px]">
        Sources
      </h2>
      <ol className="seo-sources">
        {sources.map((s, i) => (
          <li key={s.url} id={`source-${i + 1}`}>
            <a href={s.url} rel="noopener noreferrer nofollow" target="_blank">
              {s.title}
            </a>
            {s.publisher ? <span className="text-[var(--foreground-faint)]"> · {s.publisher}</span> : null}
            {s.accessedAt ? <span className="text-[var(--foreground-faint)]"> · checked {s.accessedAt}</span> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Closing call to action. Same promise everywhere: free for 3 days, no card. */
export function CtaBand({
  title = "Try Lazur free for 3 days",
  text = "Hold a key and ask. Lazur sees your screen, points at the button and talks you through it, in any Mac app. No credit card.",
  source,
}: {
  title?: string;
  text?: string;
  source?: string;
}) {
  return (
    <section className="seo-cta" aria-label="Download Lazur">
      <div className="seo-cta__glow" aria-hidden />
      <p className="relative font-display text-[1.5rem] font-semibold tracking-[-0.03em] text-white md:text-[1.9rem]">{title}</p>
      <p className="relative mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-white/70 md:text-[16px]">{text}</p>
      <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <GlowCta href={source ? `/download?ref=${encodeURIComponent(source)}` : "/download"} variant="light">
          <AppleIcon className="h-4 w-4" />
          Download for Mac
        </GlowCta>
        <Link href="/pricing" className="text-[14px] font-medium text-white/70 transition-colors hover:text-white">
          Pro $18/month after the trial →
        </Link>
      </div>
    </section>
  );
}

/** A one-line mid-page nudge. */
export function LazurCallout({ text, href = "/download" }: { text: string; href?: string }) {
  return (
    <aside className="seo-nudge">
      <span className="seo-nudge__dot" aria-hidden />
      <p>
        <InlineText text={text} />{" "}
        <Link href={href} className="seo-link whitespace-nowrap">
          Try it free
        </Link>
      </p>
    </aside>
  );
}
