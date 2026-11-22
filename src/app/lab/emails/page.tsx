import type { Metadata } from "next";
import { EMAIL_ASSET_BASE, EMAIL_TOKENS } from "@/emails/system";
import { EMAIL_SAMPLES } from "@/emails/templates";

export const metadata: Metadata = {
  title: "Email design system (lab)",
  robots: { index: false, follow: false },
};

const BLOCKS: [string, string][] = [
  ["header", "The teal top: wordmark, tagline, optional tilted stamp."],
  ["heading", "The one headline."],
  ["text", "Body paragraph."],
  ["ticket", "Dashed teal ticket for codes, with a stub."],
  ["button", "The black pill. One per email."],
  ["steps", "Numbered steps in ink circles."],
  ["facts", "Outlined table for receipts and plan details."],
  ["note", "Teal note with a small label."],
  ["sayThis", "Words to say to Lazur, in serif italic."],
  ["divider", "Dashed line between two parts."],
  ["finePrint", "Small grey closing words."],
  ["footer", "Why you got this, plus site, help and privacy links. Added to every branded email."],
  ["plainEmail", "A personal note: slim teal top, plain friendly words, signature with the sender’s initial."],
];

/**
 * Where every personal detail in the emails comes from, so nothing in them is made up. The
 * backend fills these in when it sends; the samples on this page use a made-up person.
 */
const SOURCES: [string, string][] = [
  ["First name (all emails)", "the account's name (GET /auth/me: name), first word only; left out when there is none"],
  ["Codes", "made by the backend when someone signs up or signs in"],
  ["Not opened yet", "sent only if the app has not signed in 24 hours after sign-up (/auth/me: onboarding_completed is still false)"],
  ["Trial ends tomorrow / in N days", "/auth/me: trial_ends_at"],
  ["Words spoken", "/auth/me: word_quota_used; the line is left out when it is 0"],
  ["Plan, amount, dates, invoice link", "the payment record from Polar (billing)"],
  ["Retry date", "Polar's next attempt on a failed payment"],
  ["Links", "real pages on lazur.app: /download, /pricing, /billing, /dashboard, /copy"],
];

/** The email design system on one page: the colours, the blocks, and every email built from them. */
export default function EmailSystemLab() {
  const colors = Object.entries(EMAIL_TOKENS.color);
  return (
    <main className="min-h-screen bg-[#e9e6e1] px-6 py-10">
      <h1 className="font-display text-3xl font-medium tracking-[-0.03em] text-[var(--foreground)]">Email design system</h1>
      <p className="mt-2 max-w-2xl text-[15px] text-[var(--foreground-muted)]">
        Account emails (codes, receipts) go out through Resend in the branded design. Everything else is a personal note, lighter but still branded, from
        Veer, Aayush or Vaidik, sent from their own mailbox. Code: src/emails/system.ts (blocks) and src/emails/templates.ts (the
        emails).
      </p>

      <h2 className="mt-10 text-[17px] font-semibold text-[var(--foreground)]">Colours</h2>
      <ul className="mt-3 flex flex-wrap gap-3">
        {colors.map(([name, value]) => (
          <li key={name} className="w-[104px] text-[12px] text-[var(--foreground-muted)]">
            <span className="block h-12 rounded-lg border border-black/15" style={{ background: value }} />
            <span className="mt-1 block font-medium text-[var(--foreground)]">{name}</span>
            {value}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-[17px] font-semibold text-[var(--foreground)]">Blocks</h2>
      <ul className="mt-3 grid max-w-4xl gap-x-8 gap-y-1.5 text-[14px] text-[var(--foreground-muted)] md:grid-cols-2">
        {BLOCKS.map(([name, what]) => (
          <li key={name}>
            <span className="font-[family-name:var(--font-geist-mono)] text-[13px] text-[var(--foreground)]">{name}</span> {what}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-[17px] font-semibold text-[var(--foreground)]">Where the details come from</h2>
      <ul className="mt-3 max-w-4xl space-y-1.5 text-[14px] text-[var(--foreground-muted)]">
        {SOURCES.map(([what, from]) => (
          <li key={what}>
            <span className="font-semibold text-[var(--foreground)]">{what}:</span> {from}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-[17px] font-semibold text-[var(--foreground)]">The emails</h2>
      <div className="mt-4 grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        {EMAIL_SAMPLES.map((sample) => {
          const built = sample.build();
          return (
            <section key={sample.id} id={sample.id}>
              <h3 className="text-[16px] font-semibold text-[var(--foreground)]">{sample.name}</h3>
              <p className="mt-0.5 text-[13px] text-[var(--foreground-muted)]">{sample.when}</p>
              <div className="mt-2 rounded-t-xl border border-b-0 border-black/15 bg-white px-4 py-2.5 text-[13px]">
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--foreground)]">{built.from.name}</span>
                  <span className="text-[var(--foreground-faint)]">&lt;{built.from.address}&gt;</span>
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      built.from.via === "resend" ? "bg-[#ecfdf9] text-[#0f766e]" : "bg-black/[0.06] text-[var(--foreground-muted)]"
                    }`}
                  >
                    {built.from.via === "resend" ? "Resend, branded" : "their mailbox, personal"}
                  </span>
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-[var(--foreground)]">{built.subject}</span>{" "}
                  <span className="text-[var(--foreground-faint)]">{built.preheader}</span>
                </p>
              </div>
              {/* The sticker images are on this site already; production emails use the full lazur.app address. */}
              <iframe title={sample.name} srcDoc={built.html.replaceAll(EMAIL_ASSET_BASE, "/email")} className="h-[900px] w-full rounded-b-xl border border-black/15 bg-white" />
            </section>
          );
        })}
      </div>
    </main>
  );
}
