"use client";

import type { ReactNode } from "react";
import { Copy, Trophy, Users } from "lucide-react";
import { SoftCard } from "@/components/SoftCard";

export function ReferralSystem() {
  return (
    <section className="mt-14 space-y-6 border-t border-[var(--border)] pt-12">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
          How it works
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[1.75rem]">
          Earn as you share
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StepCard
          icon={<Copy className="h-4 w-4" strokeWidth={1.75} />}
          number="1"
          title="Share your link"
          description="Share your referral link with friends and on social."
        />
        <StepCard
          icon={<Users className="h-4 w-4" strokeWidth={1.75} />}
          symbol="✓"
          number="2"
          title="Friends join"
          description="When they sign up with your link, you earn 30% of their purchase."
        />
        <StepCard
          icon={<Trophy className="h-4 w-4" strokeWidth={1.75} />}
          number="3"
          title="Earn rewards"
          description="Unlock perks at each milestone you reach."
        />
      </div>
    </section>
  );
}

function StepCard({
  icon,
  number,
  title,
  description,
  symbol,
}: {
  icon: ReactNode;
  number: string;
  title: string;
  description: string;
  symbol?: string;
}) {
  return (
    <SoftCard interactive className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--background-deep)]/70 text-[var(--foreground-muted)]">
          {icon}
        </div>
        {symbol ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--foreground)] text-[9px] font-bold text-[var(--background)]">
            {symbol}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-[14px] font-semibold text-[var(--foreground)]">
        {number}. {title}
      </p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--foreground-muted)]">
        {description}
      </p>
    </SoftCard>
  );
}
