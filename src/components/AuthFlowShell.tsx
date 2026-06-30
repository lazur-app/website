"use client";

import type { ReactNode } from "react";
import { MarketingBackdrop } from "./MarketingBackdrop";
import { Navbar } from "./Navbar";
import { PerformanceTierProvider } from "@/hooks/usePerformanceTier";

type AuthFlowShellProps = {
  children: ReactNode;
  /** Width constraint for centered auth content. */
  contentClassName?: string;
};

/** Shared layout for sign-in and OAuth callback — matches download/dashboard shell. */
export function AuthFlowShell({
  children,
  contentClassName = "w-full max-w-sm",
}: AuthFlowShellProps) {
  return (
    <PerformanceTierProvider>
      <div className="relative min-h-screen">
        <MarketingBackdrop />
        <Navbar />
        <main className="relative mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 pb-20 pt-28 md:pt-32">
          <div className={contentClassName}>{children}</div>
        </main>
      </div>
    </PerformanceTierProvider>
  );
}
