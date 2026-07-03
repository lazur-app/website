"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SoftCard } from "@/components/SoftCard";

const LAZUR_VOICE_WPM = 230;
const WORK_DAYS_PER_WEEK = 5;

function formatHours(hours: number): string {
  if (hours >= 10) return hours.toFixed(1);
  return hours.toFixed(1);
}

function computeSavings(typingWpm: number, hoursPerDay: number) {
  const typingMinutesPerWeek = hoursPerDay * 60 * WORK_DAYS_PER_WEEK;
  const wordsPerWeek = typingWpm * typingMinutesPerWeek;
  const voiceHoursPerWeek = wordsPerWeek / LAZUR_VOICE_WPM / 60;
  const typingHoursPerWeek = hoursPerDay * WORK_DAYS_PER_WEEK;
  const weeklySaved = Math.max(0, typingHoursPerWeek - voiceHoursPerWeek);
  const speedRatio = LAZUR_VOICE_WPM / typingWpm;

  return {
    weeklySaved,
    monthlySaved: weeklySaved * 4,
    annualDays: (weeklySaved * 52) / 24,
    speedRatio,
    wordsPerWeek,
  };
}

export function PricingTimeCalculator({ className = "" }: { className?: string }) {
  const [typingWpm, setTypingWpm] = useState(65);
  const [hoursPerDay, setHoursPerDay] = useState(4);

  const stats = useMemo(
    () => computeSavings(typingWpm, hoursPerDay),
    [typingWpm, hoursPerDay],
  );

  return (
    <section className={`w-full ${className}`.trim()}>
      <div className="mb-8 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
          Time saved calculator
        </p>
        <h2 className="mt-2 font-display text-[1.5rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[2rem]">
          How much could you save with voice?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] text-[var(--foreground-muted)]">
          Compare your typing speed to Lazur at {LAZUR_VOICE_WPM} WPM.
        </p>
      </div>

      <SoftCard hover={false} className="overflow-hidden p-0">
        <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-8 border-b border-[var(--border)] p-6 md:border-b-0 md:border-r md:p-8">
            <div>
              <div className="mb-3 flex items-center justify-between gap-4">
                <label
                  htmlFor="typing-wpm"
                  className="text-[13px] font-medium text-[var(--foreground)]"
                >
                  Your typing speed
                </label>
                <span className="font-display text-2xl font-semibold tabular-nums text-[var(--foreground)]">
                  {typingWpm}{" "}
                  <span className="text-sm font-medium text-[var(--foreground-faint)]">
                    WPM
                  </span>
                </span>
              </div>
              <input
                id="typing-wpm"
                type="range"
                min={30}
                max={120}
                step={1}
                value={typingWpm}
                onChange={(e) => setTypingWpm(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer accent-[var(--foreground)]"
              />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-4">
                <label
                  htmlFor="hours-typing"
                  className="text-[13px] font-medium text-[var(--foreground)]"
                >
                  Hours typing per day
                </label>
                <span className="font-display text-2xl font-semibold tabular-nums text-[var(--foreground)]">
                  {hoursPerDay}{" "}
                  <span className="text-sm font-medium text-[var(--foreground-faint)]">
                    hrs
                  </span>
                </span>
              </div>
              <input
                id="hours-typing"
                type="range"
                min={1}
                max={8}
                step={0.5}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer accent-[var(--foreground)]"
              />
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--background-deep)]/50 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
                The benchmark
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--foreground-muted)]">
                Lazur at {LAZUR_VOICE_WPM} WPM is about{" "}
                <span className="font-semibold text-[var(--foreground)]">
                  {stats.speedRatio.toFixed(1)}× faster
                </span>{" "}
                than typing at {typingWpm} WPM.
              </p>
            </div>
          </div>

          <motion.div
            key={`${typingWpm}-${hoursPerDay}`}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col justify-center bg-[var(--background-deep)]/30 p-6 md:p-8"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
              Weekly hours saved
            </p>
            <p className="mt-2 font-display text-5xl font-semibold tabular-nums tracking-tight text-[var(--foreground)] md:text-6xl">
              {formatHours(stats.weeklySaved)}
            </p>
            <p className="mt-1 text-[12px] italic text-[var(--foreground-faint)]">
              Based on a {WORK_DAYS_PER_WEEK}-day work week
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
                  Monthly
                </p>
                <p className="mt-1 font-display text-xl font-semibold tabular-nums text-[var(--foreground)]">
                  {formatHours(stats.monthlySaved)} hrs
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
                  Annually
                </p>
                <p className="mt-1 font-display text-xl font-semibold tabular-nums text-[var(--foreground)]">
                  {formatHours(stats.annualDays)} days
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </SoftCard>
    </section>
  );
}
