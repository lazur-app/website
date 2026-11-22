"use client";

import type { PostHog } from "posthog-js";

/**
 * PostHog for the website: full tracking.
 * - Autocapture of every click, form submit and input change (input *values* are never sent)
 * - Session replay (all inputs masked), heatmaps, dead clicks, rage clicks
 * - Exceptions, web vitals, page views on every route change, page leaves with scroll depth
 * - Named events via track() for the actions we report on (download, checkout, CTA clicks…)
 *
 * Requests go through our own domain (/ingest, see next.config.ts) so ad blockers don't drop them.
 * posthog-js is loaded lazily once the browser is idle after the first paint, so it never sits in
 * the critical bundle. Calls made before it arrives are queued and replayed in order.
 */

// The project key is public by design (it ships to every browser); env var overrides it.
const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() || "phc_BcZntX35R2irgicyov9QYMsBk9tD9hUMZTERuYUTrnVR";
const API_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "/ingest";
const UI_HOST = "https://us.posthog.com";

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

let started = false;
let client: PostHog | null = null;
const queue: Array<(ph: PostHog) => void> = [];

function withPosthog(fn: (ph: PostHog) => void) {
  if (typeof window === "undefined") return;
  if (client) fn(client);
  else queue.push(fn);
}

function whenIdle(cb: () => void) {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 2500 });
  else setTimeout(cb, 1500);
}

export function startProductAnalytics() {
  if (started || !KEY || typeof window === "undefined") return;
  started = true;
  whenIdle(() => {
    void import("posthog-js").then(({ default: posthog }) => {
      posthog.init(KEY, {
        api_host: API_HOST,
        ui_host: UI_HOST,
        defaults: "2025-05-24",
        autocapture: { capture_copied_text: true },
        capture_pageview: false, // sent from Providers on every route change (App Router)
        capture_pageleave: true,
        capture_dead_clicks: true,
        capture_exceptions: true,
        capture_performance: { web_vitals: true, network_timing: true },
        enable_heatmaps: true,
        rageclick: true,
        disable_session_recording: false,
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: "[data-ph-mask]",
        },
        enable_recording_console_log: true,
        persistence: "localStorage+cookie",
        person_profiles: "always",
        loaded: (ph) => {
          ph.register({ site: "website" });
          if (process.env.NODE_ENV === "development") ph.debug(false);
        },
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

function clean(properties?: AnalyticsProps) {
  if (!properties) return undefined;
  const out: Record<string, string | number | boolean | null> = {};
  for (const [k, v] of Object.entries(properties)) if (v !== undefined) out[k] = v;
  return out;
}

/**
 * Send a named event. Use snake_case "object_action" names (cta_clicked, faq_opened, …) and put
 * the specifics in properties (location, label, plan…), so one event covers every placement.
 */
export function track(event: string, properties?: AnalyticsProps) {
  const props = clean(properties);
  const gaName = event === "download_clicked" && props?.platform === "windows" ? "download_windows" : GA_EVENTS[event];
  if (gaName && typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", gaName, props ?? {});
  }
  withPosthog((ph) => ph.capture(event, props));
}

/**
 * Like track(), but only once per browser for a given key (e.g. a checkout id), so reloading a
 * success page doesn't double-count. With no key it behaves like track().
 */
export function trackOnce(key: string | null | undefined, event: string, properties?: AnalyticsProps) {
  if (key && typeof window !== "undefined") {
    const storageKey = `lazur_tracked:${event}:${key}`;
    try {
      if (window.localStorage.getItem(storageKey)) return;
      window.localStorage.setItem(storageKey, "1");
    } catch {
      // storage blocked: send anyway
    }
  }
  track(event, properties);
}

/** Link this browser to the Lazur account (same id the app and backend use). */
export function identifyUser(userId: string, traits?: AnalyticsProps) {
  if (!userId) return;
  withPosthog((ph) => ph.identify(userId, clean(traits)));
}

/**
 * Someone gave us their email without signing in (waitlist, early access): attach it to this
 * visitor in PostHog so their visits and replays can be found by email.
 */
export function rememberVisitorEmail(email: string) {
  const value = email.trim().toLowerCase();
  if (!value) return;
  withPosthog((ph) => ph.setPersonProperties({ email: value }));
}

export function resetAnalyticsUser() {
  withPosthog((ph) => ph.reset());
}

export function trackPageview(path: string) {
  if (typeof window === "undefined") return;
  const url = window.location.origin + path + window.location.search;
  withPosthog((ph) => ph.capture("$pageview", { $current_url: url }));
}
