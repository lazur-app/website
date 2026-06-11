"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { SoftCard } from "../SoftCard";

const KEYBOARD_WPM = 45;
const LAZUR_WPM = 220;
const SPEED_RATIO = LAZUR_WPM / KEYBOARD_WPM;

const KEYBOARD_LINES = [0.92, 0.78, 0.86, 0.52];
const LAZUR_LINES = [
  0.96, 0.88, 0.94, 0.82, 0.9, 0.76, 0.98, 0.84, 0.91, 0.72, 0.95, 0.8, 0.88,
  0.93, 0.7, 0.86, 0.92, 0.64,
];

const TONE = {
  muted: {
    wpm: "text-[var(--foreground-muted)]",
    label: "text-[var(--foreground-muted)]",
    unit: "text-[var(--foreground-muted)]",
    sub: "text-[var(--foreground-muted)]/90",
    caption: "text-[var(--foreground-muted)]/85",
    bar: "bg-[var(--foreground-muted)]/75",
  },
  strong: {
    wpm: "text-[var(--foreground)]/78",
    label: "text-[var(--foreground)]/72",
    unit: "text-[var(--foreground-muted)]",
    sub: "text-[var(--foreground-muted)]/95",
    caption: "text-[var(--foreground-muted)]/90",
    bar: "bg-[var(--foreground)]/58",
  },
} as const;

type Side = "keyboard" | "lazur";

function TypingLine({
  width,
  tone,
  isActive,
}: {
  width: number;
  tone: keyof typeof TONE;
  isActive: boolean;
}) {
  const barClass = TONE[tone].bar;

  return (
    <div className="relative h-2.5 w-full shrink-0">
      <motion.div
        className={`h-full rounded-full ${barClass}`}
        initial={{ scaleX: 0, opacity: 0.4 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: `${width * 100}%`, transformOrigin: "left center" }}
      />
      {isActive && (
        <motion.span
          className={`absolute top-1/2 h-3 w-px -translate-y-1/2 ${barClass}`}
          style={{ left: `${width * 100}%` }}
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 0.75, repeat: Infinity }}
        />
      )}
    </div>
  );
}

