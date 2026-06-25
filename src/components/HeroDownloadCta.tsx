"use client";

import Link from "next/link";
import { EXCLUSIVE_ACCESS_PATH } from "@/lib/exclusiveAccess";

type HeroAccessCtaProps = {
  align?: "center" | "start";
  variant?: "default" | "minimal";
};

export function HeroDownloadCta({
  align = "center",
  variant = "default",
}: HeroAccessCtaProps) {
  const rowAlign =
    align === "start"
      ? "justify-center lg:justify-start"
      : "justify-center";

  if (variant === "minimal") {
    return (
      <div className={`flex ${rowAlign}`}>
        <Link
          href={EXCLUSIVE_ACCESS_PATH}
          className="btn-dark inline-flex items-center justify-center gap-2 px-7 text-[var(--text-base)] font-semibold"
        >
          Exclusive access
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${rowAlign}`}
    >
      <Link
        href={EXCLUSIVE_ACCESS_PATH}
        className="btn-dark inline-flex items-center justify-center gap-2 px-6 text-[var(--text-base)] font-semibold"
      >
        Exclusive access
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
