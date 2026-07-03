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
        scale: pressed ? 0.96 : 1,
        y: pressed ? 2 : 0,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className={`relative flex items-center justify-center rounded-[10px] border font-mono font-semibold text-[var(--foreground)] ${
        wide ? "min-w-[6.75rem] px-4 py-3 text-[14px]" : "h-[3.25rem] w-[3.25rem] text-lg"
      } ${
        pressed
          ? "border-[var(--brand)] bg-[var(--brand-soft)] shadow-[inset_0_2px_5px_rgba(0,0,0,0.1)]"
          : "border-[var(--border-strong)] bg-white shadow-[0_2px_0_rgba(28,25,23,0.12),0_4px_12px_rgba(28,25,23,0.05)]"
      }`}
    >
      <AnimatePresence>
        {pressed ? (
          <motion.span
            key="ring"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 rounded-[10px] ring-2 ring-[var(--brand)]/80 ring-offset-1"
          />
        ) : null}
      </AnimatePresence>
      {label}
    </motion.div>
  );
}

type HotkeyPressDemoProps = {
  className?: string;
};

export function HotkeyPressDemo({ className = "" }: HotkeyPressDemoProps) {
  const [pressed, setPressed] = useState<PressState>({ ctrl: false, space: false });
  const holding = pressed.ctrl && pressed.space;

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
    <div className={`flex flex-col items-center ${className}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
        System-wide hotkey
      </p>

      <motion.p
        animate={{ opacity: pressed.ctrl || pressed.space ? 1 : 0.5 }}
        className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-ink)]"
      >
        {pressed.ctrl && pressed.space ? "Holding — speak now" : "Hold both keys to dictate"}
      </motion.p>

      <div className="mt-5 flex items-end justify-center gap-2">
        <div className="flex flex-col items-center gap-1.5">
          <KeyCap label="⌃" pressed={pressed.ctrl} />
          <span className="text-[10px] text-[var(--foreground-faint)]">control</span>
        </div>
        <span className="mb-7 text-[13px] text-[var(--foreground-faint)]">+</span>
        <div className="flex flex-col items-center gap-1.5">
          <KeyCap label="space" pressed={pressed.space} wide />
          <span className="text-[10px] text-[var(--foreground-faint)]">spacebar</span>
        </div>
      </div>

      <div className="mt-5 flex h-8 items-center justify-center">
        <motion.div
          animate={{ opacity: holding ? 1 : 0, y: holding ? 0 : 4 }}
          className="flex items-center gap-2 rounded-full border border-[var(--brand)]/20 bg-[var(--brand-soft)] px-3 py-1"
        >
          <motion.span
            animate={{ scale: holding ? [1, 1.2, 1] : 1 }}
            transition={{ repeat: holding ? Infinity : 0, duration: 1.2 }}
            className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]"
          />
          <span className="text-[10px] font-semibold text-[var(--brand-ink)]">
            Dictating in any app
          </span>
        </motion.div>
      </div>
    </div>
  );
}
