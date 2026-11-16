"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track, type AnalyticsProps } from "@/lib/productAnalytics";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  /** Event name; defaults to "cta_clicked". */
  event?: string;
  eventProps?: AnalyticsProps;
};

/** next/link that fires a named analytics event on click. Usable from server components. */
export function TrackedLink({ event = "cta_clicked", eventProps, onClick, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track(event, eventProps);
        onClick?.(e);
      }}
    />
  );
}

export default TrackedLink;

type TrackedAnchorProps = ComponentProps<"a"> & {
  /** Event name; defaults to "outbound_link_clicked". */
  event?: string;
  eventProps?: AnalyticsProps;
};

/** Plain <a> (external / mailto links) that fires a named analytics event on click. */
export function TrackedAnchor({ event = "outbound_link_clicked", eventProps, onClick, ...props }: TrackedAnchorProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event, eventProps);
        onClick?.(e);
      }}
    />
  );
}
