"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

export function DownloadCTA() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 grain opacity-40" />
      <div
        className="ambient-blob pointer-events-none absolute right-[10%] top-1/2 h-[32vh] w-[40vw] -translate-y-1/2 rounded-full bg-[#e8e0ff]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-lg px-6 text-center">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
          Get started
        </p>
        <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
          Your voice, upgraded.
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--foreground-muted)]">
          Download for macOS. Hold a key, speak, release — polished text lands
          at your cursor. No credit card required.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <Link
            href="/download"
            className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold"
          >
            <Download className="h-4 w-4" />
            Download for Mac
          </Link>
          <Link
            href="/#refer"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
          >
            Refer a friend
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
