"use client";

import Link from "next/link";
import { GlowCta } from "@/components/GlowCta";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { SendMacLink } from "@/components/download/SendMacLink";
import { useIsMacVisitor } from "@/hooks/useIsMacVisitor";
import { track } from "@/lib/productAnalytics";

type HeroDownloadCtaProps = {
  align?: "center" | "start";
  variant?: "default" | "minimal";
  className?: string;
  /** Analytics placement for the CTA clicks (e.g. "hero", "final_cta"). */
  location?: string;
  /** Analytics placement for the "Email me the Mac link" form non-Mac visitors see (defaults to `location`). */
  macLinkLocation?: string;
};

export function HeroDownloadCta({
  align = "center",
  variant = "default",
  className = "",
  location = "hero",
  macLinkLocation,
}: HeroDownloadCtaProps) {
  // null on the server and first render: show the Mac button so Mac visitors (most of them) see no shift.
  const isMac = useIsMacVisitor();

  const rowAlign =
    align === "start"
      ? "justify-center lg:justify-start"
      : "justify-center";

  // Phones, Windows and Linux can't install Lazur: let them send the Mac link to themselves.
  if (isMac === false) {
    return (
      <div className={`flex w-full flex-col items-center gap-2 ${align === "start" ? "lg:items-start" : ""}`}>
        <p className="text-[13px] text-[var(--foreground-muted)]">
          Lazur runs on Mac. Get the download link by email:
        </p>
        <SendMacLink location={macLinkLocation ?? location} variant="inline" />
      </div>
    );
  }

  const label = "Download free for Mac";

  if (variant === "minimal") {
    return (
      <GlowCta
        href="/download"
        eventProps={{ location, label, destination: "/download", platform: isMac ? "mac" : "unknown" }}
        variant="dark"
        size="lg"
        wrapClassName={`final-cta-btn-wrap--subtle ${className}`.trim()}
        className={className}
      >
        <AppleIcon />
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
