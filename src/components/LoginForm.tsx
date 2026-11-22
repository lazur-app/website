"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Sticker } from "@/components/landing/Sticker";
import { hasValidSessionToken, startOAuth } from "@/lib/auth";
import { isSafeReturnPath } from "@/lib/returnTo";
import { AuthFlowShell } from "./AuthFlowShell";
import { HandLoop, HandUnderline } from "./buddy/HandLoop";

type LoginFormProps = {
  source: "web" | "desktop";
  returnTo?: string;
};

/** The homepage's red hand-drawn ink. */
const INK = "#e11d48";
const EASE = [0.16, 1, 0.3, 1] as const;

const copy = {
  web: {
    eyebrow: "Your account",
    titleLead: "Welcome",
    titleKey: "back.",
    subtitle: "Sign in to see your plan, usage and invites.",
    note: "One click, that's it.",
    perks: ["No password to remember", "Same account as the Mac app", "Manage your plan any time"],
  },
  desktop: {
    eyebrow: "Mac sign-in",
    titleLead: "Sign in to",
    titleKey: "Lazur.",
    subtitle: "Connect your account, then you're back on your Mac.",
    note: "Then you're straight back to your Mac.",
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

const linkClass =
  "font-semibold text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-4 hover:decoration-[var(--foreground)]";

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
    const t = window.setTimeout(() => setDrawn(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AuthFlowShell contentClassName="w-full max-w-[440px]">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
        <div className="relative text-center">
          <Sticker name="key" size={72} rotate={-12} className="absolute -left-24 -top-4 hidden lg:block" />
          <Sticker name="heart" size={64} rotate={10} className="absolute -right-24 top-16 hidden lg:block" />
          <span className="inline-flex min-h-[28px] items-center rounded-full bg-[#1c1917] px-3 text-[12px] font-bold text-white">
            {text.eyebrow}
          </span>
          <h1 className="mt-6 font-sans text-[clamp(2.4rem,7vw,3.4rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[var(--foreground)]">
            {text.titleLead}{" "}
            <span className="relative inline-block whitespace-nowrap">
              {text.titleKey}
              <HandUnderline show color={INK} delay={0.4} duration={0.9} offset={2} />
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-[320px] text-[16px] font-medium leading-normal text-[var(--foreground-muted)]">
            {text.subtitle}
          </p>
        </div>

        <div className="mt-12 rounded-[28px] border-[1.5px] border-[#1c1917] bg-white p-6 shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] md:p-8">
          <div className="relative">
            <button
              type="button"
              onClick={() => startOAuth("google", source, safeReturnTo)}
              className="group relative flex h-14 w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-[#1c1917] bg-white pl-12 pr-6 text-[16px] font-bold tracking-[-0.02em] text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(28,25,23,0.9),0_16px_30px_-10px_rgba(28,25,23,0.24)] active:translate-y-0.5 active:shadow-[0_0_0_rgba(28,25,23,0.9)]"
            >
              <span className="absolute left-3"><GoogleMark /></span>
              Continue with Google
              <ArrowRight className="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
            </button>
            <HandLoop show={drawn} color={INK} padX={12} padY={8} />
          </div>
          <p className="mt-4 text-center text-[13px] font-medium text-[var(--foreground-muted)]">{text.note}</p>

          <ul className="mt-6 space-y-3 border-t-[1.5px] border-dashed border-[#1c1917]/15 pt-6">
            {text.perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-[14px] font-medium text-[var(--foreground)]">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#14917a]">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-center text-[13px] leading-relaxed text-[var(--foreground-muted)]">
          By continuing, you agree to Lazur&apos;s{" "}
          <TrackedLink href="/terms" event="nav_link_clicked" eventProps={{ location: `login_${source}`, label: "Terms", destination: "/terms" }} className={linkClass}>Terms</TrackedLink>{" "}
          and{" "}
          <TrackedLink href="/privacy" event="nav_link_clicked" eventProps={{ location: `login_${source}`, label: "Privacy Policy", destination: "/privacy" }} className={linkClass}>Privacy Policy</TrackedLink>.
          {source === "web" ? (
            <>
              <br />
              New here? <TrackedLink href="/download" eventProps={{ location: "login_web", label: "Download Lazur", destination: "/download" }} className={linkClass}>Download Lazur</TrackedLink> and your 3-day trial starts in the app.
            </>
          ) : null}
        </p>
      </motion.div>
    </AuthFlowShell>
  );
}
