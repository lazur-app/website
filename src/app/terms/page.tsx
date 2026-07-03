import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { LegalDocumentLayout } from "@/components/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Terms of Service | Lazur",
  description:
    "Terms of Service for the Lazur macOS voice-to-text application, subscriptions, and website.",
};

const UPDATED = "July 3, 2026";
const CONTACT = "hello@lazur.app";

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-2 list-disc space-y-1.5 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  return (
    <LegalDocumentLayout
      label="Legal"
      title="Terms of Service"
      updated={UPDATED}
      intro={
        <>
          These Terms govern your use of Lazur&apos;s macOS application, website,
          and related services. Every new account starts with a 7-day Pro trial;
          after that, Lazur requires a paid Pro or Power subscription. By
          creating an account, downloading the app, or using Lazur, you agree to
          these Terms and our{" "}
          <Link
            href="/privacy"
            className="font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-2"
          >
            Privacy Policy
          </Link>
          .
        </>
      }
      sections={[
        {
          title: "1. The service",
          content: (
            <>
              <p>
                Lazur provides voice dictation software for macOS that helps you
                turn speech into text in the applications you already use. Paid
                plans may include usage quotas and additional features described
                on our website and in the app.
              </p>
              <p className="mt-3">
                We may add, change, or remove features over time. Lazur is
                currently available on macOS unless we state otherwise.
              </p>
            </>
          ),
        },
        {
          title: "2. Eligibility and accounts",
          content: (
            <>
              <List
                items={[
                  "You must be at least 16 years old to use Lazur.",
                  "You must provide accurate account information and keep your credentials secure.",
                  "You are responsible for all activity under your account.",
                  "You may sign in using supported authentication methods we make available.",
                  "One person may not share account credentials with others except as we expressly allow.",
                ]}
              />
            </>
          ),
        },
        {
          title: "3. Acceptable use",
          content: (
            <>
              <p>You agree not to:</p>
              <List
                items={[
                  "Use Lazur for unlawful, harmful, fraudulent, or abusive purposes.",
                  "Attempt to reverse engineer, scrape, overload, or disrupt our services or infrastructure.",
                  "Circumvent usage limits, quotas, billing, or access controls.",
                  "Upload or dictate content that infringes others' intellectual property or privacy rights.",
                  "Use Lazur to process highly sensitive regulated data (such as protected health information under HIPAA) unless you have a separate written agreement with us authorizing that use.",
                ]}
              />
              <p className="mt-3">
                We may suspend or terminate accounts that violate these Terms or
                pose a security risk.
              </p>
            </>
          ),
        },
        {
          title: "4. Privacy",
          content: (
            <>
              Our{" "}
              <Link
                href="/privacy"
                className="font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-2 transition-colors hover:decoration-[var(--foreground)]"
              >
                Privacy Policy
              </Link>{" "}
              explains what information we collect, how we use it, and your
              choices. By using Lazur, you consent to those practices.
            </>
          ),
        },
        {
          title: "5. Plans, Pro trial, and billing",
          content: (
            <>
              <p>
                Lazur is a paid service. We do not offer a permanent free plan.
                New accounts receive a <strong className="text-[var(--foreground)]">one-time 7-day Pro trial</strong> with
                the same features and quotas as Pro. When the trial ends,
                continued use requires a paid <strong className="text-[var(--foreground)]">Pro</strong> or{" "}
                <strong className="text-[var(--foreground)]">Power</strong> subscription.
                Plan limits and pricing are shown on our{" "}
                <Link
                  href="/pricing"
                  className="font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-2"
                >
                  pricing page
                </Link>{" "}
                and at checkout.
              </p>
              <List
                items={[
                  <>
                    <strong className="text-[var(--foreground)]">7-day Pro
                    trial</strong> — Starts when you create an account. No
                    credit card is required to download and begin the trial.
                    After seven days, paid features stop until you subscribe.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Paid
                    subscriptions</strong> — Pro and Power are billed monthly
                    or annually through our secure checkout provider. Prices,
                    applicable taxes (including GST where shown as
                    tax-exclusive), and currency are displayed before you pay.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Renewal</strong>{" "}
                    — Subscriptions renew automatically until you cancel through
                    your billing settings.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Cancellation</strong>{" "}
                    — You may cancel at any time; access typically continues
                    until the end of the current billing period unless stated
                    otherwise at checkout.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Refunds</strong>{" "}
                    — Fees are non-refundable except where required by applicable
                    law or explicitly stated by us.
                  </>,
                ]}
              />
              <p className="mt-3">
                We may change plan prices or features for future billing periods
                with reasonable notice where required by law.
              </p>
            </>
          ),
        },
        {
          title: "6. Fair use and quotas",
          content: (
            <>
              <p>
                Paid plans may include monthly or fair-use limits on words,
                commands, or other features as described on our pricing page or
                in the app. We may throttle or restrict use that materially
                exceeds normal personal or professional use, or that harms
                service stability.
              </p>
            </>
          ),
        },
        {
          title: "7. Intellectual property",
          content: (
            <>
              <p>
                Lazur and its branding, software, documentation, and website
                content are owned by us or our licensors and protected by
                intellectual property laws. We grant you a limited, personal,
                non-exclusive, non-transferable license to use the app according
                to these Terms while your account is in good standing.
              </p>
              <p className="mt-3">
                <strong className="text-[var(--foreground)]">Your content:</strong>{" "}
                You retain ownership of text you dictate and create. You grant us
                a limited license to host, process, sync, and display that
                content solely as needed to provide the service.
              </p>
            </>
          ),
        },
        {
          title: "8. Third-party services",
          content: (
            <>
              <p>
                Lazur may rely on third-party providers for sign-in, payments,
                cloud processing, and infrastructure. Your use of those services
                may be subject to their separate terms. We are not responsible
                for third-party services outside our reasonable control.
              </p>
            </>
          ),
        },
        {
          title: "9. Referral program",
          content: (
            <>
              <p>
                If you participate in our referral leaderboard or rewards
                program, additional rules may apply (prize eligibility, fraud
                prevention, tax reporting). We may modify or end the program at
                any time. Referral rewards have no cash value except as
                explicitly stated.
              </p>
            </>
          ),
        },
        {
          title: "10. Disclaimers",
          content: (
            <>
              <p>
                LAZUR IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
                AVAILABLE.&rdquo; TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE
                DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                NON-INFRINGEMENT.
              </p>
              <p className="mt-3">
                Dictation and AI-generated text may contain errors. You are
                responsible for reviewing output before sending, publishing, or
                relying on it. Lazur does not provide legal, medical, financial,
                or other professional advice.
              </p>
            </>
          ),
        },
        {
          title: "11. Limitation of liability",
          content: (
            <>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, LAZUR AND ITS AFFILIATES,
                OFFICERS, EMPLOYEES, AND SUPPLIERS WILL NOT BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                DAMAGES, OR ANY LOSS OF PROFITS, DATA, GOODWILL, OR BUSINESS
                OPPORTUNITIES, ARISING FROM YOUR USE OF THE SERVICE.
              </p>
              <p className="mt-3">
                OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF THESE TERMS OR
                THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU
                PAID US IN THE TWELVE (12) MONTHS BEFORE THE CLAIM OR (B) USD
                $100.
              </p>
              <p className="mt-3">
                Some jurisdictions do not allow certain limitations; in those
                cases, our liability is limited to the fullest extent permitted by
                law.
              </p>
            </>
          ),
        },
        {
          title: "12. Indemnification",
          content:
            "You agree to indemnify and hold harmless Lazur from claims, damages, and expenses (including reasonable legal fees) arising from your misuse of the service, your content, or your violation of these Terms or applicable law.",
        },
        {
          title: "13. Termination",
          content: (
            <>
              <p>
                You may stop using Lazur at any time. We may suspend or terminate
                your access if you breach these Terms, if required by law, or if
                we discontinue the service. Upon termination, your license ends
                and we may delete account data according to our Privacy Policy
                and retention practices.
              </p>
            </>
          ),
        },
        {
          title: "14. Changes to these Terms",
          content:
            "We may update these Terms from time to time. We will post the revised Terms on this page and update the \"Last updated\" date. Material changes may be communicated through the app or by email. Continued use after changes take effect constitutes acceptance.",
        },
        {
          title: "15. Governing law and disputes",
          content: (
            <>
              <p>
                These Terms are governed by the laws of India, without regard to
                conflict-of-law principles, except where mandatory consumer
                protection laws in your country require otherwise.
              </p>
              <p className="mt-3">
                Before filing a formal dispute, please contact us at{" "}
                <a
                  href={`mailto:${CONTACT}`}
                  className="font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-2"
                >
                  {CONTACT}
                </a>{" "}
                so we can try to resolve the issue informally.
              </p>
            </>
          ),
        },
        {
          title: "16. Contact",
          content: (
            <>
              Questions about these Terms? Email{" "}
              <a
                href={`mailto:${CONTACT}`}
                className="font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-2"
              >
                {CONTACT}
              </a>
              .
            </>
          ),
        },
      ]}
    />
  );
}
