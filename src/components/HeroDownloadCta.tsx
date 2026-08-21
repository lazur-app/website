"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Monitor } from "lucide-react";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { detectPlatform, type Platform } from "@/lib/platform";

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
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const rowAlign =
    align === "start"
      ? "justify-center lg:justify-start"
      : "justify-center";

  if (platform === null) {
    return (
      <div className={`flex w-full ${rowAlign}`} aria-hidden>
        <span
          className={`btn-dark inline-flex min-h-[44px] min-w-[12.5rem] px-6 opacity-0 sm:min-h-[48px] ${className}`}
        >
          &nbsp;
        </span>
      </div>
    );
  }

  if (platform === "windows") {
    return (
      <Link
        href="/exclusive-access"
        className={`btn-dark inline-flex min-h-[44px] items-center justify-center gap-2 px-6 text-[var(--text-base)] font-semibold sm:min-h-[48px] ${className}`}
      >
        <Monitor className="h-4 w-4" strokeWidth={2} />
        Get notified for Windows
      </Link>
    );
  }

  if (variant === "minimal") {
    return (
      <Link
        href="/download"
        className={`btn-dark inline-flex min-h-[44px] items-center justify-center gap-2 px-7 text-[var(--text-base)] font-semibold sm:min-h-[48px] ${className}`}
      >
        <AppleIcon />
        Download Free for Mac
      </Link>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${rowAlign}`}
    >
      <Link
        href="/download"
        className="btn-dark inline-flex min-h-[48px] items-center justify-center gap-2 px-6 text-[var(--text-base)] font-semibold"
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
