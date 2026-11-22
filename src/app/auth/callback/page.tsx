"use client";

import { useEffect, Suspense, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { HandUnderline } from "@/components/buddy/HandLoop";
import { AuthFlowShell } from "@/components/AuthFlowShell";
import { LogoWordmark } from "@/components/LogoWordmark";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { track } from "@/lib/productAnalytics";

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
        await fetch(`http://127.0.0.1:1421/?${params}`, { mode: "no-cors" });
        await fetch("http://127.0.0.1:1421/", {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
        });
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
      track("login_failed", { method: "google", source: "desktop", reason: "missing_tokens" });
      setStatus("error");
      return;
    }

    const timer = setTimeout(() => {
      track("login", { method: "google", source: "desktop" });
      setStatus("success");
      triggerDeepLink();
    }, 1200);

    return () => clearTimeout(timer);
  }, [searchParams, triggerDeepLink]);

  return (
    <AuthFlowShell contentClassName="w-full max-w-[440px]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8 flex flex-col items-center gap-6">
          <LogoWordmark href="/" height={40} />
          {(status === "verifying" || status === "success") && (
            <span className="inline-flex min-h-[28px] items-center rounded-full bg-[#1c1917] px-3 text-[12px] font-bold text-white">
              Desktop sign-in
            </span>
          )}
        </div>

        <div className={CARD}>
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
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#1c1917]" />
                <div>
                  <h1 className={TITLE}>Connecting your account</h1>
                  <p className={BODY}>Verifying sign-in and preparing the Mac app…</p>
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
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#14917a]">
                  <Check className="h-6 w-6 text-white" strokeWidth={3} />
                </span>

                <div>
                  <h1 className={TITLE}>
                    You&apos;re{" "}
                    <span className="relative inline-block whitespace-nowrap">
                      signed in.
                      <HandUnderline show color="#e11d48" delay={0.3} duration={0.8} offset={2} />
                    </span>
                  </h1>
                  <p className={BODY}>
                    Your account is synced. Head back to Lazur on your Mac to start
                    writing with your voice.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      track("cta_clicked", { location: "auth_callback", label: "Return to app", destination: "app" });
                      void triggerDeepLink();
                    }}
                    className={`group ${PILL}`}
                  >
                    Return to app
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <p className="text-[13px] text-[var(--foreground-muted)]">
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
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e0621c]">
                  <span className="text-[20px] font-bold leading-none text-white">!</span>
                </span>
                <div>
                  <h1 className={TITLE}>Sign-in incomplete</h1>
                  <p className={BODY}>
                    We didn&apos;t receive your session tokens. Please try signing in
                    again from the app.
                  </p>
                </div>
                <TrackedLink
                  href="/login/app"
                  eventProps={{ location: "auth_callback_error", label: "Back to sign in", destination: "/login/app" }}
                  className={PILL}
                >
                  Back to sign in
                </TrackedLink>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center text-[13px] leading-relaxed text-[var(--foreground-muted)]">
          Signed in on the web?{" "}
          <TrackedLink
            href="/dashboard"
            event="nav_link_clicked"
            eventProps={{ location: "auth_callback", label: "Go to your dashboard", destination: "/dashboard" }}
            className="font-semibold text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-4 hover:decoration-[var(--foreground)]">
            Go to your dashboard
          </TrackedLink>
        </p>
      </motion.div>
    </AuthFlowShell>
  );
}

const CARD =
  "rounded-[28px] border-[1.5px] border-[#1c1917] bg-white px-6 py-8 shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] md:px-8";
const TITLE = "font-sans text-[1.75rem] font-bold leading-[1.1] tracking-[-0.04em] text-[var(--foreground)]";
const BODY = "mt-4 text-[15px] leading-relaxed text-[var(--foreground-muted)]";
const PILL =
  "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-[#1c1917] bg-white px-6 text-[15px] font-bold text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(28,25,23,0.9),0_16px_30px_-10px_rgba(28,25,23,0.24)] active:translate-y-0.5";

function CallbackFallback() {
  return (
    <AuthFlowShell contentClassName="w-full max-w-[440px]">
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-[#1c1917]" />
        <p className="mt-4 text-[14px] text-[var(--foreground-muted)]">Loading…</p>
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
