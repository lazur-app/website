"use client";

import { motion } from "framer-motion";

const WORD_INDEX = 2;
const WORD_DELAY = 0.2 + WORD_INDEX * 0.11;
const HIGHLIGHT_DELAY = WORD_DELAY + 0.5;

/** "optional" — italic word with a left-to-right marker stroke reveal. */
export function HeroOptionalWord() {
  return (
    <motion.span
      className="relative mr-[0.22em] inline-block italic"
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      transition={{
        delay: WORD_DELAY,
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
            delay: HIGHLIGHT_DELAY,
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

      optional
    </motion.span>
  );
}
