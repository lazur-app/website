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
};

function MarketingPageShellInner({ children }: MarketingPageShellProps) {
  const { isReduced } = usePerformanceTier();

  return (
    <div className="relative min-h-screen">
      <MarketingBackdrop />
      {!isReduced && <ScrollIndicator />}
      {children}
    </div>
  );
}

/** Shared backdrop for marketing pages (landing, pricing, leaderboard). */
export function MarketingPageShell({ children }: MarketingPageShellProps) {
  return (
    <PerformanceTierProvider>
      <MarketingPageShellInner>{children}</MarketingPageShellInner>
    </PerformanceTierProvider>
  );
}
