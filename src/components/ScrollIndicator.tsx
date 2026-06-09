"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";

const REST_DOT = 5;
const RAIL_W = 16;
const THUMB_W = 12;
const THUMB_H = 96;

const springConfig = { stiffness: 140, damping: 32, mass: 0.45 };
const expandTransition = {
  type: "spring" as const,
  stiffness: 380,
  damping: 34,
  mass: 0.55,
};

export function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const [trackHeight, setTrackHeight] = useState(0);

  const targetProgress = useMotionValue(0);
  const smoothProgress = useSpring(targetProgress, springConfig);

  useEffect(() => {
    document.documentElement.classList.add("hide-native-scrollbar");
    return () => document.documentElement.classList.remove("hide-native-scrollbar");
  }, []);

  useEffect(() => {
    const check = () => {
      setCanScroll(
        document.documentElement.scrollHeight > window.innerHeight + 8,
      );
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => setTrackHeight(track.clientHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(track);
    return () => ro.disconnect();
  }, [canScroll]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!dragging) targetProgress.set(v);
  });

  useMotionValueEvent(smoothProgress, "change", (v) => {
    setProgress(v);
  });

  const scrollToProgress = useCallback((p: number, smooth = true) => {
    const clamped = Math.min(1, Math.max(0, p));
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: clamped * max,
      behavior: smooth ? "smooth" : "auto",
    });
    targetProgress.set(clamped);
    setProgress(clamped);
  }, [targetProgress]);

  const progressFromPointer = useCallback(
    (clientY: number) => {
      const track = trackRef.current;
      if (!track) return progress;
      const rect = track.getBoundingClientRect();
      const expanded = hovered || dragging;
      const thumbH = expanded ? THUMB_H : REST_DOT;
      const usable = rect.height - thumbH;
      const y = clientY - rect.top - thumbH / 2;
      return Math.min(1, Math.max(0, y / usable));
    },
    [dragging, hovered, progress],
  );

  const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).dataset.thumb) return;
    scrollToProgress(progressFromPointer(e.clientY));
  };

  const onThumbDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => {
      const p = progressFromPointer(e.clientY);
      targetProgress.jump(p);
      setProgress(p);
      scrollToProgress(p, false);
    };
    const onUp = () => setDragging(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, progressFromPointer, scrollToProgress, targetProgress]);

  if (!canScroll) return null;

  const expanded = hovered || dragging;
  const thumbH = expanded ? THUMB_H : REST_DOT;
  const thumbW = expanded ? THUMB_W : REST_DOT;
  const usable = Math.max(0, trackHeight - thumbH);
  const thumbY = progress * usable;
  const fillHeightPx = progress * usable + thumbH / 2;

  return (
    <div
      className="fixed inset-y-0 right-0 z-[100] hidden w-14 md:block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        if (!dragging) setHovered(false);
      }}
      aria-hidden
    >
      <div
        ref={trackRef}
        role="scrollbar"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="absolute right-3 top-[5vh] h-[90vh] cursor-pointer"
        style={{ width: RAIL_W }}
        onClick={onTrackClick}
      >
        {/* Rail — glass track on hover */}
        <motion.div
          animate={{
            opacity: expanded ? 1 : 0,
            width: expanded ? RAIL_W : REST_DOT,
          }}
          transition={expandTransition}
          className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 overflow-hidden rounded-full border border-[var(--foreground)]/[0.08] bg-white/55 shadow-[0_2px_16px_rgba(0,0,0,0.04)] backdrop-blur-md"
        >
          {/* Quarter tick marks */}
          {[0.25, 0.5, 0.75].map((tick) => (
            <span
              key={tick}
              className="absolute left-1/2 h-px w-2 -translate-x-1/2 bg-[var(--foreground)]/[0.12]"
              style={{ top: `${tick * 100}%` }}
            />
          ))}

          {/* Progress fill — glides with scroll */}
          <motion.div
            animate={{ height: fillHeightPx }}
            transition={springConfig}
            className="absolute left-1/2 top-0 w-full -translate-x-1/2 rounded-full bg-[var(--foreground)]/[0.07]"
          />
        </motion.div>

        {/* Thumb */}
        <motion.div
          data-thumb
          animate={{
            y: thumbY,
            width: thumbW,
            height: thumbH,
            opacity: expanded ? 0.92 : 0.32,
          }}
          transition={
            dragging
              ? { type: "spring", stiffness: 500, damping: 42, mass: 0.35 }
              : {
                  y: springConfig,
                  width: expandTransition,
                  height: expandTransition,
                  opacity: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                }
          }
          onPointerDown={onThumbDown}
          className="absolute left-1/2 top-0 flex -translate-x-1/2 cursor-grab flex-col items-center justify-center gap-[5px] rounded-full bg-[var(--foreground)] shadow-[0_2px_12px_rgba(0,0,0,0.18)] active:cursor-grabbing"
        >
          {/* Grip lines — visible when expanded */}
          <motion.span
            animate={{ opacity: expanded ? 1 : 0, scale: expanded ? 1 : 0.4 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none flex flex-col items-center gap-[5px]"
          >
            <span className="h-px w-3 rounded-full bg-white/35" />
            <span className="h-px w-3 rounded-full bg-white/35" />
            <span className="h-px w-3 rounded-full bg-white/35" />
          </motion.span>
        </motion.div>

        {/* Scroll hint — fades in on hover */}
        <motion.div
          animate={{ opacity: expanded ? 1 : 0, y: expanded ? 0 : 4 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute -left-7 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1"
        >
          <span className="text-[9px] font-medium tabular-nums tracking-wide text-[var(--foreground-muted)]">
            {Math.round(progress * 100)}
          </span>
          <span className="text-[8px] uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
            %
          </span>
        </motion.div>
      </div>
    </div>
  );
}
