"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LandingBand,
  LandingBandInner,
} from "@/components/landing/LandingBand";

const ASSURANCES = [
  {
    title: "On-device speech",
    detail: "Transcription runs locally on your Mac, not sent as audio.",
  },
  {
    title: "No voice storage",
    detail: "We don't keep recordings of what you say in the cloud.",
  },
  {
    title: "No training on your content",
    detail: "Your dictation isn't used to train generalized AI models.",
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
              Your voice stays on your Mac.
            </h2>
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
