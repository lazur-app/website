"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Loader2, Sparkles } from "lucide-react";
import { AuthFlowShell } from "@/components/AuthFlowShell";
import { HandUnderline } from "@/components/buddy/HandLoop";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { useAuth } from "@/components/AuthProvider";
import { hasValidSessionToken } from "@/lib/auth";
import {
  fetchBillingStatus,
  syncBillingSubscription,
  type BillingStatus,
} from "@/lib/billing";
import { loginPathWithReturn } from "@/lib/returnTo";
import { trackOnce } from "@/lib/productAnalytics";

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 30;
/** Sync is a fallback only, webhooks should unlock first. */
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
  const checkoutId = searchParams.get("checkout_id") ?? searchParams.get("session_id");
  const [status, setStatus] = useState<"polling" | "done" | "timeout">("polling");
  const [billing, setBilling] = useState<BillingStatus | null>(null);

  useEffect(() => {
    if (searchParams.get("desktop") === "1") {
      trackOnce(checkoutId, "checkout_completed", { plan: expectedPlan, session_id: checkoutId, confirmed: false, source: "desktop" });
      window.location.replace("lazur://billing/complete");
      return;
    }

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
          if (!cancelled) trackOnce(checkoutId, "checkout_completed", {
            plan: next.plan_slug,
            interval: next.billing_interval,
            session_id: checkoutId,
            confirmed: true,
            polls: attempts,
            source: "website",
          });
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
        trackOnce(checkoutId, "checkout_completed", {
          plan: last?.plan_slug ?? expectedPlan,
          interval: last?.billing_interval,
          session_id: checkoutId,
          confirmed: false,
          polls: attempts,
          source: "website",
        });
        await refresh({ force: true }).catch(() => null);
        setStatus("timeout");
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [router, refresh, expectedPlan, checkoutId]);

  return (
    <AuthFlowShell contentClassName="w-full max-w-[480px]">
      <div className="rounded-[28px] border-[1.5px] border-[#1c1917] bg-white px-6 py-8 text-center shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] md:px-8">
        {status === "polling" && (
          <>
            <Loader2 className="mx-auto mb-6 h-10 w-10 animate-spin text-[#1c1917]" />
            <h1 className={TITLE}>Confirming your upgrade…</h1>
            <p className={BODY}>
              Finalizing your subscription. This usually takes a few seconds, keep this tab open.
            </p>
          </>
        )}

        {status === "done" && billing && (
          <>
            <span className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-full bg-[#14917a]">
              <Check className="h-6 w-6 text-white" strokeWidth={3} />
            </span>
            <h1 className={TITLE}>
              You&apos;re on{" "}
              <span className="relative inline-block whitespace-nowrap">
                {billing.plan}
                <HandUnderline show color="#e11d48" delay={0.3} duration={0.8} offset={2} />
              </span>
            </h1>
            <p className={BODY}>
              Your subscription is active. Open Lazur on your Mac to use your new limits right away.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <TrackedLink
                href="/dashboard"
                eventProps={{ location: "billing_success", label: "Go to dashboard", destination: "/dashboard" }}
                className={DARK_PILL}
              >
                <Sparkles className="h-4 w-4" />
                Go to dashboard
              </TrackedLink>
              <TrackedLink
                href="/download"
                eventProps={{ location: "billing_success", label: "Download for Mac", destination: "/download" }}
                className={WHITE_PILL}
              >
                Download for Mac
              </TrackedLink>
            </div>
          </>
        )}

        {status === "timeout" && (
          <>
            <span className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-full bg-[#5b4bd6]">
              <Sparkles className="h-5 w-5 text-white" strokeWidth={2} />
            </span>
            <h1 className={TITLE}>Payment received</h1>
            <p className={BODY}>
              {billing
                ? `Your account shows ${billing.plan}. If limits haven't updated yet, refresh the app or check back in a minute.`
                : "We're still syncing your subscription. Check your dashboard in a minute."}
            </p>
            <TrackedLink
              href="/billing"
              eventProps={{ location: "billing_success_timeout", label: "View billing", destination: "/billing" }}
              className={`mt-8 ${DARK_PILL}`}
            >
              View billing
            </TrackedLink>
          </>
        )}
      </div>
    </AuthFlowShell>
  );
}

const TITLE = "font-sans text-[1.75rem] font-bold leading-[1.1] tracking-[-0.04em] text-[var(--foreground)]";
const BODY = "mt-4 text-[15px] leading-relaxed text-[var(--foreground-muted)]";
const DARK_PILL =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#1c1917] px-6 text-[15px] font-bold text-white transition-colors hover:bg-black";
const WHITE_PILL =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-[1.5px] border-[#1c1917] bg-white px-6 text-[15px] font-bold text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9)] transition-transform hover:-translate-y-0.5";

export default function BillingSuccessPage() {
  return (
    <Suspense>
      <BillingSuccessContent />
    </Suspense>
  );
}
