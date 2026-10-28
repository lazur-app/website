"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Search, Timer as TimerIcon } from "lucide-react";

/**
 * The hero demo: a Mac screen whose notch does what Lazur does. Four short scenes loop (or are
 * picked from the tabs): point at something, start a timer, hand off a job, type a reply.
 * Everything is drawn in code, so it stays crisp and loads instantly.
 */

const CORAL = "#ef5350";

type SceneId = "point" | "timer" | "job" | "type";

type Phase =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "result"
  | "working"
  | "done";

type Scene = {
  id: SceneId;
  tab: string;
  /** What you say. */
  said: string;
  /** What Lazur says back (none for dictation). */
  reply?: string;
  phases: Array<[Phase, number]>;
};

const SCENES: Scene[] = [
  {
    id: "point",
    tab: "Point",
    said: "Where's Control Center?",
    reply: "It's this switch, top right.",
    phases: [["idle", 700], ["listening", 1900], ["thinking", 700], ["speaking", 1500], ["result", 3200]],
  },
  {
    id: "timer",
    tab: "Timer",
    said: "Set a timer for 5 minutes.",
    reply: "Five minutes, starting now.",
    phases: [["idle", 600], ["listening", 1800], ["thinking", 600], ["speaking", 1500], ["result", 4200]],
  },
  {
    id: "job",
    tab: "Jobs",
    said: "Find the best standing desks under $300.",
    reply: "On it. I'll do that in the background.",
    phases: [["idle", 600], ["listening", 2100], ["thinking", 600], ["speaking", 1600], ["working", 2600], ["done", 3000]],
  },
  {
    id: "type",
    tab: "Type",
    said: "um so thursday works no actually friday works better for me",
    phases: [["idle", 600], ["listening", 2600], ["thinking", 900], ["result", 3600]],
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

/** Drives scene → phase on a timeline; picking a tab restarts that scene. */
function useTimeline(reduced: boolean) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const scene = SCENES[sceneIndex];

  useEffect(() => {
    if (reduced || paused) return;
    const [, duration] = scene.phases[phaseIndex];
    const t = window.setTimeout(() => {
      if (phaseIndex + 1 < scene.phases.length) {
        setPhaseIndex(phaseIndex + 1);
      } else {
        setSceneIndex((sceneIndex + 1) % SCENES.length);
        setPhaseIndex(0);
      }
    }, duration);
    return () => window.clearTimeout(t);
  }, [reduced, paused, scene, sceneIndex, phaseIndex]);

  const pick = (i: number) => {
    setSceneIndex(i);
    setPhaseIndex(0);
  };

  // Reduced motion: one still frame per scene, the outcome.
  const shownIndex = reduced ? scene.phases.length - 1 : phaseIndex;
  const total = scene.phases.reduce((n, [, d]) => n + d, 0);
  const elapsed = scene.phases.slice(0, shownIndex).reduce((n, [, d]) => n + d, 0);
  return { scene, sceneIndex, phase: scene.phases[shownIndex][0], phaseIndex: shownIndex, pick, setPaused, total, elapsed };
}

/** Words appear one by one while you "speak". */
function Spoken({ text, active }: { text: string; active: boolean }) {
  const words = text.split(" ");
  const [shown, setShown] = useState(active ? 0 : words.length);
  useEffect(() => {
    if (!active) return;
    const step = Math.max(90, 1500 / words.length);
    const t = window.setInterval(() => setShown((n) => (n >= words.length ? n : n + 1)), step);
    return () => window.clearInterval(t);
  }, [active, text, words.length]);
  return <>{words.slice(0, shown).join(" ")}</>;
}

function Dots() {
  return (
    <span className="flex items-center gap-[3px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-[4px] w-[4px] rounded-full bg-white/80"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

function Bars() {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="w-[2.5px] rounded-full bg-white"
          animate={{ height: ["30%", "100%", "45%", "80%", "30%"] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </span>
  );
}

function Spinner() {
  return (
    <motion.span
      className="block h-3 w-3 rounded-full border-[1.5px] border-white/25 border-t-white"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      aria-hidden
    />
  );
}

/** "5:00", then ticking down a second at a time (still when motion is reduced). */
function Countdown({ from, ticking }: { from: number; ticking: boolean }) {
  const [left, setLeft] = useState(from);
  useEffect(() => {
    if (!ticking) return;
    const t = window.setInterval(() => setLeft((n) => Math.max(0, n - 1)), 1000);
    return () => window.clearInterval(t);
  }, [ticking]);
  return <>{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</>;
}

/** The notch: a camera cutout at rest, a live pill or card while Lazur works. */
function Notch({ scene, phase, reduced }: { scene: Scene; phase: Phase; reduced: boolean }) {
  const dictation = scene.id === "type";

  let body: React.ReactNode = null;
  let size = { w: "19%", h: "3.4%" };

  if (phase === "listening") {
    size = { w: "46%", h: "8.4%" };
    body = (
      <Pill label={dictation ? "Dictating" : "Listening"} right={<span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: CORAL }} />}>
        <Spoken text={scene.said} active={!reduced} />
      </Pill>
    );
  } else if (phase === "thinking") {
    size = { w: "34%", h: "4.2%" };
    body = <Pill label={dictation ? "Cleaning up" : "Thinking"} right={dictation ? <Dots /> : <Spinner />} />;
  } else if (phase === "speaking") {
    size = { w: "46%", h: "8.4%" };
    body = (
      <Pill label="Speaking" right={<Bars />}>
        <span className="text-white/90">{scene.reply}</span>
      </Pill>
    );
  } else if (phase === "result" && scene.id === "timer") {
    size = { w: "34%", h: "4.2%" };
    body = (
      <div className="relative flex h-full items-center justify-between px-[4%]">
        <span className="flex items-center gap-1 text-[clamp(7px,1.05cqw,11px)] font-medium text-white">
          <TimerIcon className="h-[1.1em] w-[1.1em]" style={{ color: "#ff8a80" }} /> Timer
        </span>
        <span className="text-[clamp(7.5px,1.15cqw,12px)] font-semibold tabular-nums text-white"><Countdown from={300} ticking={!reduced} /></span>
        <motion.span
          className="absolute bottom-0 left-[4%] h-[2px] rounded-full"
          style={{ background: CORAL }}
          initial={{ width: "92%" }}
          animate={{ width: reduced ? "80%" : "70%" }}
          transition={{ duration: 4, ease: "linear" }}
        />
      </div>
    );
  } else if (phase === "working") {
    size = { w: "34%", h: "4.2%" };
    body = <Pill label="Working" right={<Spinner />} />;
  } else if (phase === "done") {
    size = { w: "46%", h: "4.2%" };
    body = (
      <div className="flex h-full items-center justify-between px-[4%]">
        <span className="truncate text-[clamp(7px,1.05cqw,11px)] font-medium text-white">Desk research is done</span>
        <span className="flex items-center gap-1 rounded-full bg-white px-[0.6em] py-[0.15em] text-[clamp(6.5px,0.95cqw,10px)] font-semibold text-black">
          <FileText className="h-[1em] w-[1em]" /> Full report
        </span>
      </div>
    );
  }

  return (
    <motion.div
      className="absolute left-1/2 top-0 z-30 -translate-x-1/2 overflow-hidden rounded-b-[clamp(8px,1.4cqw,16px)] bg-black shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
      animate={{ width: size.w, height: size.h }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      aria-hidden
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${scene.id}-${phase}`}
          className="h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {body}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function Pill({ label, right, children }: { label: string; right?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[2.625cqw] shrink-0 items-center justify-between px-[4%]">
        <span className="text-[clamp(7px,1.05cqw,11px)] font-medium text-white">{label}</span>
        {right}
      </div>
      {children ? (
        <div className="flex flex-1 items-center justify-center overflow-hidden px-[5%] pb-[2%] text-center text-[clamp(7px,1.05cqw,11.5px)] leading-tight text-white/80">
          <span className="truncate">{children}</span>
        </div>
      ) : null}
    </div>
  );
}

/** Hand-drawn circle around the icon it's placed in, with the icon's name underneath. */
function PointCircle({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-[4.4cqw] -translate-x-1/2 -translate-y-1/2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <svg viewBox="0 0 60 60" className="w-full overflow-visible">
            <motion.path
              d="M30 6 C46 5 55 17 54 31 C53 46 41 55 28 54 C14 53 5 43 6 29 C7 16 17 7 33 8"
              fill="none"
              stroke={CORAL}
              strokeWidth="3.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          </svg>
          <motion.span
            className="absolute right-0 top-[105%] whitespace-nowrap rounded-full border px-[0.7em] py-[0.2em] text-[clamp(7px,1cqw,11px)] font-semibold"
            style={{ background: "#ffdcdc", color: "#381212", borderColor: "rgba(239,83,80,0.35)" }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            Control Center
          </motion.span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Lazur's cursor buddy: a small coral triangle that follows the pointer and flies to targets. */
function Buddy({ at }: { at: { x: string; y: string } }) {
  return (
    <motion.div
      className="pointer-events-none absolute z-40"
      animate={{ left: at.x, top: at.y }}
      transition={{ type: "spring", stiffness: 70, damping: 16 }}
      aria-hidden
    >
      <svg width="13" height="13" viewBox="0 0 12 12" style={{ transform: "rotate(-28deg)" }}>
        <path d="M6 1 L11 10.5 L1 10.5 Z" fill={CORAL} />
      </svg>
    </motion.div>
  );
}

function MenuBar({ pointing }: { pointing: boolean }) {
  const icon = "h-[clamp(7px,1.1cqw,12px)] w-auto text-black/75";
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex h-[clamp(12px,2.1cqw,22px)] items-center justify-between bg-white/55 px-[2.2%] text-[clamp(6px,0.95cqw,10.5px)] font-medium text-black/80 backdrop-blur-md">
      <div className="flex items-center gap-[1.6em]">
        <svg viewBox="0 0 14 17" className={icon} fill="currentColor" aria-hidden>
          <path d="M11.6 9c0-2.1 1.7-3.1 1.8-3.2-1-1.5-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.8-2.8-.7-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7 1.3 0 1.7.7 2.8.7 1.2 0 1.9-1.1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4s-2.6-1-2.6-3.6zM9.5 2.8c.6-.7 1-1.7.9-2.8-.9 0-2 .6-2.6 1.4-.6.6-1.1 1.7-.9 2.7 1 .1 2-.5 2.6-1.3z" />
        </svg>
        <span className="font-semibold">Mail</span>
        <span className="hidden sm:inline">File</span>
        <span className="hidden sm:inline">Edit</span>
        <span className="hidden md:inline">View</span>
      </div>
      <div className="flex items-center gap-[1.4em]">
        <Search className={icon} />
        <svg viewBox="0 0 20 14" className={icon} fill="currentColor" aria-hidden>
          <path d="M10 13.2l2.2-2.6a3.3 3.3 0 00-4.4 0zM5.3 8a7 7 0 019.4 0l1.4-1.6a9.2 9.2 0 00-12.2 0zM1.4 4.4a12.8 12.8 0 0117.2 0L20 2.8a15 15 0 00-20 0z" />
        </svg>
        {/* Control Center: two toggles (what the Point scene circles) */}
        <span className="relative flex items-center">
          <svg viewBox="0 0 18 14" className={icon} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <rect x="1" y="1" width="16" height="5" rx="2.5" />
            <circle cx="13.5" cy="3.5" r="1.3" fill="currentColor" />
            <rect x="1" y="8" width="16" height="5" rx="2.5" />
            <circle cx="4.5" cy="10.5" r="1.3" fill="currentColor" />
          </svg>
          <PointCircle show={pointing} />
        </span>
        <svg viewBox="0 0 26 13" className={icon} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
          <rect x="1" y="1" width="21" height="11" rx="3" />
          <rect x="3" y="3" width="15" height="7" rx="1.5" fill="currentColor" stroke="none" />
          <path d="M24 5v3" strokeLinecap="round" />
        </svg>
        <span>Tue 9:41</span>
      </div>
    </div>
  );
}

/** A Mail window: an email from Maya, and the reply that dictation fills in. */
function MailWindow({ typed }: { typed: boolean }) {
  return (
    <div className="absolute left-[14%] right-[14%] top-[17%] bottom-[30%] z-0 overflow-hidden rounded-[clamp(6px,1cqw,12px)] bg-white shadow-[0_20px_60px_rgba(28,25,23,0.18)] ring-1 ring-black/5">
      <div className="flex h-[11%] items-center gap-[1.2%] border-b border-black/5 px-[2.5%]">
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} className="h-[clamp(5px,0.8cqw,9px)] w-[clamp(5px,0.8cqw,9px)] rounded-full" style={{ background: c }} />
        ))}
      </div>
      <div className="space-y-[2.5%] px-[5%] py-[3.5%] text-left text-[clamp(7px,1.1cqw,12.5px)] leading-snug text-[#1c1917]">
        <div className="flex items-center gap-[2%]">
          <span className="grid h-[clamp(14px,2.4cqw,26px)] w-[clamp(14px,2.4cqw,26px)] place-items-center rounded-full bg-[#ede9fe] text-[0.85em] font-semibold text-[#5b3fd6]">M</span>
          <div>
            <p className="font-semibold">Maya Chen</p>
            <p className="text-[0.85em] text-black/45">Design review: does Thursday work?</p>
          </div>
        </div>
        <p className="text-black/70">Hey! Can we move the design review to later this week? Thursday afternoon works for me.</p>
        <div className="rounded-[0.6em] border border-black/10 px-[3%] py-[2.5%]">
          <AnimatePresence mode="wait">
            {typed ? (
              <motion.p key="typed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-black/85">
                Friday works better for me.
                <span className="ml-[1px] inline-block h-[1em] w-[1.5px] translate-y-[2px] animate-pulse bg-black/60" />
              </motion.p>
            ) : (
              <motion.p key="empty" exit={{ opacity: 0 }} className="text-black/25">
                Reply…
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function NotchStage() {
  const reduced = usePrefersReducedMotion();
  const { scene, sceneIndex, phase, phaseIndex, pick, setPaused, total, elapsed } = useTimeline(reduced);
  const stageRef = useRef<HTMLDivElement>(null);

  const pointing = scene.id === "point" && (phase === "speaking" || phase === "result");
  const buddyAt = pointing ? { x: "85.5%", y: "5.5%" } : scene.id === "type" ? { x: "40%", y: "53%" } : { x: "58%", y: "40%" };
  const typed = scene.id === "type" && phase === "result";

  return (
    <div className="w-full">
      <div
        ref={stageRef}
        className="relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-[clamp(12px,2cqw,24px)] [container-type:inline-size] shadow-[0_30px_90px_rgba(28,25,23,0.22)] ring-1 ring-black/10"
        style={{ background: "linear-gradient(135deg, #c9b8ff 0%, #f3c4dd 45%, #ffd2a8 100%)" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        role="img"
        aria-label={`Lazur demo: you say "${scene.said}"${scene.reply ? ` and Lazur answers "${scene.reply}"` : ", and the cleaned-up text is typed into the reply"}.`}
      >
        <MenuBar pointing={pointing} />
        <MailWindow typed={typed} />
        <Notch scene={scene} phase={phase} reduced={reduced} />
        <Buddy at={buddyAt} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Demo">
        {SCENES.map((s, i) => {
          const active = i === sceneIndex;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => pick(i)}
              className={`relative overflow-hidden rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                active ? "bg-[var(--foreground)] text-white" : "bg-black/[0.05] text-[var(--foreground-muted)] hover:bg-black/[0.08]"
              }`}
            >
              {active && !reduced ? (
                <motion.span
                  key={`${s.id}-${phaseIndex === 0 ? "start" : "run"}`}
                  className="absolute inset-y-0 left-0 bg-white/15"
                  initial={{ width: `${(elapsed / total) * 100}%` }}
                  animate={{ width: "100%" }}
                  transition={{ duration: (total - elapsed) / 1000, ease: "linear" }}
                />
              ) : null}
              <span className="relative">{s.tab}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[13px] text-[var(--foreground-faint)]" aria-live="polite">
        You say <span className="text-[var(--foreground-muted)]">&ldquo;{scene.id === "type" ? "Friday works better for me" : scene.said}&rdquo;</span>
      </p>
    </div>
  );
}
