"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const contexts = [
  {
    label: "Slack tone",
    raw: "yeah so basically the deploy failed again lol",
    out: "Heads up — the deploy failed again. Investigating now.",
  },
  {
    label: "Email tone",
    raw: "sorry for bothering you but do you have time for a quick call",
    out: "Would you have time for a brief call this week? Happy to work around your schedule.",
  },
  {
    label: "Code comment",
    raw: "this function is kinda broken when input is empty",
    out: "Returns undefined when input is empty — needs a guard clause.",
  },
];

export function ProductDemo() {
  const [active, setActive] = useState(0);
  const [showPolished, setShowPolished] = useState(false);

  useEffect(() => {
    const loop = setInterval(() => {
      setShowPolished(false);
      setTimeout(() => setShowPolished(true), 1800);
      setTimeout(() => setActive((a) => (a + 1) % contexts.length), 4000);
    }, 4200);
    return () => clearInterval(loop);
  }, []);

  const ctx = contexts[active];

  return (
    <section id="transformation" className="relative py-32 md:py-40">
      <div className="pointer-events-none absolute inset-0 grain" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--foreground-faint)]">
          Live transformation
        </p>
        <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl">
          Speech that writes{" "}
          <span className="gradient-word">like you.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-pretty text-base text-[var(--foreground-muted)]">
          Not a transcript. Lazur reads the room — Slack, email, docs — and
          delivers text you&apos;d actually send.
        </p>

        {/* Context tabs — pills, not cards */}
        <div className="mt-12 flex justify-center gap-2">
          {contexts.map((c, i) => (
            <button
              key={c.label}
              type="button"
              onClick={() => {
                setActive(i);
                setShowPolished(false);
              }}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
                i === active
                  ? "bg-[var(--foreground)] text-white"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Floating transform layer */}
        <div className="relative mx-auto mt-10 max-w-xl">
          <div
            className="voice-morph-aura-mask pointer-events-none absolute left-1/2 top-[45%] h-[min(280px,50vh)] w-[min(130%,52rem)] -translate-x-1/2 -translate-y-1/2 opacity-70"
            aria-hidden
          >
            <div className="voice-morph-aura-fill absolute inset-0" />
          </div>
          <div className="glass relative rounded-2xl px-8 py-10 text-left md:px-10 md:py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${active}-${showPolished}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                {!showPolished ? (
                  <p className="text-lg leading-relaxed text-[var(--foreground-faint)] md:text-xl">
                    &ldquo;{ctx.raw}&rdquo;
                  </p>
                ) : (
                  <p className="font-display text-lg font-semibold leading-relaxed text-[var(--foreground)] md:text-xl">
                    {ctx.out}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center gap-3 border-t border-[var(--border)] pt-6">
              <div className="flex h-5 items-end gap-[2px]">
                {[0.4, 0.75, 0.55, 1, 0.45, 0.8].map((h, i) => (
                  <div
                    key={i}
                    className="wave-bar w-[2px] origin-bottom rounded-full bg-[var(--brand)]"
                    style={{ height: `${h * 100}%`, animationDelay: `${i * 0.08}s` }}
                  />
                ))}
              </div>
              <span className="text-xs text-[var(--foreground-faint)]">
                {showPolished
                  ? "Pasted to cursor"
                  : "Hold ⌃ Space (customizable)"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
