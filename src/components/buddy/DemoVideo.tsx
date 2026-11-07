"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { setGuide } from "@/lib/guide";

const SRC = "https://releases.lazur.app/videos/lazur-demo-v3.mp4";
const POSTER = "https://releases.lazur.app/videos/lazur-demo-v3-poster.jpg";

/**
 * The homepage demo film. It plays muted and loops once the hero's pen has finished (`held`),
 * like the animated stage it replaces; the button turns the app's sounds on and starts it over.
 * With reduced motion it waits for the visitor to press play.
 */
export function DemoVideo({ held = false }: { held?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => setGuide({ demoScene: "video" }), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v || reduced) return;
    if (held) v.pause();
    else void v.play().catch(() => {});
  }, [held, reduced]);

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
    if (!next) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    }
  };

  return (
    <div className="w-full">
      <link rel="preload" as="image" href={POSTER} fetchPriority="high" />
      <div
        data-guide="demo-screen"
        className="relative mx-auto aspect-video w-full overflow-hidden rounded-[clamp(12px,2vw,24px)] bg-[#eef0f2] shadow-[0_30px_90px_rgba(28,25,23,0.22)] ring-1 ring-black/10"
      >
        <video
          ref={video}
          className="h-full w-full object-cover"
          src={SRC}
          poster={POSTER}
          muted
          loop
          playsInline
          preload="metadata"
          controls={reduced}
          aria-label="Lazur demo: you ask out loud; Lazur points on screen, rewrites, types, fixes code, totals a sheet, and researches in Chrome in the background."
        />
        {!reduced ? (
          <button
            type="button"
            onClick={toggleSound}
            className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-black/75 px-3.5 py-2 text-[13px] font-semibold text-white shadow-lg backdrop-blur transition hover:bg-black/85 sm:bottom-4 sm:right-4"
            aria-label={muted ? "Play with sound" : "Mute"}
          >
            {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
            {muted ? "Sound on" : "Mute"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
