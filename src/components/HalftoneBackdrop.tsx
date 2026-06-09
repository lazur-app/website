/** Fixed grunge + coarse grain backdrop for marketing pages. */
export function HalftoneBackdrop() {
  return (
    <div
      className="halftone-backdrop pointer-events-none fixed inset-0 -z-20"
      aria-hidden
    >
      <div className="halftone-backdrop__wash" />
      <div className="halftone-backdrop__grunge" />
      <div className="halftone-backdrop__grain" />
    </div>
  );
}
