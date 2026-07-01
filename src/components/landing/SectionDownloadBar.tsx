"use client";

import Link from "next/link";
import { AppleIcon } from "@/components/icons/AppleIcon";

type SectionDownloadBarProps = {
  price: string;
  note?: string;
  className?: string;
};

export function SectionDownloadBar({
  price,
  note,
  className = "",
}: SectionDownloadBarProps) {
  return (
    <div
      className={`mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 border-b border-[var(--border)] px-6 py-8 sm:flex-row sm:gap-6 ${className}`}
    >
      <div className="text-center sm:text-left">
        <p className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {price}
        </p>
        {note ? (
          <p className="mt-1 text-[13px] text-[var(--foreground-muted)]">
            {note}
          </p>
        ) : null}
      </div>
      <Link
        href="/download"
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--foreground)] px-5 py-2.5 text-[13px] font-semibold text-[var(--background)] transition-opacity hover:opacity-90"
      >
        <AppleIcon className="h-3.5 w-3.5" />
        Download for Mac
      </Link>
    </div>
  );
}
