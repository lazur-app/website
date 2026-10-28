"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { loopPath, underlinePath } from "@/lib/handDrawn";

/** A hand-drawn loop around its parent (which must be position: relative), drawn in real pixels. */
export function HandLoop({ show, color, padX = 10, padY = 8, delay = 0 }: {
  show: boolean;
  color: string;
  padX?: number;
  padY?: number;
  delay?: number;
}) {
  const box = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <span ref={box} className="pointer-events-none absolute" style={{ inset: `-${padY}px -${padX}px` }} aria-hidden>
      {size ? (
        <svg className="absolute inset-0 overflow-visible" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
          <motion.path
            d={loopPath(size.w, size.h)}
            fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round"
            initial={false}
            animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
            transition={{
              pathLength: { delay: show ? delay : 0, duration: show ? 0.7 : 0.2, ease: [0.65, 0, 0.35, 1] },
              opacity: { delay: show ? delay : 0, duration: 0.15 },
            }}
          />
        </svg>
      ) : null}
    </span>
  );
}

/** A hand-drawn underline along the bottom of its parent, drawn in real pixels. */
export function HandUnderline({ show, color, delay = 0, duration = 0.9, offset = 4 }: {
  show: boolean;
  color: string;
  delay?: number;
  duration?: number;
  /** Distance below the parent's bottom edge, in px. */
  offset?: number;
}) {
  const box = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setW(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <span ref={box} className="pointer-events-none absolute inset-x-0 h-3" style={{ bottom: -offset - 6 }} aria-hidden>
      {w ? (
        <svg className="absolute inset-0 overflow-visible" width={w} height={12} viewBox={`0 0 ${w} 12`}>
          <motion.path
            d={underlinePath(w, 12)}
            fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
            initial={false}
            animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
            transition={{
              pathLength: { delay: show ? delay : 0, duration: show ? duration : 0.2, ease: [0.65, 0, 0.35, 1] },
              opacity: { delay: show ? delay : 0, duration: 0.1 },
            }}
          />
        </svg>
      ) : null}
    </span>
  );
}
