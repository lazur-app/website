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

/** Shared layout for sign-in and OAuth callback, in the homepage's look (same shell as /download). */
export function AuthFlowShell({
  children,
  contentClassName = "w-full max-w-sm",
}: AuthFlowShellProps) {
  return (
    <PerformanceTierProvider>
      <div className="relative min-h-screen overflow-x-clip">
        <MarketingBackdrop />
        <Navbar />
        <main className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 pb-24 pt-32 sm:px-6 md:pt-40">
          <div className={contentClassName}>{children}</div>
        </main>
      </div>
    </PerformanceTierProvider>
  );
}
