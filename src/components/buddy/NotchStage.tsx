"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Keyboard, MousePointerClick, Search, Sparkles, Timer as TimerIcon } from "lucide-react";

/**
 * The hero demo: a Mac screen whose notch does what Lazur does. Each scene has its own app on
 * screen: point at a button in Keynote, start a timer from a recipe in Safari, hand off research
 * in Chrome, dictate a reply in Mail. Scenes loop (or are picked from the tabs). Drawn in code, so
 * it stays crisp and loads instantly.
 */

const CORAL = "#ef5350";

type SceneId = "point" | "timer" | "job" | "type";

type Phase = "idle" | "listening" | "thinking" | "speaking" | "result" | "working" | "done";

type Scene = {
  id: SceneId;
  tab: string;
  /** Shown on the screen as the scene starts. */
  caption: string;
  icon: typeof Sparkles;
  app: string;
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
    caption: "Points at anything",
    icon: MousePointerClick,
    app: "Keynote",
    said: "Where's the share button?",
    reply: "Top right. Right here.",
    phases: [["idle", 300], ["listening", 1400], ["thinking", 1200], ["speaking", 2000], ["result", 1900]],
  },
  {
    id: "timer",
    tab: "Timer",
    caption: "Timers in the notch",
    icon: TimerIcon,
    app: "Safari",
    said: "Set a timer for 10 minutes.",
    reply: "Ten minutes, starting now.",
    phases: [["idle", 300], ["listening", 1400], ["thinking", 1200], ["speaking", 1900], ["result", 2400]],
  },
  {
    id: "job",
    tab: "Jobs",
    caption: "Jobs in the background",
    icon: Sparkles,
    app: "Chrome",
    said: "Compare standing desks under $300.",
    reply: "On it. I'll do that in the background.",
    phases: [["idle", 300], ["listening", 1500], ["thinking", 1200], ["speaking", 2000], ["working", 2400], ["done", 2200]],
  },
  {
    id: "type",
    tab: "Type",
    caption: "Types for you, anywhere",
    icon: Keyboard,
    app: "Notes",
    said: "um so for the offsite tomorrow we need to first book the venue second confirm catering for twenty people and third send everyone the agenda by friday",
    phases: [["idle", 300], ["listening", 3200], ["thinking", 1300], ["result", 3400]],
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
  const scene = SCENES[sceneIndex];

  useEffect(() => {
    if (reduced) return;
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
  }, [reduced, scene, sceneIndex, phaseIndex]);

  const pick = (i: number) => {
    setSceneIndex(i);
    setPhaseIndex(0);
  };

  // Reduced motion: one still frame per scene, the outcome.
  const shownIndex = reduced ? scene.phases.length - 1 : phaseIndex;
  const total = scene.phases.reduce((n, [, d]) => n + d, 0);
  const elapsed = scene.phases.slice(0, shownIndex).reduce((n, [, d]) => n + d, 0);
  return { scene, sceneIndex, phase: scene.phases[shownIndex][0], phaseIndex: shownIndex, pick, total, elapsed };
}

/** Words appear quickly, like live transcription, filling most of the listening time. */
function Spoken({ text, active, within }: { text: string; active: boolean; within: number }) {
  const words = text.split(" ");
  const [shown, setShown] = useState(active ? 1 : words.length);
  useEffect(() => {
    if (!active) return;
    const step = Math.max(45, (within * 0.75) / words.length);
    const t = window.setInterval(() => setShown((n) => (n >= words.length ? n : n + 1)), step);
    return () => window.clearInterval(t);
  }, [active, within, words.length]);
  const said = words.slice(0, shown).join(" ");
  return <>{said.length > 64 ? `…${said.slice(-64)}` : said}</>;
}

function Dots() {
  return (
    <span className="flex items-center gap-[0.25cqw]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-[0.4cqw] w-[0.4cqw] rounded-full bg-white/80"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.13 }}
        />
      ))}
    </span>
  );
}

