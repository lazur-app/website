"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { CursorMuseDemo } from "./CursorMuseDemo";
import { SoftCard } from "../SoftCard";

const APPS = [
  { name: "Slack", icon: "/slack-new-50.png" },
  { name: "Gmail", icon: "/gmail-50.png" },
  { name: "Notion", icon: "/notion.png" },
  { name: "Cursor", icon: "/cursor-ai-48.png" },
] as const;

const KEYBOARD_STEPS = [
  "Open the app",
  "Type it out",
  "Switch apps",
  "Type it again",
];

type Mode = "keyboard" | "voice";

function AppIconRow({
  activeIndex,
  allActive = false,
}: {
  activeIndex?: number;
  allActive?: boolean;
}) {
  return (
    <ul className="flex flex-wrap items-center gap-3">
      {APPS.map((app, i) => {
        const lit = allActive || activeIndex === i;
        return (
          <motion.li
            key={app.name}
            animate={{
              opacity: lit ? 1 : 0.35,
              scale: lit ? 1.05 : 1,
              filter: lit ? "grayscale(0)" : "grayscale(1)",
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-white/90"
          >
            <Image
              src={app.icon}
              alt={app.name}
              width={18}
              height={18}
              className="h-[18px] w-[18px] object-contain"
            />
          </motion.li>
        );
      })}
    </ul>
  );
}

function KeyboardDemo({ runKey }: { runKey: number }) {
  const [step, setStep] = useState(0);
  const barWidths = [0.55, 0.42, 0.48, 0.36];

  useEffect(() => {
    setStep(0);
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 1400);
    return () => window.clearInterval(id);
  }, [runKey]);

  return (
    <motion.div
      key={`kb-${runKey}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
        Slow · manual · repeated
      </p>

      <div className="mt-5">
        <AppIconRow activeIndex={step} />
      </div>

      <motion.p
        key={step}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-[13px] text-[var(--foreground-muted)]"
      >
        <span className="mr-2 font-semibold text-[var(--foreground-faint)]">
          {step + 1}.
        </span>
        {KEYBOARD_STEPS[step]}
        <span className="text-[var(--foreground-faint)]"> — {APPS[step].name}</span>
      </motion.p>

      <div className="mt-6 flex-1 rounded-lg bg-[var(--background-deep)]/55 p-4">
        <div className="space-y-2">
          {barWidths.slice(0, step + 1).map((w, i) => (
            <motion.div
              key={`${runKey}-${i}`}
              initial={{ scaleX: 0, opacity: 0.4 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="h-2 origin-left rounded-full bg-[var(--foreground-faint)]/55"
              style={{ width: `${w * 100}%` }}
            />
          ))}
        </div>
        <p className="mt-4 text-[11px] text-[var(--foreground-faint)]">
          Same thought, typed four separate times
        </p>
      </div>
    </motion.div>
  );
}

export function TypingTaxSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [mode, setMode] = useState<Mode>("keyboard");
  const [runKey, setRunKey] = useState({ keyboard: 0, voice: 0 });

  const selectMode = (next: Mode) => {
    setMode(next);
    setRunKey((k) => ({ ...k, [next]: k[next] + 1 }));
  };

  return (
    <section id="voice-era" ref={ref} className="landing-section landing-section--speech px-6 py-6 md:py-8">
      <div className="mx-auto max-w-5xl">
        <SoftCard hover={false} className="px-8 py-10 md:px-12 md:py-14 lg:px-14 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center md:mb-12"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Outdated default
          </p>
          <h2 className="mx-auto mt-2 max-w-2xl font-display text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--foreground)] md:text-[2.75rem]">
            You think in speech.
            <br />
            Apps still ask you to type.
          </h2>
          
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-stretch lg:gap-14"
        >
          {/* Left — hover labels */}
          <div className="flex flex-col justify-center gap-1 md:gap-2">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-faint)] md:mb-4">
              Hover to compare
            </p>
            <button
              type="button"
              onMouseEnter={() => selectMode("keyboard")}
              onFocus={() => selectMode("keyboard")}
              onClick={() => selectMode("keyboard")}
              className={`text-left font-display text-[2.5rem] font-semibold leading-none tracking-[-0.03em] transition-colors duration-300 sm:text-[3rem] md:text-[3.25rem] ${
                mode === "keyboard"
                  ? "text-[var(--foreground-muted)]"
                  : "text-[var(--foreground-faint)]/70 hover:text-[var(--foreground-faint)]"
              }`}
            >
              Keyboard
            </button>
            <button
              type="button"
              onMouseEnter={() => selectMode("voice")}
              onFocus={() => selectMode("voice")}
              onClick={() => selectMode("voice")}
              className={`text-left font-display text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] transition-colors duration-300 sm:text-[3rem] md:text-[3.25rem] ${
                mode === "voice"
                  ? "text-[var(--foreground)]"
                  : "text-[var(--foreground-faint)]/70 hover:text-[var(--foreground-faint)]"
              }`}
            >
              Voice{" "}
              <span
                className={
                  mode === "voice"
                    ? "text-[var(--brand)]"
                    : "text-[var(--brand)]/45"
                }
              >
                with lazur
              </span>
            </button>
          </div>

          {/* Right — animated explainer */}
          <div className="relative min-h-[380px] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-solid)]/90 p-6 shadow-[0_4px_24px_rgba(28,25,23,0.04)] md:min-h-[400px] md:p-8">
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40 blur-3xl"
              style={{
                background:
                  mode === "voice"
                    ? "radial-gradient(circle, rgba(107,75,252,0.35), transparent 70%)"
                    : "radial-gradient(circle, rgba(168,162,158,0.25), transparent 70%)",
              }}
              aria-hidden
            />
            <AnimatePresence mode="wait">
              {mode === "keyboard" ? (
                <KeyboardDemo key="panel-kb" runKey={runKey.keyboard} />
              ) : (
                <CursorMuseDemo key="panel-voice" runKey={runKey.voice} />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-10 text-center text-[14px] font-medium text-[var(--foreground)]/70"
        >
          The keyboard isn&apos;t wrong — it&apos;s just outdated for how you work
          today.
        </motion.p>
        </SoftCard>
      </div>
    </section>
  );
}
