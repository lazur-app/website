"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { AuthFlowShell } from "@/components/AuthFlowShell";
import { LogoWordmark } from "@/components/LogoWordmark";
import {
  submitExclusiveAccessRequest,
  type ExclusiveAccessResult,
} from "@/lib/exclusiveAccess";
import { detectPlatform } from "@/lib/platform";

export default function ExclusiveAccessPage() {
  const [email, setEmail] = useState("");
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
      });
      setResult(response);
    } catch (err) {
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
          <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-faint)]">
            Early access
          </span>
        </div>

        <div className="glass rounded-[var(--radius-card)] px-6 py-8 md:px-8">
          {result ? (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">
                <Check className="h-6 w-6" strokeWidth={2} />
              </div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                You&apos;re on the list
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[var(--foreground-muted)]">
                {result.message}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
                We&apos;re putting the finishing touches on Lazur. When it&apos;s
                ready, we&apos;ll email you with access and next steps.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                  Exclusive access
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-[var(--foreground-muted)]">
                  Lazur is in active development. Leave your email and we&apos;ll
                  reach out personally when it&apos;s ready for you.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="exclusive-access-email"
                    className="mb-2 block text-left text-[12px] font-medium text-[var(--foreground-muted)]"
                  >
                    Email address
                  </label>
                  <input
                    id="exclusive-access-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    className="soft-card w-full px-4 py-3 text-sm text-[var(--foreground)] outline-none ring-[var(--brand)]/30 transition-shadow focus:ring-2"
                  />
                </div>

                {error && (
                  <p className="text-left text-[13px] text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-dark w-full rounded-xl px-4 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Ask for exclusive access"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--foreground-faint)] transition-colors hover:text-[var(--foreground-muted)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </p>
      </motion.div>
    </AuthFlowShell>
  );
}
