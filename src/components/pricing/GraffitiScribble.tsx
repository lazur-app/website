"use client";

type GraffitiTextProps = {
  children: React.ReactNode;
  className?: string;
  /** Degrees — negative tilts counter-clockwise */
  rotate?: number;
};

/** Hand-drawn style label (Caveat) */
export function GraffitiText({
  children,
  className = "",
  rotate = -10,
}: GraffitiTextProps) {
  return (
    <span
      className={`font-[family-name:var(--font-caveat)] inline-block leading-none tracking-tight ${className}`}
      style={{
        transform: `rotate(${rotate}deg)`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </span>
  );
}

type GraffitiArrowCalloutProps = {
  label: string;
  className?: string;
  /** Degrees — rotates arrow + label together */
  rotate?: number;
};

/** Curved arrow + rotated scribble — tip points left toward Annual */
export function GraffitiArrowCallout({
  label,
  className = "",
  rotate = -10,
}: GraffitiArrowCalloutProps) {
  return (
    <div
      className={`pointer-events-none text-[var(--brand)] ${className}`}
      aria-hidden
    >
      <div
        className="flex origin-left items-start"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <svg
          width="44"
          height="28"
          viewBox="0 0 44 28"
          fill="none"
          className="mt-1.5 shrink-0"
          aria-hidden
        >
          {/* Single path — curve flows into chevron tip with no seam */}
          <path
            d="M38 3.5 C28 3.5 18 7 12 11 L4 14.5 L12 18"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <GraffitiText
          rotate={0}
          className="-mt-1.5 whitespace-nowrap text-[1.125rem] font-bold leading-none sm:text-[1.35rem]"
        >
          {label}
        </GraffitiText>
      </div>
    </div>
  );
}
