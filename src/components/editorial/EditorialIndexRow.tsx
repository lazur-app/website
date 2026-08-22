import Link from "next/link";
import type { ReactNode } from "react";

export function EditorialIndexRow({
  href,
  kicker,
  title,
  description,
  meta,
  cta = "Read more",
}: {
  href: string;
  kicker: string;
  title: string;
  description: string;
  meta: ReactNode;
  cta?: string;
}) {
  return (
    <Link
      href={href}
      className="group grid gap-3 py-10 sm:grid-cols-[13.5rem_minmax(0,1fr)] sm:gap-10"
    >
      <div className="text-[13px] leading-relaxed text-[var(--foreground-muted)] sm:pt-1">
        {meta}
      </div>
      <div>
        <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
          {kicker}
        </p>
        <h2 className="mt-1.5 font-display text-[1.35rem] font-semibold leading-snug tracking-[-0.025em] text-[var(--foreground)] transition-colors group-hover:text-[var(--brand-ink)] md:text-[1.5rem]">
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[#5c564f] md:text-[16px]">
          {description}
        </p>
        <span className="mt-4 inline-block text-[14px] font-medium text-[var(--foreground)]">
          {cta}
          <span
            className="ml-1 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
