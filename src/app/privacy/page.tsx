import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { LegalDocumentLayout } from "@/components/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Lazur",
  description:
    "How Lazur handles your voice, text, account data, and privacy choices.",
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

export default function PrivacyPage() {
  return (
    <LegalDocumentLayout
      label="Legal"
      title="Privacy Policy"
      updated={UPDATED}
      intro={
        <>
          <strong className="font-semibold text-[var(--foreground)]">
            In short:
          </strong>{" "}
          Your voice is transcribed on your Mac — we do not store voice
          recordings in the cloud. Some features send <em>text</em> to our
          servers so we can deliver the service (for example, polished output,
          commands, and account sync). We do not sell your personal data.
        </>
      }
      sections={[
        {
          title: "1. Who we are",
          content: (
            <>
              Lazur (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
              operates the Lazur macOS application and website at{" "}
              <a
                href="https://www.lazur.app"
                className="font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-2"
              >
                lazur.app
              </a>
              . This Privacy Policy describes what personal information we
              collect, how we use it, who we share it with, and your choices.
              Questions or requests:{" "}
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
        {
          title: "2. Information we collect",
          content: (
            <>
              <p>Depending on how you use Lazur, we may collect:</p>
              <List
                items={[
                  <>
                    <strong className="text-[var(--foreground)]">Account
                    information</strong> — such as your email address, display
                    name, and profile image when you create an account or sign
                    in.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Subscription
                    and billing information</strong> — plan status, trial dates,
                    usage quotas, and transaction records. Payment card details
                    are handled by our payment provider; we do not store full
                    card numbers.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Content you
                    create</strong> — text from dictation and related features,
                    including items you choose to save to your account (such as
                    history, dictionary entries, snippets, and style
                    preferences).
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Usage
                    information</strong> — aggregated metrics like word counts,
                    feature usage, session duration, device type, app version,
                    and similar data needed to run quotas, billing, and the
                    service reliably.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Communications</strong>{" "}
                    — support messages, feedback, and optional attachments you
                    send us.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Referral
                    information</strong> — if you use our referral program,
                    referral codes and referral relationships.
                  </>,
                ]}
              />
            </>
          ),
        },
        {
          title: "3. What stays on your device",
          content: (
            <>
              <p>
                Lazur is designed so voice input is handled on your Mac
                whenever possible:
              </p>
              <List
                items={[
                  "Voice audio is processed on your device for speech-to-text. We do not upload or store voice recordings in the cloud.",
                  "Speech recognition resources used by the app are kept in local storage on your device.",
                  "Clipboard shortcuts and similar on-device tools remain in local app storage unless you separately copy content elsewhere.",
                ]}
              />
              <p className="mt-3">
                If you use transcript-style output (without cloud rewriting),
                dictation text may remain on your device only. When signed in,
                you may still choose to save results to your account history.
              </p>
            </>
          ),
        },
        {
          title: "4. Cloud processing and account data",
          content: (
            <>
              <p>
                Certain features require sending <em>text</em> (not voice
                recordings) to our servers, including when you use polished
                output, voice commands, spelling assistance, or other
                cloud-assisted features. We use this information solely to
                provide the feature you requested.
              </p>
              <p className="mt-3">
                When you are signed in, we may store text and settings in your
                Lazur account so you can sync across devices and recover data if
                you reinstall the app. This can include dictation history,
                dictionary entries, snippets, and tone preferences. You can
                delete history items or clear your history from within the app.
              </p>
            </>
          ),
        },
        {
          title: "5. How we use your information",
          content: (
            <>
              <p>We use personal information to:</p>
              <List
                items={[
                  "Provide, operate, maintain, and improve Lazur.",
                  "Authenticate your account and keep the service secure.",
                  "Manage trials, subscriptions, billing, and referrals.",
                  "Enforce plan limits and prevent abuse.",
                  "Respond to support requests and communicate with you about the service.",
                  "Comply with applicable law.",
                ]}
              />
              <p className="mt-3">
                We process your information where necessary to perform our
                contract with you, based on your consent where required, to
                comply with legal obligations, and for our legitimate interests
                in operating and improving Lazur (balanced against your rights).
              </p>
              <p className="mt-3">
                We do <strong className="text-[var(--foreground)]">not</strong>{" "}
                sell your personal information. We do not use your content to
                train generalized AI models for unrelated purposes.
              </p>
            </>
          ),
        },
        {
          title: "6. How we share information",
          content: (
            <>
              <p>
                We do not sell personal information. We share information only
                in these situations:
              </p>
              <List
                items={[
                  <>
                    <strong className="text-[var(--foreground)]">Service
                    providers</strong> — trusted companies that help us run
                    Lazur (for example, authentication, payments, hosting,
                    security, and cloud text processing). They may access
                    information only to perform services for us and must protect
                    it under contractual obligations.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Legal
                    requirements</strong> — when required by law, regulation,
                    legal process, or to protect rights, safety, and security.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Business
                    transfers</strong> — in connection with a merger,
                    acquisition, or sale of assets, subject to this policy.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">With your
                    direction</strong> — when you ask us to or clearly consent.
                  </>,
                ]}
              />
            </>
          ),
        },
        {
          title: "7. Analytics",
          content:
            "We collect limited usage analytics to understand how Lazur is used, diagnose problems, and improve the product. Analytics are designed to avoid including full transcript content. We do not use analytics to sell your data.",
        },
        {
          title: "8. Data security",
          content:
            "We use reasonable technical and organizational measures to protect personal information, including encryption in transit, access controls, and secure credential storage on your device. No system is perfectly secure; please keep your account credentials safe and contact us if you suspect unauthorized access.",
        },
        {
          title: "9. Data retention",
          content: (
            <>
              <List
                items={[
                  "Account and billing records are retained while your account is active and as needed for legal, tax, and accounting requirements.",
                  "Content you save to your account (such as history and preferences) remains until you delete it or close your account.",
                  "Voice recordings are not retained on our servers.",
                  "Aggregated or de-identified analytics may be kept longer.",
                ]}
              />
            </>
          ),
        },
        {
          title: "10. Your rights and choices",
          content: (
            <>
              <p>Depending on your location, you may have the right to:</p>
              <List
                items={[
                  "Access the personal information we hold about you.",
                  "Correct inaccurate information.",
                  "Delete content such as dictation history from within the app.",
                  "Request deletion of your account or personal data.",
                  "Object to or restrict certain processing.",
                  "Withdraw consent where processing is based on consent.",
                  "Lodge a complaint with a supervisory authority.",
                ]}
              />
              <p className="mt-3">
                To make a request, email{" "}
                <a
                  href={`mailto:${CONTACT}`}
                  className="font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-2"
                >
                  {CONTACT}
                </a>
                . We will respond within a reasonable period and as required by
                applicable law, including under the GDPR, UK GDPR, India&apos;s
                Digital Personal Data Protection Act (DPDP), and similar laws
                where they apply.
              </p>
              <p className="mt-3">
                California residents may have rights under the CCPA/CPRA,
                including to know, delete, and correct personal information. We
                do not sell personal information.
              </p>
            </>
          ),
        },
        {
          title: "11. Children",
          content:
            "Lazur is not intended for anyone under 16. We do not knowingly collect personal information from children. If you believe a child has provided us information, contact us and we will take appropriate steps to delete it.",
        },
        {
          title: "12. International transfers",
          content:
            "We may process and store information in countries other than where you live. Where required by law, we use appropriate safeguards for cross-border transfers of personal information.",
        },
        {
          title: "13. Changes to this policy",
          content:
            "We may update this Privacy Policy from time to time. The revised version will be posted on this page with an updated date. Material changes may be communicated through the app or by email where appropriate. Continued use after changes take effect constitutes acceptance of the updated policy.",
        },
        {
          title: "14. Related documents",
          content: (
            <>
              Your use of Lazur is also governed by our{" "}
              <Link
                href="/terms"
                className="font-medium text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-2 transition-colors hover:decoration-[var(--foreground)]"
              >
                Terms of Service
              </Link>
              .
            </>
          ),
        },
      ]}
    />
  );
}
