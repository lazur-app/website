/**
 * An empty, square-cornered frame where a product film will go. Black and white like the rest of
 * the page: a flat panel with a small play mark. `tone="dark"` is for dark bands.
 */
export function FilmSlot({ label, className = "aspect-video", tone = "light", size = "md", guide }: {
  /** What will play here, for screen readers. */
  label: string;
  /** Sets the shape, e.g. "aspect-[4/3]" or "h-full". */
  className?: string;
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  /** A page-guide target (data-guide). */
  guide?: string;
}) {
  const dark = tone === "dark";
  const mark = size === "lg" ? "h-16 w-16 md:h-20 md:w-20" : size === "sm" ? "h-9 w-9" : "h-12 w-12";
  const glyph = size === "lg" ? "h-7 w-7" : size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <div
      data-guide={guide}
      role="img"
      aria-label={`${label}: film coming soon`}
      className={`relative grid w-full place-items-center border ${dark ? "border-white/15 bg-white/[0.06]" : "border-black/15 bg-black/[0.045]"} ${className}`}
    >
      <span className={`grid place-items-center ${dark ? "bg-white" : "bg-[#0c0b0a]"} ${mark}`} aria-hidden>
        <svg viewBox="0 0 24 24" className={`ml-0.5 ${dark ? "fill-[#0c0b0a]" : "fill-white"} ${glyph}`}>
          <path d="M7 4.5v15l12-7.5z" />
        </svg>
      </span>
    </div>
  );
}
