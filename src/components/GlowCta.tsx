import Link from "next/link";
import type { ReactNode } from "react";

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

const VARIANT_CLASS = {
  dark: "relative z-[1] inline-flex items-center justify-center gap-2 rounded-full bg-[var(--foreground)] font-semibold text-[var(--background)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
  light:
    "final-cta-btn",
  outline:
    "relative z-[1] inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-white font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]/25 disabled:cursor-not-allowed disabled:opacity-60",
} as const;

const SIZE_CLASS = {
  sm: "min-h-8 px-4 py-1.5 text-[13px]",
  md: "min-h-[48px] px-6 py-3 text-sm",
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
}: GlowCtaProps) {
  const buttonClass = `${VARIANT_CLASS[variant]} ${
    variant === "light" ? "" : SIZE_CLASS[size]
  } ${block ? "w-full" : ""} ${className}`.trim();

  const wrapClass = `final-cta-btn-wrap ${
    size === "sm" ? "final-cta-btn-wrap--sm" : ""
  } ${block ? "w-full" : ""} ${wrapClassName}`.trim();

  if (href && !disabled) {
    return (
      <span className={wrapClass}>
        <Orbit />
        <Link href={href} onClick={onClick} className={buttonClass}>
          {children}
        </Link>
      </span>
    );
  }

  return (
    <span className={wrapClass}>
      <Orbit />
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={buttonClass}
      >
        {children}
      </button>
    </span>
  );
}
