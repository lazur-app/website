/** Faded line grid — side gutters with lower-left/right visibility. */
export function HeroDemoGrid() {
  return (
    <div
      className="hero-demo-grid pointer-events-none absolute left-1/2 top-[28%] bottom-0 z-[1] w-screen max-w-[100vw] -translate-x-1/2"
      aria-hidden
    />
  );
}
