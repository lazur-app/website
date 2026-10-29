"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { hasValidSessionToken, startOAuth } from "@/lib/auth";
import { isSafeReturnPath } from "@/lib/returnTo";
import { AuthFlowShell } from "./AuthFlowShell";
import { HandLoop } from "./buddy/HandLoop";

type LoginFormProps = {
  source: "web" | "desktop";
  returnTo?: string;
};

const INK = "#2563eb";
const HAND = "font-[family-name:var(--font-caveat)]";
const EASE = [0.16, 1, 0.3, 1] as const;

const copy = {
  web: {
    eyebrow: "Your account",
    title: "Welcome back",
    subtitle: "Sign in to see your plan, usage and invites.",
    note: "one click, that's it",
    perks: ["No password to remember", "Same account as the Mac app", "Manage your plan any time"],
  },
  desktop: {
    eyebrow: "Mac sign-in",
    title: "Sign in to Lazur",
    subtitle: "Connect your account, then you're back on your Mac.",
    note: "then back to your Mac",
    perks: ["No password to remember", "Your trial starts in the app", "You can close this tab after"],
  },
};

function GoogleMark() {
  return (
    <span className="grid h-8 w-8 place-items-center rounded-full bg-white">
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" aria-hidden>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    </span>
  );
}

export function LoginForm({ source, returnTo }: LoginFormProps) {
  const text = copy[source];
  const router = useRouter();
  const safeReturnTo = returnTo && isSafeReturnPath(returnTo) ? returnTo : undefined;
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (source === "web" && hasValidSessionToken()) {
      router.replace(safeReturnTo ?? "/dashboard");
    }
  }, [source, router, safeReturnTo]);

  useEffect(() => {
    const t = window.setTimeout(() => setDrawn(true), 650);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AuthFlowShell contentClassName="w-full max-w-[420px]">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/70 px-3 py-1 text-[12px] font-medium text-[var(--foreground-muted)]">
            <Sparkles className="h-3.5 w-3.5" style={{ color: INK }} />
            {text.eyebrow}
          </span>
          <h1 className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--foreground)]">
            {text.title}
          </h1>
          <p className="mx-auto mt-3 max-w-[300px] text-[15px] leading-relaxed text-[var(--foreground-muted)]">{text.subtitle}</p>
        </div>

        <div className="relative mt-9 rounded-[28px] border border-[var(--border)] bg-white/85 p-6 shadow-[0_24px_60px_-28px_rgba(28,25,23,0.28)] backdrop-blur md:p-7">
          <motion.p
            className={`${HAND} pointer-events-none absolute -top-9 right-3 flex items-end gap-1 text-[22px] leading-none`}
            style={{ color: INK }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: drawn ? 1 : 0, y: drawn ? 0 : 4 }}
            transition={{ delay: 0.55, duration: 0.4, ease: EASE }}
            aria-hidden
          >
            {text.note}
            <svg width="26" height="22" viewBox="0 0 26 22" className="mb-[-10px] -scale-x-100" fill="none">
              <path d="M2 2 C 8 6, 14 12, 22 18 M22 18 L 14 17 M22 18 L 20 10" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.p>

          <div className="relative">
            <button
              type="button"
              onClick={() => startOAuth("google", source, safeReturnTo)}
              className="group relative flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#1c1917] pl-2 pr-5 text-[15px] font-semibold text-white transition hover:bg-black active:scale-[0.99]"
            >
              <span className="absolute left-3"><GoogleMark /></span>
              Continue with Google
              <ArrowRight className="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
            </button>
            <HandLoop show={drawn} color={INK} padX={12} padY={10} />
          </div>

          <ul className="mt-7 space-y-2.5">
            {text.perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5 text-[13.5px] text-[var(--foreground-muted)]">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#2563eb]/10">
                  <Check className="h-3 w-3" style={{ color: INK }} strokeWidth={3} />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-7 text-center text-[12px] leading-relaxed text-[var(--foreground-faint)]">
          By continuing, you agree to Lazur&apos;s{" "}
          <Link href="/terms" className="font-medium text-[var(--foreground-muted)] underline-offset-2 hover:text-[var(--foreground)] hover:underline">Terms</Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-[var(--foreground-muted)] underline-offset-2 hover:text-[var(--foreground)] hover:underline">Privacy Policy</Link>.
          {source === "web" ? (
            <>
              <br />
              New here? <Link href="/download" className="font-medium text-[var(--foreground-muted)] underline-offset-2 hover:text-[var(--foreground)] hover:underline">Download Lazur</Link> and your 3-day trial starts in the app.
            </>
          ) : null}
        </p>
      </motion.div>
    </AuthFlowShell>
  );
}
