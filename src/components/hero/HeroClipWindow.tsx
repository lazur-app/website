"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { HeroClip } from "./heroClips";

type Props = {
  clip: HeroClip;
  focused: boolean;
  dimmed: boolean;
  onFocus: () => void;
  onBlur: () => void;
  layout: "absolute" | "flow";
  className?: string;
};

const aspectClass: Record<HeroClip["aspect"], string> = {
  landscape: "aspect-[16/10]",
  portrait: "aspect-[9/14]",
  wide: "aspect-[16/9]",
};

function parseRotate(rotate?: string): number {
  if (!rotate) return 0;
  const n = Number.parseFloat(rotate);
  return Number.isFinite(n) ? n : 0;
}

export function HeroClipWindow({
  clip,
  focused,
  dimmed,
  onFocus,
  onBlur,
  layout,
  className = "",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const restRotate = layout === "absolute" ? parseRotate(clip.desktop.rotate) : 0;
  const hasVideo = Boolean(clip.src);

  const positionStyle =
    layout === "absolute"
      ? {
          top: clip.desktop.top,
          left: clip.desktop.left,
          right: clip.desktop.right,
          bottom: clip.desktop.bottom,
          width: clip.desktop.width,
        }
      : clip.role === "main"
        ? { width: clip.desktop.width, maxWidth: "100%" }
        : undefined;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;

    if (focused) {
      video.muted = false;
      const play = video.play();
      if (play && typeof play.catch === "function") {
        play.catch(() => {
          // Autoplay-with-sound can fail; retry muted so motion still works.
          video.muted = true;
          void video.play().catch(() => {});
        });
      }
    } else {
      video.pause();
      video.muted = true;
      try {
        video.currentTime = 0;
      } catch {
        /* ignore seek before metadata */
      }
    }
  }, [focused, hasVideo]);

  return (
    <motion.div
      className={`group/clip ${
        layout === "absolute" ? "absolute" : "relative w-full"
      } ${clip.role === "main" && layout === "flow" ? "mx-auto" : ""} ${
        focused ? "z-30" : dimmed ? "z-[5]" : "z-10"
      } ${className}`}
      style={positionStyle}
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: dimmed ? 0.4 : 1,
        y: 0,
        scale: focused ? 1.05 : 1,
        rotate: focused ? 0 : restRotate,
        filter: dimmed ? "blur(7px)" : "blur(0px)",
      }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
    >
      <button
        type="button"
        aria-label={focused ? `Pause ${clip.label}` : `Play ${clip.label}`}
        aria-pressed={focused}
        onClick={() => {
          if (focused) onBlur();
          else onFocus();
        }}
        className="block w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      >
        <div
          className={`overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface-solid)] shadow-[var(--shadow-card)] ring-1 ring-[rgba(28,25,23,0.04)] transition-[box-shadow,border-color] duration-300 ${
            focused
              ? "border-[var(--border-strong,rgba(28,25,23,0.14))] shadow-[0_20px_50px_rgba(28,25,23,0.14)]"
              : "hover:border-[rgba(28,25,23,0.14)]"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--background-deep)]/90 px-2 py-1">
            <div className="flex gap-1" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]/90" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]/90" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]/90" />
            </div>
            <span className="truncate px-1.5 font-mono text-[8px] leading-none text-[var(--foreground-faint)]">
              {clip.label}
            </span>
            <span className="w-6" aria-hidden />
          </div>

          <div
            className={`relative ${aspectClass[clip.aspect]} bg-[var(--background-deep)]`}
          >
            {hasVideo ? (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src={clip.src}
                poster={clip.poster}
                playsInline
                loop
                preload="metadata"
                aria-hidden
              />
            ) : clip.poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={clip.poster}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <IllustratedPoster clip={clip} />
            )}

            {!focused ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgba(28,25,23,0.06)] opacity-0 transition-opacity duration-300 group-hover/clip:opacity-100 group-focus-within/clip:opacity-100">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--foreground)]/85 text-[var(--background)] shadow-lg">
                  <PlayIcon />
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <p className="mt-1.5 text-center font-mono text-[10px] tracking-wide text-[var(--foreground-faint)]">
          {clip.label}
        </p>
      </button>
    </motion.div>
  );
}

function IllustratedPoster({ clip }: { clip: HeroClip }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[var(--surface-solid)] via-[var(--background)] to-[var(--background-deep)] px-4 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-white shadow-sm">
        <Image
          src={clip.icon}
          alt=""
          width={24}
          height={24}
          className="h-6 w-6 object-contain"
        />
      </div>
      <p className="max-w-[14ch] text-[11px] font-medium leading-snug text-[var(--foreground-muted)] md:text-[12px]">
        {clip.caption}
      </p>
      <span className="rounded-full bg-[rgba(28,25,23,0.06)] px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
        Preview soon
      </span>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="currentColor"
      aria-hidden
    >
      <path d="M4.2 2.4v9.2l7.2-4.6L4.2 2.4z" />
    </svg>
  );
}
