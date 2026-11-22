import Link from "next/link";
import type { ReactNode } from "react";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { track, type AnalyticsProps } from "@/lib/productAnalytics";

function Orbit() {
  return (
    <span className="final-cta-orbit" aria-hidden>
      <span className="final-cta-orbit__ring">
        <span className="final-cta-orbit__spin" />
        <span className="final-cta-orbit__spin final-cta-orbit__spin--trail" />
        <span className="final-cta-orbit__spin final-cta-orbit__spin--dot" />
      </span>
    </span>
  );
}

/**
 * One button language for the whole site: a lavender face with an ink border and nearly square
 * corners. "dark" is the main call to action, "light" the same on dark bands, "outline" the
 * quieter second choice. "classic" is the homepage hero's own button: the original black pill
 * with a light circling its edge.
 */
const BASE = "relative z-[1] inline-flex items-center justify-center gap-2.5 rounded-[6px] font-semibold tracking-[-0.01em] transition-[background-color,transform] duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";
const VARIANT_CLASS = {
  dark: `${BASE} border-[1.5px] border-[#2a1c6b] bg-[#e7dfff] text-[#1c1917] hover:bg-[#dccfff]`,
  light: `${BASE} border-[1.5px] border-[#e7dfff] bg-[#e7dfff] text-[#1c1917] hover:bg-white`,
  outline: `${BASE} border-[1.5px] border-[var(--foreground)] bg-white text-[var(--foreground)] hover:bg-[var(--background-deep)]`,
  classic: "relative z-[1] inline-flex items-center justify-center gap-2 rounded-full bg-[var(--foreground)] font-semibold text-[var(--background)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
} as const;

const SIZE_CLASS = {
  sm: "min-h-8 px-4 py-1.5 text-[13px]",
  md: "min-h-[48px] px-6 py-3 text-sm",
  /** Thumb-sized (52px) for the page's main download buttons. */
  lg: "min-h-[52px] px-7 py-3.5 text-[16px]",
  /** The one button the homepage hero is built around. */
  xl: "min-h-[72px] px-11 py-4 text-[21px] md:min-h-[88px] md:px-16 md:text-[26px]",
} as const;

type GlowCtaProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: keyof typeof VARIANT_CLASS;
  size?: keyof typeof SIZE_CLASS;
  block?: boolean;
  className?: string;
  wrapClassName?: string;
  /**
   * Analytics: when set, fires `event` (default "cta_clicked") with these props on click. Safe from
   * server components for links; for buttons it only applies when an onClick is passed too.
   */
  eventProps?: AnalyticsProps;
  event?: string;
};

export function GlowCta({
  children,
  href,
  onClick,
  type = "button",
  disabled = false,
  variant = "dark",
  size = "md",
  block = false,
  className = "",
  wrapClassName = "",
  eventProps,
  event = "cta_clicked",
}: GlowCtaProps) {
  const buttonClass = `${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${block ? "w-full" : ""} ${className}`.trim();

  const orbit = variant === "classic" ? <Orbit /> : null;
  const wrapClass = `final-cta-btn-wrap ${
    size === "sm" ? "final-cta-btn-wrap--sm" : ""
  } ${block ? "w-full" : ""} ${wrapClassName}`.trim();

  if (href && !disabled) {
    return (
      <span className={wrapClass}>
        {orbit}
        {eventProps ? (
          <TrackedLink href={href} onClick={onClick} event={event} eventProps={eventProps} className={buttonClass}>
            {children}
          </TrackedLink>
        ) : (
          <Link href={href} onClick={onClick} className={buttonClass}>
            {children}
          </Link>
        )}
      </span>
    );
  }

  return (
    <span className={wrapClass}>
      {orbit}
      <button
        type={type}
        onClick={
          eventProps && onClick
            ? () => {
                track(event, eventProps);
                onClick();
              }
            : onClick
        }
        disabled={disabled}
        className={buttonClass}
      >
        {children}
      </button>
    </span>
  );
}
