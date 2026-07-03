import type { ReactNode } from "react";

/** Post-testimonial sections — single background, no global grid overlay. */
export function LandingLowerFlow({ children }: { children: ReactNode }) {
  return <div className="landing-lower-flow relative">{children}</div>;
}
