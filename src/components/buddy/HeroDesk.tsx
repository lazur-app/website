"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { motion } from "framer-motion";
import { Check, FileText, Timer as TimerIcon } from "lucide-react";

/**
 * The hero as a little desk: Lazur's moments (notch pills, keys, a reminder, a finished job, a
 * circled button) float around the headline with coral handwritten notes. Everything can be
 * picked up and moved. Desktop only; phones get the plain hero.
 */

const CORAL = "#ef5350";
const HAND = "font-[family-name:var(--font-caveat)]";

/** A desk item: bobs gently, can be dragged anywhere inside the hero. */
function Piece({
  bounds,
  className,
  rotate = 0,
  delay = 0,
  children,
}: {
  bounds: RefObject<HTMLDivElement | null>;
  className: string;
  rotate?: number;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={`pointer-events-auto absolute ${className}`}
      initial={{ opacity: 0, scale: 0.9, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5 + delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        drag
        dragConstraints={bounds}
        dragElastic={0.15}
        dragMomentum={false}
        whileHover={{ scale: 1.04, rotate: 0 }}
        whileDrag={{ scale: 1.08, rotate: 0, zIndex: 50, cursor: "grabbing" }}
        style={{ rotate }}
        className="cursor-grab"
      >
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5 + delay * 2, repeat: Infinity, ease: "easeInOut", delay }}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** A coral handwritten note with a little arrow. */
function Note({ children, className, arrow }: { children: ReactNode; className: string; arrow?: "left" | "right" | "down" | "up" }) {
  const paths = {
    left: "M58 8 C40 4 18 10 6 26 M6 26 L8 14 M6 26 L18 24",
    right: "M4 8 C22 4 44 10 56 26 M56 26 L44 24 M56 26 L54 14",
    down: "M30 4 C20 16 22 30 30 42 M30 42 L22 34 M30 42 L36 33",
    up: "M30 42 C40 30 38 16 30 4 M30 4 L23 13 M30 4 L37 12",
  };
  return (
    <motion.div
      className={`pointer-events-none absolute flex items-center gap-1 ${HAND} text-[1.45rem] leading-none ${className}`}
      style={{ color: CORAL }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      {arrow === "left" || arrow === "up" ? <Arrow d={paths[arrow]} /> : null}
      <span className="whitespace-nowrap">{children}</span>
      {arrow === "right" || arrow === "down" ? <Arrow d={paths[arrow]} /> : null}
    </motion.div>
  );
}

function Arrow({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 62 46" className="h-8 w-11 overflow-visible" aria-hidden>
      <motion.path d={d} fill="none" stroke={CORAL} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.3, duration: 0.7 }} />
    </svg>
  );
}

function Key({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <span className={`grid h-12 place-items-center rounded-xl border border-black/10 bg-white text-[18px] font-semibold text-[#1c1917] shadow-[0_4px_0_rgba(28,25,23,0.16)] ${wide ? "px-5" : "w-12"}`}>
      {children}
    </span>
  );
}

function TickingTimer() {
  const [left, setLeft] = useState(598);
  useEffect(() => {
    const t = window.setInterval(() => setLeft((n) => (n > 0 ? n - 1 : 599)), 1000);
    return () => window.clearInterval(t);
  }, []);
  return <>{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</>;
}

export function HeroDesk() {
  const bounds = useRef<HTMLDivElement>(null);
  return (
    <div ref={bounds} className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
      {/* Top left: the notch, listening */}
      <Piece bounds={bounds} className="left-[4%] top-[17%]" rotate={-4}>
        <div className="w-[17rem] rounded-b-[18px] rounded-t-[6px] bg-black px-4 pb-3 pt-2 text-left text-white shadow-[0_14px_30px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between text-[12px] font-medium">
            Listening <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: CORAL }} />
          </div>
          <p className="mt-1.5 text-center text-[13px] text-white/85">where&apos;s the export button?</p>
        </div>
      </Piece>
      <Note className="left-[9%] top-[30%]" arrow="up">it hears you</Note>

      {/* Left: the keys */}
      <Piece bounds={bounds} className="left-[7%] top-[43%]" rotate={3} delay={0.15}>
        <div className="flex gap-2">
          <Key>⌥</Key>
          <Key>⌘</Key>
        </div>
      </Piece>
      <Note className="left-[15%] top-[44%]" arrow="left">hold to ask</Note>

      {/* Bottom left: a reminder, done */}
      <Piece bounds={bounds} className="left-[5%] top-[69%]" rotate={-2} delay={0.3}>
        <div className="w-60 rounded-md bg-[#fff1a8] p-4 text-left shadow-[0_12px_24px_rgba(28,25,23,0.14)]">
          <p className="text-[14px] font-medium text-[#3d3420]">&ldquo;Remind me to call Mom at 6&rdquo;</p>
          <p className="mt-2 flex items-center gap-1 text-[12.5px] font-semibold text-emerald-700">
            <Check className="h-3.5 w-3.5" /> Added to Reminders
          </p>
        </div>
      </Piece>

      {/* Top right: a timer ticking in the notch */}
      <Piece bounds={bounds} className="right-[5%] top-[18%]" rotate={3} delay={0.1}>
        <div className="relative flex w-56 items-center justify-between rounded-b-[16px] rounded-t-[6px] bg-black px-4 py-2.5 text-white shadow-[0_14px_30px_rgba(0,0,0,0.22)]">
          <span className="flex items-center gap-1.5 text-[13px] font-medium"><TimerIcon className="h-3.5 w-3.5" style={{ color: "#ff8a80" }} /> Pasta</span>
          <span className="text-[15px] font-semibold tabular-nums"><TickingTimer /></span>
          <span className="absolute bottom-0 left-4 h-[2px] w-[70%] rounded-full" style={{ background: CORAL }} />
        </div>
      </Piece>
      <Note className="right-[8%] top-[29%]" arrow="up">timers live up here</Note>

      {/* Right: a finished background job */}
      <Piece bounds={bounds} className="right-[4%] top-[37%]" rotate={-3} delay={0.25}>
        <div className="w-64 rounded-2xl bg-[#141416] p-4 text-left shadow-[0_16px_34px_rgba(0,0,0,0.25)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">Job done</p>
          <p className="mt-1 text-[14px] font-medium text-white">Standing desks under $300</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[12px] text-white/50">read 12 pages</span>
            <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[11.5px] font-semibold text-black"><FileText className="h-3 w-3" /> Full report</span>
          </div>
        </div>
      </Piece>

      {/* Bottom right: a circled button, and fn for dictation */}
      <Piece bounds={bounds} className="right-[15%] top-[63%]" rotate={2} delay={0.35}>
        <div className="relative rounded-xl bg-white px-5 py-2.5 text-[15px] font-semibold text-[#1c1917] shadow-[0_10px_22px_rgba(28,25,23,0.12)] ring-1 ring-black/5">
          Export
          <svg className="pointer-events-none absolute -inset-3 h-[calc(100%+24px)] w-[calc(100%+24px)] overflow-visible" viewBox="0 0 100 60" preserveAspectRatio="none">
            <motion.path d="M52 4 C80 3 97 15 96 30 C95 47 74 57 49 56 C24 55 4 45 5 29 C6 14 25 5 58 6" fill="none" stroke={CORAL} strokeWidth="2.6" strokeLinecap="round" vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.6, duration: 0.8, ease: "easeInOut" }} />
          </svg>
        </div>
      </Piece>
      <Note className="right-[6%] top-[72%]" arrow="up">it points at stuff</Note>
      <Piece bounds={bounds} className="left-[8%] top-[56%]" rotate={-4} delay={0.4}>
        <Key wide>fn</Key>
      </Piece>
      <Note className="left-[13.5%] top-[56.5%]" arrow="left">hold to dictate</Note>

      {/* The sparkle buddy, drifting near the headline */}
      <motion.svg
        viewBox="0 0 24 24"
        className="absolute left-[30%] top-[20%] h-7 w-7"
        style={{ filter: "drop-shadow(0 0 8px rgba(239,83,80,0.6))" }}
        animate={{ x: [0, 18, -6, 0], y: [0, -10, 8, 0], rotate: [0, 15, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M12 1.5 C12.6 7.4 16.6 11.4 22.5 12 C16.6 12.6 12.6 16.6 12 22.5 C11.4 16.6 7.4 12.6 1.5 12 C7.4 11.4 11.4 7.4 12 1.5 Z" fill={CORAL} />
      </motion.svg>
    </div>
  );
}

/** A soft dot grid that fades out at the edges, like a desk mat. */
export function DotGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden
      style={{
        backgroundImage: "radial-gradient(rgba(28,25,23,0.13) 1px, transparent 1.3px)",
        backgroundSize: "22px 22px",
        maskImage: "radial-gradient(ellipse 85% 75% at 50% 35%, black 40%, transparent 85%)",
        WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 35%, black 40%, transparent 85%)",
      }}
    />
  );
}
