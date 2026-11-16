import type React from "react";
import { TRIAL_DAYS } from "@/lib/pricingPlans";

/** The facts that take the risk out of clicking Download. Keep them true (see pricingPlans, faq). */
export const DOWNLOAD_REASSURANCE = [
  `Free ${TRIAL_DAYS}-day Pro trial`,
  "No credit card",
  "Apple Silicon & Intel",
] as const;

/** One quiet line under a Download button: free trial · no card · runs on every Mac. */
export function DownloadReassurance({
  tone = "light",
  className = "",
  style,
}: {
  /** "dark" for dark sections (white text). */
  tone?: "light" | "dark";
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <p
      style={style}
      className={`text-[12.5px] leading-snug ${
        tone === "dark" ? "text-white/55" : "text-[var(--foreground-faint)]"
      } ${className}`.trim()}
    >
      {DOWNLOAD_REASSURANCE.map((item, i) => (
        <span key={item}>
          {i > 0 ? <span aria-hidden>{"\u00a0· "}</span> : null}
          <span className="whitespace-nowrap">{item}</span>
        </span>
      ))}
    </p>
  );
}
