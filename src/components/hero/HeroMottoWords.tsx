"use client";

import { motion } from "framer-motion";

const VOICE_INDEX = 2;
const PROMPTS_INDEX = 6;
const WORD_STAGGER = 0.1;
const BASE_DELAY = 0.15;

function wordDelay(index: number) {
  return BASE_DELAY + index * WORD_STAGGER;
}

/** "voice" — italic with a left-to-right marker stroke reveal. */
export function HeroVoiceWord() {
  const delay = wordDelay(VOICE_INDEX);
  const highlightDelay = delay + 0.5;

  return (
    <motion.span
      className="relative inline-block shrink-0 italic"
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      transition={{
        delay,
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-[0.12em] -right-[0.1em] bottom-[-0.02em] -z-10 h-[0.72em] overflow-hidden"
      >
        <motion.span
          className="absolute inset-0"
          initial={{ clipPath: "inset(0 100% 0 0 round 3px)" }}
          animate={{ clipPath: "inset(0 0% 0 0 round 3px)" }}
          transition={{
            delay: highlightDelay,
            duration: 0.72,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <svg
            viewBox="0 0 160 40"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <path
              d="M3 22 C 28 16, 48 26, 72 20 S 118 18, 157 22"
              fill="none"
              stroke="rgba(250, 204, 21, 0.52)"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </span>
      voice
    </motion.span>
  );
}

/** "prompts" — muted, soft strikethrough so the motto reads as a stance. */
export function HeroPromptsWord() {
  const delay = wordDelay(PROMPTS_INDEX);

  return (
    <motion.span
      className="relative inline-block shrink-0 text-[var(--foreground-muted)]"
      initial={{ y: 16, opacity: 0.55 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <span className="relative">
        prompts
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-[0.58em] h-[0.06em] origin-left rounded-full bg-[var(--foreground-faint)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            delay: delay + 0.55,
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </span>
    </motion.span>
  );
}
