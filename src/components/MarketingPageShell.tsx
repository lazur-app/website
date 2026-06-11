import type { ReactNode } from "react";
import { HalftoneBackdrop } from "./HalftoneBackdrop";
import { LazurCursor } from "./LazurCursor";
import { ScrollIndicator } from "./ScrollIndicator";

type MarketingPageShellProps = {
  children: ReactNode;
};

/** Shared halftone backdrop for marketing pages (landing, pricing, leaderboard). */
export function MarketingPageShell({ children }: MarketingPageShellProps) {
  return (
    <div className="lazur-cursor-scope relative min-h-screen">
      <HalftoneBackdrop />
      <LazurCursor />
      <ScrollIndicator />
      {children}
    </div>
  );
}
