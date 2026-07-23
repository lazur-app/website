"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getHeroShowreelSrc } from "./heroClips";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function HeroDemoModal({ open, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = getHeroShowreelSrc();

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (open) {
      video.currentTime = 0;
      const play = video.play();
      if (play && typeof play.catch === "function") {
        play.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Close demo"
            className="absolute inset-0 bg-[rgba(28,25,23,0.62)] backdrop-blur-[10px]"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Lazur demo video"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface-solid)] shadow-[0_24px_80px_rgba(28,25,23,0.28)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--background-deep)]/90 px-3 py-2">
              <div className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/90" />
              </div>
              <span className="font-mono text-[11px] text-[var(--foreground-faint)]">
                lazur-demo-video.mp4
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md px-2 py-0.5 text-[13px] text-[var(--foreground-muted)] transition-colors hover:bg-[rgba(28,25,23,0.06)] hover:text-[var(--foreground)]"
              >
                Close
              </button>
            </div>

            <div className="relative aspect-[23/15] bg-black">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-contain"
                src={src}
                controls
                playsInline
                preload="metadata"
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
