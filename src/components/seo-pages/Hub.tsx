import { ContentImage } from "./ContentImage";
import Link from "next/link";
import type { SeoImage } from "@/lib/seo-pages/types";
import type { ReactNode } from "react";
import { Breadcrumbs, Kicker } from "./Primitives";

/** Index pages per type (/how-to, /apps, /for, /compare, /alternatives, /tools). */
export function HubHeader({ crumbs, kicker, title, intro, children }: { crumbs: { href: string; label: string }[]; kicker: string; title: string; intro: string; children?: ReactNode }) {
  return (
    <header className="seo-hub-head">
      <Breadcrumbs items={crumbs} />
      <Kicker>{kicker}</Kicker>
      <h1 className="seo-h1 max-w-3xl">{title}</h1>
      <p className="seo-hero__intro max-w-2xl">{intro}</p>
      {children}
    </header>
  );
}

export function HubCard({ href, kicker, title, description, aside, image }: { href: string; kicker: string; title: string; description?: string; aside?: ReactNode; image?: SeoImage }) {
  return (
    <Link href={href} className="seo-hubcard group">
      {image ? (
        <ContentImage
          src={image.url}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="-mx-5 -mt-[18px] mb-4 aspect-[16/9] w-[calc(100%+40px)] max-w-none rounded-t-[18px] object-cover"
        />
      ) : null}
      <span className="seo-related__kicker">{kicker}</span>
      <span className="mt-1 block font-display text-[1.1rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--foreground)] group-hover:text-[var(--brand-ink)]">{title}</span>
      {description ? <span className="mt-2 block text-[14px] leading-relaxed text-[var(--foreground-muted)] line-clamp-3">{description}</span> : null}
      {aside ? <span className="mt-3 block">{aside}</span> : null}
    </Link>
  );
}

export function HubSection({ title, id, children, more }: { title: string; id?: string; children: ReactNode; more?: { href: string; label: string } }) {
  return (
    <section className="mt-14" aria-labelledby={id}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={id} className="seo-h2">
          {title}
        </h2>
        {more ? (
          <Link href={more.href} className="shrink-0 text-[14px] font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
            {more.label} →
          </Link>
        ) : null}
      </div>
      <div className="seo-hubgrid mt-5">{children}</div>
    </section>
  );
}
