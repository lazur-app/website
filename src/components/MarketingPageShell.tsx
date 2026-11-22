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
  /** The little scroll marker on the right edge of the page. Off everywhere; pass true to bring it back on a page. */
  scrollIndicator?: boolean;
};

function MarketingPageShellInner({ children, scrollIndicator = false }: MarketingPageShellProps) {
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
