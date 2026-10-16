"use client";

import Link from "next/link";
import { GlowCta } from "@/components/GlowCta";

type HeroDownloadCtaProps = {
  align?: "center" | "start";
  variant?: "default" | "minimal";
  className?: string;
};

export function HeroDownloadCta({
  align = "center",
  variant = "default",
  className = "",
}: HeroDownloadCtaProps) {
  const rowAlign =
    align === "start"
      ? "justify-center lg:justify-start"
      : "justify-center";

  if (variant === "minimal") {
    return (
      <GlowCta
        href="/exclusive-access"
        variant="dark"
        wrapClassName={`final-cta-btn-wrap--subtle ${className}`.trim()}
        className={className}
      >
        Get Early Access
      </GlowCta>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${rowAlign}`}
    >
      <GlowCta
        href="/exclusive-access"
        variant="dark"
        wrapClassName="final-cta-btn-wrap--subtle"
      >
        Get Early Access
      </GlowCta>
      <Link
        href="#refer"
        className="text-[var(--text-sm)] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
      >
        Refer a friend →
      </Link>
    </div>
  );
}

