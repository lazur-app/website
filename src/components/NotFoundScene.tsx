"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * The 404 scene: a little Mac where Lazur goes looking for the page. The notch listens and
 * thinks, the blue sparkle searches the empty screen, then it shrugs.
 */

const INK = "#2563eb";
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
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ filter: "drop-shadow(0 0 8px rgba(37,99,235,0.55))" }} aria-hidden>
      <path d="M12 1.5 C12.6 7.4 16.6 11.4 22.5 12 C16.6 12.6 12.6 16.6 12 22.5 C11.4 16.6 7.4 12.6 1.5 12 C7.4 11.4 11.4 7.4 12 1.5 Z" fill={INK} />
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
      className="relative mx-auto aspect-[16/10] w-full max-w-xl overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(28,25,23,0.16)] ring-1 ring-black/10"
      style={{ background: "linear-gradient(135deg, #c9b8ff 0%, #f3c4dd 45%, #ffd2a8 100%)" }}
      role="img"
      aria-label="Lazur looked for this page and couldn't find it."
    >
      <div className="absolute inset-x-0 top-0 h-6 bg-white/45" />

      {/* The notch */}
      <motion.div
        className="absolute left-1/2 top-0 z-20 -translate-x-1/2 overflow-hidden rounded-b-[16px] bg-[#3a3a3c] text-white shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
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
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ef5350]" />
              ) : null}
            </div>
            {line ? <p className="truncate pb-2 text-center text-[13px] font-medium">{line}</p> : null}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* An empty window: the page that isn't there */}
      <div className="absolute inset-x-[14%] bottom-[12%] top-[26%] rounded-xl bg-white/80 shadow-[0_14px_30px_rgba(28,25,23,0.12)] ring-1 ring-black/5">
        <div className="flex h-7 items-center gap-1.5 border-b border-black/5 px-3">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} className="h-2 w-2 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div className="grid h-[calc(100%-1.75rem)] place-items-center">
          <span className="font-display text-[clamp(3rem,10vw,5.5rem)] font-semibold leading-none tracking-[-0.05em] text-black/[0.07]">404</span>
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
              className="absolute bottom-[4%] right-[6%] z-10 font-[family-name:var(--font-caveat)] text-[clamp(1.1rem,3vw,1.6rem)] leading-none"
              style={{ color: INK }}
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
