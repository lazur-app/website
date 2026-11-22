"use client";

import type { ReactNode } from "react";
import { MarketingBackdrop } from "./MarketingBackdrop";
import { ScrollIndicator } from "./ScrollIndicator";
import {
  PerformanceTierProvider,
  usePerformanceTier,
} from "@/hooks/usePerformanceTier";

type MarketingPageShellProps = {
  children: ReactNode;
  /** The little scroll marker on the right edge of the page. Pass false for a page without one. */
  scrollIndicator?: boolean;
};

function MarketingPageShellInner({ children, scrollIndicator = true }: MarketingPageShellProps) {
  const { isReduced } = usePerformanceTier();

  return (
    <div className="relative min-h-screen">
      <MarketingBackdrop />
      {scrollIndicator && !isReduced && <ScrollIndicator />}
      {children}
    </div>
  );
}

/** Shared backdrop for marketing pages (landing, pricing, leaderboard). */
export function MarketingPageShell({ children, scrollIndicator }: MarketingPageShellProps) {
  return (
    <PerformanceTierProvider>
      <MarketingPageShellInner scrollIndicator={scrollIndicator}>{children}</MarketingPageShellInner>
    </PerformanceTierProvider>
  );
}
