"use client";

import { motion } from "framer-motion";
import { Mic, Wand2, ClipboardPaste } from "lucide-react";

const steps = [
  {
    icon: Mic,
    step: "01",
    title: "Hold & speak",
    description:
      "Press ⌃ Space anywhere on your Mac. Talk like you're explaining to a friend — messy is fine.",
    chip: "bg-[var(--brand)]",
  },
  {
    icon: Wand2,
    step: "02",
    title: "AI rewrites",
    description:
      "Magic Mode reads the context of your active app and transforms your ramble into the right format and tone.",
    chip: "bg-[var(--brand-hover)]",
  },
  {
    icon: ClipboardPaste,
    step: "03",
    title: "Release & paste",
    description:
      "Let go of the key. Polished text is pasted directly into your cursor — no copy-paste, no app switching.",
    chip: "bg-[var(--foreground)]",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[var(--surface)] py-28">
      <div className="pointer-events-none absolute inset-0 grain-light opacity-35" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[min(90%,520px)] -translate-x-1/2 rounded-full bg-[var(--brand-soft)] blur-[70px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-20 text-center">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--foreground-muted)]">
            How it works
          </p>
          <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-[2.35rem]">
            Three beats to your{" "}
            <span className="text-brand">superpower</span>
          </h2>
        </div>

        <div className="relative grid gap-10 md:grid-cols-3 md:gap-8">
          <div className="pointer-events-none absolute top-14 left-[16.67%] right-[16.67%] hidden h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent md:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative flex flex-col items-center text-center"
            >
              <div
                className={`relative mb-8 flex h-[3.85rem] w-[3.85rem] items-center justify-center rounded-[1.2rem] ${step.chip} text-white shadow-[0_16px_40px_rgba(20,18,15,0.12)]`}
                style={{ transform: `rotate(${i === 1 ? 1.5 : i === 2 ? -1.5 : 0}deg)` }}
              >
                <step.icon className="h-7 w-7" />
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] text-[10px] font-semibold text-[var(--brand)] shadow-sm">
                  {step.step}
                </span>
              </div>
              <h3 className="mb-3 font-display text-xl font-bold tracking-tight text-[var(--foreground)]">
                {step.title}
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-[var(--foreground-muted)]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
