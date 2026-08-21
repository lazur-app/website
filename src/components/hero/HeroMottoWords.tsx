"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

const HIGHLIGHT_INDEX = 2;
const WORD_STAGGER = 0.1;
const BASE_DELAY = 0.15;

function wordDelay(index: number) {
  return BASE_DELAY + index * WORD_STAGGER;
}

/** Highlighted motto word — italic with a left-to-right marker stroke reveal. */
export function HeroVoiceWord({ children }: { children: ReactNode }) {
  const delay = wordDelay(HIGHLIGHT_INDEX);
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
      {children}
    </motion.span>
  );
}
