"use client";

import type { PostHog } from "posthog-js";

/**
 * PostHog for the website: page views and a few named actions (download, checkout).
 * No autocapture, no session recording, no heatmaps: only the events we send on purpose.
 *
 * posthog-js is loaded lazily, once the browser is idle after the first paint, so it never sits in
 * the critical bundle. Calls made before it arrives are queued and replayed in order.
 */

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() ?? "";
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";
let started = false;
let client: PostHog | null = null;
const queue: Array<(ph: PostHog) => void> = [];

function withPosthog(fn: (ph: PostHog) => void) {
  if (!started) return;
  if (client) fn(client);
  else queue.push(fn);
}

function whenIdle(cb: () => void) {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 4000 });
  else setTimeout(cb, 2000);
}

export function startProductAnalytics() {
  if (started || !KEY || typeof window === "undefined") return;
  started = true;
  whenIdle(() => {
    void import("posthog-js").then(({ default: posthog }) => {
      posthog.init(KEY, {
        api_host: HOST,
        autocapture: false,
        capture_pageview: false, // sent from Providers on every route change (App Router)
        capture_pageleave: true,
        disable_session_recording: true,
        enable_heatmaps: false,
        capture_dead_clicks: false,
        persistence: "localStorage+cookie",
        person_profiles: "identified_only",
      });
      client = posthog;
      for (const fn of queue.splice(0)) fn(posthog);
    });
  });
}

// Website actions that also go to Google Analytics, so GA can count them per traffic source.
// GA's own names where it has one (begin_checkout, login); mark them as key events in GA.
const GA_EVENTS: Record<string, string> = {
  download_clicked: "download_mac",
  checkout_started: "begin_checkout",
  login: "login",
  persona_selected: "persona_selected",
};

export function track(event: string, properties?: Record<string, string | number | boolean>) {
  const gaName = GA_EVENTS[event];
  if (gaName && typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", gaName, properties ?? {});
  }
  withPosthog((ph) => ph.capture(event, properties));
}

/** Link this browser to the Lazur account (same id the app and backend use). */
export function identifyUser(userId: string) {
  if (!userId) return;
  withPosthog((ph) => ph.identify(userId));
}

export function resetAnalyticsUser() {
  withPosthog((ph) => ph.reset());
}

export function trackPageview(path: string) {
  const url = window.location.origin + path;
  withPosthog((ph) => ph.capture("$pageview", { $current_url: url }));
}
