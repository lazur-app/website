/**
 * Asymmetric color washes + scattered marks — breaks centered monotony on the landing page.
 * Static, pointer-events-none, sits behind content.
 */
export function LandingAtmosphere() {
  return (
    <div
      className="landing-atmosphere pointer-events-none absolute inset-x-0 top-0 -z-[1] min-h-full w-full overflow-hidden"
      aria-hidden
    >
      {/* Hero band — purple left, warm yellow right */}
      <div
        className="absolute -left-[14%] top-[8vh] h-[min(480px,42vw)] w-[min(480px,42vw)] rounded-full opacity-[0.28] blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(107, 75, 252, 0.45) 0%, rgba(168, 85, 247, 0.15) 45%, transparent 72%)",
        }}
      />
      <div
        className="absolute -right-[10%] top-[22vh] h-[min(380px,34vw)] w-[min(340px,30vw)] rounded-full opacity-[0.22] blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(250, 204, 21, 0.35) 0%, rgba(251, 146, 60, 0.12) 50%, transparent 70%)",
        }}
      />

      {/* Speed race — coral peek from left */}
      <div
        className="absolute -left-[6%] top-[95vh] h-[320px] w-[280px] rounded-full opacity-[0.2] blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, transparent 68%)",
        }}
      />
      <div
        className="absolute right-[2%] top-[108vh] h-[260px] w-[300px] rounded-full opacity-[0.18] blur-[85px]"
        style={{
          background:
            "radial-gradient(circle, rgba(107, 75, 252, 0.35) 0%, transparent 65%)",
        }}
      />

      {/* Mid page — mint + violet, offset */}
      <div
        className="absolute left-[8%] top-[175vh] h-[240px] w-[220px] rounded-full opacity-[0.14] blur-[70px]"
        style={{
          background:
            "radial-gradient(circle, rgba(52, 211, 153, 0.35) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -right-[4%] top-[210vh] h-[400px] w-[360px] rounded-full opacity-[0.2] blur-[95px]"
        style={{
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.28) 0%, rgba(250, 204, 21, 0.08) 40%, transparent 72%)",
        }}
      />

      {/* Lower page */}
      <div
        className="absolute -left-[8%] top-[290vh] h-[340px] w-[320px] rounded-full opacity-[0.16] blur-[88px]"
        style={{
          background:
            "radial-gradient(circle, rgba(107, 75, 252, 0.32) 0%, transparent 68%)",
        }}
      />

      {/* Scattered marks — voice ghost on left, intent on right */}
      <span className="absolute left-[5%] top-[32vh] hidden max-w-[7rem] rotate-[-11deg] font-display text-[13px] italic leading-snug text-[var(--brand)]/[0.07] sm:block">
        um so like…
      </span>
      <span className="absolute right-[4%] top-[48vh] hidden max-w-[8rem] rotate-[6deg] text-[12px] leading-snug text-[var(--foreground)]/[0.06] sm:block">
        what you meant
      </span>
      <span className="absolute left-[7%] top-[120vh] hidden h-px w-16 rotate-[18deg] bg-gradient-to-r from-[var(--brand)]/20 to-transparent md:block" />
      <span className="absolute right-[6%] top-[145vh] hidden h-1.5 w-1.5 rounded-full bg-[rgba(250,204,21,0.35)] md:block" />
      <span className="absolute left-[3%] top-[188vh] hidden h-1 w-1 rounded-full bg-[var(--brand)]/25 md:block" />
      <span className="absolute right-[8%] top-[235vh] hidden max-w-[6rem] rotate-[-4deg] text-[11px] italic text-[var(--foreground-faint)]/40 md:block">
        hold · speak · release
      </span>
      <span className="absolute left-[10%] top-[260vh] hidden h-px w-24 -rotate-12 bg-gradient-to-r from-transparent via-[rgba(251,146,60,0.25)] to-transparent lg:block" />
    </div>
  );
}
