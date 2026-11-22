"use client";

import { useEffect, useRef } from "react";

/** A short, silent product clip that loops while it is on screen, in the page's shared frame. */
/** `bare` swaps the shared frame for the navbar's look: a thin ink outline and a hard 2px drop. */
export function FeatureFilm({ src, poster, label, className = "aspect-[1360/1000]", bare = false }: { src: string; poster: string; label: string; className?: string; bare?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = video.current;
    const frame = box.current;
    if (!el || !frame) return;
    el.muted = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.3 },
    );
    io.observe(frame);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={box} className={`${bare ? "overflow-hidden rounded-[20px] border-[1.5px] border-[#1c1917] bg-white shadow-[0_2px_0_rgba(28,25,23,0.9)]" : "frame-apple"} relative w-full ${className}`}>
      <video ref={video} className="absolute inset-0 h-full w-full object-cover" src={src} poster={poster} playsInline loop preload="metadata" aria-label={label} />
    </div>
  );
}
