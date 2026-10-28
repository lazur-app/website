"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { HeroDownloadCta } from "@/components/HeroDownloadCta";
import { NotchStage } from "./NotchStage";

/**
 * The hero is the demo: a notch hangs from the top of the page, hears "what is this?", answers,
 * and Lazur's coral pen draws on the page itself, underlining the headline, circling the download
 * button, pointing at the demo below. Click the notch to see it again.
 */

const CORAL = "#ef5350";
const HAND = "font-[family-name:var(--font-caveat)]";

type Phase = "idle" | "listening" | "thinking" | "speak1" | "speak2" | "rest";
const TIMELINE: Array<[Phase, number]> = [
  ["idle", 700],
  ["listening", 2000],
  ["thinking", 1300],
  ["speak1", 3200],
  ["speak2", 2900],
  ["rest", 0],
];
const order = (p: Phase) => TIMELINE.findIndex(([q]) => q === p);

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

function Bars() {
  return (
    <span className="flex h-3 items-end gap-[3px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.span key={i} className="w-[2.5px] rounded-full bg-white"
          animate={{ height: ["30%", "100%", "45%", "85%", "30%"] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.1 }} />
      ))}
    </span>
  );
}

/** The notch at the top of the page: at rest a camera cutout, then it listens, thinks, talks. */
function PageNotch({ phase, onReplay }: { phase: Phase; onReplay: () => void }) {
  const open = phase === "listening" || phase === "speak1" || phase === "speak2";
  // At rest it matches the menu bar notch (h-9, w-44); it grows down out of the menu bar.
  const size = open ? { width: "min(30rem, calc(100vw - 2rem))", height: 80 } : phase === "thinking" ? { width: "min(20rem, calc(100vw - 2rem))", height: 40 } : { width: "11rem", height: 36 };
  let label = "";
  let line: ReactNode = null;
  let right: ReactNode = null;
  if (phase === "listening") {
    label = "Listening";
    line = <span className="text-white/85">&ldquo;hey Lazur, what is this?&rdquo;</span>;
    right = <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: CORAL }} />;
  } else if (phase === "thinking") {
    label = "Thinking";
    right = <motion.span className="block h-3 w-3 rounded-full border-[1.5px] border-white/25 border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />;
  } else if (phase === "speak1" || phase === "speak2") {
    label = "Speaking";
    right = <Bars />;
    line = phase === "speak1" ? "I'm your AI buddy. I live up here, in the notch." : "Hold a key and talk to me. Start here.";
  }

  return (
    <button
      type="button"
      onClick={onReplay}
      title="Play it again"
      aria-label="Replay Lazur's introduction"
      className="fixed left-1/2 top-0 z-[60] -translate-x-1/2"
    >
      <motion.div
        className="overflow-hidden rounded-b-[16px] bg-black text-left text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
        animate={size}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.08 }}
      >
        <motion.div
          key={phase}
          className="px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: label ? 1 : 0, transition: { delay: 0.22, duration: 0.18 } }}
        >
          <div className="flex h-[38px] items-center justify-between text-[13px] font-medium">
            {label}
            {right}
          </div>
          {line ? <p className="truncate pb-3 text-center text-[14.5px] font-medium">{line}</p> : null}
        </motion.div>
      </motion.div>
    </button>
  );
}

/** Points (relative to the hero) the pen visits: under the headline, around the button, at the demo. */
type Spots = { notch: [number, number]; lineStart: [number, number]; lineEnd: [number, number]; cta: [number, number]; arrow: [number, number] };

function useSpots(hero: React.RefObject<HTMLElement | null>, underline: React.RefObject<HTMLElement | null>, cta: React.RefObject<HTMLElement | null>, arrow: React.RefObject<HTMLElement | null>) {
  const [spots, setSpots] = useState<Spots | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const h = hero.current?.getBoundingClientRect();
      const u = underline.current?.getBoundingClientRect();
      const c = cta.current?.getBoundingClientRect();
      const a = arrow.current?.getBoundingClientRect();
      if (!h || !u || !c || !a) return;
      const at = (x: number, y: number): [number, number] => [x - h.left, y - h.top];
      setSpots({
        notch: at(h.left + h.width / 2 + 120, h.top + 64),
        lineStart: at(u.left, u.bottom + 4),
        lineEnd: at(u.right, u.bottom + 2),
        cta: at(c.right + 10, c.top - 6),
        arrow: at(a.left + a.width / 2 - 30, a.top + 36),
      });
    };
    const frame = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    void document.fonts?.ready.then(measure);
    // The headline and button slide in on load; measure again once they've settled.
    const settled = window.setTimeout(measure, 900);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.clearTimeout(settled);
    };
  }, [hero, underline, cta, arrow]);
  return spots;
}

/** Lazur's sparkle pen, flying between the spots it draws at. */
function Pen({ spots, phase }: { spots: Spots; phase: Phase }) {
  const i = order(phase);
  let target: { left: number | number[]; top: number | number[] } = { left: spots.notch[0], top: spots.notch[1] };
  let duration = 0.9;
  if (i === order("speak1")) {
    target = { left: [spots.notch[0], spots.lineStart[0], spots.lineEnd[0]], top: [spots.notch[1], spots.lineStart[1], spots.lineEnd[1]] };
    duration = 2.1;
  } else if (i === order("speak2")) {
    target = { left: spots.cta[0], top: spots.cta[1] };
  } else if (i >= order("rest")) {
    target = { left: spots.arrow[0], top: spots.arrow[1] };
  }
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="pointer-events-none absolute z-30 -ml-3 -mt-3 h-6 w-6"
      style={{ filter: "drop-shadow(0 0 8px rgba(239,83,80,0.65))" }}
      initial={false}
      animate={target}
      transition={{ duration, ease: [0.45, 0, 0.2, 1], times: Array.isArray(target.left) ? [0, 0.4, 1] : undefined }}
      aria-hidden
    >
      <path d="M12 1.5 C12.6 7.4 16.6 11.4 22.5 12 C16.6 12.6 12.6 16.6 12 22.5 C11.4 16.6 7.4 12.6 1.5 12 C7.4 11.4 11.4 7.4 12 1.5 Z" fill={CORAL} />
    </motion.svg>
  );
}

