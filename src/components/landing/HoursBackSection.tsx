"use client";

import { motion } from "framer-motion";
import {
  LandingBand,
  LandingBandInner,
} from "@/components/landing/LandingBand";

const WORDS_PER_WEEK = 15_000;
const TYPING_WPM = 40;
const VOICE_WPM = 230;

function hoursSavedPerWeek(words: number): number {
  return words / TYPING_WPM / 60 - words / VOICE_WPM / 60;
}

const WEEKLY_HOURS_SAVED = hoursSavedPerWeek(WORDS_PER_WEEK);
const HOURS_LABEL =
  WEEKLY_HOURS_SAVED >= 5 ? "5+" : `${Math.round(WEEKLY_HOURS_SAVED)}`;

export function HoursBackSection() {
  return (
    <LandingBand id="hours-back" variant="light" className="py-10 md:py-16">
      <LandingBandInner>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="aura-stage px-6 py-16 text-center md:px-12 md:py-24"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--foreground)]/45">
            · Your time, back ·
          </p>
          <h2 className="mt-4 font-display text-[2.15rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[3.25rem]">
            {HOURS_LABEL} hours every week.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[var(--foreground)]/65">
            Same emails, same docs, same prompts — spoken instead of typed.
          </p>
        </motion.div>
      </LandingBandInner>
    </LandingBand>
  );
}
