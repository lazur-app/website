"use client";

import posthog from "posthog-js";

/**
 * PostHog for the website: page views and a few named actions (download, checkout).
 * No autocapture, no session recording, no heatmaps: only the events we send on purpose.
 */

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() ?? "";
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";
let started = false;

export function startProductAnalytics() {
  if (started || !KEY || typeof window === "undefined") return;
  started = true;
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
  if (!started) return;
  posthog.capture(event, properties);
}

/** Link this browser to the Lazur account (same id the app and backend use). */
export function identifyUser(userId: string) {
  if (!started || !userId) return;
  posthog.identify(userId);
}

export function resetAnalyticsUser() {
  if (!started) return;
  posthog.reset();
}

export function trackPageview(path: string) {
  if (!started) return;
  posthog.capture("$pageview", { $current_url: window.location.origin + path });
}
