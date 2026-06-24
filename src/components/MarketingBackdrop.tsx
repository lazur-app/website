/** Fixed side washes — no grain or texture. */
export function MarketingBackdrop() {
  return (
    <div
      className="marketing-backdrop pointer-events-none fixed inset-0 -z-20"
      aria-hidden
    >
      <div className="marketing-backdrop__glow" />
    </div>
  );
}