function Bars() {
  return (
    <span className="flex h-[1.1cqw] items-end gap-[0.2cqw]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="w-[0.25cqw] rounded-full bg-white"
          animate={{ height: ["30%", "100%", "45%", "85%", "30%"] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </span>
  );
}

function Spinner() {
  return (
    <motion.span
      className="block h-[1.1cqw] w-[1.1cqw] rounded-full border-[0.15cqw] border-white/25 border-t-white"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      aria-hidden
    />
  );
}

/** "10:00", then ticking down a second at a time (still when motion is reduced). */
function Countdown({ from, ticking }: { from: number; ticking: boolean }) {
  const [left, setLeft] = useState(from);
  useEffect(() => {
    if (!ticking) return;
    const t = window.setInterval(() => setLeft((n) => Math.max(0, n - 1)), 1000);
    return () => window.clearInterval(t);
  }, [ticking]);
  return <>{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</>;
}

const TEXT = "text-[1.05cqw]";

function Pill({ label, right, children }: { label: string; right?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[2.625cqw] shrink-0 items-center justify-between px-[4%]">
        <span className={`${TEXT} font-medium text-white`}>{label}</span>
        {right}
      </div>
      {children ? (
        <div className={`flex flex-1 items-center justify-center overflow-hidden px-[5%] pb-[2%] text-center ${TEXT} leading-tight text-white/85`}>
          <span className="truncate">{children}</span>
        </div>
      ) : null}
    </div>
  );
}

/** The notch: a camera cutout at rest, a live pill or card while Lazur works. */
function Notch({ scene, phase, reduced }: { scene: Scene; phase: Phase; reduced: boolean }) {
  const dictation = scene.id === "type";
  const listenFor = scene.phases.find(([p]) => p === "listening")?.[1] ?? 1200;

  let body: ReactNode = null;
  let size = { w: "19%", h: "3.4%" };

  if (phase === "listening") {
    size = { w: "46%", h: "8.4%" };
    body = (
      <Pill label={dictation ? "Dictating" : "Listening"} right={<span className="h-[0.55cqw] w-[0.55cqw] animate-pulse rounded-full" style={{ background: CORAL }} />}>
        <Spoken text={scene.said} active={!reduced} within={listenFor} />
      </Pill>
    );
  } else if (phase === "thinking") {
    size = { w: "34%", h: "4.2%" };
    body = <Pill label={dictation ? "Cleaning up" : "Thinking"} right={dictation ? <Dots /> : <Spinner />} />;
  } else if (phase === "speaking") {
    size = { w: "46%", h: "8.4%" };
    body = (
      <Pill label="Speaking" right={<Bars />}>
        <span className="font-medium text-white">{scene.reply}</span>
      </Pill>
    );
  } else if (phase === "result" && scene.id === "timer") {
    size = { w: "34%", h: "4.2%" };
    body = (
      <div className="relative flex h-full items-center justify-between px-[4%]">
        <span className={`flex items-center gap-[0.5cqw] ${TEXT} font-medium text-white`}>
          <TimerIcon className="h-[1.2cqw] w-[1.2cqw]" style={{ color: "#ff8a80" }} /> Pasta
        </span>
        <span className="text-[1.2cqw] font-semibold tabular-nums text-white"><Countdown from={600} ticking={!reduced} /></span>
        <motion.span
          className="absolute bottom-0 left-[4%] h-[0.2cqw] rounded-full"
          style={{ background: CORAL }}
          initial={{ width: "92%" }}
          animate={{ width: reduced ? "88%" : "84%" }}
          transition={{ duration: 3, ease: "linear" }}
        />
      </div>
    );
  } else if (phase === "working") {
    size = { w: "34%", h: "4.2%" };
    body = <Pill label="Working on desk research" right={<Spinner />} />;
  } else if (phase === "done") {
    size = { w: "46%", h: "4.2%" };
    body = (
      <div className="flex h-full items-center justify-between px-[4%]">
        <span className={`truncate ${TEXT} font-medium text-white`}>Desk research is done</span>
        <span className="flex items-center gap-[0.4cqw] rounded-full bg-white px-[0.8cqw] py-[0.15cqw] text-[0.95cqw] font-semibold text-black">
          <FileText className="h-[1cqw] w-[1cqw]" /> Full report
        </span>
      </div>
    );
  }

  return (
    <motion.div
      className="absolute left-1/2 top-0 z-30 -translate-x-1/2 overflow-hidden rounded-b-[1.4cqw] bg-black shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
      animate={{ width: size.w, height: size.h }}
      // Like the Dynamic Island: old content fades out, then the shape morphs, then new content fades in.
      transition={{ type: "spring", stiffness: 340, damping: 32, delay: 0.08 }}
      aria-hidden
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${scene.id}-${phase}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.14, duration: 0.16 } }}
          exit={{ opacity: 0, transition: { duration: 0.08 } }}
        >
          {body}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/** Hand-drawn circle around whatever it's placed in, with a label underneath. */
function PointCircle({ show, label }: { show: boolean; label: string }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div className="pointer-events-none absolute -inset-[0.9cqw] z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="h-full w-full overflow-visible">
            <motion.path
              d="M52 4 C80 3 97 15 96 30 C95 47 74 57 49 56 C24 55 4 45 5 29 C6 14 25 5 58 6"
              fill="none"
              stroke={CORAL}
              strokeWidth="2.6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </svg>
          <motion.span
            className="absolute right-0 top-[108%] whitespace-nowrap rounded-full border px-[0.8cqw] py-[0.2cqw] text-[1cqw] font-semibold"
            style={{ background: "#ffdcdc", color: "#381212", borderColor: "rgba(239,83,80,0.35)" }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            {label}
          </motion.span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** The Mac pointer, with Lazur's sparkle buddy beside it (the "Sparkle" cursor style). */
function Pointer({ at, sparkleAt }: { at: { x: string; y: string }; sparkleAt: { x: string; y: string } }) {
  return (
    <>
      <motion.div
        className="pointer-events-none absolute z-40"
        animate={{ left: at.x, top: at.y }}
        transition={{ type: "spring", stiffness: 60, damping: 18, mass: 0.9 }}
        aria-hidden
      >
        <svg viewBox="0 0 12 18" className="h-[1.7cqw] w-auto drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
          <path d="M1 1 L1 15 L4.5 11.6 L7 17 L9.2 16 L6.8 10.8 L11.5 10.8 Z" fill="#111" stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
        </svg>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute z-40"
        animate={{ left: sparkleAt.x, top: sparkleAt.y }}
        transition={{ type: "spring", stiffness: 55, damping: 16, mass: 0.9 }}
        aria-hidden
      >
        <motion.svg
          viewBox="0 0 24 24"
          className="h-[1.5cqw] w-[1.5cqw]"
          style={{ filter: "drop-shadow(0 0 0.35cqw rgba(239,83,80,0.65))" }}
          animate={{ rotate: [0, 12, 0, -12, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M12 1.5 C12.6 7.4 16.6 11.4 22.5 12 C16.6 12.6 12.6 16.6 12 22.5 C11.4 16.6 7.4 12.6 1.5 12 C7.4 11.4 11.4 7.4 12 1.5 Z" fill={CORAL} />
        </motion.svg>
      </motion.div>
    </>
  );
}

function MenuBar({ app }: { app: string }) {
  const icon = "h-[1.1cqw] w-auto text-black/75";
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex h-[2.1cqw] items-center justify-between bg-white/55 px-[2.2%] text-[0.95cqw] font-medium text-black/80 backdrop-blur-md">
      <div className="flex items-center gap-[1.6em]">
        <svg viewBox="0 0 14 17" className={icon} fill="currentColor" aria-hidden>
          <path d="M11.6 9c0-2.1 1.7-3.1 1.8-3.2-1-1.5-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.8-2.8-.7-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7 1.3 0 1.7.7 2.8.7 1.2 0 1.9-1.1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4s-2.6-1-2.6-3.6zM9.5 2.8c.6-.7 1-1.7.9-2.8-.9 0-2 .6-2.6 1.4-.6.6-1.1 1.7-.9 2.7 1 .1 2-.5 2.6-1.3z" />
        </svg>
        <AnimatePresence mode="wait">
          <motion.span key={app} className="font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            {app}
          </motion.span>
        </AnimatePresence>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
      </div>
      <div className="flex items-center gap-[1.4em]">
        <Search className={icon} />
        <svg viewBox="0 0 20 14" className={icon} fill="currentColor" aria-hidden>
          <path d="M10 13.2l2.2-2.6a3.3 3.3 0 00-4.4 0zM5.3 8a7 7 0 019.4 0l1.4-1.6a9.2 9.2 0 00-12.2 0zM1.4 4.4a12.8 12.8 0 0117.2 0L20 2.8a15 15 0 00-20 0z" />
        </svg>
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

// --- App windows, one per scene -------------------------------------------------------------

function Window({ title, toolbar, children, dark = false }: { title?: string; toolbar?: ReactNode; children: ReactNode; dark?: boolean }) {
  return (
    <div className={`absolute inset-x-[11%] top-[13%] bottom-[16%] overflow-hidden rounded-[1.1cqw] shadow-[0_20px_60px_rgba(28,25,23,0.2)] ring-1 ring-black/5 ${dark ? "bg-[#1f1f22]" : "bg-white"}`}>
      <div className={`flex h-[3.6cqw] items-center gap-[0.7cqw] border-b px-[1.6cqw] ${dark ? "border-white/10" : "border-black/5"}`}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} className="h-[0.85cqw] w-[0.85cqw] rounded-full" style={{ background: c }} />
        ))}
        {title ? <span className={`ml-[1cqw] text-[1cqw] font-medium ${dark ? "text-white/70" : "text-black/60"}`}>{title}</span> : null}
        <div className="ml-auto flex items-center gap-[0.8cqw]">{toolbar}</div>
      </div>
      {children}
    </div>
  );
}

function KeynoteWindow({ pointing }: { pointing: boolean }) {
  const tool = "rounded-[0.5cqw] px-[0.9cqw] py-[0.35cqw] text-[1cqw] text-black/60";
  return (
    <Window
      title="Launch deck"
      toolbar={
        <>
          <span className={tool}>Play</span>
          <span className={tool}>Insert</span>
          <span className="relative">
            <span className={`${tool} bg-black/[0.05] font-medium text-black/75`}>Share</span>
            <PointCircle show={pointing} label="Share" />
          </span>
        </>
      }
    >
      <div className="flex h-full">
        <div className="w-[16%] space-y-[0.8cqw] border-r border-black/5 bg-black/[0.02] p-[1cqw]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`aspect-video rounded-[0.4cqw] ${i === 0 ? "ring-2 ring-[#6b4bfc]" : ""}`} style={{ background: i === 0 ? "linear-gradient(135deg,#6b4bfc,#f97316)" : "#ece9f6" }} />
          ))}
        </div>
        <div className="flex flex-1 items-center justify-center p-[3cqw]">
          <div className="flex aspect-video w-[78%] flex-col justify-end rounded-[0.8cqw] p-[2.4cqw] text-left text-white" style={{ background: "linear-gradient(135deg,#6b4bfc 0%,#a855f7 50%,#f97316 100%)" }}>
            <p className="text-[2.6cqw] font-semibold leading-none">Q4 Launch</p>
            <p className="mt-[0.6cqw] text-[1.1cqw] opacity-80">What we shipped, and what&apos;s next</p>
          </div>
        </div>
      </div>
    </Window>
  );
}

function RecipeWindow() {
  return (
    <Window title="Spaghetti carbonara · Safari">
      <div className="grid h-full grid-cols-[1fr_1.3fr] gap-[2cqw] p-[2.4cqw] text-left">
        <div className="rounded-[0.8cqw]" style={{ background: "radial-gradient(circle at 40% 40%, #ffe3a3, #f6b65b 55%, #d98a3c)" }} />
        <div>
          <p className="text-[2cqw] font-semibold leading-tight text-[#1c1917]">Spaghetti carbonara</p>
          <p className="mt-[0.4cqw] text-[1cqw] text-black/45">Serves 2 · 20 minutes</p>
          <ol className="mt-[1.4cqw] space-y-[0.8cqw] text-[1.1cqw] text-black/70">
            <li>1. Whisk eggs, pecorino and pepper.</li>
            <li className="rounded-[0.4cqw] bg-[#fff4d6] px-[0.6cqw] py-[0.3cqw] font-medium text-black/85">2. Boil the pasta for 10 minutes.</li>
            <li>3. Crisp the guanciale in a pan.</li>
            <li>4. Toss everything off the heat.</li>
          </ol>
        </div>
      </div>
    </Window>
  );
}

const TABS = ["Wirecutter", "Reddit", "Amazon", "The Verge", "YouTube"];

function ChromeWindow({ phase }: { phase: Phase }) {
  const opened = phase === "working" ? 3 : phase === "done" ? TABS.length : 0;
  return (
    <Window
      dark
      toolbar={
        <div className="flex items-center gap-[0.5cqw]">
          <AnimatePresence>
            {TABS.slice(0, opened).map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, x: -8, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: phase === "working" ? i * 0.45 : 0, duration: 0.25 }}
                className="flex items-center gap-[0.4cqw] rounded-[0.5cqw] bg-white/10 px-[0.8cqw] py-[0.3cqw] text-[0.9cqw] text-white/80"
              >
                <Sparkles className="h-[0.9cqw] w-[0.9cqw]" style={{ color: CORAL }} /> {t}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      }
    >
      <div className="space-y-[1.2cqw] p-[2.4cqw] text-left">
        <p className="text-[1cqw] font-semibold uppercase tracking-[0.12em] text-white/40">Lazur is researching</p>
        {["Flexispot E7", "Uplift V2", "Fully Jarvis", "IKEA Bekant"].map((desk, i) => (
          <div key={desk} className="flex items-center justify-between rounded-[0.6cqw] bg-white/[0.06] px-[1.2cqw] py-[0.9cqw]">
            <span className="text-[1.15cqw] text-white/85">{desk}</span>
            <motion.span
              className="h-[0.4cqw] rounded-full"
              style={{ background: phase === "done" ? "#34d399" : CORAL }}
              initial={{ width: "0cqw" }}
              animate={{ width: phase === "done" ? "12cqw" : phase === "working" ? `${3 + i * 2.4}cqw` : "0cqw" }}
              transition={{ duration: 1.2, delay: i * 0.2 }}
            />
          </div>
        ))}
      </div>
    </Window>
  );
}

const NOTE_LINES = [
  { text: "For the offsite tomorrow we need to:", heading: true },
  { text: "1. Book the venue" },
  { text: "2. Confirm catering for 20 people" },
  { text: "3. Send everyone the agenda by Friday" },
];

/** Notes: the long rambling sentence lands as a heading and a numbered list, line by line. */
function NotesWindow({ typed }: { typed: boolean }) {
  return (
    <Window title="Offsite plan · Notes">
      <div className="flex h-full">
        <div className="w-[22%] space-y-[0.6cqw] border-r border-black/5 bg-[#fbf7ea] p-[1.2cqw] text-left">
          {["Offsite plan", "Groceries", "Book ideas"].map((n, i) => (
            <div key={n} className={`rounded-[0.5cqw] px-[0.8cqw] py-[0.6cqw] text-[1cqw] ${i === 0 ? "bg-[#f5d76e]/60 font-semibold text-black/80" : "text-black/50"}`}>{n}</div>
          ))}
        </div>
        <div className="flex-1 p-[2.4cqw] text-left">
          <p className="text-[1.8cqw] font-semibold text-[#1c1917]">Offsite plan</p>
          <div className="mt-[1.4cqw] space-y-[0.7cqw] text-[1.3cqw] leading-snug text-black/80">
            {typed ? (
              NOTE_LINES.map((line, i) => (
                <motion.p
                  key={line.text}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.28, duration: 0.25 }}
                  className={line.heading ? "font-medium text-black/85" : "pl-[1cqw]"}
                >
                  {line.text}
                  {i === NOTE_LINES.length - 1 ? <span className="ml-[2px] inline-block h-[1em] w-[1.5px] translate-y-[2px] animate-pulse bg-black/60" /> : null}
                </motion.p>
              ))
            ) : (
              <p className="text-black/25">Start typing…</p>
            )}
          </div>
        </div>
      </div>
    </Window>
  );
}

