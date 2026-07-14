"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { hasValidSessionToken } from "@/lib/auth";
import {
  fetchBillingStatus,
  syncBillingSubscription,
  type BillingStatus,
} from "@/lib/billing";
import { loginPathWithReturn } from "@/lib/returnTo";

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 30;
/** Sync is a fallback only — webhooks should unlock first. */
const SYNC_ON_ATTEMPTS = new Set([1, 5, 15]);

function planMatchesExpected(status: BillingStatus, expected: string | null): boolean {
  if (!expected) {
    return (status.plan_slug || "").toLowerCase() === "pro"
      || (status.plan_slug || "").toLowerCase() === "power";
  }
  const slug = (status.plan_slug || "").toLowerCase();
  if (expected === "pro") return slug === "pro";
  if (expected === "power") return slug === "power";
  return true;
}

function BillingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const expectedPlan = searchParams.get("plan");
  const [status, setStatus] = useState<"polling" | "done" | "timeout">("polling");
  const [billing, setBilling] = useState<BillingStatus | null>(null);

  useEffect(() => {
    if (!hasValidSessionToken()) {
      router.replace(loginPathWithReturn("/billing/success"));
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      while (!cancelled && attempts < MAX_POLLS) {
        attempts += 1;

        if (SYNC_ON_ATTEMPTS.has(attempts)) {
          await syncBillingSubscription().catch(() => null);
        }

        const next = await fetchBillingStatus();
        if (next && planMatchesExpected(next, expectedPlan)) {
          setBilling(next);
          setStatus("done");
          await refresh({ force: true }).catch(() => null);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }
      if (!cancelled) {
        await syncBillingSubscription().catch(() => null);
        const last = await fetchBillingStatus();
        if (last) setBilling(last);
        await refresh({ force: true }).catch(() => null);
        setStatus("timeout");
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [router, refresh, expectedPlan]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 pb-20 pt-28 text-center">
        {status === "polling" && (
          <>
            <Loader2 className="mb-6 h-10 w-10 animate-spin text-[var(--brand)]" />
            <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">
              Confirming your upgrade…
            </h1>
            <p className="mt-3 text-sm text-[var(--foreground-muted)]">
              Finalizing your subscription. This usually takes a few seconds — keep this tab open.
            </p>
          </>
        )}

        {status === "done" && billing && (
          <>
            <CheckCircle2 className="mb-6 h-12 w-12 text-emerald-600" />
            <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">
              You&apos;re on {billing.plan}
            </h1>
            <p className="mt-3 text-sm text-[var(--foreground-muted)]">
              Your subscription is active. Open Lazur on your Mac to use your new limits right away.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)]"
              >
                <Sparkles className="h-4 w-4" />
                Go to dashboard
              </Link>
              <Link
                href="/download"
                className="inline-flex items-center justify-center rounded-xl border border-[var(--border-strong)] px-5 py-3 text-sm font-semibold text-[var(--foreground)]"
              >
                Download for Mac
              </Link>
            </div>
          </>
        )}

        {status === "timeout" && (
          <>
            <Sparkles className="mb-6 h-10 w-10 text-[var(--brand)]" />
            <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">
              Payment received
            </h1>
            <p className="mt-3 text-sm text-[var(--foreground-muted)]">
              {billing
                ? `Your account shows ${billing.plan}. If limits haven't updated yet, refresh the app or check back in a minute.`
                : "We're still syncing your subscription. Check your dashboard in a minute."}
            </p>
            <Link
              href="/billing"
              className="mt-8 inline-flex rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)]"
            >
              View billing
            </Link>
          </>
        )}
      </main>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense>
      <BillingSuccessContent />
    </Suspense>
  );
}
