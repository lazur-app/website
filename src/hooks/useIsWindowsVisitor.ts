"use client";

import { useSyncExternalStore } from "react";
import { detectPlatform } from "@/lib/platform";
import { hasWindowsBuild } from "@/lib/download";

function subscribe() {
  // Platform never changes during a visit.
  return () => {};
}

/** A Windows visitor while there is no Windows build: they can join the waitlist, not download. */
export function isWindowsWaitlistVisitor(): boolean {
  if (typeof window === "undefined" || hasWindowsBuild()) return false;
  // ?platform=windows previews the Windows view from any machine.
  const forced = new URLSearchParams(window.location.search).get("platform");
  if (forced) return forced === "windows";
  return detectPlatform() === "windows";
}

/**
 * true for a Windows visitor (no Windows build yet), false otherwise, and false on the server and the first client
 * render so markup never mismatches; the Windows labels swap in right after hydration.
 */
export function useIsWindowsVisitor(): boolean {
  return useSyncExternalStore(subscribe, isWindowsWaitlistVisitor, () => false);
}

/** What a download button says to a Windows visitor. */
export const WINDOWS_WAITLIST_LABEL = "Join the Windows waitlist";
