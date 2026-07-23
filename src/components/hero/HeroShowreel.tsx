"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { HERO_CLIPS } from "./heroClips";

type Props = {
  onOpen: () => void;
  /** Pause hover preview while the lightbox is open */
  paused?: boolean;
};

export function HeroShowreel({ onOpen, paused = false }: Props) {
  const main = HERO_CLIPS.find((c) => c.role === "main");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering] = useState(false);
  /** Browsers block unmuted play until a real gesture — track when we've had one. */
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = true;
  }, []);

  useEffect(() => {
    const unlock = () => setAudioUnlocked(true);
    window.addEventListener("pointerdown", unlock, { capture: true });
    window.addEventListener("keydown", unlock, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", unlock, { capture: true });
      window.removeEventListener("keydown", unlock, { capture: true });
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Never put `muted` in JSX — React re-applies it every render and kills unmute.
    if (paused) {
      video.pause();
      video.muted = true;
      return;
    }

    if (hovering) {
      const tryPlay = async (withSound: boolean) => {
        video.muted = !withSound;
        try {
          await video.play();
          return !video.paused;
        } catch {
          return false;
        }
      };

      void (async () => {
        // Always try with sound first (works after any click / high MEI).
        const unmutedOk = await tryPlay(true);
        if (!unmutedOk || video.muted) {
          if (audioUnlocked) {
            video.muted = false;
            try {
              await video.play();
            } catch {
              await tryPlay(false);
            }
          } else {
            await tryPlay(false);
          }
        }
      })();
    } else {
      video.pause();
      video.muted = true;
      try {
        video.currentTime = 0;
      } catch {
        /* ignore seek before metadata */
      }
    }
  }, [hovering, paused, audioUnlocked]);

  if (!main?.src) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 mx-auto mt-8 w-full max-w-5xl px-2 lg:mt-9"
      style={{ width: main.desktop.width, maxWidth: "100%" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open video"
        className="group/showreel relative block w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      >
        <div
          className={`overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface-solid)] shadow-[var(--shadow-card)] ring-1 ring-[rgba(28,25,23,0.04)] transition-[box-shadow,border-color] duration-300 ${
            hovering && !paused
              ? "border-[rgba(28,25,23,0.14)] shadow-[0_16px_40px_rgba(28,25,23,0.1)]"
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
              {main.label}
            </span>
            <span className="w-6" aria-hidden />
          </div>

          <div className="relative aspect-[23/15] bg-[var(--background-deep)]">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-contain"
              src={main.src}
              poster={main.poster}
              playsInline
              loop
              preload="metadata"
              aria-hidden
            />

            <span className="pointer-events-none absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-[rgba(28,25,23,0.82)] px-3 py-1.5 text-[12px] font-medium tracking-tight text-white shadow-[0_4px_16px_rgba(28,25,23,0.25)] backdrop-blur-sm transition-[transform,background-color] duration-200 group-hover/showreel:bg-[rgba(28,25,23,0.92)] group-hover/showreel:scale-[1.02]">
              <PlayGlyph />
              Open video
            </span>
          </div>
        </div>

        <p className="mt-1.5 text-center font-mono text-[10px] tracking-wide text-[var(--foreground-faint)]">
          {main.label}
        </p>
      </button>
    </motion.div>
  );
}

function PlayGlyph({ size = 11 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="currentColor"
      aria-hidden
    >
      <path d="M4.2 2.4v9.2l7.2-4.6L4.2 2.4z" />
    </svg>
  );
}
