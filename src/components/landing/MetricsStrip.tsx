"use client";

import { motion } from "framer-motion";

const METRICS = [
  {
    value: "12.5M+",
    label: "Words dictated",
    note: "Replace with live analytics",
  },
  {
    value: "210+",
    label: "Professional users",
    note: "Stage 1 social proof",
  },
] as const;

export function MetricsStrip() {
  return (
    <section className="relative -mt-[100px] px-6 pt-[140px] pb-14 md:pt-[160px] md:pb-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
          Trusted by professionals
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-12 md:gap-16">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
            >
              <p className="font-display text-3xl font-semibold text-[var(--foreground)] md:text-4xl">
                {m.value}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--foreground-faint)]">
                {m.label}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-[12px] text-[var(--foreground-faint)]">
          Real usage metrics only — no fabricated testimonials.
        </p>
      </div>
    </section>
  );
}
