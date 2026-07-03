"use client";

import { motion } from "framer-motion";

/** Early-access cohort: ~30 users × 150k words/mo × 3 months. */
const ACTIVE_USERS = 30;
const WORDS_PER_USER_PER_MONTH = 150_000;
const MONTHS_LIVE = 3;
const TOTAL_WORDS =
  ACTIVE_USERS * WORDS_PER_USER_PER_MONTH * MONTHS_LIVE;

function formatCompact(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M+`;
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)}K+`;
  return `${n}+`;
}

const METRICS = [
  {
    value: formatCompact(TOTAL_WORDS),
    label: "Words dictated",
  },
  {
    value: `${ACTIVE_USERS}+`,
    label: "Active professionals",
  },
] as const;

export function MetricsStrip() {
  return (
    <section className="relative -mt-[100px] px-6 pt-[140px] pb-14 md:pt-[160px] md:pb-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
          Trusted by professionals
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-10 md:gap-14">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="flex items-center gap-10 md:gap-14"
            >
              {i > 0 ? (
                <span
                  aria-hidden
                  className="hidden h-10 w-px bg-[var(--border-strong)] md:block"
                />
              ) : null}
              <div>
                <p className="font-display text-3xl font-semibold tabular-nums text-[var(--foreground)] md:text-4xl">
                  {m.value}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--foreground-faint)]">
                  {m.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-[12px] text-[var(--foreground-faint)]">
          Real usage from our early-access cohort — updated as we grow.
        </p>
      </div>
    </section>
  );
}
