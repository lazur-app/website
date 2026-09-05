"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LogoWordmark } from "../LogoWordmark";
import { SoftCard } from "../SoftCard";

const COMPETITORS = [
  "Wispr Flow",
  "Superwhisper",
  "Willow Voice",
  "Apple Dictation",
];

const DICTATION_STEPS = [
  "Read the thread again",
  "Work out what you want to say",
  "Dictate the whole reply, sentence by sentence",
  "Fix the tone so it stops reading like speech",
  "Fix the bullets and the line breaks",
  "Send",
] as const;

const LAZUR_STEPS = [
  "\u201creply, Thursday works, ask for the deck first\u201d",
  "Send",
] as const;

function StepList({
  steps,
  tone,
}: {
  steps: readonly string[];
  tone: "muted" | "strong";
}) {
  return (
    <ol className="mt-5 space-y-0">
      {steps.map((step, i) => (
        <li
          key={step}
          className="flex items-start gap-3 border-t border-[var(--border)] py-3 first:border-t-0 first:pt-0"
        >
          <span className="mt-[2px] w-4 shrink-0 font-display text-[12px] tabular-nums text-[var(--foreground-faint)]">
            {i + 1}
          </span>
          <span
            className={`text-[14px] leading-snug md:text-[15px] ${
              tone === "strong"
                ? "text-[var(--foreground)]"
                : "text-[var(--foreground-muted)]"
            }`}
          >
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function CompetitorComparison() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      id="compare"
      ref={ref}
      className="relative w-full px-6 py-14 md:px-10 md:py-20 lg:px-14 xl:px-20"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[min(520px,70vh)] -translate-y-1/2 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(107,75,252,0.08) 0%, rgba(168,85,247,0.04) 45%, transparent 72%)",
        }}
        aria-hidden
      />

      <div className="mx-auto w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-10 max-w-2xl text-center md:mb-12"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Why lazur
          </p>
          <h2 className="mx-auto mt-2 font-display text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--foreground)] md:text-[2.5rem]">
            The difference shows up after it types.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            Every voice tool gets words onto the screen. The only question that
            matters is how much work is left when it&apos;s done.
          </p>
        </motion.div>

        <p className="mb-5 text-center text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
          Replying to one client email
        </p>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[14px] border border-[var(--border)] bg-white/60 p-6 md:p-7"
          >
            <p className="text-[13px] font-semibold tracking-tight text-[var(--foreground-muted)]">
              With a dictation app
            </p>
            <StepList steps={DICTATION_STEPS} tone="muted" />
            <p className="mt-5 border-t border-[var(--border)] pt-4 text-[14px] font-medium text-[var(--foreground-muted)]">
              Six steps. Five of them yours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <SoftCard
              hover={false}
              className="h-full p-6 shadow-[0_8px_40px_rgba(107,75,252,0.1)] md:p-7"
            >
              <LogoWordmark
                height={24}
                href=""
                className="pointer-events-none"
              />
              <StepList steps={LAZUR_STEPS} tone="strong" />
              <p className="mt-5 border-t border-[var(--border)] pt-4 text-[14px] font-medium text-[var(--foreground)]">
                Two steps. One of them is Send.
              </p>
            </SoftCard>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-8 text-center text-[12px] leading-relaxed text-[var(--foreground-faint)]"
        >
          Compared with {COMPETITORS.join(", ")}. Capabilities vary by plan and
          platform, and every one of them is good at getting words down. Lazur
          is built for what happens after.
        </motion.p>
      </div>
    </section>
  );
}