function SceneWindow({ scene, phase }: { scene: Scene; phase: Phase }) {
  switch (scene.id) {
    case "point":
      return <KeynoteWindow pointing={phase === "speaking" || phase === "result"} />;
    case "timer":
      return <RecipeWindow />;
    case "job":
      return <ChromeWindow phase={phase} />;
    case "type":
      return <NotesWindow typed={phase === "result"} />;
  }
}

/** One key on the keyboard, pushed down while it's held. */
function Keycap({ children, wide = false, down }: { children: ReactNode; wide?: boolean; down: boolean }) {
  return (
    <motion.span
      className={`grid h-[4.2cqw] place-items-center rounded-[0.9cqw] border text-[1.5cqw] font-semibold ${wide ? "min-w-[6.4cqw] px-[1cqw]" : "w-[4.2cqw]"}`}
      animate={
        down
          ? { y: "0.35cqw", backgroundColor: "#1c1917", color: "#ffffff", borderColor: "#1c1917", boxShadow: "0 0 0 0.35cqw rgba(239,83,80,0.35)" }
          : { y: "0cqw", backgroundColor: "#ffffff", color: "#1c1917", borderColor: "rgba(28,25,23,0.15)", boxShadow: "0 0.35cqw 0 rgba(28,25,23,0.18)" }
      }
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.span>
  );
}

