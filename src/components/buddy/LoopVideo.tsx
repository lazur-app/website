"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A short silent demo loop for a homepage section. It plays only while on screen; with reduced
 * motion it shows the poster and play controls instead of autoplaying.
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
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      data-guide={guide}
      className={`relative mx-auto w-full overflow-hidden rounded-[clamp(12px,2vw,22px)] bg-[#eef0f2] shadow-[0_24px_70px_rgba(28,25,23,0.18)] ring-1 ring-black/10 ${className}`}
    >
      <video
        ref={video}
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        controls={reduced}
        aria-label={label}
      />
    </div>
  );
}
