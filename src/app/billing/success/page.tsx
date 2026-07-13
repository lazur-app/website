"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { hasValidSessionToken, type UserProfile } from "@/lib/auth";
import { syncBillingSubscription } from "@/lib/billing";
import { loginPathWithReturn } from "@/lib/returnTo";

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 30;

function planMatchesExpected(profile: UserProfile, expected: string | null): boolean {
  if (!expected) return true;
  const slug = (profile.plan_slug || profile.plan).toLowerCase();
  if (expected === "pro") {
    return slug === "pro";
  }
  if (expected === "power") {
    return slug === "power";
  }
  return true;
}

function BillingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const expectedPlan = searchParams.get("plan");
  const [status, setStatus] = useState<"polling" | "done" | "timeout">("polling");
  const [profile, setProfile] = useState<UserProfile | null>(null);

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
        await syncBillingSubscription().catch(() => null);
        const next = await refresh({ force: true });
        if (next && planMatchesExpected(next, expectedPlan)) {
          setProfile(next);
          setStatus("done");
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }
      if (!cancelled) {
        const last = await refresh({ force: true });
        if (last) setProfile(last);
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
              This usually takes a few seconds. Please keep this tab open.
            </p>
          </>
        )}

        {status === "done" && profile && (
          <>
            <CheckCircle2 className="mb-6 h-12 w-12 text-emerald-600" />
            <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">
              You&apos;re on {profile.plan}
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
              {profile
                ? `Your account shows ${profile.plan}. If limits haven't updated yet, refresh the app or check back in a minute.`
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
