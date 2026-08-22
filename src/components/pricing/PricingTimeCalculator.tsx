"use client";

import { useMemo, useState } from "react";

const LAZUR_VOICE_WPM = 230;
const WORK_DAYS_PER_WEEK = 5;

function formatHours(hours: number): string {
  return hours.toFixed(1);
}

function computeSavings(typingWpm: number, hoursPerDay: number) {
  const typingMinutesPerWeek = hoursPerDay * 60 * WORK_DAYS_PER_WEEK;
  const wordsPerWeek = typingWpm * typingMinutesPerWeek;
  const voiceHoursPerWeek = wordsPerWeek / LAZUR_VOICE_WPM / 60;
  const typingHoursPerWeek = hoursPerDay * WORK_DAYS_PER_WEEK;
  const weeklySaved = Math.max(0, typingHoursPerWeek - voiceHoursPerWeek);

  return {
    weeklySaved,
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
    <section className={`w-full max-w-md ${className}`.trim()}>
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
        Time saved
      </p>
      <p className="mt-3 text-center font-display text-[2.5rem] font-semibold tabular-nums tracking-tight text-[var(--foreground)]">
        {formatHours(stats.weeklySaved)}
        <span className="ml-2 text-[1rem] font-medium text-[var(--foreground-faint)]">
          hrs / week
        </span>
      </p>
      <p className="mt-1 text-center text-[13px] text-[var(--foreground-muted)]">
        {Math.round(stats.wordsPerWeek).toLocaleString()} words vs typing at{" "}
        {typingWpm} WPM
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <label htmlFor="typing-wpm" className="text-[13px] text-[var(--foreground-muted)]">
              Typing speed
            </label>
            <span className="text-[13px] tabular-nums text-[var(--foreground)]">
              {typingWpm} WPM
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
            className="h-1 w-full cursor-pointer accent-[var(--foreground)]"
          />
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <label htmlFor="hours-typing" className="text-[13px] text-[var(--foreground-muted)]">
              Hours typing / day
            </label>
            <span className="text-[13px] tabular-nums text-[var(--foreground)]">
              {hoursPerDay} hrs
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
            className="h-1 w-full cursor-pointer accent-[var(--foreground)]"
          />
        </div>
      </div>
    </section>
  );
}
