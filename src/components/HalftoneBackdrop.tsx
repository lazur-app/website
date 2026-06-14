"use client";

import { usePerformanceTier } from "@/hooks/usePerformanceTier";

/** Fixed grunge + scanline glitch + grain backdrop for marketing pages. */
export function HalftoneBackdrop() {
  const { isReduced } = usePerformanceTier();

  return (
    <div
      className="halftone-backdrop pointer-events-none fixed inset-0 -z-20"
      aria-hidden
    >
      <div className="halftone-backdrop__wash" />
      {!isReduced && (
        <>
          <div className="halftone-backdrop__analyze" />
          <div className="halftone-backdrop__scanlines" />
          <div className="halftone-backdrop__grunge" />
          <div className="halftone-backdrop__grain" />
        </>
      )}
    </div>
  );
}
