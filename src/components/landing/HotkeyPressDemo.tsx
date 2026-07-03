"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PressState = {
  ctrl: boolean;
  space: boolean;
};

const CYCLE: { state: PressState; holdMs: number }[] = [
  { state: { ctrl: false, space: false }, holdMs: 700 },
  { state: { ctrl: true, space: false }, holdMs: 450 },
  { state: { ctrl: true, space: true }, holdMs: 1400 },
  { state: { ctrl: false, space: false }, holdMs: 700 },
];

function KeyCap({
  label,
  pressed,
  wide,
}: {
  label: string;
  pressed: boolean;
  wide?: boolean;
}) {
  return (
    <motion.div
      animate={{
        scale: pressed ? 0.95 : 1,
        y: pressed ? 3 : 0,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className={`relative flex items-center justify-center rounded-xl border bg-white font-mono font-semibold text-[var(--foreground)] ${
        wide ? "min-w-[7.5rem] px-5 py-3.5 text-[15px]" : "h-14 w-14 text-xl"
      } ${
        pressed
          ? "border-[var(--brand)] bg-[var(--brand-soft)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.12)]"
          : "border-[var(--border-strong)] shadow-[0_3px_0_rgba(28,25,23,0.14),0_6px_16px_rgba(28,25,23,0.06)]"
      }`}
    >
      <AnimatePresence>
        {pressed ? (
          <motion.span
            key="ring"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[var(--brand)] ring-offset-2"
          />
        ) : null}
      </AnimatePresence>
      {label}
    </motion.div>
  );
}

export function HotkeyPressDemo() {
  const [pressed, setPressed] = useState<PressState>({ ctrl: false, space: false });
  const holding = pressed.ctrl || pressed.space;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPressed({ ctrl: true, space: true });
      return;
    }

    let step = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const { state, holdMs } = CYCLE[step]!;
      setPressed(state);
      step = (step + 1) % CYCLE.length;
      timeout = setTimeout(tick, holdMs);
    };

    tick();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 lg:items-end">
      <div className="flex items-center gap-2">
        <motion.span
          animate={{ opacity: holding ? 1 : 0.45 }}
          className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-ink)]"
        >
          {holding ? "Holding…" : "Hold to speak"}
        </motion.span>
      </div>

      <div className="flex items-end gap-2.5">
        <div className="flex flex-col items-center gap-2">
          <KeyCap label="⌃" pressed={pressed.ctrl} />
          <span className="text-[10px] font-medium text-[var(--foreground-faint)]">
            control
          </span>
        </div>

        <span className="mb-8 text-sm font-medium text-[var(--foreground-faint)]">
          +
        </span>

        <div className="flex flex-col items-center gap-2">
          <KeyCap label="space" pressed={pressed.space} wide />
          <span className="text-[10px] font-medium text-[var(--foreground-faint)]">
            spacebar
          </span>
        </div>
      </div>

      <motion.div
        animate={{ opacity: pressed.ctrl && pressed.space ? 1 : 0 }}
        className="flex items-center gap-2 rounded-full border border-[var(--brand)]/25 bg-[var(--brand-soft)] px-3 py-1.5"
      >
        <motion.span
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="h-2 w-2 rounded-full bg-[var(--brand)]"
        />
        <span className="text-[11px] font-semibold text-[var(--brand-ink)]">
          Dictating in any app
        </span>
      </motion.div>
    </div>
  );
}
