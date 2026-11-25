import type { Metadata } from "next";
import { EMAIL_ASSET_BASE, EMAIL_THEME, EMAIL_THEMES, EMAIL_TOKENS, recolor, type EmailThemeId } from "@/emails/system";
import { EmailGallery } from "./EmailGallery";
import { EMAIL_SAMPLES } from "@/emails/templates";

export const metadata: Metadata = {
  title: "Email design system (lab)",
  robots: { index: false, follow: false },
};

const BLOCKS: [string, string][] = [
  ["header", "The tall coloured top: wordmark, tagline, stickers, optional stamp."],
  ["heading", "The one headline."],
  ["text", "Body paragraph."],
  ["ticket", "Dashed ticket for codes."],
  ["button", "The black pill. One per email."],
  ["steps", "Numbered steps in ink circles."],
  ["facts", "Outlined table for receipts and plan details."],
  ["note", "Note in the theme colour with a small label."],
  ["sayThis", "Words to say to Lazur, in serif italic."],
  ["divider", "Dashed line between two parts."],
  ["finePrint", "Small grey closing words."],
  ["footer", "Why you got this, plus site, help and privacy links. Added to every branded email."],
  ["plainEmail", "A personal note: the same tall top, plain friendly words, signed with a first name."],
];

/**
 * Where every personal detail in the emails comes from, so nothing in them is made up. The
 * backend fills these in when it sends; the samples on this page use a made-up person.
 */
const SOURCES: [string, string][] = [
  ["Who a personal note is from", "Veer, Aayush or Vaidik, picked at random for each email; a reply goes to whoever sent that one"],
  ["First name (all emails)", "the account's name (GET /auth/me: name), first word only; left out when there is none"],
  ["Welcome", "sent right after a new account (Google or GitHub sign-in); the Windows backend sends the Windows wording"],
  ["Not opened yet", "sent 24-72 hours after making an account if the app never checked in (users.app_activated_at is empty)"],
  ["Codes (confirm, sign-in)", "designed and ready, not sent yet: sign-in is Google only today"],
  ["Trial ends tomorrow / in N days", "users.trial_ends_at, sent when less than a day is left and they don't pay"],
  ["Words spoken", "/auth/me: word_quota_used; the line is left out when it is 0"],
  ["Plan, amount, dates, invoice link", "the Polar order.paid webhook (billing_orders)"],
  ["Payment failed", "the Polar subscription.past_due webhook; Polar doesn't send a retry date, so the line is left out"],
  ["Admin messages", "from and signed by whoever is signed in to the admin (Veer, Aayush or Vaidik); a short first line becomes the headline, the button is optional"],
  ["Links", "real pages on lazur.app: /download, /pricing, /billing, /dashboard, /copy"],
];

/** The email design system on one page: the colours, the blocks, and every email built from them. */
export default function EmailSystemLab() {
  const colors = Object.entries(EMAIL_TOKENS.color);
  const themeIds = Object.keys(EMAIL_THEMES) as EmailThemeId[];
  return (
    <main className="min-h-screen bg-[#e9e6e1] px-6 py-10">
      <h1 className="font-display text-3xl font-medium tracking-[-0.03em] text-[var(--foreground)]">Email design system</h1>
      <p className="mt-2 max-w-2xl text-[15px] text-[var(--foreground-muted)]">
        Account emails (codes, receipts) and admin messages go out through Resend from hello@lazur.app in the branded design. Everything
        else is a personal note, lighter but still branded, from Veer, Aayush or Vaidik, sent through Resend from their own @lazur.app
        address so replies reach them. Code: src/emails/system.ts (blocks) and src/emails/templates.ts (the emails). The backends send
        them from a Python copy (app/email_templates.py) that a test keeps identical to these: export from /lab/emails/samples.
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
      <EmailGallery
        initial={EMAIL_THEME}
        themes={themeIds.map((id) => ({ id, name: EMAIL_THEMES[id].name, swatch: EMAIL_THEMES[id].accent }))}
        emails={EMAIL_SAMPLES.map((sample) => {
          const built = sample.build();
          // The sticker images are on this site already; real emails use the full lazur.app address.
          const local = built.html.replaceAll(EMAIL_ASSET_BASE, "/email");
          return {
            id: sample.id,
            name: sample.name,
            when: sample.when,
            fromName: built.from.name,
            fromAddress: built.from.address,
            via: built.from.via,
            subject: built.subject,
            preheader: built.preheader,
            html: Object.fromEntries(themeIds.map((id) => [id, recolor(local, id)])),
          };
        })}
      />
    </main>
  );
}
