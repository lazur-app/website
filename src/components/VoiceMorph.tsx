"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";
import { OrbCapsule } from "./orb/OrbCapsule";

type Phase = "listening" | "processing" | "done";

type GmailCycle = {
  kind: "gmail";
  app: "Gmail";
  to: string;
  subject: string;
  raw: string;
  /** Full pasted email — one cohesive message, not preamble + rewrite stacked */
  done: string;
};

type SlackCycle = {
  kind: "slack";
  app: "Slack";
  channel: string;
  raw: string;
  polished: string;
};

type CursorCycle = {
  kind: "cursor";
  app: "Cursor";
  file: string;
  preamble: string;
  raw: string;
  polished: string;
};

type Cycle = GmailCycle | SlackCycle | CursorCycle;

/** Fixed scene height — keeps demo window stable across Gmail / Slack / Cursor */
const SCENE_BODY_H = 184;
const SCENE_ORB_H = 46;

const cycles: Cycle[] = [
  {
    kind: "gmail",
    app: "Gmail",
    to: "sarah.chen@meridian.io",
    subject: "Re: Q2 planning sync",
    raw: "yeah so um I wanted to check if you had a chance to look at the doc I sent and maybe we could sync sometime this week if that works for you",
    done: "Hey Sarah,\n\nJust wanted to follow up on our conversation from last week regarding the product roadmap. I wanted to check if you've had a chance to review the document I sent. Would you be available to sync this week?",
  },
  {
    kind: "slack",
    app: "Slack",
    channel: "#product",
    raw: "hey team uh I was thinking we should maybe push the sync to tuesday instead because monday is totally packed",
    polished:
      "Suggest moving the sync to Tuesday — Monday is packed and half of eng is out. Does that work?",
  },
  {
    kind: "cursor",
    app: "Cursor",
    file: "auth.ts",
    preamble: "// TODO: handle token refresh edge cases\n",
    raw: "so um basically the save button like doesn't actually save anything when you edit and click save",
    polished:
      "// Bug: Save action does not persist changes after editing — users lose work on every save attempt.",
  },
];

const STREAM_MS = 5200;
const HOLD_MS = 800;
const PROCESS_MS = 1600;
const DONE_MS = 2600;
const LISTEN_MS = STREAM_MS + HOLD_MS;

/** Listen curve: type a partial draft → backspace → type the full raw line */
const LISTEN_TYPE1_END = 0.34;
const LISTEN_BACKSPACE_END = 0.5;
const LISTEN_TYPE2_END = 0.9;
const LISTEN_PARTIAL_RATIO = 0.4;

const phaseLabel: Record<Phase, string> = {
  listening: "Listening",
  processing: "Rewriting",
  done: "Pasted",
};

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function charIndexAtProgress(t: number, text: string) {
  if (t <= 0) return 0;
  if (t >= 1) return text.length;

  let total = 0;
  const weights = [...text].map((ch) => {
    if (ch === " ") return 2.4;
    if (ch === "," || ch === ".") return 2.8;
    return 1;
  });
  total = weights.reduce((sum, w) => sum + w, 0);

  const target = t * total;
  let acc = 0;
  for (let i = 0; i < text.length; i++) {
    acc += weights[i];
    if (acc >= target) return i + 1;
  }
  return text.length;
}

/** Type → erase → retype curve for the listening phase */
function charIndexAtListenProgress(t: number, text: string) {
  if (t <= 0) return 0;
  if (t >= 1) return text.length;

  const partialIdx = Math.max(1, Math.floor(text.length * LISTEN_PARTIAL_RATIO));

  if (t < LISTEN_TYPE1_END) {
    const local = t / LISTEN_TYPE1_END;
    return Math.round(easeInOutSine(local) * partialIdx);
  }
  if (t < LISTEN_BACKSPACE_END) {
    const local = (t - LISTEN_TYPE1_END) / (LISTEN_BACKSPACE_END - LISTEN_TYPE1_END);
    return Math.round(partialIdx * (1 - easeInOutSine(local)));
  }
  if (t < LISTEN_TYPE2_END) {
    const local = (t - LISTEN_BACKSPACE_END) / (LISTEN_TYPE2_END - LISTEN_BACKSPACE_END);
    return charIndexAtProgress(easeInOutSine(local), text);
  }
  return text.length;
}

