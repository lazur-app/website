/** Soft washes behind the post-testimonial landing — no hard section edges. */
export function LandingLowerAtmosphere() {
  return (
    <div
      className="landing-lower-atmosphere pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute -left-[12%] top-[4%] h-[min(420px,38vw)] w-[min(380px,34vw)] rounded-full opacity-[0.22] blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(107, 75, 252, 0.28) 0%, transparent 68%)",
        }}
      />
      <div
        className="absolute -right-[8%] top-[18%] h-[min(360px,32vw)] w-[min(320px,28vw)] rounded-full opacity-[0.16] blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(250, 204, 21, 0.22) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute left-[6%] top-[42%] h-[280px] w-[240px] rounded-full opacity-[0.1] blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(52, 211, 153, 0.2) 0%, transparent 72%)",
        }}
      />
      <div
        className="absolute -right-[6%] top-[58%] h-[340px] w-[300px] rounded-full opacity-[0.14] blur-[95px]"
        style={{
          background:
            "radial-gradient(circle, rgba(107, 75, 252, 0.22) 0%, transparent 68%)",
        }}
      />
      <div
        className="absolute -left-[4%] bottom-[8%] h-[300px] w-[280px] rounded-full opacity-[0.12] blur-[88px]"
        style={{
          background:
            "radial-gradient(circle, rgba(251, 146, 60, 0.18) 0%, transparent 70%)",
        }}
      />

      <span className="absolute left-[4%] top-[12%] hidden max-w-[6rem] rotate-[-8deg] font-[family-name:var(--font-caveat)] text-[1.1rem] text-[var(--brand)]/25 md:block">
        builders
      </span>
      <span className="absolute right-[5%] top-[35%] hidden max-w-[7rem] rotate-[5deg] text-[11px] italic text-[var(--foreground-faint)]/50 md:block">
        hold · speak · release
      </span>
      <span className="absolute left-[8%] top-[72%] hidden h-px w-20 rotate-[14deg] bg-gradient-to-r from-[var(--brand)]/20 to-transparent lg:block" />
    </div>
  );
}
