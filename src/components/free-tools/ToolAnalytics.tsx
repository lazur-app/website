"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { registerAnalyticsProps, track } from "@/lib/productAnalytics";

/**
 * PostHog for the free tools. Every event on a tool page (page views, autocapture, replays and the
 * named events below) carries `tool`, `tool_category` and `tool_kind` ("ai" | "browser"), so any
 * PostHog view can be split by tool.
 *
 * Named events (see also AiTool.tsx and Letter.tsx):
 *   tool_viewed            the page opened
 *   tool_used              first click / key press / tap inside the tool on this visit
 *   tool_run_started       an AI tool was run                 (AiTool)
 *   tool_run_succeeded     … and answered (ms, output shape)  (AiTool)
 *   tool_run_failed        … and failed (status, reason)      (AiTool)
 *   tool_limit_hit         the daily limit was reached (stage) (AiTool)
 *   tool_example_used      "Try an example"                   (AiTool)
 *   tool_signup_completed  email left, extra runs unlocked    (AiTool)
 *   tool_pass_*            the download + feedback card        (AiTool)
 *   tool_result_copied     a result was copied (copied: worked?) (Letter)
 *   letter_shown / letter_cta_clicked   the founders' note     (Letter)
 */
export function ToolAnalytics({ tool, category, kind, embedded = false }: { tool: string; category: string; kind: "ai" | "browser"; embedded?: boolean }) {
  useEffect(() => {
    registerAnalyticsProps({ tool, tool_category: category, tool_kind: kind, tool_embedded: embedded });
    track("tool_viewed", { tool, tool_category: category, tool_kind: kind, embedded, referrer_host: embedded ? document.referrer.split("/")[2] ?? "" : undefined });
  }, [tool, category, kind, embedded]);
  return null;
}

/** Wraps a tool's widget and sends `tool_used` the first time someone interacts with it. */
export function ToolUsage({ tool, kind, children }: { tool: string; kind: "ai" | "browser"; children: ReactNode }) {
  const sent = useRef(false);
  const opened = useRef(0);
  useEffect(() => {
    opened.current = Date.now();
  }, []);
  const first = () => {
    if (sent.current) return;
    sent.current = true;
    track("tool_used", { tool, tool_kind: kind, seconds_to_first_use: Math.round((Date.now() - opened.current) / 1000) });
  };
  return (
    <div onPointerDownCapture={first} onKeyDownCapture={first}>
      {children}
    </div>
  );
}
