/** Fine paper grain over everything, so the page feels printed rather than flat and digital. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.11 0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Fixed side washes, plus a paper grain laid over the whole page. */
export function MarketingBackdrop() {
  return (
    <>
      <div className="marketing-backdrop pointer-events-none fixed inset-0 -z-20" aria-hidden>
        <div className="marketing-backdrop__glow" />
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-[70] opacity-[0.16] mix-blend-multiply"
        style={{ backgroundImage: GRAIN, backgroundSize: "220px 220px" }}
        aria-hidden
      />
    </>
  );
}
