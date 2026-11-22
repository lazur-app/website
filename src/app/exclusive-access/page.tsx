"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { AuthFlowShell } from "@/components/AuthFlowShell";
import { LogoWordmark } from "@/components/LogoWordmark";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import {
  submitExclusiveAccessRequest,
  type ExclusiveAccessResult,
} from "@/lib/exclusiveAccess";
import { detectPlatform } from "@/lib/platform";
import { HandUnderline } from "@/components/buddy/HandLoop";
import { track } from "@/lib/productAnalytics";

export default function ExclusiveAccessPage() {
  const [email, setEmail] = useState("");
  const [excitedToUseFor, setExcitedToUseFor] = useState("");
  const [aboutYourself, setAboutYourself] = useState("");
  const [platform, setPlatform] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExclusiveAccessResult | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await submitExclusiveAccessRequest(email, {
        platform: platform ?? undefined,
        source: "website",
        excitedToUseFor,
        aboutYourself: aboutYourself || undefined,
      });
      track("exclusive_access_requested", {
        platform,
        location: "exclusive_access_page",
        status: response.status,
        has_about: Boolean(aboutYourself),
      });
      setResult(response);
    } catch (err) {
      track("exclusive_access_failed", { platform, location: "exclusive_access_page" });
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthFlowShell contentClassName="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8 flex justify-center">
          <LogoWordmark href="/" height={40} />
        </div>

        <div className="mb-6 text-center">
          <span className="inline-flex items-center rounded-full bg-[#5b4bd6] px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] text-white">
            Early access
          </span>
        </div>

        <div className="rounded-[28px] border-[1.5px] border-[#1c1917] bg-white px-4 py-8 shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] sm:px-8">
          {result ? (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#14917a] text-white">
                <Check className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <h1 className="text-[clamp(2rem,6vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.05em] text-[var(--foreground)]">
                You&apos;re on the list
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
                {result.message}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
                We&apos;re putting the finishing touches on Lazur. When it&apos;s
                ready, we&apos;ll email you with access and next steps.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-[clamp(2rem,6vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.05em] text-[var(--foreground)]">
                  <span className="relative inline-block whitespace-nowrap">
                    Exclusive
                    <HandUnderline show color="#e11d48" delay={0.4} duration={0.9} offset={2} />
                  </span>{" "}
                  access
                </h1>
                <p className="mt-4 text-[15px] leading-relaxed text-[var(--foreground-muted)]">
                  Lazur is in active development. Leave your email and we&apos;ll
                  reach out personally when it&apos;s ready for you.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="exclusive-access-email"
                    className="mb-2 block text-left text-[13px] font-bold text-[var(--foreground)]"
                  >
                    Email address *
                  </label>
                  <input
                    id="exclusive-access-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-[12px] border-[1.5px] border-[#1c1917] bg-white px-4 py-3 text-[15px] text-[var(--foreground)] shadow-[0_2px_0_rgba(28,25,23,0.9)] outline-none placeholder:text-[var(--foreground-muted)] focus:ring-2 focus:ring-[#1c1917]/15"
                  />
                </div>

                <div>
                  <label
                    htmlFor="exclusive-access-excitement"
                    className="mb-2 block text-left text-[13px] font-bold text-[var(--foreground)]"
                  >
                    What are you excited to use Lazur for? *
                  </label>
                  <textarea
                    id="exclusive-access-excitement"
                    required
                    value={excitedToUseFor}
                    onChange={(event) => setExcitedToUseFor(event.target.value)}
                    rows={3}
                    className="w-full rounded-[12px] border-[1.5px] border-[#1c1917] bg-white px-4 py-3 text-[15px] text-[var(--foreground)] shadow-[0_2px_0_rgba(28,25,23,0.9)] outline-none placeholder:text-[var(--foreground-muted)] focus:ring-2 focus:ring-[#1c1917]/15 resize-y"
                  />
                </div>

                <div>
                  <label
                    htmlFor="exclusive-access-about"
                    className="mb-2 block text-left text-[13px] font-bold text-[var(--foreground)]"
                  >
                    Tell me about yourself. <span className="font-medium text-[var(--foreground-muted)]">(optional)</span>
                  </label>
                  <textarea
                    id="exclusive-access-about"
                    value={aboutYourself}
                    onChange={(event) => setAboutYourself(event.target.value)}
                    rows={3}
                    className="w-full rounded-[12px] border-[1.5px] border-[#1c1917] bg-white px-4 py-3 text-[15px] text-[var(--foreground)] shadow-[0_2px_0_rgba(28,25,23,0.9)] outline-none placeholder:text-[var(--foreground-muted)] focus:ring-2 focus:ring-[#1c1917]/15 resize-y"
                  />
                </div>

                {error && (
                  <p className="text-left text-[14px] font-medium text-[#be123c]">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#1c1917] px-6 text-[16px] font-bold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Ask for exclusive access"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-8 text-center">
          <TrackedLink
            href="/"
            event="nav_link_clicked"
            eventProps={{ location: "exclusive_access_page", label: "Back to home", destination: "/" }}
            className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-4 transition-colors hover:decoration-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </TrackedLink>
        </p>
      </motion.div>
    </AuthFlowShell>
  );
}
