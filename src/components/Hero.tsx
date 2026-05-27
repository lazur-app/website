"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { VoiceMorph } from "./VoiceMorph";

const trust = [
  { label: "No setup" },
  { label: "Works everywhere" },
  { label: "Your data stays private" },
];

const apps = ["Slack", "Gmail", "Notion", "VS Code", "Cursor", "Discord"];

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-28 pb-20 md:pt-32 md:pb-28">
      {/* Ambient layers */}
      <div className="pointer-events-none absolute inset-0 grain" />
      <div
        className="ambient-blob pointer-events-none absolute -left-[10%] top-[5%] h-[50vh] w-[50vw] rounded-full bg-[#e8e0ff]"
        aria-hidden
      />
      <div
        className="ambient-blob pointer-events-none absolute -right-[5%] top-[20%] h-[45vh] w-[45vw] rounded-full bg-[#fde8d8]"
        aria-hidden
      />
      <div
        className="ambient-blob pointer-events-none absolute bottom-[10%] left-1/2 h-[40vh] w-[60vw] -translate-x-1/2 rounded-full bg-[#ede9fe]"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 inline-flex items-center gap-2 text-[12px] font-medium text-[var(--foreground-muted)]"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Early access for macOS
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-balance text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-6xl md:text-7xl lg:text-[5.25rem]"
        >
          Speak{" "}
          <span className="gradient-word">naturally.</span>
          <br />
          Write brilliantly.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.55 }}
          className="mt-8 max-w-md text-pretty text-base leading-relaxed text-[var(--foreground-muted)] md:max-w-lg md:text-[1.05rem] md:leading-[1.7]"
        >
          Your voice, upgraded. Lazur turns messy speech into polished writing,
          everywhere you type.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-5"
        >
          <Link
            href="#waitlist"
            className="btn-primary rounded-full px-8 py-3.5 text-sm font-semibold"
          >
            Join the waitlist
          </Link>
          <Link
            href="#transformation"
            className="btn-ghost flex items-center gap-2 text-sm font-semibold"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-strong)]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <path d="M2 1.5v7l6-3.5L2 1.5z" />
              </svg>
            </span>
            See it transform
          </Link>
        </motion.div>

        {/* Trust — text only, no boxes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-[var(--foreground-faint)]"
        >
          {trust.map((t, i) => (
            <span key={t.label} className="flex items-center gap-6">
              {i > 0 && (
                <span className="hidden h-3 w-px bg-[var(--border-strong)] sm:block" />
              )}
              {t.label}
            </span>
          ))}
        </motion.div>

        {/* Living hero visual */}
        <VoiceMorph />

        {/* App cloud — minimal, below fold of hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-20 w-full"
        >
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-faint)]">
            Works in the apps you already use
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {apps.map((app) => (
              <span
                key={app}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-solid)]/60 px-4 py-2 text-[13px] font-medium text-[var(--foreground-muted)] backdrop-blur-sm transition-colors hover:border-[var(--brand)]/30 hover:text-[var(--foreground)]"
              >
                {app}
              </span>
            ))}
            <span className="text-[13px] font-medium text-[var(--foreground-faint)]">
              + more
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
