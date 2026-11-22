"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

/** The launch film. Local file in development, the releases CDN in production (videos aren't committed). */
export function getLaunchFilmSrc(): string {
  return (
    process.env.NEXT_PUBLIC_LAUNCH_FILM_URL?.trim() ||
    (process.env.NODE_ENV === "development" ? "/videos/lazur-launch.mp4" : "https://releases.lazur.app/videos/lazur-launch.mp4")
  );
}

/**
 * The launch film, played the way heyclicky plays theirs: a silent preview loops while it is on
 * screen and a "play video" pill follows the pointer; a click starts it from the top with sound.
 * While it plays: a big pause/play mark in the middle on hover, a thin timeline along the bottom
 * (click to seek) and a sound button in the corner.
 */
export function LaunchFilm({ guide, label = "lazur-launch.mp4", dark = true }: { guide?: string; label?: string; dark?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [hover, setHover] = useState(false);
  const [pill, setPill] = useState<{ x: number; y: number } | null>(null);
  const [progress, setProgress] = useState(0);

  // The silent preview only runs while the film is on screen.
  useEffect(() => {
    const el = video.current;
    const frame = box.current;
    if (!el || !frame || started) return;
    el.muted = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(frame);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const tick = () => setProgress(el.duration ? el.currentTime / el.duration : 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener("timeupdate", tick);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.removeEventListener("timeupdate", tick);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  const start = () => {
    const el = video.current;
    if (!el) return;
    setStarted(true);
    el.currentTime = 0;
    el.loop = false;
    el.muted = false;
    setMuted(false);
    void el.play().catch(() => {
      el.muted = true;
      setMuted(true);
      void el.play();
    });
  };

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (!started) return start();
    if (el.paused || el.ended) void el.play();
    else el.pause();
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = video.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const el = video.current;
    if (!el || !el.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * el.duration;
  };

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = box.current?.getBoundingClientRect();
    if (r) setPill({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <figure className="m-0">
      <div
        ref={box}
        data-guide={guide}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => {
          setHover(false);
          setPill(null);
        }}
        onPointerMove={move}
        onClick={toggle}
        role="button"
        tabIndex={0}
        aria-label={started ? (playing ? "Pause the film" : "Play the film") : "Play the Lazur film with sound"}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            toggle();
          }
        }}
        className={`frame-apple ${dark ? "frame-apple-dark" : ""} relative aspect-[1480/1080] w-full select-none bg-[#0c0b0a] outline-none focus-visible:ring-2 focus-visible:ring-[#6B4BFC] ${
          started ? "cursor-pointer" : "cursor-none"
        }`}
      >
        <video
          ref={video}
          className="absolute top-0 h-full max-w-none"
          style={{ width: "129.73%", left: "-14.86%" }}
          src={getLaunchFilmSrc()}
          poster="/launch-film-poster.jpg"
          playsInline
          loop
          preload="metadata"
          aria-label="Lazur launch film: what Lazur can do on your Mac"
        />

        {/* Before it starts: the pill follows the pointer (or sits in the middle on touch). */}
        {!started && (
          <span
            className="pointer-events-none absolute z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[14px] font-semibold text-[#1c1917] shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur transition-[left,top] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ left: pill ? pill.x : "50%", top: pill ? pill.y : "50%" }}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
              <path d="M7 4.5v15l12-7.5z" />
            </svg>
            play video
          </span>
        )}

        {/* While playing: the big mark in the middle on hover. */}
        {started && (
          <span
            className={`pointer-events-none absolute left-1/2 top-1/2 z-10 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] transition-opacity duration-200 ${
              hover || !playing ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-14 w-14 fill-current">
                <rect x="5.5" y="4" width="4.6" height="16" rx="1.6" />
                <rect x="13.9" y="4" width="4.6" height="16" rx="1.6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="ml-1 h-14 w-14 fill-current">
                <path d="M7 4.5v15l12-7.5z" />
              </svg>
            )}
          </span>
        )}

        {started && (
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            className={`absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full text-white transition-opacity duration-200 hover:bg-white/15 ${hover || muted ? "opacity-100" : "opacity-0"}`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" aria-hidden>
              <path d="M4 9.5h3.2L12 5.2v13.6l-4.8-4.3H4z" />
              {muted ? (
                <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" fill="none" />
              ) : (
                <path d="M15 8.6a4.6 4.6 0 0 1 0 6.8M17.6 6.2a8 8 0 0 1 0 11.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              )}
            </svg>
          </button>
        )}

        {started && (
          <div onClick={seek} className="group/bar absolute inset-x-4 bottom-3 z-20 flex h-4 cursor-pointer items-center" aria-hidden>
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/30 transition-[height] group-hover/bar:h-[5px]">
              <div className="h-full rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        )}
      </div>
      {label ? <figcaption className={`mt-3 text-center font-mono text-[12px] tracking-wide ${dark ? "text-white/45" : "text-[var(--foreground-faint)]"}`}>{label}</figcaption> : null}
    </figure>
  );
}