/** Bottom-left of the screen: the shortcut for this scene, held while you speak. */
function HeldKeys({ scene, phase }: { scene: Scene; phase: Phase }) {
  const dictation = scene.id === "type";
  const down = phase === "listening";
  return (
    <div className="absolute bottom-[3.5%] left-[2.5%] z-30 flex items-center gap-[1cqw] rounded-[1.4cqw] bg-white/80 px-[1.2cqw] py-[1cqw] shadow-lg backdrop-blur">
      <div className="flex gap-[0.6cqw]">
        {dictation ? (
          <Keycap wide down={down}>fn</Keycap>
        ) : (
          <>
            <Keycap down={down}>⌥</Keycap>
            <Keycap down={down}>⌘</Keycap>
          </>
        )}
      </div>
      <div className="text-left leading-tight">
        <p className="text-[1.15cqw] font-semibold text-[#1c1917]">{down ? "Holding…" : "Hold"} {dictation ? "fn" : "⌥ ⌘"}</p>
        <p className="text-[1cqw] text-black/50">{dictation ? "to dictate" : "to ask Lazur"}</p>
      </div>
    </div>
  );
}

/** Where the pointer and the sparkle sit in each scene (the sparkle flies to the target). */
function pointerSpots(scene: Scene, phase: Phase) {
  const [px, py] = ({ point: [52, 56], timer: [60, 52], job: [48, 60], type: [40, 62] } as const)[scene.id];
  const pointer = { x: `${px}%`, y: `${py}%` };
  if (scene.id === "point" && (phase === "speaking" || phase === "result")) return { pointer, sparkle: { x: "79.5%", y: "14%" } };
  // Just below-right of the pointer, like the cursor buddy in the app.
  return { pointer, sparkle: { x: `${px + 1.6}%`, y: `${py + 2.9}%` } };
}

