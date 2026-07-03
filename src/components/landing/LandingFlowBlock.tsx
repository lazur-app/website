import type { ReactNode } from "react";

type LandingFlowBlockProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Single beat in the lower landing story — no band background, uneven spacing via className. */
export function LandingFlowBlock({
  id,
  className = "",
  children,
}: LandingFlowBlockProps) {
  return (
    <section id={id} className={`landing-flow-block relative ${className}`}>
      {children}
    </section>
  );
}
