import Link from "next/link";
import type { ReactNode } from "react";
import { AlertTriangle, ArrowRight, CalendarDays, Info, Lightbulb, Sparkles, Zap } from "lucide-react";
import { GlowCta } from "@/components/GlowCta";
import { AppleIcon } from "@/components/icons/AppleIcon";
import type { SeoFaq, SeoImage, SeoSource } from "@/lib/seo-pages/types";
import { InlineText } from "./InlineText";

/** Small shared pieces of the SEO page design system. See docs/DESIGN-SYSTEM.md. */

/** Where "Book a call" goes. TODO(Veer): put the real meeting link here. */
export const MEETING_URL = "/support";

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="seo-kicker">{children}</p>;
}

export function SectionHeading({ id, children, sub, eyebrow }: { id?: string; children: ReactNode; sub?: ReactNode; eyebrow?: string }) {
  return (
    <div className="seo-sechead">
      {eyebrow ? <p className="seo-sechead__eyebrow">{eyebrow}</p> : null}
      <h2 id={id} className="seo-h2">
        {children}
      </h2>
      {sub ? <p className="seo-sechead__sub">{sub}</p> : null}
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
    <span className="seo-keys">
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
          {i > 0 ? (
            <span className="mx-1 text-[var(--foreground-faint)]" aria-hidden>
              ›
            </span>
          ) : null}
          <span className="seo-menupath__item">{p}</span>
        </span>
      ))}
    </span>
  );
}

export function TldrBox({ items, title = "Quick answer" }: { items: string[]; title?: string }) {
  if (items.length === 0) return null;
  return (
    <div className="blog-tldr seo-tldr seo-reveal">
      <p className="seo-tldr__title">
        <span className="seo-tldr__icon" aria-hidden>
          <Zap size={14} strokeWidth={2.5} />
        </span>
        {title}
      </p>
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

const CALLOUT = {
  tip: { icon: Lightbulb, label: "Tip" },
  note: { icon: Info, label: "Good to know" },
  warning: { icon: AlertTriangle, label: "Heads up" },
} as const;

export function Callout({ tone, title, text }: { tone: "tip" | "note" | "warning"; title?: string; text: string }) {
  const c = CALLOUT[tone] ?? CALLOUT.note;
  const Icon = c.icon;
  return (
    <aside className={`seo-callout seo-callout--${tone} seo-reveal`}>
      <span className="seo-callout__icon" aria-hidden>
        <Icon size={18} strokeWidth={2.2} />
      </span>
      <div>
        <p className="seo-callout__title">{title ? title.charAt(0).toUpperCase() + title.slice(1).toLowerCase() : c.label}</p>
        <p className="seo-callout__text">
          <InlineText text={text} />
        </p>
      </div>
    </aside>
  );
}

export function FaqList({ items, id = "faq", title = "Questions people ask" }: { items: SeoFaq[]; id?: string; title?: string }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby={id} className="seo-section">
      <SectionHeading id={id} eyebrow="FAQ">
        {title}
      </SectionHeading>
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
    <section aria-labelledby="sources" className="seo-section seo-sources-wrap">
      <h2 id="sources" className="seo-label !text-[12px]">
        Sources
      </h2>
      <ol className="seo-sources">
        {sources.map((s, i) => (
          <li key={s.url + i} id={`source-${i + 1}`}>
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

/** One quiet line crediting the photographers, at the end of the page (nothing under each photo). */
export function PhotoCredits({ images }: { images: (SeoImage | undefined)[] }) {
  const seen = new Set<string>();
  const credits = images
    .filter((i): i is SeoImage => Boolean(i?.credit?.name))
    .map((i) => i.credit!)
    .filter((c) => !seen.has(c.name) && (seen.add(c.name), true));
  if (credits.length === 0) return null;
  return (
    <p className="seo-photo-credits">
      Photos:{" "}
      {credits.map((c, i) => (
        <span key={c.name}>
          {i > 0 ? ", " : ""}
          {c.url ? (
            <a href={c.url} rel="noopener noreferrer nofollow" target="_blank">
              {c.name}
            </a>
          ) : (
            c.name
          )}
        </span>
      ))}{" "}
      on{" "}
      <a href="https://pixabay.com" rel="noopener noreferrer nofollow" target="_blank">
        Pixabay
      </a>
      .
    </p>
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
    <section className="seo-cta seo-reveal" aria-label="Download Lazur">
      <div className="seo-cta__glow" aria-hidden />
      <div className="seo-cta__grid" aria-hidden />
      <p className="seo-cta__eyebrow">
        <Sparkles size={14} aria-hidden /> Voice assistant for Mac
      </p>
      <p className="seo-cta__title">{title}</p>
      <p className="seo-cta__text">{text}</p>
      <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <GlowCta href={source ? `/download?ref=${encodeURIComponent(source)}` : "/download"} variant="light">
          <AppleIcon className="h-4 w-4" />
          Download for Mac
        </GlowCta>
        <Link href="/pricing#pro" className="seo-cta__ghost">
          See Pro and Power plans <ArrowRight size={14} aria-hidden />
        </Link>
      </div>
      <p className="seo-cta__small">
        Pro $18/month after the trial. Power $120/month for heavy use.{" "}
        <Link href={MEETING_URL} className="underline underline-offset-2 hover:text-white">
          Book a call
        </Link>
      </p>
    </section>
  );
}

/** A short mid-page nudge. */
export function LazurCallout({ text, href = "/download" }: { text: string; href?: string }) {
  return (
    <aside className="seo-nudge seo-reveal">
      <span className="seo-nudge__orb" aria-hidden>
        <span />
        <span />
        <span />
      </span>
      <p>
        <InlineText text={text} />
      </p>
      <Link href={href} className="seo-nudge__btn">
        Try it free <ArrowRight size={14} aria-hidden />
      </Link>
    </aside>
  );
}

/** Small card for the side rail: download, plans and a call. */
export function RailCta({ source }: { source?: string }) {
  return (
    <div className="seo-railcard seo-railcard--cta">
      <p className="seo-railcard__title">Ask instead of searching</p>
      <p className="seo-railcard__text">Hold ⌥ ⌘ and ask. Lazur sees your screen, points at the button and walks you through it.</p>
      <Link href={source ? `/download?ref=${encodeURIComponent(source)}` : "/download"} className="seo-railcard__btn">
        <AppleIcon className="h-3.5 w-3.5" /> Download for Mac
      </Link>
      <p className="seo-railcard__fine">Free for 3 days, no card.</p>
      <div className="seo-railcard__links">
        <Link href="/pricing#pro">Pro $18/mo</Link>
        <Link href="/pricing#power">Power $120/mo</Link>
        <Link href={MEETING_URL}>
          <CalendarDays size={13} aria-hidden /> Book a call
        </Link>
      </div>
    </div>
  );
}