export function NotchStage() {
  const reduced = usePrefersReducedMotion();
  const { scene, sceneIndex, phase, phaseIndex, pick, total, elapsed } = useTimeline(reduced);
  const spots = pointerSpots(scene, phase);
  const CaptionIcon = scene.icon;

  return (
    <div className="w-full">
      <div
        className="relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-[clamp(12px,2cqw,24px)] shadow-[0_30px_90px_rgba(28,25,23,0.22)] ring-1 ring-black/10 [container-type:inline-size]"
        style={{ background: "linear-gradient(135deg, #c9b8ff 0%, #f3c4dd 45%, #ffd2a8 100%)" }}
        role="img"
        aria-label={`Lazur demo, ${scene.caption.toLowerCase()}: you say "${scene.said}"${scene.reply ? ` and Lazur answers "${scene.reply}"` : ", and Lazur types it as a clean list"}.`}
      >
        <MenuBar app={scene.app} />
        <AnimatePresence initial={false}>
          <motion.div
            key={scene.id}
            className="absolute inset-0"
            initial={reduced ? false : { x: "105%", opacity: 0.6, scale: 0.94, filter: "blur(6px)" }}
            animate={{ x: "0%", opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={reduced ? undefined : { x: "-105%", opacity: 0.6, scale: 0.94, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 170, damping: 24, mass: 0.9 }}
          >
            <SceneWindow scene={scene} phase={phase} />
          </motion.div>
        </AnimatePresence>
        <Notch scene={scene} phase={phase} reduced={reduced} />
        <Pointer at={spots.pointer} sparkleAt={spots.sparkle} />
        <HeldKeys scene={scene} phase={phase} />

        {/* What this scene shows, big enough to read at a glance */}
        <AnimatePresence initial={false}>
          <motion.div
            key={scene.id}
            className="absolute bottom-[3.5%] left-1/2 z-30 flex -translate-x-1/2 items-center gap-[0.8cqw] rounded-full bg-black/80 px-[1.8cqw] py-[0.8cqw] text-[1.5cqw] font-semibold text-white shadow-lg backdrop-blur"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: 6 }}
            transition={{ duration: 0.3 }}
          >
            <CaptionIcon className="h-[1.6cqw] w-[1.6cqw]" style={{ color: "#ff8a80" }} />
            {scene.caption}
          </motion.div>
        </AnimatePresence>
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
        You say <span className="text-[var(--foreground-muted)]">&ldquo;{scene.id === "type" ? "first book the venue, second confirm catering…" : scene.said}&rdquo;</span>
      </p>
    </div>
  );
}
