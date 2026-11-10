"use client";

import { useState } from "react";

/**
 * Content photos (Pixabay, stored on R2 at images.lazur.app). Served straight from storage, never
 * through Vercel's image optimizer: the pipeline already resizes and compresses every photo, and
 * thousands of remote images would use up the optimizer quota (it returns 402 when it does, which
 * broke every page on 2026-11-09). If a photo ever fails to load, a branded placeholder takes its
 * place instead of a broken-image icon.
 */
export function ContentImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div role="img" aria-label={alt} className={`seo-img-fallback ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
        <span className="seo-img-fallback__mark" aria-hidden />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- deliberately not next/image, see above
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
