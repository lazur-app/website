"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "I dictate all my Slack messages now. What used to take two minutes of typing takes fifteen seconds of talking.",
    name: "Alex R.",
    role: "Product Manager",
  },
  {
    quote:
      "The code comment rewrites are eerily good. It knows when to be terse and when to add context.",
    name: "Jordan K.",
    role: "Software Engineer",
  },
  {
    quote:
      "Finally a dictation tool that doesn't feel like I'm editing a transcript. It just writes like I would.",
    name: "Sam T.",
    role: "Content Writer",
  },
];

export function Testimonials() {
  return (
    <section className="relative border-t border-[var(--border)] py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label mb-4">Early users</p>
          <h2 className="font-display text-balance text-[2rem] leading-[1.12] tracking-[-0.02em] text-[var(--foreground)] md:text-[3rem]">
            Loved by people who type all day
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="demo-surface flex flex-col p-6 md:p-7"
            >
              <p className="flex-1 text-[15px] leading-[1.7] text-[var(--foreground)]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-[var(--border)] pt-5">
                <p className="text-[14px] font-semibold text-[var(--foreground)]">
                  {t.name}
                </p>
                <p className="mt-0.5 text-[13px] text-[var(--foreground-muted)]">
                  {t.role}
                </p>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              stat: "4× faster",
              label: "From typing to talking",
              detail: "Dictate commit messages, PRs, and Slack updates without leaving your editor.",
            },
            {
              stat: "<200ms",
              label: "Streaming latency",
              detail: "Local Whisper STT on-device — cloud polish only when you want it.",
            },
            {
              stat: "One hotkey",
              label: "Everywhere you work",
              detail: "No plugins. Hold ⌃ Space, speak, release — text lands at your cursor.",
            },
          ].map((h, i) => (
            <motion.div
              key={h.stat}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] p-6 text-center md:text-left"
            >
              <p className="font-display text-2xl text-[var(--foreground)]">
                {h.stat}
              </p>
              <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
                {h.label}
              </p>
              <p className="mt-4 text-[14px] leading-[1.6] text-[var(--foreground-muted)]">
                {h.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
