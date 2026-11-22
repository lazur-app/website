"use client";

import Link from "next/link";
import { GlowCta } from "@/components/GlowCta";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { useIsMacVisitor } from "@/hooks/useIsMacVisitor";
import { track } from "@/lib/productAnalytics";

type HeroDownloadCtaProps = {
  align?: "center" | "start";
  variant?: "default" | "minimal";
  className?: string;
  /** Button size; "xl" is the homepage hero. */
  size?: "lg" | "xl";
  /** "classic" is the hero's black pill with the circling light. */
  look?: "dark" | "classic";
  /** Button text for the minimal variant, on every platform (default: "Download for Mac"). */
  label?: string;
  /** Analytics placement for the CTA clicks (e.g. "hero", "final_cta"). */
  location?: string;
  /** No longer used: every visitor gets the same download button. Kept so older callers still compile. */
  macLinkLocation?: string;
};

export function HeroDownloadCta({
  align = "center",
  variant = "default",
  className = "",
  size = "lg",
  look = "dark",
  label: customLabel,
  location = "hero",
}: HeroDownloadCtaProps) {
  // Every visitor gets the same button, on a Mac or not. Only the analytics note which they are.
  const isMac = useIsMacVisitor();

  const rowAlign =
    align === "start"
      ? "justify-center lg:justify-start"
      : "justify-center";

  const label = customLabel ?? "Download for Mac";

  if (variant === "minimal") {
    return (
      <GlowCta
        href="/download"
        eventProps={{ location, label, destination: "/download", platform: isMac ? "mac" : "unknown" }}
        variant={look}
        size={size}
        wrapClassName={`final-cta-btn-wrap--subtle ${className}`.trim()}
        className={className}
      >
        {customLabel ? null : <AppleIcon />}
        {label}
      </GlowCta>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${rowAlign}`}
    >
      <GlowCta
        href="/download"
        eventProps={{ location, label, destination: "/download", platform: isMac ? "mac" : "unknown" }}
        variant="dark"
        size="lg"
        wrapClassName="final-cta-btn-wrap--subtle"
      >
        <AppleIcon />
        {label}
      </GlowCta>
      <Link
        href="#refer"
        onClick={() => track("cta_clicked", { location, label: "Refer a friend", destination: "#refer" })}
        className="text-[var(--text-sm)] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
      >
        Refer a friend →
      </Link>
    </div>
  );
}
