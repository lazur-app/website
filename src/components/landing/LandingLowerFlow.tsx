import type { ReactNode } from "react";

/** Wraps post-speed sections — atmosphere handles the wash (no box-edge gradient). */
export function LandingLowerFlow({ children }: { children: ReactNode }) {
  return <div className="landing-lower-flow relative">{children}</div>;
}
