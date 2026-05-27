"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cycles = [
  {
    raw: "hey can you maybe send the report when you get a chance",
    polished: "Could you send the report by EOD? Thank you.",
    contextLabel: "Gmail draft",
    contextDetail: "you@company.com",
  },
  {
    raw: "um so like I think we should push the meeting to tuesday",
    polished: "I suggest we reschedule to Tuesday — does that work for everyone?",
    contextLabel: "#product",
    contextDetail: "@yourname · Slack",
  },
  {
    raw: "the save button just doesn't save anything it's so annoying",
    polished: "Bug: Save action does not persist changes after editing.",
    contextLabel: "Linear",
    contextDetail: "Issue LAZ-842",
  },
];

type Phase = "listening" | "morphing" | "done";

export function VoiceMorph() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("listening");

  useEffect(() => {
    const tick = setInterval(() => {
      setPhase("listening");
      setTimeout(() => setPhase("morphing"), 2200);
      setTimeout(() => setPhase("done"), 3200);
      setTimeout(() => setIndex((i) => (i + 1) % cycles.length), 5200);
    }, 5400);
    return () => clearInterval(tick);
  }, []);

  const cycle = cycles[index];
  const bars = [0.35, 0.7, 1, 0.55, 0.85, 0.45, 0.95, 0.6, 0.4, 0.75];

  return (
    <div className="relative isolate mx-auto mt-16 w-full max-w-xl md:mt-20">
      {/* Soft glow — masked so top/bottom fade into page (no hard lines) */}
      <div
        className="pointer-events-none absolute left-1/2 top-[45%] h-[min(420px,55vh)] w-[min(120%,54rem)] -translate-x-1/2 -translate-y-1/2 voice-morph-aura-mask"
        aria-hidden
      >
        <div className="voice-morph-aura-fill animate-morph-glow absolute inset-0" />
      </div>

      <div className="glass relative overflow-hidden rounded-2xl px-6 py-7 md:px-8 md:py-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${
                phase === "listening"
                  ? "bg-[var(--brand)]"
                  : phase === "morphing"
                    ? "bg-[var(--brand)]/80"
                    : "bg-emerald-600"
              }`}
            >
              <div className="flex h-4 items-end gap-[2px]">
                {bars.slice(0, 5).map((h, i) => (
                  <div
                    key={i}
                    className={`w-[2px] origin-bottom rounded-full bg-white ${
                      phase === "listening" ? "wave-bar" : ""
                    }`}
                    style={{
                      height: `${h * 100}%`,
                      animationDelay: `${i * 0.07}s`,
                      opacity: phase === "done" ? 0.5 : 1,
                    }}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs font-medium text-[var(--foreground-faint)]">
              {phase === "listening"
                ? "Listening…"
                : phase === "morphing"
                  ? "Rewriting…"
                  : "Ready to paste"}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${cycle.contextLabel}-${index}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="min-w-0 text-right"
            >
              <p className="text-[11px] font-semibold text-[var(--foreground-muted)]">
                {cycle.contextLabel}
              </p>
              <p className="max-w-[11rem] truncate text-[10px] text-[var(--foreground-faint)]">
                {cycle.contextDetail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="min-h-[4.5rem]">
          <AnimatePresence mode="wait">
            {phase !== "done" ? (
              <motion.p
                key={`raw-${index}-${phase}`}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{
                  opacity: phase === "morphing" ? 0.25 : 0.55,
                  filter: "blur(0px)",
                }}
                exit={{ opacity: 0, filter: "blur(6px)", y: -8 }}
                transition={{ duration: 0.45 }}
                className="font-display text-lg font-medium leading-snug text-[var(--foreground-muted)] md:text-xl"
              >
                &ldquo;{cycle.raw}&rdquo;
              </motion.p>
            ) : (
              <motion.p
                key={`polished-${index}`}
                initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-lg font-semibold leading-snug text-[var(--foreground)] md:text-xl"
              >
                {cycle.polished}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-4 text-center text-[12px] leading-relaxed text-[var(--foreground-faint)]">
        Default shortcut is{" "}
        <kbd className="rounded-md border border-[var(--border)] bg-[var(--surface-solid)]/80 px-1.5 py-0.5 font-mono text-[11px] text-[var(--foreground-muted)]">
          ⌃ Space
        </kbd>{" "}
        — remap to whatever fits your flow in Settings.
      </p>
    </div>
  );
}
