"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { X } from "lucide-react";
import { setGuide, useGuide } from "@/lib/guide";
import { usePersona, type PersonaId } from "@/lib/personas";
import { loopPath, underlinePath } from "@/lib/handDrawn";

/**
 * Lazur's sparkle, travelling down the homepage. Each section is a stop (data-guide-section) with
 * a few steps: where to point (data-guide targets), what to say, whether to circle it. The section
 * whose box crosses the middle of the screen is the active stop; its steps play once on arrival.
 * Sections read the current step from lib/guide to animate their own content.
 */

const INK = "#2563eb";
const OFF_KEY = "lazur.guide.off";

/** circle: a loop around the target; underline: a stroke under it (for words). */
type Step = { target: string; say: string; ms?: number; mark?: "circle" | "underline" };
type Stop = { id: string; steps: (ctx: { persona: PersonaId; scene: string }) => Step[] };

const DEMO_INTRO: Record<PersonaId, string> = {
  everyone: "let me show you what I do",
  founder: "here's how I take things off your plate",
  developer: "here's how I help while you code",
  student: "here's how I help you study",
  lawyer: "here's how I help with the paperwork",
};

const DEMO_SCENE: Record<string, string> = {
  point: "watch: I'll find the Share button",
  timer: "I'll start your timer, right in the notch",
  job: "this one I do in the background",
  type: "now I'll type it for you, as a list",
};

const STOPS: Stop[] = [
  {
    id: "demo",
    steps: ({ persona, scene }) => [
      { target: "[data-guide=demo-screen]", say: DEMO_INTRO[persona], ms: 3200 },
      { target: "[data-guide=demo-screen]", say: DEMO_SCENE[scene] ?? DEMO_SCENE.point },
    ],
  },
  {
    id: "guide",
    steps: () => [
      { target: "[data-guide=guide-start]", say: "stuck? I'll walk you through it", ms: 2000 },
      { target: "[data-guide=guide-appearance]", say: "click here first", ms: 1700 },
      { target: "[data-guide=guide-dark]", say: "now this one", ms: 1700 },
      { target: "[data-guide=guide-done]", say: "done. that's it" },
    ],
  },
  {
    id: "everyday",
    steps: () => [
      { target: "[data-guide=chip-0]", say: "try saying this", ms: 1500 },
      { target: "[data-guide=chip-1]", say: "or this", ms: 1300 },
      { target: "[data-guide=chip-2]", say: "or this one", ms: 1300 },
      { target: "[data-guide-section=everyday] h2", say: "I do all of these, out loud" },
    ],
  },
  {
    id: "privacy",
    steps: () => [
      { target: "[data-guide=privacy-key]", say: "I only listen while you hold the key", ms: 2600 },
      { target: "[data-guide=privacy-stored]", say: "and I don't keep anything" },
    ],
  },
  {
    id: "love",
    steps: () => [{ target: "[data-guide-section=love] mark", say: "don't take my word for it", mark: "underline" }],
  },
  {
    id: "pricing",
    steps: () => [
      { target: "[data-guide=pricing-pro]", say: "most people pick this one", ms: 2600, mark: "circle" },
      { target: "[data-guide=pricing-trial]", say: "and the first 3 days are free" },
    ],
  },
  {
    id: "faq",
    steps: () => [
      { target: "[data-guide=faq-0]", say: "ask me anything", ms: 1800 },
      { target: "[data-guide=faq-4]", say: "this one comes up a lot" },
    ],
  },
  {
    id: "cta",
    steps: () => [{ target: "[data-guide-section=cta] a[href='/download']", say: "ready? let's go", mark: "circle" }],
  },
];

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

function useIsPhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return phone;
}

function Sparkle({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ filter: "drop-shadow(0 0 8px rgba(37,99,235,0.55))" }} aria-hidden>
      <path d="M12 1.5 C12.6 7.4 16.6 11.4 22.5 12 C16.6 12.6 12.6 16.6 12 22.5 C11.4 16.6 7.4 12.6 1.5 12 C7.4 11.4 11.4 7.4 12 1.5 Z" fill={INK} />
    </svg>
  );
}

