"use client";

import { useSyncExternalStore } from "react";

/**
 * What the navbar notch is saying right now. The homepage hero sets it while Lazur introduces
 * itself; the navbar (which is the notch) grows to show it, then shrinks back when it's cleared.
 */
export type NotchVoice = {
  state: "listening" | "thinking" | "speaking";
  /** The line under the status row (what was said or what Lazur says). */
  line?: string;
};

let current: NotchVoice | null = null;
const listeners = new Set<() => void>();

export function setNotchVoice(voice: NotchVoice | null) {
  current = voice;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useNotchVoice(): NotchVoice | null {
  return useSyncExternalStore(subscribe, () => current, () => null);
}

/**
 * The homepage intro, if this page has one: whether it has finished (so hover and idle peeks may
 * start without talking over it) and how to play it again.
 */
export type NotchIntro = { done: boolean; replay: () => void };

let intro: NotchIntro | null = null;
const introListeners = new Set<() => void>();

export function setNotchIntro(next: NotchIntro | null) {
  intro = next;
  introListeners.forEach((l) => l());
}

function subscribeIntro(listener: () => void) {
  introListeners.add(listener);
  return () => introListeners.delete(listener);
}

export function useNotchIntro(): NotchIntro | null {
  return useSyncExternalStore(subscribeIntro, () => intro, () => null);
}
