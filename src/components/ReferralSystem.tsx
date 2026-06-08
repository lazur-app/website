"use client";

import type { ReactNode } from "react";
import { Copy, MessageSquare, Trophy, Users } from "lucide-react";

export function ReferralSystem() {
  return (
    <section className="mt-12 space-y-8 border-t border-[var(--border)] pt-10">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-faint)]">
          How it works
        </p>
        <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-[var(--foreground)]">
          Earn as you <span className="gradient-word">share</span>
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StepCard
          icon={<Copy className="h-4 w-4 text-[var(--brand)]" />}
          number="1"
          title="Share your link"
          description="Share your referral link with friends and on social."
        />
        <StepCard
          icon={<Users className="h-4 w-4 text-emerald-600" />}
          symbol="✓"
          number="2"
          title="Friends join"
          description="When they sign up with your link, you earn 30% of their purchase."
        />
        <StepCard
          icon={<Trophy className="h-4 w-4 text-orange-500" />}
          number="3"
          title="Earn rewards"
          description="Unlock perks at each milestone you reach."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-solid)]/80 p-5">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-faint)]">
            Milestones
          </h3>
          <div className="mt-3 divide-y divide-[var(--border)]">
            <MilestoneRow threshold="5 invites" reward="Day 1 Badge" />
            <MilestoneRow threshold="25 invites" reward="1 Month Ultra" />
            <MilestoneRow threshold="50 invites" reward="Founding Member" />
            <MilestoneRow threshold="100 invites" reward="3 Months Ultra" />
            <MilestoneRow threshold="250 invites" reward="4% Lifetime" />
            <MilestoneRow threshold="1000 invites" reward="Get Hired" isSpecial />
          </div>
          <p className="mt-3 text-[11px] text-[var(--foreground-muted)]">
            * Referrals must subscribe to Pro or Power to qualify.
          </p>
        </div>

        <div className="space-y-3">
          <PromoCard
            icon={<MessageSquare className="h-4 w-4" />}
            iconBg="bg-[var(--foreground)] text-white"
            title="Promote on X"
            description="Post about Lazur and earn $1 per 1,000 views."
          />
          <PromoCard
            icon={<Trophy className="h-4 w-4" />}
            iconBg="bg-orange-100 text-orange-600"
            title="Creator program"
            description="10k+ followers? Promote on more platforms."
          />
        </div>
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
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-solid)]/80 p-4">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-soft)]">
          {icon}
        </div>
        {symbol ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
            {symbol}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-[13px] font-semibold text-[var(--foreground)]">
        {number}. {title}
      </p>
      <p className="mt-1 text-[12px] leading-relaxed text-[var(--foreground-muted)]">
        {description}
      </p>
    </div>
  );
}

function PromoCard({
  icon,
  iconBg,
  title,
  description,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)]/80 p-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-semibold text-[var(--foreground)]">{title}</p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--foreground-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}

function MilestoneRow({
  threshold,
  reward,
  isSpecial = false,
}: {
  threshold: string;
  reward: string;
  isSpecial?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 text-[13px]">
      <span className="font-medium text-[var(--foreground-muted)]">{threshold}</span>
      <span
        className={`font-semibold ${
          isSpecial ? "gradient-word" : "text-[var(--foreground)]"
        }`}
      >
        {reward}
      </span>
    </div>
  );
}
