"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const demos = [
  {
    raw: `Umm, hope your week has started well… I was talking to Cheyene earlier but reception was really bad and I think their going to handle the first part of the project, but I'm not totally sure. Also, I told the team the the new timeline should be ready by Friday, although it's probably going to slip.`,
    polished: `Hope your week is off to a good start. I was talking to Cheyene earlier, but the reception was really bad. I think they're going to handle the first part of the project, but I'm not totally sure. I also told the team the new timeline should be ready by Friday — although it might slip.`,
  },
  {
    raw: `hey so um I need to follow up on the thing from yesterday's meeting like can someone send the notes or are we still waiting on that`,
    polished: `Quick follow-up from yesterday's meeting — could someone confirm whether the notes were sent out, or if we're still waiting on them?`,
  },
];

const CYCLE_MS = 7000;

export function HeroSpeechDemo() {
  const [index, setIndex] = useState(0);
  const [showPolished, setShowPolished] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const run = (i: number) => {
      setIndex(i);
      setShowPolished(false);
      timers.push(setTimeout(() => setShowPolished(true), 2400));
      timers.push(
        setTimeout(() => run((i + 1) % demos.length), CYCLE_MS),
      );
    };

    run(0);
    return () => timers.forEach(clearTimeout);
  }, []);

  const demo = demos[index];

  return (
    <div className="demo-surface mx-auto max-w-3xl overflow-hidden text-left">
      <div className="flex items-center justify-between border-b border-[var(--border-strong)] bg-[#f8f6f2] px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[12px] font-medium text-[var(--foreground-muted)]">
            Live dictation
          </span>
        </div>
        <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-ink)]">
          {showPolished ? "Polished" : "Listening"}
        </span>
      </div>

      <div className="grid gap-0 md:grid-cols-[1fr_auto_1fr]">
        <div className="border-b border-[var(--border)] p-5 sm:p-6 md:border-b-0 md:border-r">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
            You speak
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={`raw-${index}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="text-[14px] italic leading-[1.7] text-[var(--brand-ink)] sm:text-[15px]"
            >
              {demo.raw}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="hidden items-center justify-center px-3 md:flex">
          <motion.div
            animate={{ x: showPolished ? [0, 4, 0] : 0 }}
            transition={{ duration: 0.6, repeat: showPolished ? Infinity : 0, repeatDelay: 1.2 }}
          >
            <ArrowRight className="h-4 w-4 text-[var(--foreground-faint)]" />
          </motion.div>
        </div>

        <div className="p-5 sm:p-6">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
            Lazur writes
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={`polished-${index}-${showPolished}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: showPolished ? 1 : 0.35, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className={`text-[14px] leading-[1.7] sm:text-[15px] ${
                showPolished
                  ? "font-medium text-[var(--foreground)]"
                  : "text-[var(--foreground-faint)]"
              }`}
            >
              {showPolished
                ? demo.polished
                : "Polishing your words…"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-[var(--border)] bg-[#faf9f7] px-5 py-3">
        <div className="flex h-4 items-end gap-[2px]">
          {[0.35, 0.7, 0.5, 1, 0.4, 0.85, 0.55].map((h, i) => (
            <div
              key={i}
              className="wave-bar w-[2px] origin-bottom rounded-full bg-[var(--brand)]"
              style={{ height: `${h * 100}%`, animationDelay: `${i * 0.07}s` }}
            />
          ))}
        </div>
        <span className="text-[11px] text-[var(--foreground-muted)]">
          Hold ⌃ Space anywhere — release to paste
        </span>
      </div>
    </div>
  );
}
