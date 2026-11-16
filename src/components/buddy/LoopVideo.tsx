"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/productAnalytics";

/**
 * A short silent demo loop for a homepage section. Nothing (video or poster) is fetched until the
 * loop comes within a screen of the viewport, so the first load only pays for the hero. It plays
 * only while on screen; with reduced motion it shows the poster and play controls instead.
 */
export function LoopVideo({ src, poster, label, className = "", guide }: {
  src: string;
  poster: string;
  /** What the loop shows, for screen readers. */
  label: string;
  /** Sets the aspect ratio and size, e.g. "aspect-video max-w-4xl". */
  className?: string;
  /** A page-guide target (data-guide). */
  guide?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  const [near, setNear] = useState(false);
  // Analytics: loops never end, so "completed" is the first time it wraps back to the start.
  const name = src.split("/").pop()?.replace(/\.mp4$/, "") ?? src;
  const location = guide ?? "loop_video";
  const lastTime = useRef(0);
  const completed = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v || near) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setNear(true);
    }, { rootMargin: "100% 0px" });
    io.observe(v);
    return () => io.disconnect();
  }, [near]);

  useEffect(() => {
    const v = video.current;
    if (!v || reduced || !near) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduced, near]);

  return (
    <div
      data-guide={guide}
      className={`relative mx-auto w-full overflow-hidden rounded-[clamp(12px,2vw,22px)] bg-[#eef0f2] shadow-[0_24px_70px_rgba(28,25,23,0.18)] ring-1 ring-black/10 ${className}`}
    >
      <video
        ref={video}
        className="h-full w-full object-cover"
        src={near ? src : undefined}
        poster={near ? poster : undefined}
        muted
        loop
        playsInline
        preload={!near ? "none" : reduced ? "metadata" : "auto"}
        controls={reduced}
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime;
          if (!completed.current && t + 1 < lastTime.current) {
            completed.current = true;
            track("video_completed", { location, video: name });
          }
          lastTime.current = t;
        }}
        // Scroll-driven play/pause isn't the visitor's choice; only report it with native controls.
        onPlay={reduced ? () => track("video_played", { location, video: name }) : undefined}
        onPause={reduced ? () => track("video_paused", { location, video: name }) : undefined}
        aria-label={label}
      />
    </div>
  );
}
