"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LandingBand,
  LandingBandInner,
} from "@/components/landing/LandingBand";

const ASSURANCES = [
  {
    title: "Your voice never leaves your computer",
    detail:
      "Speech becomes text on your own machine. No recording is ever uploaded.",
  },
  {
    title: "It looks once, when you ask",
    detail:
      "One look at your window the moment you speak. Used, then thrown away. It is never watching in the background.",
  },
  {
    title: "Nothing you write trains anything",
    detail: "Your work is never used to improve anyone's AI.",
  },
] as const;

export function PrivateSection() {
  return (
    <LandingBand id="privacy" variant="light" className="py-16 md:py-24">
      <LandingBandInner>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="grid gap-10 border-t border-[var(--border)] pt-12 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-16 md:pt-16"
        >
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-faint)]">
              Private by default
            </p>
            <h2 className="mt-3 max-w-sm font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.5rem]">
              Safe to use with real work.
            </h2>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-[var(--foreground-muted)]">
              What&apos;s on your screen is usually someone else&apos;s business
              too.
            </p>
          </div>

          <div>
            <ul>
              {ASSURANCES.map((item, i) => (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className="grid grid-cols-[auto_1fr] gap-x-4 border-b border-[var(--border)] py-5 first:pt-0 last:border-b-0 md:gap-x-5 md:py-6"
                >
                  <span className="pt-0.5 font-display text-[13px] tabular-nums text-[var(--foreground-faint)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[16px] font-semibold tracking-tight text-[var(--foreground)]">
                      {item.title}
                    </p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
                      {item.detail}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <p className="mt-2 md:mt-4">
              <Link
                href="/privacy"
                className="text-[13px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
              >
                Read the privacy policy →
              </Link>
            </p>
          </div>
        </motion.div>
      </LandingBandInner>
    </LandingBand>
  );
}
