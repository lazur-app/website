"use client";

import { useEffect, Suspense, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { AuthFlowShell } from "@/components/AuthFlowShell";
import { LogoWordmark } from "@/components/LogoWordmark";

function CallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  const triggerDeepLink = useCallback(async () => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      localStorage.setItem("lazur_access_token", accessToken);
      localStorage.setItem("lazur_refresh_token", refreshToken);

      try {
        const params = `access_token=${accessToken}&refresh_token=${refreshToken}`;
        await fetch(`http://127.0.0.1:1421?${params}`, { mode: "no-cors" });
      } catch {
        /* local auth server optional */
      }

      const deepLink = `lazur://auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`;
      setTimeout(() => {
        window.location.href = deepLink;
      }, 500);
    } else {
      setStatus("error");
    }
  }, [searchParams]);

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (!accessToken || !refreshToken) {
      setStatus("error");
      return;
    }

    const timer = setTimeout(() => {
      setStatus("success");
      triggerDeepLink();
    }, 1200);

    return () => clearTimeout(timer);
  }, [searchParams, triggerDeepLink]);

  return (
    <AuthFlowShell contentClassName="w-full max-w-sm">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8 flex justify-center">
          <LogoWordmark href="/" height={40} />
        </div>

        {(status === "verifying" || status === "success") && (
          <div className="mb-6 text-center">
            <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
              Desktop sign-in
            </span>
          </div>
        )}

        <div className="glass rounded-[var(--radius-card)] px-6 py-8 md:px-8">
          <AnimatePresence mode="wait">
            {status === "verifying" && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-center"
              >
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--foreground-muted)]" />
                <div>
                  <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                    Connecting your account
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
                    Verifying sign-in and preparing the Mac app…
                  </p>
                </div>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-center"
              >
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" strokeWidth={1.75} />

                <div>
                  <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                    You&apos;re signed in
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
                    Your account is synced. Head back to Lazur on your Mac to start
                    writing with your voice.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={triggerDeepLink}
                    className="btn-dark group flex w-full items-center justify-center gap-2 !rounded-xl px-5 py-3 text-sm font-semibold"
                  >
                    Return to app
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <p className="text-[12px] text-[var(--foreground-faint)]">
                    Opening Lazur on your Mac…
                  </p>
                </div>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-center"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                  <span className="text-lg font-semibold text-red-600">!</span>
                </div>
                <div>
                  <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                    Sign-in incomplete
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
                    We didn&apos;t receive your session tokens. Please try signing in
                    again from the app.
                  </p>
                </div>
                <Link
                  href="/login/app"
                  className="btn-dark inline-flex w-full items-center justify-center !rounded-xl px-5 py-3 text-sm font-semibold"
                >
                  Back to sign in
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center text-[11px] leading-relaxed text-[var(--foreground-faint)]">
          Signed in on the web?{" "}
          <Link href="/dashboard" className="font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
            Go to your dashboard
          </Link>
        </p>
      </motion.div>
    </AuthFlowShell>
  );
}

function CallbackFallback() {
  return (
    <AuthFlowShell contentClassName="w-full max-w-sm">
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--foreground-muted)]" />
        <p className="mt-4 text-sm text-[var(--foreground-muted)]">Loading…</p>
      </div>
    </AuthFlowShell>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <CallbackContent />
    </Suspense>
  );
}
