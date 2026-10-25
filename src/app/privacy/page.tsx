import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { LegalDocumentLayout } from "@/components/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Lazur",
  description:
    "What Lazur sends, to whom, and why: your voice, your screen when you ask, account data, and your choices.",
};

const UPDATED = "October 25, 2026";
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
          Lazur only sends what it needs to do what you ask, at the moment you
          ask. When you dictate, your audio goes to our speech-to-text providers
          to become text. When you ask Lazur something, your voice and one
          picture of your screen go to our AI provider to answer you. We don&apos;t
          keep your recordings or screenshots, we never sell your data, and we
          never use your content to train AI models.
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
                    information</strong>, such as your email address, display
                    name, and profile image when you create an account or sign
                    in.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Subscription
                    and billing information</strong>, plan status, trial dates,
                    usage quotas, and transaction records. Payment card details
                    are handled by our payment provider; we do not store full
                    card numbers.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Content you
                    create</strong>, text from dictation and related features,
                    including items you choose to save to your account (such as
                    history, dictionary entries, snippets, and style
                    preferences).
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Usage
                    information</strong>, aggregated metrics like word counts,
                    feature usage, session duration, device type, app version,
                    and similar data needed to run quotas, billing, and the
                    service reliably.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Communications</strong>{" "}
                   , support messages, feedback, and optional attachments you
                    send us.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Referral
                    information</strong>, if you use our referral program,
                    referral codes and referral relationships.
                  </>,
                ]}
              />
            </>
          ),
        },
        {
          title: "3. What Lazur sends, and when",
          content: (
            <>
              <p>
                Lazur works only while you use it: it listens while you hold a
                shortcut, and looks at your screen only when you ask it
                something. It never records or watches in the background.
              </p>
              <List
                items={[
                  <>
                    <strong className="text-[var(--foreground)]">Dictation.</strong>{" "}
                    While you hold the dictation shortcut, your audio is sent to
                    our speech-to-text providers (Groq and OpenAI) to be
                    transcribed, and the text is tidied up by a language model
                    from the same providers. Lazur does not store the audio.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Asking Lazur.</strong>{" "}
                    While you hold the command shortcut, your voice, one
                    screenshot of your screen at that moment, any text you have
                    selected, the name of the app in front, and your local time
                    are sent to Google&apos;s Gemini to understand and answer you.
                    Lazur does not store the screenshot or the audio.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Background jobs and Lazur for Chrome.</strong>{" "}
                    When you ask for a job such as research or reading a feed,
                    the text of the web pages the job opens (in its own tabs) is
                    sent to Gemini to do the work. See section 7.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Actions on your Mac.</strong>{" "}
                    Reminders, notes, calendar events, opening apps and moving
                    files happen on your Mac. For &ldquo;play a song&rdquo;, the
                    song name is looked up with Spotify.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Usage records.</strong>{" "}
                    For billing and plan limits we record counts (words
                    dictated, AI actions used) and, per request, which AI model
                    was used and how much it cost. These records contain no
                    audio, screenshots or text you dictated.
                  </>,
                ]}
              />
            </>
          ),
        },
        {
          title: "4. What stays on your Mac, and what's in your account",
          content: (
            <>
              <List
                items={[
                  "Your dictation and command history stays on your Mac by default. If you turn on cloud history, the text of your dictations and commands is saved to your account so it syncs across devices; you can delete it anytime.",
                  "Reports and files made by background jobs are saved in your agent folder (Documents/Lazur by default), and your recent jobs list is kept on your Mac.",
                  "Clipboard slots stay on your Mac.",
                  "Your dictionary, snippets and preferences are saved to your account so they work on every Mac you sign in to.",
                  "To prevent repeat free trials, Lazur sends a scrambled (hashed) identifier of your Mac; the real hardware ID never leaves your computer.",
                ]}
              />
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
                    providers</strong> that help us run Lazur: Google (Gemini, for
                    answering you and background jobs), Groq and OpenAI
                    (speech-to-text and text clean-up), Polar (payments), and our
                    hosting, database and analytics providers. They process
                    information only to provide their service to us, under
                    their business terms.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Legal
                    requirements</strong>, when required by law, regulation,
                    legal process, or to protect rights, safety, and security.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">Business
                    transfers</strong>, in connection with a merger,
                    acquisition, or sale of assets, subject to this policy.
                  </>,
                  <>
                    <strong className="text-[var(--foreground)]">With your
                    direction</strong>, when you ask us to or clearly consent.
                  </>,
                ]}
              />
            </>
          ),
        },
        {
          id: "extension",
          title: "7. Background agents and Lazur for Chrome",
          content: (
            <>
              <p>
                When you ask Lazur for a task that needs the web, its agents can
                use Chrome through the Lazur for Chrome extension:
              </p>
              <List
                items={[
                  "Agents open their own tabs (in a \"Lazur\" tab group, marked [Lazur]) and only read, scroll, click or type in those tabs, to do what you asked.",
                  "They use the sites you are already signed into. The extension never reads or stores your passwords or cookies.",
                  "The extension talks only to the Lazur app on your own Mac (localhost). Text from the pages an agent reads is sent to our servers and our AI provider only to carry out your request.",
                  "If you ask about a tab you have open, the agent can read the titles and addresses of your open tabs. It does not read your browsing history.",
                  "Reports and files agents make are saved on your Mac in your agent folder (Documents/Lazur by default). Recent jobs are listed in the app on your Mac.",
                  "Page content is not sold, not used for advertising, and not used to train AI models.",
                ]}
              />
              <p className="mt-3">
                You can stop any job from the notch or the extension&apos;s
                toolbar popup, and remove the extension at any time from
                chrome://extensions.
              </p>
            </>
          ),
        },
        {
          title: "8. Analytics",
          content:
            "We use product analytics (PostHog) to understand how Lazur is used and where it falls short: for example that a dictation finished, how many words it had, which kind of action a command used, or that a background job failed. These events are tied to your account but never contain what you said, typed or saw on screen, and are sent from our servers without your IP address. On our website we also use Google Analytics, DataFast and PostHog to measure visits and downloads. We do not record your screen or sessions for analytics, and we never sell analytics data.",
        },
        {
          title: "9. Data security",
          content:
            "We use reasonable technical and organizational measures to protect personal information, including encryption in transit, access controls, and secure credential storage on your device. No system is perfectly secure; please keep your account credentials safe and contact us if you suspect unauthorized access.",
        },
        {
          title: "10. Data retention",
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
          title: "11. Your rights and choices",
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
          title: "12. Children",
          content:
            "Lazur is not intended for anyone under 16. We do not knowingly collect personal information from children. If you believe a child has provided us information, contact us and we will take appropriate steps to delete it.",
        },
        {
          title: "13. International transfers",
          content:
            "We may process and store information in countries other than where you live. Where required by law, we use appropriate safeguards for cross-border transfers of personal information.",
        },
        {
          title: "14. Changes to this policy",
          content:
            "We may update this Privacy Policy from time to time. The revised version will be posted on this page with an updated date. Material changes may be communicated through the app or by email where appropriate. Continued use after changes take effect constitutes acceptance of the updated policy.",
        },
        {
          title: "15. Related documents",
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