export function Guide() {
  const g = useGuide();
  const persona = usePersona();
  const reduced = usePrefersReducedMotion();
  const phone = useIsPhone();

  // Hidden for this visit?
  useEffect(() => {
    try {
      if (sessionStorage.getItem(OFF_KEY)) setGuide({ dismissed: true });
    } catch {
      /* fine */
    }
  }, []);
  const dismiss = () => {
    try {
      sessionStorage.setItem(OFF_KEY, "1");
    } catch {
      /* fine */
    }
    setGuide({ dismissed: true });
  };

  // Which section is under the middle of the screen. Scrolling down takes over from the hero
  // intro straight away, even if it hasn't finished drawing.
  useEffect(() => {
    let frame = 0;
    let last: string | null = null;
    const tick = () => {
      const mid = window.innerHeight * 0.5;
      let found: string | null = null;
      for (const stop of STOPS) {
        const el = document.querySelector(`[data-guide-section=${stop.id}]`);
        const r = el?.getBoundingClientRect();
        if (r && r.top < mid && r.bottom > mid) {
          found = stop.id;
          break;
        }
      }
      if (found !== last) {
        last = found;
        setGuide({ stop: found, step: 0 });
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const stop = STOPS.find((s) => s.id === g.stop);
  const steps = stop ? stop.steps({ persona: persona.id, scene: g.demoScene }) : [];
  const step = steps[Math.min(g.step, steps.length - 1)];

  // Play the stop's steps once, in order; the last one stays.
  const count = steps.length;
  const holdMs = steps[g.step]?.ms ?? 1800;
  useEffect(() => {
    if (!g.stop || g.step >= count - 1) return;
    const t = window.setTimeout(() => setGuide({ step: g.step + 1 }), holdMs);
    return () => window.clearTimeout(t);
  }, [g.stop, g.step, count, holdMs]);

  // Follow the target every frame: springs make the sparkle trail behind when you scroll fast.
  // Over-damped: it glides into place and settles, never bounces past.
  const spring = reduced ? { stiffness: 2000, damping: 100 } : { stiffness: 220, damping: 42, mass: 1 };
  const x = useSpring(useMotionValue(-100), spring);
  const y = useSpring(useMotionValue(-100), spring);
  const ring = { l: useMotionValue(0), t: useMotionValue(0) };
  const [ringSize, setRingSize] = useState({ w: 0, h: 0 });
  const mark = step?.mark;
  const [labelLeft, setLabelLeft] = useState(false);
  const target = step?.target;
  const placed = useRef(false);
  useEffect(() => {
    if (!target || phone) return;
    let frame = 0;
    const tick = () => {
      const el = document.querySelector(target);
      const r = el?.getBoundingClientRect();
      if (r) {
        const vw = window.innerWidth;
        // Wide targets (the demo screen): sit on the top-left corner. Others: just past the right edge,
        // or before the left edge when there's no room on the right.
        const wide = r.width > vw * 0.5;
        const nearRight = !wide && r.right + 260 > vw;
        const px = wide ? r.left + 18 : nearRight ? r.left - 14 : r.right + 12;
        // Keep the label clear of the floating navbar.
        const py = Math.max(96, wide ? r.top + 14 : r.top - 8);
        if (!placed.current) {
          // First appearance: start from the hero's "watch me work" arrow, so it's the same sparkle.
          const start = document.querySelector("[data-guide-start]")?.getBoundingClientRect();
          x.jump(start ? start.left : px);
          y.jump(start ? start.top : py);
          placed.current = true;
        }
        x.set(px);
        y.set(py);
        // Marks in real pixels (a stretched loop never finishes drawing).
        const under = mark === "underline";
        const w = Math.round(under ? r.width + 4 : r.width + 28);
        const h = Math.round(under ? 10 : r.height + 22);
        ring.l.set(under ? r.left - 2 : r.left - 14);
        ring.t.set(under ? r.bottom - 1 : r.top - 11);
        setRingSize((old) => (Math.abs(old.w - w) > 1 || Math.abs(old.h - h) > 1 ? { w, h } : old));
        setLabelLeft(nearRight);
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, phone, mark]);

  const visible = Boolean(step) && !g.dismissed;

  if (phone) {
    // Phones: no flying; a small note docked at the bottom.
    return (
      <AnimatePresence>
        {visible ? (
          <motion.div
            key="dock"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed inset-x-0 bottom-4 z-[65] flex justify-center px-4"
          >
            <div className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/90 py-2 pl-3 pr-2 shadow-[0_8px_24px_rgba(28,25,23,0.12)] backdrop-blur-xl">
              <Sparkle size={16} />
              <AnimatePresence mode="wait">
                <motion.span key={step!.say} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[13px] font-medium text-[var(--foreground)]">
                  {step!.say}
                </motion.span>
              </AnimatePresence>
              <button type="button" onClick={dismiss} aria-label="Hide Lazur's tips" className="grid h-6 w-6 place-items-center rounded-full text-[var(--foreground-faint)]">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }

  return (
    <>
      {/* A loop or an underline on the target, when the step calls for one */}
      <AnimatePresence>
        {visible && mark && ringSize.w > 0 ? (
          <motion.svg
            key={`${g.stop}-${g.step}`}
            className="pointer-events-none fixed left-0 top-0 z-[64] overflow-visible"
            style={{ x: ring.l, y: ring.t }}
            width={ringSize.w}
            height={ringSize.h}
            viewBox={`0 0 ${ringSize.w} ${ringSize.h}`}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            aria-hidden
          >
            <motion.path
              d={mark === "underline" ? underlinePath(ringSize.w, ringSize.h) : loopPath(ringSize.w, ringSize.h)}
              fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.45, duration: mark === "underline" ? 0.5 : 0.75, ease: [0.65, 0, 0.35, 1] }}
            />
          </motion.svg>
        ) : null}
      </AnimatePresence>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[65]"
        style={{ x, y }}
        initial={false}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        aria-hidden={!visible}
      >
        <div className="-ml-[11px] -mt-[11px]">
          <Sparkle />
        </div>
        <AnimatePresence mode="wait">
          {visible ? (
            <motion.div
              key={`${g.stop}-${step!.say}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`pointer-events-auto absolute bottom-3 flex items-center gap-1 whitespace-nowrap rounded-full py-1.5 pl-3 pr-1.5 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] ${
                labelLeft ? "right-4" : "left-4"
              }`}
              style={{ background: INK }}
              role="status"
            >
              {step!.say}
              <button type="button" onClick={dismiss} aria-label="Hide Lazur's tips" className="ml-0.5 grid h-5 w-5 place-items-center rounded-full text-white/70 hover:bg-white/15 hover:text-white">
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
