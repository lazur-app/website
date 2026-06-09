"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const sampleText =
  "I'm getting started with the project. How would you like to set up the file? Here are a few options.";

const KEYBOARD_WPM = 45;
const LAZUR_WPM = 220;

function useTypingProgress(wpm: number, active: boolean) {
  const [chars, setChars] = useState(0);
  const msPerChar = 60000 / (wpm * 5);

  useEffect(() => {
    if (!active) return;
    setChars(0);
    const interval = setInterval(() => {
      setChars((c) => {
        if (c >= sampleText.length) {
          clearInterval(interval);
          return c;
        }
        return c + 1;
      });
    }, msPerChar);
    return () => clearInterval(interval);
  }, [active, msPerChar]);

  return sampleText.slice(0, chars);
}

export function SpeedComparison() {
  const [active, setActive] = useState(false);
  const keyboardText = useTypingProgress(KEYBOARD_WPM, active);
  const lazurText = useTypingProgress(LAZUR_WPM, active);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.3 },
    );
    const el = document.getElementById("speed");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="speed" className="relative py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label mb-4">Speed</p>
          <h2 className="font-display text-balance text-[2rem] leading-[1.12] tracking-[-0.02em] text-[var(--foreground)] md:text-[3rem]">
            4× faster than typing
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[16px] leading-[1.65] text-[var(--foreground-muted)]">
            Voice that finally works. Create, code, message, and write at the
            speed of thought — without breaking your flow.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="demo-surface flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-strong)] bg-[#f8f6f2] px-5 py-3">
              <span className="text-[13px] font-semibold text-[var(--foreground)]">
                Keyboard
              </span>
              <span className="font-mono text-[12px] text-[var(--foreground-muted)]">
                {KEYBOARD_WPM} wpm
              </span>
            </div>
            <div className="flex-1 p-5">
              <p className="font-mono text-[13px] leading-[1.75] text-[var(--foreground-muted)]">
                {keyboardText}
                <span className="ml-px inline-block h-[1em] w-px animate-pulse bg-[var(--foreground-faint)]" />
              </p>
            </div>
            <div className="border-t border-[var(--border)] px-5 py-3">
              <div className="h-1 overflow-hidden rounded-full bg-[var(--background-deep)]">
                <motion.div
                  className="h-full rounded-full bg-[var(--foreground-faint)]"
                  animate={{
                    width: `${(keyboardText.length / sampleText.length) * 100}%`,
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.4 }}
            className="demo-surface lazur-ring-accent flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-strong)] bg-[#f8f6f2] px-5 py-3">
              <span className="text-[13px] font-semibold text-[var(--brand-ink)]">
                Lazur
              </span>
              <span className="font-mono text-[12px] font-medium text-[var(--brand)]">
                {LAZUR_WPM} wpm
              </span>
            </div>
            <div className="flex-1 p-5">
              <p className="font-mono text-[13px] leading-[1.75] text-[var(--foreground)]">
                {lazurText}
                <span className="ml-px inline-block h-[1em] w-px animate-pulse bg-[var(--brand)]" />
              </p>
            </div>
            <div className="border-t border-[var(--border)] px-5 py-3">
              <div className="h-1 overflow-hidden rounded-full bg-[var(--brand-soft)]">
                <motion.div
                  className="h-full rounded-full bg-[var(--brand)]"
                  animate={{
                    width: `${(lazurText.length / sampleText.length) * 100}%`,
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
