"use client";

import type { ReactNode } from "react";
import { Copy, MessageSquare, Trophy, Users } from "lucide-react";

export function ReferralSystem() {
  return (
    <section className="mx-auto max-w-4xl space-y-16 px-6 py-24">
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-faint)]">
          How it works
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
          Earn as you <span className="gradient-word">share</span>
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StepCard
          icon={<Copy className="h-5 w-5 text-[var(--brand)]" />}
          number="1"
          title="Share your link"
          description="Share your referral link with friends and on social media."
        />
        <StepCard
          icon={<Users className="h-5 w-5 text-emerald-600" />}
          symbol="✓"
          number="2"
          title="Friends join"
          description="When they sign up with your link, you get 30% of their purchase."
        />
        <StepCard
          icon={<Trophy className="h-5 w-5 text-orange-500" />}
          number="3"
          title="Earn rewards"
          description="Unlock perks at each milestone you reach."
        />
      </div>

      <div className="glass space-y-6 rounded-3xl p-8">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
            Milestones
          </h3>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
            Rewards
          </span>
        </div>

        <div className="divide-y divide-[var(--border)]">
          <MilestoneRow threshold="5 invites" reward="Day 1 Badge" />
          <MilestoneRow threshold="25 invites" reward="1 Month Ultra" />
          <MilestoneRow threshold="50 invites" reward="Founding Member" />
          <MilestoneRow threshold="100 invites" reward="3 Months Ultra" />
          <MilestoneRow threshold="250 invites" reward="4% Lifetime Earning" />
          <MilestoneRow threshold="1000 invites" reward="Get Hired" isSpecial />
        </div>

        <p className="text-xs text-[var(--foreground-muted)]">
          * Referrals must subscribe to a Basic plan or higher for the invite to qualify.
        </p>
      </div>

      <div className="glass space-y-6 rounded-3xl p-8">
        <h4 className="font-display text-lg font-semibold text-[var(--foreground)]">
          Get paid to promote
        </h4>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--foreground)] text-white shadow-md">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">Promote on X</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--foreground-muted)]">
                Post about Lazur on X and earn $1 for every 1000 views.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shadow-md">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">Creator program</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--foreground-muted)]">
                Have 10k+ followers? You qualify to promote on these platforms too.
              </p>
            </div>
          </div>
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
    <div className="glass space-y-4 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-soft)]">
          {icon}
        </div>
        {symbol ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
            {symbol}
          </div>
        ) : null}
      </div>
      <div className="space-y-2">
        <p className="font-display text-base font-semibold text-[var(--foreground)]">
          {number}. {title}
        </p>
        <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">{description}</p>
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
    <div className="flex items-center justify-between py-4">
      <span className="font-medium text-[var(--foreground)]">{threshold}</span>
      <span
        className={`font-display font-semibold tracking-tight ${
          isSpecial ? "gradient-word" : "text-[var(--foreground)]"
        }`}
      >
        {reward}
      </span>
    </div>
  );
}
