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
  const fillPercent = Math.min(
    100,
    Math.round((WEEKLY_HOURS_SAVED / 40) * 100),
  );

  return (
    <LandingBand id="hours-back" variant="light" className="py-16 md:py-24">
      <LandingBandInner>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center lg:text-left"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
              Your time, back
            </p>
            <h2 className="mt-3 font-display text-[2rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[3rem]">
              {HOURS_LABEL} hours every week.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--foreground-muted)] lg:mx-0 mx-auto">
              Same emails, same docs, same prompts — spoken instead of typed.
              Roughly one full workday back each month.
            </p>
            <p className="mt-6 max-w-sm text-[12px] leading-relaxed text-[var(--foreground-faint)] lg:mx-0 mx-auto">
              Based on ~{WORDS_PER_WEEK.toLocaleString()} words a week — the
              kind of output heavy writers and builders produce daily.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.5 }}
            className="relative mx-auto flex h-56 w-56 items-center justify-center lg:ml-auto lg:mr-0 md:h-64 md:w-64"
            aria-hidden
          >
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="var(--border)"
                strokeWidth="5"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="var(--foreground)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${fillPercent * 2.64} 264`}
              />
            </svg>
            <div className="relative text-center">
              <p className="font-display text-5xl font-semibold tabular-nums text-[var(--foreground)] md:text-6xl">
                {HOURS_LABEL}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
                hrs / week
              </p>
            </div>
          </motion.div>
        </div>
      </LandingBandInner>
    </LandingBand>
  );
}