function formatTimer(ms: number) {
  const safe = Math.max(0, ms);
  const s = Math.floor(safe / 1000);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, "0")}`;
}

function Cursor({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <motion.span
      aria-hidden
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1.05, repeat: Infinity, ease: "linear" }}
      className="ml-px inline-block h-[1em] w-px translate-y-px bg-[var(--foreground)]"
    />
  );
}

/** Listening + processing share one mount; processing blurs in place (no blink). */
function PhaseText({
  phase,
  revealedRaw,
  doneText,
  doneContent,
  isTyping,
  voiceClassName,
  doneClassName,
}: {
  phase: Phase;
  revealedRaw: string;
  doneText?: string;
  doneContent?: ReactNode;
  isTyping: boolean;
  voiceClassName: string;
  doneClassName: string;
}) {
  const done = doneContent ?? doneText;

  return (
    <AnimatePresence mode="wait">
      {phase === "done" ? (
        <motion.div
          key="done"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={doneClassName}
        >
          {done}
          <Cursor active />
        </motion.div>
      ) : (
        <motion.div
          key="voice"
          animate={{
            opacity: phase === "processing" ? 0.55 : 1,
            filter: phase === "processing" ? "blur(3.5px)" : "blur(0px)",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={voiceClassName}
        >
          {revealedRaw}
          {phase === "listening" && <Cursor active={isTyping} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GmailBody({
  cycle,
  phase,
  revealedRaw,
  isTyping,
}: {
  cycle: GmailCycle;
  phase: Phase;
  revealedRaw: string;
  isTyping: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 space-y-0">
        <div className="flex gap-3 border-b border-[var(--border)] pb-2.5 text-[12px]">
          <span className="w-14 shrink-0 text-[var(--foreground-faint)]">
            To
          </span>
          <span className="font-medium text-[var(--foreground)]">
            {cycle.to}
          </span>
        </div>
        <div className="flex gap-3 border-b border-[var(--border)] pb-2.5 text-[12px]">
          <span className="w-14 shrink-0 text-[var(--foreground-faint)]">
            Subject
          </span>
          <span className="font-medium text-[var(--foreground)]">
            {cycle.subject}
          </span>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden whitespace-pre-wrap pt-2 text-[13px] leading-[1.65] text-[var(--foreground)]">
        <PhaseText
          phase={phase}
          revealedRaw={revealedRaw}
          doneText={cycle.done}
          isTyping={isTyping}
          voiceClassName="italic text-[var(--brand-ink)]"
          doneClassName=""
        />
      </div>
    </div>
  );
}

function SlackBody({
  cycle,
  phase,
  revealedRaw,
  isTyping,
}: {
  cycle: SlackCycle;
  phase: Phase;
  revealedRaw: string;
  isTyping: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 flex-col justify-start rounded-lg border border-[var(--border-strong)] bg-[#faf9f7] px-3.5 py-3">
        <PhaseText
          phase={phase}
          revealedRaw={revealedRaw}
          doneText={cycle.polished}
          isTyping={isTyping}
          voiceClassName="text-[13px] italic leading-[1.65] text-[var(--brand-ink)]"
          doneClassName="text-[13px] font-medium leading-[1.65] text-[var(--foreground)]"
        />
      </div>
    </div>
  );
}

function CursorBody({
  cycle,
  phase,
  revealedRaw,
  isTyping,
}: {
  cycle: CursorCycle;
  phase: Phase;
  revealedRaw: string;
  isTyping: boolean;
}) {
  return (
    <div className="flex h-full flex-col justify-start font-mono text-[12px] leading-[1.75]">
      <PhaseText
        phase={phase}
        revealedRaw={revealedRaw}
        doneContent={
          <>
            <span className="text-[var(--foreground-muted)]">
              {cycle.preamble}
            </span>
            <span className="font-medium text-[var(--foreground)]">
              {cycle.polished}
            </span>
          </>
        }
        isTyping={isTyping}
        voiceClassName="italic text-[#7c6df0]"
        doneClassName=""
      />
    </div>
  );
}

export function VoiceMorph() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("listening");
  const [activity, setActivity] = useState(0.15);
  const [charIndex, setCharIndex] = useState(0);
  const [recordingMs, setRecordingMs] = useState(0);
  const listenStartRef = useRef(0);

  const cycle = cycles[index];
  const cycleMs = LISTEN_MS + PROCESS_MS + DONE_MS;
  const revealedRaw =
    phase === "processing" || phase === "done"
      ? cycle.raw
      : cycle.raw.slice(0, charIndex);
  const isTyping = phase === "listening";

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const runCycle = (cycleIndex: number) => {
      setIndex(cycleIndex);
      setPhase("listening");
      setCharIndex(0);
      setRecordingMs(0);
      listenStartRef.current = performance.now();

      timers.push(setTimeout(() => setPhase("processing"), LISTEN_MS));
      timers.push(
        setTimeout(() => setPhase("done"), LISTEN_MS + PROCESS_MS),
      );
      timers.push(
        setTimeout(
          () => runCycle((cycleIndex + 1) % cycles.length),
          cycleMs,
        ),
      );
    };

    runCycle(0);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [cycleMs]);

  useAnimationFrame((time) => {
    if (phase === "listening") {
      const elapsed = time - listenStartRef.current;
      setRecordingMs(Math.min(elapsed, LISTEN_MS));

      const streamElapsed = Math.min(elapsed, STREAM_MS);
      const linear = streamElapsed / STREAM_MS;
      const next = charIndexAtListenProgress(linear, cycle.raw);
      setCharIndex((prev) => (prev === next ? prev : next));

      const inBackspace =
        linear >= LISTEN_TYPE1_END && linear < LISTEN_BACKSPACE_END;
      const t = time / 1000;
      const base = inBackspace ? 0.12 : 0.3 + Math.sin(t * 2.8) * 0.18;
      const burst =
        !inBackspace && Math.sin(t * 5.2) > 0.92 ? 0.28 : 0;
      const speechBoost =
        !inBackspace && cycle.raw.length > 0
          ? (next / cycle.raw.length) * 0.35
          : 0;
      setActivity(Math.min(1.2, base + burst + speechBoost));
    }
  });

  const showOrb = phase === "listening" || phase === "processing";
  const orbStatus = phase === "listening" ? "listening" : "processing";
  const subtitle =
    cycle.kind === "gmail"
      ? "Compose"
      : cycle.kind === "slack"
        ? cycle.channel
        : cycle.file;

  return (
    <div className="w-full">
      <div className="demo-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--border-strong)] bg-[#f8f6f2] px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex shrink-0 gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="truncate text-[12px] font-semibold text-[var(--foreground)]">
              {cycle.app}
            </span>
            <span className="hidden text-[var(--foreground-faint)] sm:inline">
              ·
            </span>
            <span className="hidden truncate text-[11px] text-[var(--foreground-muted)] sm:inline">
              {subtitle}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {phase === "listening" && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-[11px] tabular-nums text-red-500"
              >
                ● {formatTimer(recordingMs)}
              </motion.span>
            )}
            <AnimatePresence mode="wait">
              <motion.span
                key={phase}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.2 }}
                className="rounded-md border border-[var(--border-strong)] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]"
              >
                {phaseLabel[phase]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="relative bg-white px-4 py-4 sm:px-5 sm:py-5">
          <div
            className="flex flex-col"
            style={{ height: SCENE_BODY_H + SCENE_ORB_H }}
          >
            <div
              className="overflow-hidden"
              style={{ height: SCENE_BODY_H }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`app-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {cycle.kind === "gmail" && (
                    <GmailBody
                      cycle={cycle}
                      phase={phase}
                      revealedRaw={revealedRaw}
                      isTyping={isTyping}
                    />
                  )}
                  {cycle.kind === "slack" && (
                    <SlackBody
                      cycle={cycle}
                      phase={phase}
                      revealedRaw={revealedRaw}
                      isTyping={isTyping}
                    />
                  )}
                  {cycle.kind === "cursor" && (
                    <CursorBody
                      cycle={cycle}
                      phase={phase}
                      revealedRaw={revealedRaw}
                      isTyping={isTyping}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div
              className="flex w-full shrink-0 items-center justify-center"
              style={{ height: SCENE_ORB_H }}
            >
              <AnimatePresence>
                {showOrb && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{
                      duration: 0.28,
                      delay: 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <OrbCapsule
                      status={orbStatus}
                      activity={activity}
                      scale={1}
                      tilt={0}
                      shadowVariant="warm"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
            <p className="text-[11px] text-[var(--foreground-muted)]">
              Live at your cursor
            </p>
            <AnimatePresence>
              {showOrb && (
                <motion.kbd
                  initial={{ opacity: 0, scale: 0.88, y: 2 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -2 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-md border border-[var(--border-strong)] bg-[#f8f6f2] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--foreground)] shadow-sm ring-2 ring-[var(--brand-soft)]"
                >
                  ⌃ Space
                </motion.kbd>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
