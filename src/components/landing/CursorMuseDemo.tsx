"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const APPS = [
  { name: "Slack", icon: "/slack-new-50.png" },
  { name: "Gmail", icon: "/gmail-50.png" },
  { name: "Notion", icon: "/notion.png" },
  { name: "Cursor", icon: "/cursor-ai-48.png" },
] as const;

const TYPING = "hey can you rev";
const MEANT = "Please review the deck before Tuesday's standup.";

const CHAR_MS = 72;
const STUTTER_MS = 850;
const SWEEP_MS = 900;
const REVEAL_MS = 400;

type Phase = "typing" | "stutter" | "sweep" | "meant";

function MuseCaret({ wild }: { wild: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="relative ml-px inline-block h-[1.15em] w-[2px] align-[-0.12em] bg-[var(--brand)]"
      animate={
        wild
          ? {
              x: [0, -3, 4, -2, 5, 0],
              scaleY: [1, 1.4, 0.6, 1.2, 0],
              opacity: [1, 1, 0.4, 1, 0],
            }
          : { opacity: [1, 0, 1] }
      }
      transition={
        wild
          ? { duration: 0.55, ease: "easeInOut" }
          : { duration: 0.85, repeat: Infinity, ease: "linear" }
      }
    />
  );
}

function WaveMonster() {
  const heights = [0.3, 0.7, 1, 0.55, 0.85, 0.45, 0.95, 0.6, 0.8, 0.5, 1, 0.65];

  return (
    <div className="flex h-full items-end justify-center gap-[2px] px-2">
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-[var(--brand)] to-[#a855f7]"
          animate={{ height: [6, h * 52, 8] }}
          transition={{
            duration: 0.35,
            repeat: Infinity,
            delay: i * 0.04,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function AppIconRow({ lit }: { lit: boolean }) {
  return (
    <ul className="flex flex-wrap items-center gap-2.5">
      {APPS.map((app, i) => (
        <motion.li
          key={app.name}
          initial={{ opacity: 0.3, scale: 0.92 }}
          animate={{
            opacity: lit ? 1 : 0.35,
            scale: lit ? 1.06 : 1,
            filter: lit ? "grayscale(0)" : "grayscale(1)",
          }}
          transition={{ delay: lit ? i * 0.06 : 0, duration: 0.35 }}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-white/95"
        >
          <Image
            src={app.icon}
            alt={app.name}
            width={16}
            height={16}
            className="h-4 w-4 object-contain"
          />
        </motion.li>
      ))}
    </ul>
  );
}

type CursorMuseDemoProps = {
  runKey: number;
};

/** Text caret gets devoured by a voice wave — then "what you meant" lands. */
export function CursorMuseDemo({ runKey }: CursorMuseDemoProps) {
  const [phase, setPhase] = useState<Phase>("typing");
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const runCycle = () => {
      if (cancelled) return;

      setPhase("typing");
      setCharCount(0);

      for (let i = 1; i <= TYPING.length; i++) {
        schedule(() => setCharCount(i), 350 + i * CHAR_MS);
      }

      const afterType = 350 + TYPING.length * CHAR_MS;
      schedule(() => setPhase("stutter"), afterType + STUTTER_MS);
      schedule(() => setPhase("sweep"), afterType + STUTTER_MS + 120);
      schedule(
        () => setPhase("meant"),
        afterType + STUTTER_MS + SWEEP_MS + REVEAL_MS,
      );
      schedule(
        runCycle,
        afterType + STUTTER_MS + SWEEP_MS + REVEAL_MS + 2600,
      );
    };

    runCycle();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [runKey]);

  const showCaret = phase === "typing" || phase === "stutter";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--brand)]">
        Fast · reads what you meant
      </p>

      <motion.div
        animate={
          phase === "sweep"
            ? { x: [0, -2, 2, -1, 0], scale: [1, 1.01, 0.995, 1] }
            : { x: 0, scale: 1 }
        }
        transition={{ duration: 0.45 }}
        className="relative mt-5 overflow-hidden rounded-lg border border-[var(--border-strong)] bg-white shadow-sm"
      >
        <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[#f8f6f2] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          <span className="ml-1 font-mono text-[10px] text-[var(--foreground-faint)]">
            draft.txt
          </span>
        </div>

        <div className="relative min-h-[88px] px-4 py-4 font-mono text-[13px] leading-relaxed">
          <AnimatePresence mode="wait">
            {phase === "meant" ? (
              <motion.p
                key="meant"
                initial={{ opacity: 0, filter: "blur(8px)", y: 6 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-[var(--foreground)]"
              >
                {MEANT}
              </motion.p>
            ) : (
              <motion.p
                key="typing"
                className="text-[var(--foreground-muted)]"
                animate={
                  phase === "stutter"
                    ? { opacity: [1, 0.5, 1, 0.65, 1] }
                    : { opacity: 1 }
                }
                transition={{ duration: 0.4 }}
              >
                {TYPING.slice(0, charCount)}
                {showCaret && <MuseCaret wild={phase === "stutter"} />}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === "sweep" && (
              <motion.div
                initial={{ x: "-110%" }}
                animate={{ x: "110%" }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: SWEEP_MS / 1000,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-y-0 left-0 z-20 flex w-[45%] items-center bg-gradient-to-r from-[var(--brand)]/90 via-[#a855f7]/85 to-transparent shadow-[8px_0_32px_rgba(107,75,252,0.35)]"
              >
                <WaveMonster />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === "sweep" &&
              ["|", "c", "u", "r", "s", "o", "r", "⌁"].map((ch, i) => (
                <motion.span
                  key={ch + i}
                  initial={{ opacity: 1, x: 40 + i * 8, y: 20, scale: 1 }}
                  animate={{
                    opacity: 0,
                    x: 40 + i * 8 + (i % 2 === 0 ? 28 : -24),
                    y: 20 + (i % 3) * 12 - 8,
                    scale: 0,
                    rotate: (i - 4) * 18,
                  }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.03 }}
                  className="pointer-events-none absolute z-30 font-mono text-[10px] font-bold text-[var(--brand)]"
                >
                  {ch}
                </motion.span>
              ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        animate={{ opacity: phase === "meant" ? 1 : 0.55 }}
        className="mt-4 flex items-center justify-between gap-3"
      >
        <span
          className={`text-[11px] font-medium ${
            phase === "meant"
              ? "text-[var(--brand)]"
              : "text-[var(--foreground-faint)]"
          }`}
        >
          {phase === "meant" ? "What you meant" : "What you said"}
        </span>
        <AppIconRow lit={phase === "meant"} />
      </motion.div>

      <p className="mt-auto pt-4 text-[11px] text-[var(--foreground-muted)]">
        {phase === "meant"
          ? "One pass of speech → polished text everywhere"
          : "The cursor stutters… then voice takes over"}
      </p>
    </motion.div>
  );
}
