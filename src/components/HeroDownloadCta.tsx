"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { detectPlatform, type Platform } from "@/lib/platform";

export function HeroDownloadCta() {
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  if (platform === "windows") {
    return (
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)]/80 px-5 py-3 text-center backdrop-blur-sm">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Coming to Windows soon
          </p>
          <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
            macOS is available now
          </p>
        </div>
        <Link
          href="#refer"
          className="btn-primary rounded-full px-8 py-3.5 text-sm font-semibold"
        >
          Refer a friend · join waitlist
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
      <Link
        href="/download"
        className="btn-primary inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold"
      >
        <Download className="h-4 w-4" />
        Download
      </Link>
      <Link
        href="#refer"
        className="btn-ghost text-sm font-semibold"
      >
        Refer a friend
      </Link>
    </div>
  );
}
