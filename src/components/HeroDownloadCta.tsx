"use client";

import Link from "next/link";
import { useState } from "react";
import { GlowCta } from "@/components/GlowCta";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { SendMacLink } from "@/components/download/SendMacLink";
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
  /** Button text for the minimal variant, on every platform (default: "Download free for Mac"). */
  label?: string;
  /** Analytics placement for the CTA clicks (e.g. "hero", "final_cta"). */
  location?: string;
  /** Analytics placement for the "Email me the Mac link" form non-Mac visitors see (defaults to `location`). */
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
  macLinkLocation,
}: HeroDownloadCtaProps) {
  // null on the server and first render: show the Mac button so Mac visitors (most of them) see no shift.
  const isMac = useIsMacVisitor();
  const [showMacLink, setShowMacLink] = useState(false);

  const rowAlign =
    align === "start"
      ? "justify-center lg:justify-start"
      : "justify-center";

  // Phones, Windows and Linux can't install Lazur. A friendly button first; tapping it opens the
  // "email me the Mac link" form right under it, so the hero stays clean and nobody hits a dead end.
  if (isMac === false) {
    const meetLabel = customLabel ?? "Meet my companion";
    return (
      <div className={`flex w-full flex-col items-center gap-3 ${align === "start" ? "lg:items-start" : ""}`}>
        {!showMacLink && (
          <GlowCta
            onClick={() => setShowMacLink(true)}
            eventProps={{ location, label: meetLabel, destination: "send_mac_link", platform: "not_mac" }}
            variant={look}
            size={size}
            wrapClassName="final-cta-btn-wrap--subtle"
          >
            {meetLabel}
          </GlowCta>
        )}
        {showMacLink && (
          <>
            <p className="text-[13px] text-[var(--foreground-muted)]">
              Lazur runs on Mac. Get the download link by email:
            </p>
            <SendMacLink location={macLinkLocation ?? location} variant="inline" />
          </>
        )}
      </div>
    );
  }

  const label = customLabel ?? "Download free for Mac";

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
