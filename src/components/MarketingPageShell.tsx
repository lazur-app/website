"use client";

import type { ReactNode } from "react";
import { MarketingBackdrop } from "./MarketingBackdrop";
import { LazurCursor } from "./LazurCursor";
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
    <div className="lazur-cursor-scope relative min-h-screen">
      <MarketingBackdrop />
      <LazurCursor />
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
