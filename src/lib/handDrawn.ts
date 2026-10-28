/**
 * Hand-drawn marks in real pixels. Never stretch these with preserveAspectRatio="none": Chrome then
 * miscounts the stroke length and a drawn-in loop stops halfway.
 */

/** A loop around a w×h box (its own size), starting top right and overshooting where it began. */
export function loopPath(w: number, h: number): string {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2 - 3;
  const ry = h / 2 - 3;
  const k = 0.5523; // bezier handle for a quarter ellipse
  return [
    `M ${cx + rx * 0.12} ${cy - ry}`,
    `C ${cx + rx * 0.12 + rx * k} ${cy - ry} ${cx + rx} ${cy - ry * k} ${cx + rx} ${cy}`,
    `C ${cx + rx} ${cy + ry * k} ${cx + rx * k} ${cy + ry} ${cx} ${cy + ry}`,
    `C ${cx - rx * k} ${cy + ry} ${cx - rx} ${cy + ry * k} ${cx - rx} ${cy}`,
    `C ${cx - rx} ${cy - ry * k} ${cx - rx * k} ${cy - ry - 1.5} ${cx + rx * 0.05} ${cy - ry - 1}`,
    `C ${cx + rx * 0.22} ${cy - ry - 1} ${cx + rx * 0.34} ${cy - ry + 0.5} ${cx + rx * 0.42} ${cy - ry + 3}`,
  ].join(" ");
}

/** A slightly wavy underline across width w, at height h (the svg's own height). */
export function underlinePath(w: number, h: number): string {
  const y = h / 2;
  return `M 2 ${y + 1} C ${w * 0.3} ${y - 2} ${w * 0.6} ${y + 2.5} ${w - 2} ${y - 1}`;
}
