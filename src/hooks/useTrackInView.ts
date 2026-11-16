"use client";

import { useEffect, useRef } from "react";
import type React from "react";
import { track, type AnalyticsProps } from "@/lib/productAnalytics";

/**
 * Fires `event` once (per mount, i.e. per page view) the first time `ref` scrolls into view.
 * Props are read at fire time, so callers can pass inline objects without re-observing.
 */
export function useTrackInView<T extends Element>(
  ref: React.RefObject<T | null>,
  event: string,
  props?: AnalyticsProps,
) {
  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let fired = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (fired || !entries.some((e) => e.isIntersecting)) return;
        fired = true;
        observer.disconnect();
        track(event, propsRef.current);
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, event]);
}