function Ink({ show, d, delay = 0, duration = 0.9, viewBox, className, preserve = "none" }: {
  show: boolean; d: string; delay?: number; duration?: number; viewBox: string; className: string; preserve?: string;
}) {
  return (
    <svg viewBox={viewBox} preserveAspectRatio={preserve} className={`pointer-events-none absolute overflow-visible ${className}`} aria-hidden>
      <motion.path
        d={d} fill="none" stroke={CORAL} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
        initial={false}
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={{ pathLength: { delay: show ? delay : 0, duration, ease: "easeInOut" }, opacity: { delay: show ? delay : 0, duration: 0.01 } }}
      />
    </svg>
  );
}

export function BuddyHero() {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);
  const phase: Phase = reduced ? "rest" : TIMELINE[step][0];
  const at = order(phase);

  useEffect(() => {
    if (reduced) return;
    const [, ms] = TIMELINE[step];
    if (!ms) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), ms);
    return () => window.clearTimeout(t);
  }, [step, run, reduced]);

  const replay = () => {
    setStep(0);
    setRun((r) => r + 1);
  };

  const hero = useRef<HTMLElement>(null);
  const underline = useRef<HTMLSpanElement>(null);
  const cta = useRef<HTMLDivElement>(null);
  const arrow = useRef<HTMLDivElement>(null);
  const spots = useSpots(hero, underline, cta, arrow);

  const drawLine = at >= order("speak1");
  const drawCircle = at >= order("speak2");
  const drawArrow = at >= order("rest");

  return (
    <section ref={hero} className="relative overflow-x-clip">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 0%, rgba(107, 75, 252, 0.12), transparent 70%), radial-gradient(ellipse 40% 35% at 85% 30%, rgba(249, 115, 22, 0.08), transparent 70%)",
        }}
      />
      <PageNotch phase={phase} onReplay={replay} />
      {spots && !reduced ? <Pen spots={spots} phase={phase} /> : null}

      <div className="landing-container relative flex flex-col items-center pt-32 text-center md:pt-44">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-full border border-[var(--border-strong)] bg-white/70 px-3 py-1 text-[13px] font-medium text-[var(--foreground-muted)]"
        >
          AI buddy for Mac
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,5.4vw,5rem)] font-medium leading-[0.98] tracking-[-0.04em] text-[var(--foreground)]"
        >
          Your AI buddy,
          <br />
          right{" "}
          <span ref={underline} className="relative inline-block">
            in the notch.
            <Ink show={drawLine} delay={0.85} duration={1.1} viewBox="0 0 300 20" className="-bottom-[0.18em] left-0 h-[0.28em] w-full"
              d="M3 12 C60 5 110 16 160 9 C205 3 250 14 297 7" />
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55 }}
          className="mt-6 max-w-[40rem] text-[clamp(1.05rem,2.2vw,1.35rem)] leading-snug text-[var(--foreground-muted)]"
        >
          Hold a key and talk. Lazur sees your screen, points at things, answers out loud and gets
          things done, in any app.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5 }}
          className="relative mt-9 flex w-full max-w-[17rem] justify-center md:max-w-none"
        >
          <div ref={cta} className="relative">
            <HeroDownloadCta align="center" variant="minimal" className="w-full md:w-auto" />
            <Ink show={drawCircle} delay={0.6} duration={0.9} viewBox="0 0 100 60" className="-inset-x-6 -inset-y-4 h-[calc(100%+2rem)] w-[calc(100%+3rem)]"
              d="M52 4 C82 3 98 16 97 30 C96 47 74 57 48 56 C22 55 3 45 4 29 C5 14 24 5 60 7" />
            <motion.span
              className={`absolute left-[calc(100%+2.6rem)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap text-[1.7rem] leading-none sm:block ${HAND}`}
              style={{ color: CORAL }}
              initial={false}
              animate={{ opacity: drawCircle ? 1 : 0, x: drawCircle ? 0 : -6 }}
              transition={{ delay: drawCircle ? 1.4 : 0, duration: 0.35 }}
            >
              start here
            </motion.span>
          </div>
        </motion.div>

        {/* The pen's last stop: pointing down at the demo */}
        <div ref={arrow} className="relative mt-6 h-16 w-40" aria-hidden>
          <Ink show={drawArrow} delay={0.7} duration={0.8} viewBox="0 0 60 64" preserve="xMidYMid meet" className="left-1/2 top-0 h-16 w-14 -translate-x-1/2"
            d="M30 4 C22 20 38 34 30 56 M30 56 L21 46 M30 56 L39 47" />
          <motion.span
            className={`absolute left-[calc(50%+2.2rem)] top-5 whitespace-nowrap text-[1.6rem] leading-none ${HAND}`}
            style={{ color: CORAL }}
            initial={false}
            animate={{ opacity: drawArrow ? 1 : 0 }}
            transition={{ delay: drawArrow ? 1.3 : 0, duration: 0.35 }}
          >
            watch me work
          </motion.span>
        </div>
      </div>

      <div className="landing-container relative flex flex-col items-center pb-16 text-center md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full max-w-5xl"
        >
          {/* One notch talking at a time: the demo starts once the intro above is done. */}
          <NotchStage held={at < order("rest")} />
        </motion.div>
      </div>
    </section>
  );
}
