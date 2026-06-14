"use client";

import { forwardRef, useEffect, useRef } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";

const MAX_BURSTS = 2;
const MOVE_SMOOTH_FULL = 0.38;
const MOVE_SMOOTH_REDUCED = 0.72;
const MOVE_EPSILON = 0.35;
const HOVER_SAMPLE_PX = 10;
const HOVER_SAMPLE_MS = 100;

function spawnClickBurst(host: HTMLDivElement | null) {
  if (!host) return;

  while (host.childElementCount >= MAX_BURSTS) {
    host.firstElementChild?.remove();
  }

  const burst = document.createElement("div");
  burst.className = "lazur-cursor__burst";
  burst.innerHTML =
    '<span class="lazur-cursor__ripple" aria-hidden="true"></span>' +
    '<span class="lazur-cursor__wave" aria-hidden="true">' +
    "<i></i><i></i><i></i></span>";

  host.appendChild(burst);
  window.setTimeout(() => burst.remove(), 520);
}

/** Inline mic sprite — matches public/cursor/lazur-cursor.svg (no img fetch). */
const CursorSprite = forwardRef<SVGSVGElement, { className?: string }>(
  function CursorSprite({ className }, ref) {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className={className}
      >
        <circle
          cx="12"
          cy="12"
          r="11"
          fill="#ffffff"
          stroke="rgba(28,25,23,0.14)"
          strokeWidth="1"
        />
        <rect x="10.25" y="7" width="3.5" height="6.25" rx="1.75" fill="#1c1917" />
        <path
          d="M8.25 11.75a3.75 3.75 0 0 0 7.5 0"
          stroke="#1c1917"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M12 15.25v1.75"
          stroke="#1c1917"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M9.75 17h4.5"
          stroke="#1c1917"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    );
  },
);

/**
 * Lightweight mic cursor — inline SVG sprite, CSS-only click bursts.
 * Position uses a short rAF lerp while moving; idle when settled.
 */
export function LazurCursor() {
  const { isReduced } = usePerformanceTier();
  const rootRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<SVGSVGElement>(null);
  const burstHostRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const root = rootRef.current;
    if (!root) return;

    root.style.opacity = "1";

    const moveSmooth = isReduced ? MOVE_SMOOTH_REDUCED : MOVE_SMOOTH_FULL;
    const target = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    let rafId = 0;
    let positioned = false;
    let tabVisible = document.visibilityState === "visible";
    let lastHoverSample = { x: -1000, y: -1000, at: 0 };

    const applyTransform = () => {
      root.style.transform = `translate3d(${current.x}px,${current.y}px,0)`;
    };

    const tick = () => {
      if (!tabVisible) {
        rafId = 0;
        return;
      }

      current.x += (target.x - current.x) * moveSmooth;
      current.y += (target.y - current.y) * moveSmooth;
      applyTransform();

      const settled =
        Math.abs(target.x - current.x) < MOVE_EPSILON &&
        Math.abs(target.y - current.y) < MOVE_EPSILON;

      if (settled) {
        current.x = target.x;
        current.y = target.y;
        applyTransform();
        rafId = 0;
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    const queueMove = () => {
      if (!tabVisible) return;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const updateHoverState = (el: HTMLElement | null, x: number, y: number) => {
      const now = performance.now();
      const dx = x - lastHoverSample.x;
      const dy = y - lastHoverSample.y;
      const movedFar =
        dx * dx + dy * dy >= HOVER_SAMPLE_PX * HOVER_SAMPLE_PX;
      const elapsed = now - lastHoverSample.at;

      if (!movedFar && elapsed < HOVER_SAMPLE_MS) return;

      lastHoverSample = { x, y, at: now };

      const useNative = !!el?.closest('[data-lazur-cursor="native"]');
      root.style.opacity = useNative ? "0" : "1";

      const interactive = !!el?.closest(
        'a, button, [role="button"], input, textarea, select, summary, [data-cursor="pointer"]',
      );

      if (interactive === hoveringRef.current) return;
      hoveringRef.current = interactive;
      spriteRef.current?.classList.toggle(
        "lazur-cursor__sprite--hover",
        interactive,
      );
    };

    const onMove = (e: MouseEvent) => {
      if (!tabVisible) return;

      target.x = e.clientX;
      target.y = e.clientY;

      if (!positioned) {
        positioned = true;
        current.x = target.x;
        current.y = target.y;
        applyTransform();
      } else if (isReduced) {
        current.x = target.x;
        current.y = target.y;
        applyTransform();
      } else {
        queueMove();
      }

      updateHoverState(e.target as HTMLElement | null, e.clientX, e.clientY);
    };

    const onLeave = () => {
      root.style.opacity = "0";
    };

    const onDown = () => {
      if (!isReduced) {
        spriteRef.current?.classList.add("lazur-cursor__sprite--click");
        spawnClickBurst(burstHostRef.current);
      }
    };

    const onUp = () => {
      spriteRef.current?.classList.remove("lazur-cursor__sprite--click");
    };

    const onVisibility = () => {
      tabVisible = document.visibilityState === "visible";
      if (!tabVisible && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isReduced]);

  return (
    <div
      ref={rootRef}
      className="lazur-cursor pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
      aria-hidden
    >
      <div className="lazur-cursor__inner">
        <div ref={burstHostRef} className="lazur-cursor__bursts" />
        <CursorSprite ref={spriteRef} className="lazur-cursor__sprite" />
      </div>
    </div>
  );
}
