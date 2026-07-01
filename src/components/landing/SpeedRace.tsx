"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

function TypingStream({
  lines,
  tone,
  highlighted,
}: {
  lines: number[];
  tone: keyof typeof TONE;
  highlighted?: boolean;
}) {
  const barClass = TONE[tone].bar;

  return (
    <div
      className={`relative h-44 overflow-hidden rounded-lg md:h-48 ${
        highlighted
          ? "bg-[rgba(243,241,236,0.72)]"
          : "bg-[var(--background-deep)]/45"
      }`}
    >
      <div className="flex h-full flex-col gap-2.5 overflow-hidden p-4">
        {lines.map((width, i) => (
          <div key={i} className="h-2.5 w-full shrink-0">
            <div
              className={`h-full rounded-full ${barClass}`}
              style={{ width: `${width * 100}%` }}
            />
          </div>
        ))}
      </div>
    </div>
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
  children: React.ReactNode;
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
  const [hovered, setHovered] = useState<Side | null>(null);

  return (
    <section id="speed" className="relative px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center md:mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            One minute of output
          </p>
          <h2 className="mt-2 font-display text-[1.75rem] font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[2.5rem]">
            Voice writes {SPEED_RATIO.toFixed(1)}× more than typing
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--foreground-muted)]">
            Same minute. Same thought. One stream of speech vs. fingers on keys.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <RaceCard
            side="keyboard"
            hovered={hovered === "keyboard"}
            peerHovered={hovered === "lazur"}
            onHover={setHovered}
          >
            <div className="p-6 md:p-7">
              <div className="border-b border-[var(--border)] pb-4">
                <p className={`text-[15px] font-semibold ${TONE.muted.label}`}>
                  Keyboard
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span
                    className={`font-display text-4xl font-semibold tabular-nums md:text-5xl ${TONE.muted.wpm}`}
                  >
                    {KEYBOARD_WPM}
                  </span>
                  <span className={`text-[13px] font-medium ${TONE.muted.unit}`}>
                    words / min
                  </span>
                </div>
                <p className={`mt-1 text-[12px] ${TONE.muted.sub}`}>
                  Average typing speed
                </p>
              </div>

              <div className="mt-5">
                <TypingStream
                  lines={KEYBOARD_LINES}
                  tone="muted"
                  highlighted={hovered === "keyboard"}
                />
              </div>

              <p className={`mt-5 text-[12px] leading-relaxed ${TONE.muted.caption}`}>
                ~{KEYBOARD_WPM} words in 60 seconds — a short reply at best.
              </p>
            </div>
          </RaceCard>

          <RaceCard
            side="lazur"
            hovered={hovered === "lazur"}
            peerHovered={hovered === "keyboard"}
            onHover={setHovered}
          >
            <div className="p-6 md:p-8">
              <div className="border-b border-[var(--border)] pb-4">
                <p className={`text-[15px] font-semibold ${TONE.strong.label}`}>
                  Voice with lazur
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span
                    className={`font-display text-4xl font-semibold tabular-nums md:text-5xl ${TONE.strong.wpm}`}
                  >
                    {LAZUR_WPM}
                  </span>
                  <span className={`text-[13px] font-medium ${TONE.strong.unit}`}>
                    words / min
                  </span>
                </div>
                <p className={`mt-1 text-[12px] ${TONE.strong.sub}`}>
                  Reads what you meant
                </p>
              </div>

              <div className="mt-5">
                <TypingStream
                  lines={LAZUR_LINES}
                  tone="strong"
                  highlighted={hovered === "lazur"}
                />
              </div>

              <p className={`mt-5 text-[12px] leading-relaxed ${TONE.strong.caption}`}>
                ~{LAZUR_WPM} words in 60 seconds — a full draft, email, or doc
                section.
              </p>
            </div>
          </RaceCard>
        </div>

        <p className="mt-6 text-center text-[13px] text-[var(--foreground-faint)]">
          {LAZUR_WPM} ÷ {KEYBOARD_WPM} ={" "}
          <span className="font-semibold text-[var(--foreground-muted)]">
            {SPEED_RATIO.toFixed(1)}× the output
          </span>{" "}
          in the same minute
        </p>
      </div>
    </section>
  );
}
