import type { ReactNode } from "react";
import { CursorGlow } from "./CursorGlow";
import { HalftoneBackdrop } from "./HalftoneBackdrop";
import { ScrollIndicator } from "./ScrollIndicator";

type MarketingPageShellProps = {
  children: ReactNode;
};

/** Shared halftone backdrop for marketing pages (landing, pricing, leaderboard). */
export function MarketingPageShell({ children }: MarketingPageShellProps) {
  return (
    <div className="relative min-h-screen">
      <HalftoneBackdrop />
      <CursorGlow />
      <ScrollIndicator />
      {children}
    </div>
  );
}
