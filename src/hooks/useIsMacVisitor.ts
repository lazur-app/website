"use client";

import { useSyncExternalStore } from "react";
import { detectPlatform } from "@/lib/platform";

function subscribe() {
  // Platform never changes during a visit.
  return () => {};
}

/** Client-only check: a macOS desktop (not an iPad posing as a Mac). */
export function isMacDesktopVisitor(): boolean {
  if (detectPlatform() !== "mac") return false;
  // iPadOS Safari reports a desktop Mac user agent; a touch screen gives it away.
  if (typeof navigator !== "undefined" && navigator.maxTouchPoints > 1) return false;
  return true;
}

function getServerSnapshot(): boolean | null {
  return null;
}

/**
 * true on a macOS desktop, false on iOS/iPadOS/Android/Windows/Linux, null until hydrated
 * (server render and the first client render), so markup never mismatches.
 */
export function useIsMacVisitor(): boolean | null {
  return useSyncExternalStore<boolean | null>(subscribe, isMacDesktopVisitor, getServerSnapshot);
}
