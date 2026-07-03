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
    <LandingBand id="privacy" variant="dark" className="py-16 md:py-24">
      <LandingBandInner>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center lg:text-left"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
              Private by default
            </p>
            <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-tight text-[var(--background)] md:text-[2.75rem]">
              Your voice stays on your Mac.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60 lg:mx-0 mx-auto">
              Speech-to-text runs on your device. Your voice isn&apos;t stored in
              the cloud — and we don&apos;t train generalized models on what you
              say.
            </p>
            <Link
              href="/privacy"
              className="mt-6 inline-block text-[13px] font-medium text-white/50 transition-colors hover:text-white/80"
            >
              Read the privacy policy →
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06, duration: 0.45 }}
            className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4"
          >
            {ASSURANCES.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-white/12 bg-white/5 px-4 py-4 md:px-5 md:py-5"
              >
                <p className="text-[14px] font-semibold text-white/90">
                  {item.title}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
                  {item.detail}
                </p>
              </li>
            ))}
          </motion.ul>
        </div>
      </LandingBandInner>
    </LandingBand>
  );
}
