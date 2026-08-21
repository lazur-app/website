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
    detail: "Transcription runs locally on your Mac — not sent as audio.",
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
          className="mx-auto mb-12 max-w-2xl text-center md:mb-14"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-faint)]">
            · Private by default ·
          </p>
          <h2 className="mt-3 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.75rem]">
            Your voice stays on your Mac.
          </h2>
        </motion.div>

        <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
          {ASSURANCES.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="rounded-[1.5rem] bg-white px-6 py-7 shadow-[0_12px_40px_rgba(28,25,23,0.05)]"
            >
              <p className="text-[15px] font-semibold text-[var(--foreground)]">
                {item.title}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--foreground-muted)]">
                {item.detail}
              </p>
            </motion.li>
          ))}
        </ul>

        <p className="mt-8 text-center">
          <Link
            href="/privacy"
            className="text-[13px] font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
          >
            Read the privacy policy →
          </Link>
        </p>
      </LandingBandInner>
    </LandingBand>
  );
}
