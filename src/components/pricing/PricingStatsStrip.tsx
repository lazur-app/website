import { GraffitiText } from "@/components/pricing/GraffitiScribble";

const STATS = [
  { value: "15,000+", label: "Words dictated daily" },
  { value: "98%", label: "User satisfaction rate" },
  { value: "30+", label: "Active professionals" },
] as const;

export function PricingStatsStrip() {
  return (
    <div className="border-t border-[var(--border)] pt-12">
      <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center text-center"
          >
            <div className="flex h-14 w-full items-center justify-center sm:h-16">
              <GraffitiText
                rotate={-5}
                className="text-[2.5rem] font-bold leading-none text-[var(--brand)] sm:text-[3rem]"
              >
                {stat.value}
              </GraffitiText>
            </div>
            <p className="max-w-[11rem] text-[13px] leading-snug text-[var(--foreground-muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
