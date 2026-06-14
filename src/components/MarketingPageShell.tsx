"use client";

import type { ReactNode } from "react";
import { HalftoneBackdrop } from "./HalftoneBackdrop";
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
      <HalftoneBackdrop />
      <LazurCursor />
      {!isReduced && <ScrollIndicator />}
      {children}
    </div>
  );
}

/** Shared halftone backdrop for marketing pages (landing, pricing, leaderboard). */
export function MarketingPageShell({ children }: MarketingPageShellProps) {
  return (
    <PerformanceTierProvider>
      <MarketingPageShellInner>{children}</MarketingPageShellInner>
    </PerformanceTierProvider>
  );
}
