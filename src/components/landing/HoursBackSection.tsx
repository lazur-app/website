"use client";

import { motion } from "framer-motion";
import {
  LandingBand,
  LandingBandInner,
} from "@/components/landing/LandingBand";

const MODES = [
  {
    label: "Get unstuck",
    detail:
      "Start with the rough version. Lazur helps turn it into something clear and ready to use.",
  },
  {
    label: "Stay in flow",
    detail:
      "Move from idea to reply to finished task without losing your train of thought.",
  },
] as const;

export function HoursBackSection() {
  return (
    <LandingBand id="hours-back" variant="light" className="py-16 md:py-24">
      <LandingBandInner>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="border-t border-[var(--border)] pt-12 md:pt-16"
        >
          <div className="flex flex-wrap items-end gap-x-4 gap-y-1 sm:gap-x-6">
            <p className="font-display text-[5.25rem] font-semibold leading-[0.78] tracking-tight text-[var(--foreground)] sm:text-[7rem] md:text-[8.5rem]">
              14+
            </p>
            <div className="pb-1.5 sm:pb-2.5">
              <p className="font-display text-[2.15rem] font-semibold leading-[0.9] tracking-tight text-[var(--foreground)] sm:text-[3.25rem] md:text-[4rem]">
                hours
              </p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-faint)]">
                Back every week
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-8 border-t border-[var(--border)] pt-10 md:mt-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-16 md:pt-12">
            <div className="max-w-xl">
              <h2 className="font-display text-[1.55rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2.15rem]">
                More time for the work that matters.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
                Lazur handles the small translations between what you mean and
                what needs to happen next.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {MODES.map((mode) => (
                <div key={mode.label}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
                    {mode.label}
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
                    {mode.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </LandingBandInner>
    </LandingBand>
  );
}
