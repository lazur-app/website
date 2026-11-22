"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * The 404 scene: a little Mac where Lazur goes looking for the page. The notch listens and
 * thinks, the blue sparkle searches the empty screen, then it shrugs.
 */

const INK = "#d6246e";
const EASE = [0.65, 0, 0.35, 1] as const;
const SPOTS: Array<[string, string]> = [["22%", "40%"], ["72%", "34%"], ["58%", "70%"], ["30%", "66%"], ["48%", "48%"]];

type Phase = "listening" | "thinking" | "searching" | "shrug";
const TIMELINE: Array<[Phase, number]> = [["listening", 1800], ["thinking", 1300], ["searching", 3600], ["shrug", 0]];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function Sparkle({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path d="M12 1.5 C12.6 7.4 16.6 11.4 22.5 12 C16.6 12.6 12.6 16.6 12 22.5 C11.4 16.6 7.4 12.6 1.5 12 C7.4 11.4 11.4 7.4 12 1.5 Z" fill={INK} stroke="#1c1917" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function NotFoundScene() {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const phase: Phase = reduced ? "shrug" : TIMELINE[step][0];

  useEffect(() => {
    if (reduced) return;
    const ms = TIMELINE[step][1];
    if (!ms) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), ms);
    return () => window.clearTimeout(t);
  }, [step, reduced]);

  const open = phase === "listening" || phase === "shrug";
  const label = phase === "listening" ? "Listening" : phase === "thinking" ? "Thinking" : phase === "searching" ? "Looking" : "Speaking";
  const line = phase === "listening" ? "“Open this page.”" : phase === "shrug" ? "I looked everywhere. It isn't here." : "";

  return (
    <div
      className="relative mx-auto aspect-[16/10] w-full max-w-xl overflow-hidden rounded-[28px] border-[1.5px] border-[#1c1917] bg-[#ece7ff] shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)]"
      role="img"
      aria-label="Lazur looked for this page and couldn't find it."
    >
      <div className="absolute inset-x-0 top-0 h-6 border-b-[1.5px] border-[#1c1917] bg-white" />

      {/* The notch */}
      <motion.div
        className="absolute left-1/2 top-0 z-20 -translate-x-1/2 overflow-hidden rounded-b-[16px] bg-[#1c1917] text-white"
        initial={false}
        animate={open ? { width: "68%", height: 58 } : { width: "46%", height: 30 }}
        transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={phase}
            className="px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.18 } }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
          >
            <div className="flex h-[30px] items-center justify-between text-[11.5px] font-medium text-white/65">
              {label}
              {phase === "thinking" || phase === "searching" ? (
                <motion.span className="block h-3 w-3 rounded-full border-[1.5px] border-white/25 border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
              ) : phase === "listening" ? (
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#e11d48]" />
              ) : null}
            </div>
            {line ? <p className="truncate pb-2 text-center text-[13px] font-medium">{line}</p> : null}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* An empty window: the page that isn't there */}
      <div className="absolute inset-x-[14%] bottom-[12%] top-[26%] rounded-[12px] border-[1.5px] border-[#1c1917] bg-white shadow-[0_2px_0_rgba(28,25,23,0.9)]">
        <div className="flex h-7 items-center gap-1.5 rounded-t-[10px] border-b-[1.5px] border-[#1c1917] bg-black/[0.05] px-3">
          {[0, 1, 2].map((c) => (
            <span key={c} className="h-2 w-2 rounded-full bg-[#1c1917]/55" />
          ))}
        </div>
        <div className="grid h-[calc(100%-1.75rem)] place-items-center">
          <span className="text-[clamp(3rem,10vw,5.5rem)] font-bold leading-none tracking-[-0.05em] text-black/[0.08]">404</span>
        </div>
      </div>

      {/* The sparkle searching */}
      <motion.div
        className="absolute z-10 -ml-[11px] -mt-[11px]"
        initial={{ left: "50%", top: "22%" }}
        animate={
          phase === "searching"
            ? { left: SPOTS.map((s) => s[0]), top: SPOTS.map((s) => s[1]) }
            : phase === "shrug"
              ? { left: "50%", top: "50%" }
              : { left: "50%", top: "22%" }
        }
        transition={phase === "searching" ? { duration: 3.4, ease: EASE } : { duration: 0.7, ease: EASE }}
      >
        <Sparkle />
      </motion.div>

      {/* A dashed loop around nothing, and a handwritten shrug */}
      <AnimatePresence>
        {phase === "shrug" ? (
          <>
            <svg key="loop" className="absolute left-1/2 top-1/2 z-[5] h-[34%] w-[34%] -translate-x-1/2 -translate-y-[38%] overflow-visible" viewBox="0 0 200 120" aria-hidden>
              <motion.ellipse
                cx="100" cy="60" rx="96" ry="56"
                fill="none" stroke={INK} strokeWidth="2.4" strokeDasharray="7 7" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
              />
            </svg>
            <motion.span
              key="note"
              className="absolute bottom-[3%] right-[4%] z-10 rounded-full border-[1.5px] border-[#1c1917] bg-white px-3 py-1 text-[clamp(0.75rem,2vw,0.9rem)] font-bold leading-none text-[#1c1917]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
            >
              nothing here ¯\_(ツ)_/¯
            </motion.span>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
