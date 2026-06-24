"use client";

import type { CSSProperties } from "react";

/** Layered wave channels — reusable for landing section & future promo video captures */

export const HOW_IT_WORKS_WAVE_VIEWBOX = "0 0 1440 120";

/** 2-period smooth sine — amp ±22, baseline y=72, horizontal tangents at extrema */
const WAVE_LINE =
  "M0,72 C60,72 120,50 180,50 C240,50 300,72 360,72 C420,72 480,94 540,94 C600,94 660,72 720,72 C780,72 840,50 900,50 C960,50 1020,72 1080,72 C1140,72 1200,94 1260,94 C1320,94 1380,72 1440,72";

/** Fills outward from the dark section — up into hero, down into next section */
export const HOW_IT_WORKS_WAVE_PATH_TOP = `${WAVE_LINE} L1440,0 L0,0 Z`;
export const HOW_IT_WORKS_WAVE_PATH_BOTTOM = `${WAVE_LINE} L1440,120 L0,120 Z`;

export const HOW_IT_WORKS_WAVE_HEIGHT =
  "h-[clamp(3.5rem,8vh,5.5rem)] md:h-[clamp(4rem,9vh,6rem)]";

type WaveChannel = {
  offsetX: number;
  offsetY: number;
  drift: number;
  duration: number;
  opacity: number;
  delay: number;
  fill: string;
};

/** Back → front: tinted channels sit slightly inside the dark band for depth */
const WAVE_CHANNELS: WaveChannel[] = [
  {
    offsetX: -56,
    offsetY: 5,
    drift: -18,
    duration: 22,
    opacity: 0.45,
    delay: 0,
    fill: "color-mix(in srgb, var(--background) 55%, var(--foreground))",
  },
  {
    offsetX: -16,
    offsetY: 2,
    drift: 12,
    duration: 16,
    opacity: 0.65,
    delay: -4,
    fill: "color-mix(in srgb, var(--background) 78%, var(--foreground))",
  },
  {
    offsetX: 20,
    offsetY: 0,
    drift: -10,
    duration: 12,
    opacity: 1,
    delay: -2,
    fill: "var(--background)",
  },
];

type HowItWorksSectionWavesProps = {
  edge: "top" | "bottom";
};

export function HowItWorksSectionWaves({ edge }: HowItWorksSectionWavesProps) {
  const isTop = edge === "top";
  const pathD = isTop
    ? HOW_IT_WORKS_WAVE_PATH_TOP
    : HOW_IT_WORKS_WAVE_PATH_BOTTOM;

  return (
    <div
      className={`pointer-events-none absolute left-0 z-10 w-full ${HOW_IT_WORKS_WAVE_HEIGHT} ${
        isTop ? "top-0" : "bottom-0"
      }`}
      aria-hidden
    >
      {WAVE_CHANNELS.map((channel, index) => {
        const offsetY = isTop ? channel.offsetY : -channel.offsetY;

        return (
          <div
            key={index}
            className="how-it-works-wave-channel absolute inset-0"
            style={
              {
                zIndex: index + 1,
                "--wave-offset-x": `${channel.offsetX}px`,
                "--wave-offset-y": `${offsetY}px`,
                "--wave-drift": `${channel.drift}px`,
                "--wave-duration": `${channel.duration}s`,
                "--wave-delay": `${channel.delay}s`,
                opacity: channel.opacity,
              } as CSSProperties
            }
          >
            <svg
              viewBox={HOW_IT_WORKS_WAVE_VIEWBOX}
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <path d={pathD} fill={channel.fill} />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