function TypingStream({
  lines,
  active,
  tone,
  msPerLine,
  maxLines,
  restartKey,
  speedBoost = 1,
}: {
  lines: number[];
  active: boolean;
  tone: keyof typeof TONE;
  msPerLine: number;
  maxLines?: number;
  restartKey: number;
  speedBoost?: number;
}) {
  const cap = maxLines ?? lines.length;
  const [visible, setVisible] = useState(0);
  const [typing, setTyping] = useState(false);
  const interval = Math.max(60, Math.round(msPerLine / speedBoost));

  useEffect(() => {
    if (!active) {
      setVisible(0);
      setTyping(false);
      return;
    }

    setVisible(0);
    setTyping(true);
    let count = 0;

    const id = window.setInterval(() => {
      count += 1;
      setVisible(count);
      if (count >= cap) {
        window.clearInterval(id);
        setTyping(false);
      }
    }, interval);

    return () => window.clearInterval(id);
  }, [active, cap, interval, restartKey]);

  return (
    <motion.div
      className="relative h-44 overflow-hidden rounded-lg bg-[var(--background-deep)]/45 md:h-48"
      animate={{
        backgroundColor:
          speedBoost > 1
            ? "rgba(243, 241, 236, 0.72)"
            : "rgba(243, 241, 236, 0.45)",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex h-full flex-col gap-2.5 overflow-hidden p-4">
        {lines.slice(0, visible).map((width, i) => (
          <TypingLine
            key={`${restartKey}-${i}`}
            width={width}
            tone={tone}
            isActive={typing && i === visible - 1}
          />
        ))}
      </div>

      {typing && (
        <motion.div
          aria-hidden
          className="fluid-sweep pointer-events-none absolute inset-x-0 z-10 h-10 opacity-30"
          style={{ top: Math.min(visible * 20, 140) }}
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

function AnimatedWpm({
  active,
  target,
  muted = false,
  boosted = false,
}: {
  active: boolean;
  target: number;
  muted?: boolean;
  boosted?: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) {
      setDisplay(0);
      return;
    }

    const duration = boosted ? 600 : 900;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(eased * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, boosted]);

  return (
    <motion.span
      animate={boosted ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={{ duration: 0.45 }}
      className={`font-display text-4xl font-semibold tabular-nums md:text-5xl ${
        muted ? TONE.muted.wpm : TONE.strong.wpm
      }`}
    >
      {display}
    </motion.span>
  );
}

function RaceCard({
  side,
  hovered,
  peerHovered,
  onHover,
  children,
}: {
  side: Side;
  hovered: boolean;
  peerHovered: boolean;
  onHover: (side: Side | null) => void;
  children: ReactNode;
}) {
  return (
    <motion.div
      className="group/card relative"
      onHoverStart={() => onHover(side)}
      onHoverEnd={() => onHover(null)}
      animate={{
        opacity: peerHovered ? 0.52 : 1,
        scale: hovered ? 1.015 : 1,
        filter: peerHovered ? "blur(0.4px)" : "blur(0px)",
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <SoftCard interactive hover className="relative flex flex-col">
        {children}
      </SoftCard>
    </motion.div>
  );
}

export function SpeedRace() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState<Side | null>(null);
  const [restartKey, setRestartKey] = useState({ keyboard: 0, lazur: 0 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.4"],
  });

  useEffect(() => {
    if (inView) setActive(true);
  }, [inView]);

  const handleHover = (side: Side | null) => {
    setHovered(side);
    if (side) {
      setRestartKey((k) => ({ ...k, [side]: k[side] + 1 }));
    }
  };

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0.92, 1]);
  const sectionY = useTransform(scrollYProgress, [0, 1], [56, 0]);
  const leftCardX = useTransform(scrollYProgress, [0.1, 0.65], [-20, 0]);
  const rightCardX = useTransform(scrollYProgress, [0.1, 0.65], [20, 0]);
  const footerOpacity = useTransform(scrollYProgress, [0.35, 0.75], [0, 1]);

  return (
    <section id="speed" ref={ref} className="relative px-6 py-12 md:py-16">
      <motion.div
        style={{ opacity: sectionOpacity, y: sectionY }}
        className="mx-auto max-w-5xl"
      >
        <div className="mb-8 text-center md:mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            One minute of output
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[2.5rem]">
            Voice writes {SPEED_RATIO.toFixed(1)}× more than typing
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            Same minute. Same thought. Hover a card to replay the race.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <motion.div style={{ x: leftCardX }}>
            <RaceCard
              side="keyboard"
              hovered={hovered === "keyboard"}
              peerHovered={hovered === "lazur"}
              onHover={handleHover}
            >
              <div className="p-6 md:p-7">
                <div className="border-b border-[var(--border)] pb-4">
                  <p className={`text-[15px] font-semibold ${TONE.muted.label}`}>
                    Keyboard
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <AnimatedWpm
                      active={active}
                      target={KEYBOARD_WPM}
                      muted
                      boosted={hovered === "keyboard"}
                    />
                    <span className={`text-[13px] font-medium ${TONE.muted.unit}`}>
                      words / min
                    </span>
                  </div>
                  <p className={`mt-1 text-[12px] ${TONE.muted.sub}`}>
                    {hovered === "keyboard"
                      ? "Replay — slow typing"
                      : "Average typing speed"}
                  </p>
                </div>

                <div className="mt-5">
                  <TypingStream
                    lines={KEYBOARD_LINES}
                    active={active}
                    tone="muted"
                    msPerLine={420}
                    maxLines={KEYBOARD_LINES.length}
                    restartKey={restartKey.keyboard}
                    speedBoost={hovered === "keyboard" ? 1.15 : 1}
                  />
                </div>

                <p className={`mt-5 text-[12px] leading-relaxed ${TONE.muted.caption}`}>
                  ~{KEYBOARD_WPM} words in 60 seconds — a short reply at best.
                </p>
              </div>
            </RaceCard>
          </motion.div>

          <motion.div style={{ x: rightCardX }}>
            <RaceCard
              side="lazur"
              hovered={hovered === "lazur"}
              peerHovered={hovered === "keyboard"}
              onHover={handleHover}
            >
              <div className="p-6 md:p-8">
                <div className="border-b border-[var(--border)] pb-4">
                  <p className={`text-[15px] font-semibold ${TONE.strong.label}`}>
                    Voice with lazur
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <AnimatedWpm
                      active={active}
                      target={LAZUR_WPM}
                      boosted={hovered === "lazur"}
                    />
                    <span className={`text-[13px] font-medium ${TONE.strong.unit}`}>
                      words / min
                    </span>
                  </div>
                  <p className={`mt-1 text-[12px] ${TONE.strong.sub}`}>
                    {hovered === "lazur"
                      ? "Replay — voice in flow"
                      : "Reads what you meant"}
                  </p>
                </div>

                <div className="mt-5">
                  <TypingStream
                    lines={LAZUR_LINES}
                    active={active}
                    tone="strong"
                    msPerLine={110}
                    restartKey={restartKey.lazur}
                    speedBoost={hovered === "lazur" ? 1.75 : 1}
                  />
                </div>

                <p className={`mt-5 text-[12px] leading-relaxed ${TONE.strong.caption}`}>
                  ~{LAZUR_WPM} words in 60 seconds — a full draft, email, or doc
                  section.
                </p>
              </div>
            </RaceCard>
          </motion.div>
        </div>

        <motion.p
          style={{ opacity: footerOpacity }}
          className="mt-6 text-center text-[13px] text-[var(--foreground-faint)]"
        >
          {LAZUR_WPM} ÷ {KEYBOARD_WPM} ={" "}
          <span className="font-semibold text-[var(--foreground-muted)]">
            {SPEED_RATIO.toFixed(1)}× the output
          </span>{" "}
          in the same minute
        </motion.p>
      </motion.div>
    </section>
  );
}
