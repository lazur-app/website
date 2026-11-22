"use client";

import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The live site's hero intro, for the plain puzzle hero: Lazur's cursor appears above the headline
 * and says hi, flies down and underlines "AI companion", then leaves a second note. Here the pen
 * is Lazur's own pink cursor (the live site uses a blue sparkle), and the ink is red.
 *
 * It only moves the cursor and shows the notes; the underline itself is drawn by the headline,
 * which is told when to start through `onUnderline`.
 */

const INK = "#e11d48";
const HAND = "font-[family-name:var(--font-caveat)]";

/** idle: nothing yet; hello: the cursor appears and says hi; line: it underlines the phrase; rest: done. */
type Phase = "idle" | "hello" | "line" | "rest";
const TIMELINE: [Phase, number][] = [
  ["idle", 500],
  ["hello", 1500],
  ["line", 2150],
  ["rest", 0],
];
const order = (p: Phase) => TIMELINE.findIndex(([q]) => q === p);

/** Where the cursor goes, relative to the hero: where it says hi, and the two ends of the underline. */
type Spots = { hello: [number, number]; start: [number, number]; end: [number, number] };

function useSpots(hero: RefObject<HTMLElement | null>, phrase: RefObject<HTMLElement | null>, version: string) {
  const [spots, setSpots] = useState<Spots | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const h = hero.current?.getBoundingClientRect();
      const p = phrase.current?.getBoundingClientRect();
      if (!h || !p) return;
      const x = p.left - h.left;
      const y = p.top - h.top;
      setSpots({
        hello: [x + p.width * 0.62, y - 14],
        start: [x, y + p.height + 3],
        end: [x + p.width, y + p.height + 3],
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (hero.current) observer.observe(hero.current);
    window.addEventListener("resize", measure);
    // The headline's width settles once its font has loaded.
    void document.fonts?.ready.then(measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [hero, phrase, version]);
  return spots;
}

function Note({ at, show, delay = 0.2, children }: { at: [number, number]; show: boolean; delay?: number; children: React.ReactNode }) {
  return (
    <motion.span
      className={`pointer-events-none absolute z-30 hidden whitespace-nowrap text-[1.7rem] leading-none md:block ${HAND}`}
      style={{ left: at[0], top: at[1], color: INK }}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 4 }}
      transition={{ delay: show ? delay : 0, duration: 0.35 }}
      aria-hidden
    >
      {children}
    </motion.span>
  );
}

export function PenIntro({ hero, phrase, version, onUnderline }: {
  hero: RefObject<HTMLElement | null>;
  phrase: RefObject<HTMLElement | null>;
  /** Changes when the headline's words change, so the spots are measured again. */
  version: string;
  /** Called once, when the cursor sets off to draw the underline (straight away with reduced motion). */
  onUnderline: () => void;
}) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const phase: Phase = reduced ? "rest" : TIMELINE[step][0];
  const at = order(phase);
  const spots = useSpots(hero, phrase, version);

  useEffect(() => {
    if (reduced) return;
    const ms = TIMELINE[step][1];
    if (!ms) return;
    const timer = window.setTimeout(() => setStep((s) => s + 1), ms);
    return () => window.clearTimeout(timer);
  }, [step, reduced]);

  const drawing = at >= order("line");
  useEffect(() => {
    if (drawing) onUnderline();
  }, [drawing, onUnderline]);

  if (!spots) return null;

  let target: { left: number | number[]; top: number | number[] } = { left: spots.hello[0], top: spots.hello[1] };
  if (drawing) {
    target = { left: [spots.hello[0], spots.start[0], spots.end[0]], top: [spots.hello[1], spots.start[1], spots.end[1]] };
  }

  return (
    <>
      {reduced ? null : (
        // Lazur's cursor. Its tip is the top left corner of the drawing, so the tip is what draws.
        <motion.svg
          viewBox="0 0 26 28"
          className="pointer-events-none absolute z-30 hidden h-[34px] w-[32px] md:block"
          style={{ filter: "drop-shadow(0 3px 5px rgba(12,11,10,0.28))" }}
          initial={{ opacity: 0, scale: 0.6, left: spots.hello[0], top: spots.hello[1] }}
          animate={{ opacity: at >= order("hello") ? 1 : 0, scale: at >= order("hello") ? 1 : 0.6, ...target }}
          transition={{
            opacity: { duration: 0.25 },
            scale: { type: "spring", stiffness: 420, damping: 18 },
            left: { duration: drawing ? 2.1 : 0.01, ease: [0.45, 0, 0.2, 1], times: drawing ? [0, 0.4, 1] : undefined },
            top: { duration: drawing ? 2.1 : 0.01, ease: [0.45, 0, 0.2, 1], times: drawing ? [0, 0.4, 1] : undefined },
          }}
          aria-hidden
        >
          <path d="M1.5 1.5 L1.5 21.5 L7.2 16.6 L11 25.6 L15.2 23.8 L11.4 15 L19 15 Z" fill="#ff4f93" stroke="#0c0b0a" strokeWidth="1.6" strokeLinejoin="round" />
        </motion.svg>
      )}
      <Note at={[spots.hello[0] + 34, spots.hello[1] - 10]} show={at >= order("hello") && at < order("rest")}>
        hi, I&apos;m Lazur
      </Note>
      <Note at={[spots.end[0] + 34, spots.end[1] - 4]} show={at >= order("rest")} delay={0.1}>
        that&apos;s me
      </Note>
    </>
  );
}
