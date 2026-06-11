"use client";

import { forwardRef, useEffect, useRef } from "react";

const MAX_BURSTS = 2;
/** 0–1: higher = snappier. ~0.38 = subtle ease without lag. */
const MOVE_SMOOTH = 0.38;
const MOVE_EPSILON = 0.35;

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
  const rootRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<SVGSVGElement>(null);
  const burstHostRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !fine) return;

    const root = rootRef.current;
    if (!root) return;

    root.style.opacity = "1";

    const target = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    let rafId = 0;
    let positioned = false;

    const applyTransform = () => {
      root.style.transform = `translate3d(${current.x}px,${current.y}px,0)`;
    };

    const tick = () => {
      current.x += (target.x - current.x) * MOVE_SMOOTH;
      current.y += (target.y - current.y) * MOVE_SMOOTH;
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
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;

      if (!positioned) {
        positioned = true;
        current.x = target.x;
        current.y = target.y;
        applyTransform();
      } else {
        queueMove();
      }

      const el = e.target as HTMLElement | null;
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

    const onLeave = () => {
      root.style.opacity = "0";
    };

    const onDown = () => {
      spriteRef.current?.classList.add("lazur-cursor__sprite--click");
      spawnClickBurst(burstHostRef.current);
    };

    const onUp = () => {
      spriteRef.current?.classList.remove("lazur-cursor__sprite--click");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

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
