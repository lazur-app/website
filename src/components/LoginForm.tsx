"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { hasValidSessionToken, startOAuth } from "@/lib/auth";
import { isSafeReturnPath } from "@/lib/returnTo";
import { LogoWordmark } from "./LogoWordmark";

type LoginFormProps = {
  source: "web" | "desktop";
  returnTo?: string;
};

const copy = {
  web: {
    title: "Welcome back",
    subtitle: "Sign in to manage your plan, usage, and referrals.",
    hint: "You'll land on your account dashboard after signing in.",
  },
  desktop: {
    title: "Sign in to Lazur",
    subtitle: "Connect your account to the Mac app.",
    hint: "After signing in, you'll be redirected back to the desktop app.",
  },
};

export function LoginForm({ source, returnTo }: LoginFormProps) {
  const text = copy[source];
  const router = useRouter();
  const safeReturnTo = returnTo && isSafeReturnPath(returnTo) ? returnTo : undefined;

  useEffect(() => {
    if (source === "web" && hasValidSessionToken()) {
      router.replace(safeReturnTo ?? "/dashboard");
    }
  }, [source, router, safeReturnTo]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-6 py-16">
      <div className="pointer-events-none absolute inset-0 grain" aria-hidden />
      <div
        className="ambient-blob pointer-events-none absolute -left-[10%] top-[5%] h-[45vh] w-[50vw] rounded-full bg-[#e8e0ff]"
        aria-hidden
      />
      <div
        className="ambient-blob pointer-events-none absolute -right-[5%] bottom-[10%] h-[40vh] w-[45vw] rounded-full bg-[#fde8d8]"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="mb-10 flex justify-center">
          <LogoWordmark href="/" textClassName="text-2xl" />
        </div>

        <div className="glass rounded-2xl px-6 py-8 md:px-8">
          <div className="mb-8 text-center">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              {text.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
              {text.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => startOAuth("google", source, safeReturnTo)}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-solid)] px-4 py-3.5 text-sm font-semibold text-[var(--foreground)] transition-all hover:border-[var(--brand)]/30 hover:shadow-sm active:scale-[0.99]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-4 text-center text-[12px] text-[var(--foreground-faint)]">
            {text.hint}
          </p>
        </div>

        <p className="mt-8 text-center text-[11px] leading-relaxed text-[var(--foreground-faint)]">
          By continuing, you agree to Lazur&apos;s{" "}
          <Link href="/terms" className="font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
            Privacy Policy
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
}
