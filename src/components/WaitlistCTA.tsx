"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Copy, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetchWaitlistStats, joinWaitlist, storeMyReferralCode, type WaitlistJoinResult } from "@/lib/waitlist";

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function WaitlistCTA() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WaitlistJoinResult | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchWaitlistStats()
      .then((stats) => setTotalCount(stats.total_count))
      .catch(() => setTotalCount(null));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOk(email)) return;

    setLoading(true);
    setError(null);

    try {
      const data = await joinWaitlist(email);
      storeMyReferralCode(data.referral_code);
      setResult(data);
      setTotalCount(data.total_count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = async () => {
    if (!result?.referral_link) return;
    await navigator.clipboard.writeText(result.referral_link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const countLabel =
    totalCount !== null && totalCount > 0
      ? `Join ${totalCount.toLocaleString()}+ on the waitlist`
      : "Join the waitlist";

  return (
    <section id="waitlist" className="relative py-32 md:py-40">
      <div className="pointer-events-none absolute inset-0 grain" />
      <div
        className="ambient-blob pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e8e0ff]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-xl px-6 text-center">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--foreground-faint)]">
          Early access
        </p>
        <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl">
          Your voice,{" "}
          <span className="gradient-word">upgraded.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-sm text-pretty text-base text-[var(--foreground-muted)]">
          {countLabel}. Drop your email and we&apos;ll let you know the moment Lazur
          launches on macOS. You&apos;ll get a personal referral link to share.
        </p>

        <div className="mt-10">
          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl px-8 py-10 text-left"
            >
              <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-emerald-600" />
              <p className="text-center font-display text-xl font-semibold text-[var(--foreground)]">
                {result.already_joined ? "You're already on the list" : "You're on the list"}
              </p>
              <p className="mt-2 text-center text-sm text-[var(--foreground-muted)]">
                We&apos;ll email{" "}
                <span className="font-medium text-[var(--foreground)]">{result.email}</span>{" "}
                when Lazur opens up.
              </p>

              <div className="mt-6 space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
                  Your referral link
                </p>
                <p className="break-all text-sm font-medium text-[var(--foreground)]">
                  {result.referral_link}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--foreground-muted)]">
                  <span>Code: {result.referral_code}</span>
                  <span>·</span>
                  <span>#{result.waitlist_position.toLocaleString()} in line</span>
                  {result.referral_count > 0 && (
                    <>
                      <span>·</span>
                      <span>{result.referral_count} referrals</span>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={copyReferralLink}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--background-deep)]"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy link"}
                </button>
              </div>

              <Link
                href="/leaderboard"
                className="mt-6 inline-flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                Climb the leaderboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-3">
              <div className="glass flex items-center overflow-hidden rounded-full px-5">
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trimStart())}
                  placeholder="you@email.com"
                  required
                  disabled={loading}
                  className="flex-1 bg-transparent py-4 text-[var(--foreground)] placeholder:text-[var(--foreground-faint)] outline-none disabled:opacity-60"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Joining…
                  </>
                ) : (
                  "Join the waitlist"
                )}
              </button>
              <p className="text-xs text-[var(--foreground-faint)]">
                Free · No credit card · Referral link included
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
