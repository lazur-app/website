import { ContentImage } from "./ContentImage";
import Link from "next/link";
import type { SeoImage } from "@/lib/seo-pages/types";
import type { ReactNode } from "react";
import { Sticker } from "@/components/landing/Sticker";
import { AccentTitle } from "./AccentTitle";
import { Breadcrumbs, Kicker } from "./Primitives";

/** Index pages per type (/how-to, /apps, /for, /compare, /alternatives, /tools): a centred header like /download. */
export function HubHeader({
  crumbs,
  kicker,
  title,
  accent,
  intro,
  children,
}: {
  crumbs: { href: string; label: string }[];
  kicker: string;
  title: string;
  accent?: string;
  intro: string;
  children?: ReactNode;
}) {
  return (
    <header className="seo-hub-head">
      <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden>
        <Sticker name="star" size={84} rotate={-10} className="absolute left-[6%] top-[48px]" />
        <Sticker name="cursor" size={80} rotate={10} className="absolute right-[6%] top-[96px]" />
      </div>
      <div className="relative">
        <Breadcrumbs items={crumbs} />
        <Kicker>{kicker}</Kicker>
        <h1 className="seo-h1 mx-auto max-w-4xl">
          <AccentTitle title={title} accent={accent} />
        </h1>
        <p className="seo-hero__intro mx-auto max-w-[40rem]">{intro}</p>
        {children}
      </div>
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
          className="seo-hubcard__img -mx-4 -mt-4 mb-4 aspect-[16/9] w-[calc(100%+32px)] max-w-none border-b-[1.5px] border-[#1c1917] object-cover sm:-mx-6 sm:-mt-6 sm:w-[calc(100%+48px)]"
        />
      ) : null}
      <span className="seo-related__kicker">{kicker}</span>
      <span className="mt-2 block text-[1.15rem] font-bold leading-snug tracking-[-0.03em] text-[var(--foreground)] underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-[#1c1917]">
        {title}
      </span>
      {description ? <span className="mt-2 block text-[14px] leading-relaxed text-[var(--foreground-muted)] line-clamp-3">{description}</span> : null}
      {aside ? <span className="mt-4 block">{aside}</span> : null}
    </Link>
  );
}

export function HubSection({ title, id, children, more }: { title: string; id?: string; children: ReactNode; more?: { href: string; label: string } }) {
  return (
    <section className="mt-16 md:mt-24" aria-labelledby={id}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={id} className="seo-h2">
          {title}
        </h2>
        {more ? (
          <Link
            href={more.href}
            className="shrink-0 text-[14px] font-semibold text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-4 hover:decoration-[var(--foreground)]"
          >
            {more.label} →
          </Link>
        ) : null}
      </div>
      <div className="seo-hubgrid mt-6">{children}</div>
    </section>
  );
}
