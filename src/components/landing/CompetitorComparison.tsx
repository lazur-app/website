"use client";

import { motion, useInView } from "framer-motion";
import { Check, X } from "lucide-react";
import { useRef } from "react";
import { LogoWordmark } from "../LogoWordmark";
import { SoftCard } from "../SoftCard";

const COMPETITORS = [
  "Whisper Flow",
  "Super Whisper",
  "Willow Voice",
  "Apple Intelligence",
];

const ROWS = [
  {
    label: "Handles mid-sentence changes",
    lazur: "Adapts in real time — keep talking, it catches up",
    others: "Mostly locked after the first pass",
  },
  {
    label: "Understands names & context",
    lazur: "Personal dictionary + reads the app you're in",
    others: "Misspell names; limited field context",
  },
  {
    label: "Writing style",
    lazur: "Smart Rewrite — output sounds like you wrote it",
    others: "Reads like a transcript, not your voice",
  },
  {
    label: "Formatting & punctuation",
    lazur: "Lists, emails, and structure as you speak",
    others: "Raw speech — you fix commas and layout",
  },
  {
    label: "Tone awareness",
    lazur: "Reads what you meant for Slack, email, or code",
    others: "Same generic tone in every app",
  },
  {
    label: "Works in any app",
    lazur: "System-wide — polished text at your cursor",
    others: "Varies by tool; often one app or ecosystem",
  },
  {
    label: "Voice commands",
    lazur: "Command Mode — edit, rewrite, and act by voice",
    others: "Dictation only — no command layer",
  },
  {
    label: "Privacy & speed",
    lazur: "On-device Whisper STT; cloud polish when you need it",
    others: "Often cloud-only or transcript-only local",
  },
] as const;

export function CompetitorComparison() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="compare" ref={ref} className="relative w-full px-6 py-14 md:px-10 md:py-20 lg:px-14 xl:px-20">
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[min(520px,70vh)] -translate-y-1/2 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(107,75,252,0.08) 0%, rgba(168,85,247,0.04) 45%, transparent 72%)",
        }}
        aria-hidden
      />

      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-10 max-w-3xl text-center md:mb-12"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Why lazur
          </p>
          <h2 className="mx-auto mt-2 max-w-2xl font-display text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--foreground)] md:text-[2.5rem]">
            Not just transcription.
            <br />
            Writing that reads what you meant.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            Whisper Flow, Super Whisper, Willow, and Apple Intelligence get you
            words. Lazur gets you finished text — in the app you&apos;re already
            in.
          </p>
        </motion.div>

        {/* Desktop — full-width 3 columns */}
        <div className="hidden w-full lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-x-12 xl:gap-x-20 2xl:gap-x-28">
          {/* Column headers */}
          <div className="pb-5 pt-2 pl-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
              What matters
            </p>
          </div>
          <div className="pb-4 pt-1">
            <LogoWordmark height={28} href="" className="pointer-events-none" />
          </div>
          <div className="pb-5 pt-2 pr-2 xl:pr-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
              Traditional tools
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {COMPETITORS.map((name) => (
                <span
                  key={name}
                  className="rounded-md border border-[var(--border)] bg-white/80 px-2 py-0.5 text-[10px] font-medium text-[var(--foreground-muted)]"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Left — row labels */}
          <div className="flex flex-col pl-2 xl:pl-4">
            {ROWS.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  delay: 0.08 + i * 0.04,
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex min-h-[4rem] items-center border-t border-[var(--border)] py-4"
              >
                <span className="text-[14px] font-medium leading-snug text-[var(--foreground)]/85 md:text-[15px]">
                  {row.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Center — single lazur card */}
          <SoftCard
            hover={false}
            className="overflow-hidden px-6 py-2 shadow-[0_8px_40px_rgba(107,75,252,0.1)] md:px-8 lg:px-10"
          >
            {ROWS.map((row) => (
              <div
                key={row.label}
                className="flex min-h-[4rem] items-start gap-2.5 border-t border-[var(--border)] py-4 first:border-t-0"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
                <span className="text-[14px] leading-snug text-[var(--foreground)] md:text-[15px]">
                  {row.lazur}
                </span>
              </div>
            ))}
          </SoftCard>

          {/* Right — others */}
          <div className="flex flex-col pr-2 xl:pr-4">
            {ROWS.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: 10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  delay: 0.1 + i * 0.04,
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex min-h-[4rem] items-start gap-2.5 border-t border-[var(--border)] py-4"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--background-deep)] text-[var(--foreground-faint)]">
                  <X className="h-3 w-3" strokeWidth={2.5} />
                </span>
                <span className="text-[14px] leading-snug text-[var(--foreground-muted)] md:text-[15px]">
                  {row.others}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="space-y-4 lg:hidden">
          <SoftCard hover={false} className="p-5">
            <LogoWordmark height={26} href="" className="pointer-events-none" />
            <p className="mt-2 text-[13px] text-[var(--foreground-muted)]">
              What you meant — not just what you said.
            </p>
          </SoftCard>

          {ROWS.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.06 + i * 0.04, duration: 0.45 }}
              className="rounded-lg border border-[var(--border)] bg-white/90 p-4"
            >
              <p className="text-[13px] font-semibold text-[var(--foreground)]">
                {row.label}
              </p>
              <div className="mt-3 flex items-start gap-2">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]"
                  strokeWidth={2}
                />
                <p className="text-[13px] leading-snug text-[var(--foreground)]">
                  <span className="font-medium text-[var(--brand)]">lazur · </span>
                  {row.lazur}
                </p>
              </div>
              <div className="mt-2 flex items-start gap-2">
                <X
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--foreground-faint)]"
                  strokeWidth={2}
                />
                <p className="text-[13px] leading-snug text-[var(--foreground-muted)]">
                  {row.others}
                </p>
              </div>
            </motion.div>
          ))}

          <p className="text-center text-[11px] text-[var(--foreground-faint)]">
            vs. {COMPETITORS.join(" · ")}
          </p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center text-[12px] leading-relaxed text-[var(--foreground-faint)]"
        >
          Competitor capabilities vary by plan and platform. Lazur focuses on
          intent-aware rewrite, system-wide paste, and Command Mode — not raw
          transcription alone.
        </motion.p>
      </div>
    </section>
  );
}
