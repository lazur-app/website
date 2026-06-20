"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { detectPlatform, type Platform } from "@/lib/platform";

type HeroDownloadCtaProps = {
  align?: "center" | "start";
  variant?: "default" | "minimal";
};

export function HeroDownloadCta({
  align = "center",
  variant = "default",
}: HeroDownloadCtaProps) {
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const rowAlign =
    align === "start"
      ? "justify-center lg:justify-start"
      : "justify-center";

  if (platform === "windows") {
    return (
      <div
        className={`flex flex-col gap-3 sm:flex-row sm:items-center ${rowAlign}`}
      >
        <div className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-center sm:text-left">
          <p className="text-[var(--text-sm)] font-semibold text-[var(--foreground)]">
            Coming to Windows soon
          </p>
          <p className="mt-1 text-[var(--text-xs)] text-[var(--foreground-muted)]">
            macOS is available now
          </p>
        </div>
        <Link
          href="/download"
          className="btn-dark inline-flex items-center gap-2 px-6 text-[var(--text-base)] font-semibold"
        >
          <AppleIcon />
          Download for Mac
        </Link>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={`flex ${rowAlign}`}>
        <Link
          href="/download"
          className="btn-dark inline-flex items-center justify-center gap-2 px-7 text-[var(--text-base)] font-semibold"
        >
          <AppleIcon />
          Download for Mac
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${rowAlign}`}
    >
      <Link
        href="/download"
        className="btn-dark inline-flex items-center justify-center gap-2 px-6 text-[var(--text-base)] font-semibold"
      >
        <AppleIcon />
        Download for Mac
      </Link>
      <Link
        href="#refer"
        className="text-[var(--text-sm)] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
      >
        Refer a friend →
      </Link>
    </div>
  );
}
