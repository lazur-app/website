"use client";

import { useSyncExternalStore } from "react";

/**
 * Shared state for the homepage guide: the blue sparkle that travels down the page (see
 * components/buddy/Guide.tsx). Sections read which of their steps is playing to drive their own
 * visuals (a circle appearing, a chip lighting up, an FAQ opening).
 */
type GuideState = {
  /** The section the sparkle is in, and which of its steps is playing. */
  stop: string | null;
  step: number;
  /** The hero's own intro has finished, so the guide may take over. */
  heroDone: boolean;
  /** Which demo scene is on screen, so the guide can talk about it. */
  demoScene: string;
  /** Hidden until the page is loaded again (the × on its label). */
  dismissed: boolean;
};

let state: GuideState = { stop: null, step: 0, heroDone: false, demoScene: "point", dismissed: false };
const listeners = new Set<() => void>();

export function setGuide(patch: Partial<GuideState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useGuide(): GuideState {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

/** Final step for every section once the guide is dismissed. */
export const GUIDE_DONE = 99;

/** This section's current step: -1 while the guide is elsewhere, GUIDE_DONE if it's switched off. */
export function useGuideStep(stop: string): number {
  const g = useGuide();
  if (g.dismissed) return GUIDE_DONE;
  return g.stop === stop ? g.step : -1;
}
