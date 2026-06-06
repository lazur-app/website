"use client";

import { useEffect, Suspense, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { LogoWordmark } from "@/components/LogoWordmark";

function CallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  const fireConfetti = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.65 },
      colors: ["#6b4bfc", "#a855f7", "#f97316", "#fffcf8"],
      spread: 90,
      gravity: 1,
      scalar: 0.7,
      ticks: 300,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

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
    const timer = setTimeout(() => {
      setStatus("success");
      fireConfetti();
      triggerDeepLink();
    }, 1200);

    return () => clearTimeout(timer);
  }, [searchParams, fireConfetti, triggerDeepLink]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--background)] px-6 py-16">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div
        className="ambient-blob pointer-events-none absolute -left-[10%] top-[5%] h-[45vh] w-[50vw] rounded-full bg-[#e8e0ff]"
        aria-hidden
      />
      <div
        className="ambient-blob pointer-events-none absolute -right-[5%] bottom-[10%] h-[40vh] w-[45vw] rounded-full bg-[#fde8d8]"
        aria-hidden
      />
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ambient-blob pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ede9fe]"
            aria-hidden
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 flex justify-center">
          <LogoWordmark href="/" textClassName="text-xl" />
        </div>

        <div className="glass overflow-hidden rounded-2xl px-6 py-8 text-center md:px-8 md:py-10">
          <AnimatePresence mode="wait">
            {status === "verifying" && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-[var(--brand-soft)]"
                  />
                  <Loader2 className="relative h-8 w-8 animate-spin text-[var(--brand)]" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                    Connecting your account
                  </h1>
                  <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                    Verifying sign-in and preparing the Mac app…
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="space-y-7"
              >
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 18, stiffness: 260 }}
                  className="relative mx-auto flex h-20 w-20 items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-[var(--brand-glow)] blur-md"
                  />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-soft)] ring-1 ring-[var(--brand)]/20">
                    <Check className="h-8 w-8 text-[var(--brand)]" strokeWidth={2.5} />
                  </div>
                </motion.div>

                <div className="space-y-3">
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-display text-4xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl"
                  >
                    You&apos;re{" "}
                    <span className="gradient-word">in.</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto max-w-xs text-pretty text-[15px] leading-relaxed text-[var(--foreground-muted)]"
                  >
                    Your account is synced. Head back to Lazur on your Mac to start
                    writing with your voice.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4 pt-1"
                >
                  <button
                    type="button"
                    onClick={triggerDeepLink}
                    className="btn-primary group flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
                  >
                    Return to app
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[12px] font-medium text-[var(--foreground-faint)]">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--brand)]" />
                    <span>Opening Lazur on your Mac…</span>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
                  <span className="text-xl font-bold text-red-600">!</span>
                </div>
                <div>
                  <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">
                    Sign-in incomplete
                  </h1>
                  <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                    We didn&apos;t receive your session tokens. Please try signing in
                    again from the app.
                  </p>
                </div>
                <Link
                  href="/login/app"
                  className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
                >
                  Back to sign in
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-center text-[11px] text-[var(--foreground-faint)]">
          Signed in on the web?{" "}
          <Link href="/dashboard" className="font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
            Go to your dashboard
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
          <Loader2 className="h-7 w-7 animate-spin text-[var(--brand)]" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
