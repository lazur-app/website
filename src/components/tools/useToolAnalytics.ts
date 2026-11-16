"use client";

import { useEffect, useRef } from "react";
import { track, type AnalyticsProps } from "@/lib/productAnalytics";

/**
 * For tools without a finish line (calculators, checkers): returns `edited()` to call on every
 * input change. The first call sends tool_started; once the person pauses for 1.5s, tool_completed
 * goes out with the current `result`. Pass numbers only, never what the person typed.
 */
export function useToolEdits(tool: string, result: AnalyticsProps) {
  const started = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const resultRef = useRef(result);
  useEffect(() => {
    resultRef.current = result;
  });
  useEffect(() => () => clearTimeout(timer.current), []);

  return function edited() {
    if (!started.current) {
      started.current = true;
      track("tool_started", { tool });
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => track("tool_completed", { tool, ...resultRef.current }), 1500);
  };
}
