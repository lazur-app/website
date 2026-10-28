"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { HeroDownloadCta } from "@/components/HeroDownloadCta";
import { HeroFluidWaves } from "@/components/hero/HeroFluidWaves";
import { setNotchIntro, setNotchVoice, type NotchVoice } from "@/lib/notchVoice";
import { NotchStage } from "./NotchStage";
import { PersonaSwitcher } from "./PersonaSwitcher";
import { usePersona } from "@/lib/personas";

/**
 * The hero is the demo: the navbar (which is the notch) hears "what is this?" and answers, while
 * Lazur's coral pen draws on the page itself, underlining the headline, circling the download
 * button, pointing at the demo below.
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

/** Points (relative to the hero) the pen visits: under the headline, around the button, at the demo. */
type Spots = { notch: [number, number]; lineStart: [number, number]; lineEnd: [number, number]; cta: [number, number]; arrow: [number, number];
  /** The download button's own box (not its wrapper), for the circle. */
  button: { x: number; y: number; w: number; h: number } };

function useSpots(hero: React.RefObject<HTMLElement | null>, underline: React.RefObject<HTMLElement | null>, cta: React.RefObject<HTMLElement | null>, arrow: React.RefObject<HTMLElement | null>, version: string) {
  const [spots, setSpots] = useState<Spots | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const h = hero.current?.getBoundingClientRect();
      const u = underline.current?.getBoundingClientRect();
      const c = (cta.current?.querySelector("a, button") ?? cta.current)?.getBoundingClientRect();
      const a = arrow.current?.getBoundingClientRect();
      if (!h || !u || !c || !a) return;
      const at = (x: number, y: number): [number, number] => [x - h.left, y - h.top];
      setSpots({
        notch: at(h.left + h.width / 2 + 150, h.top + 70),
        lineStart: at(u.left, u.bottom + 4),
        lineEnd: at(u.right, u.bottom + 2),
        cta: at(c.right + 10, c.top - 6),
        arrow: at(a.left + a.width / 2 - 30, a.top + 36),
        button: { x: c.left - h.left, y: c.top - h.top, w: c.width, h: c.height },
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
  }, [hero, underline, cta, arrow, version]);
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
    target = { left: spots.button.x + spots.button.w + 18, top: spots.button.y - 8 };
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

/**
 * A hand-drawn loop around the download button, drawn in real pixels: a stretched SVG makes Chrome
 * miscount the stroke length and the loop never closes.
 */
function ButtonLoop({ button, show }: { button: Spots["button"]; show: boolean }) {
  const padX = 24;
  const padY = 15;
  const w = button.w + padX * 2;
  const h = button.h + padY * 2;
  const rx = w / 2 - 3;
  const ry = h / 2 - 3;
  const cx = w / 2;
  const cy = h / 2;
  const k = 0.5523; // bezier handle for a quarter ellipse
  // Start a bit right of the top, go round clockwise, and overshoot past the start like a pen does.
  const d = [
    `M ${cx + rx * 0.1} ${cy - ry}`,
    `C ${cx + rx * 0.1 + rx * k} ${cy - ry} ${cx + rx} ${cy - ry * k} ${cx + rx} ${cy}`,
    `C ${cx + rx} ${cy + ry * k} ${cx + rx * k} ${cy + ry} ${cx} ${cy + ry}`,
    `C ${cx - rx * k} ${cy + ry} ${cx - rx} ${cy + ry * k} ${cx - rx} ${cy}`,
    `C ${cx - rx} ${cy - ry * k} ${cx - rx * k} ${cy - ry - 2} ${cx + rx * 0.05} ${cy - ry - 1}`,
    `C ${cx + rx * 0.25} ${cy - ry - 1} ${cx + rx * 0.4} ${cy - ry + 1} ${cx + rx * 0.5} ${cy - ry + 4}`,
  ].join(" ");
  return (
    <svg
      className="pointer-events-none absolute z-20 overflow-visible"
      style={{ left: button.x - padX, top: button.y - padY, width: w, height: h }}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden
    >
      <motion.path
        d={d} fill="none" stroke={CORAL} strokeWidth="3" strokeLinecap="round"
        initial={false}
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={{ pathLength: { delay: show ? 0.6 : 0, duration: 0.9, ease: "easeInOut" }, opacity: { delay: show ? 0.6 : 0, duration: 0.01 } }}
      />
    </svg>
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
  const persona = usePersona();
  const [step, setStep] = useState(0);
  const phase: Phase = reduced ? "rest" : TIMELINE[step][0];
  const at = order(phase);

  useEffect(() => {
    if (reduced) return;
    const [, ms] = TIMELINE[step];
    if (!ms) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), ms);
    return () => window.clearTimeout(t);
  }, [step, reduced]);

  // The navbar is the notch: tell it what to say.
  useEffect(() => {
    const lines: Partial<Record<Phase, NotchVoice>> = {
      listening: { state: "listening", line: "“hey Lazur, what is this?”" },
      thinking: { state: "thinking" },
      speak1: { state: "speaking", line: persona.intro },
      speak2: { state: "speaking", line: "Hold a key and talk to me. Start here." },
    };
    setNotchVoice(lines[phase] ?? null);
  }, [phase, persona.intro]);
  useEffect(() => () => setNotchVoice(null), []);

  // Once the intro is over the notch may react to hover and peek now and then; clicking it replays.
  const introDone = at >= order("rest");
  useEffect(() => {
    setNotchIntro({ done: introDone, replay: () => setStep(0) });
  }, [introDone]);
  useEffect(() => () => setNotchIntro(null), []);

  const hero = useRef<HTMLElement>(null);
  const underline = useRef<HTMLSpanElement>(null);
  const cta = useRef<HTMLDivElement>(null);
  const arrow = useRef<HTMLDivElement>(null);
  const spots = useSpots(hero, underline, cta, arrow, persona.id);

  const drawLine = at >= order("speak1");
  const drawCircle = at >= order("speak2");
  const drawArrow = at >= order("rest");

  return (
    <section ref={hero} className="relative overflow-x-clip">
      <PersonaSwitcher />
      {spots && !reduced ? <Pen spots={spots} phase={phase} /> : null}
      {spots ? <ButtonLoop button={spots.button} show={drawCircle} /> : null}

      <div className="landing-container relative flex flex-col items-center pt-32 text-center md:pt-44">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-full border border-[var(--border-strong)] bg-white/70 px-3 py-1 text-[13px] font-medium text-[var(--foreground-muted)]"
        >
          AI buddy for Mac
        </motion.p>
        <div className="relative isolate">
        {/* The floating particle wave, centred behind the headline */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[34rem] w-screen -translate-x-1/2 -translate-y-[30%]" aria-hidden>
          <HeroFluidWaves />
        </div>
        <motion.h1
          key={persona.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,5.4vw,5rem)] font-medium leading-[0.98] tracking-[-0.04em] text-[var(--foreground)]"
        >
          {persona.title}
          <br />
          right{" "}
          <span ref={underline} className="relative inline-block">
            in the notch.
            <Ink show={drawLine} delay={0.85} duration={1.1} viewBox="0 0 300 20" className="-bottom-[0.18em] left-0 h-[0.28em] w-full"
              d="M3 12 C60 5 110 16 160 9 C205 3 250 14 297 7" />
          </span>
        </motion.h1>
        </div>
        <motion.p
          key={`sub-${persona.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55 }}
          className="mt-6 max-w-[40rem] text-[clamp(1.05rem,2.2vw,1.35rem)] leading-snug text-[var(--foreground-muted)]"
        >
          {persona.sub}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5 }}
          className="relative mt-9 flex w-full max-w-[17rem] justify-center md:max-w-none"
        >
          <div ref={cta} className="relative">
            <HeroDownloadCta align="center" variant="minimal" className="w-full md:w-auto" />

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
          className="relative isolate mt-4 w-full max-w-5xl"
        >
          {/* The faint grid fans out from the demo screen's top corners */}
          {(["left-0", "right-0"] as const).map((side) => (
            <div
              key={side}
              aria-hidden
              className={`pointer-events-none absolute top-0 -z-10 h-[34rem] w-[34rem] -translate-y-1/2 ${side === "left-0" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"}`}
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(28,25,23,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,25,23,0.09) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                backgroundPosition: "center",
                maskImage: "radial-gradient(circle at center, black 0%, transparent 68%)",
                WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 68%)",
              }}
            />
          ))}
          {/* One notch talking at a time: the demo starts once the intro above is done. */}
          <NotchStage held={at < order("rest")} />
        </motion.div>
      </div>
    </section>
  );
}
