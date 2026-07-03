import type { ReactNode } from "react";

type BandVariant = "light" | "dark" | "tint" | "muted";

const VARIANT_CLASS: Record<BandVariant, string> = {
  light: "bg-[var(--background)]",
  dark: "bg-[var(--foreground)] text-[var(--background)]",
  tint: "bg-[var(--brand-soft)]/30",
  muted: "bg-[var(--background-deep)]/40",
};

type LandingBandProps = {
  variant?: BandVariant;
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Full-bleed landing section — background spans viewport width. */
export function LandingBand({
  variant = "light",
  id,
  className = "",
  children,
}: LandingBandProps) {
  return (
    <section
      id={id}
      className={`w-full py-14 md:py-20 ${VARIANT_CLASS[variant]} ${className}`}
    >
      {children}
    </section>
  );
}

/** Centered content column inside a band. */
export function LandingBandInner({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`landing-container ${className}`}>{children}</div>
  );
}

/** Break out of the inner column to span the full viewport width. */
export function LandingBandBleed({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 ${className}`}
    >
      {children}
    </div>
  );
}
