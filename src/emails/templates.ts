/**
 * Every email Lazur sends. There are two kinds:
 *
 * - Account emails (codes, receipts) go out through Resend from the Lazur address, in the
 *   branded "Ticket" design from ./system.
 * - Everything else is a personal note from one of the team (Veer, Aayush or Vaidik), sent from
 *   their own mailbox, written the way you would write to a friend, in a lighter version of the brand.
 *
 * A template takes the facts for one person and returns who it is from, the subject, the preview
 * line, the HTML and a plain-text copy. To add an email, add a function here and list it in
 * EMAIL_SAMPLES so it shows on /lab/emails.
 */
import { button, email, esc, facts, finePrint, heading, link, note, plainEmail, text, ticket } from "./system";

/** Who an email is from. `via` is how it is sent: Resend for account emails, the person's own mailbox otherwise. */
export type Sender = { name: string; address: string; via: "resend" | "mailbox" };

export const SENDERS = {
  /** Account emails. The address still needs to be set up and verified in Resend. */
  lazur: { name: "Lazur", address: "hello@lazur.app", via: "resend" },
  veer: { name: "Veer from Lazur", address: "veer@lazur.app", via: "mailbox" },
  aayush: { name: "Aayush from Lazur", address: "ayush@lazur.app", via: "mailbox" },
  vaidik: { name: "Vaidik from Lazur", address: "vaidik@lazur.app", via: "mailbox" },
} satisfies Record<string, Sender>;

export type BuiltEmail = { from: Sender; subject: string; preheader: string; html: string; text: string };

const SITE = "https://www.lazur.app";
const IGNORE = "Didn't ask for this? Ignore it and nothing happens.";

/** The first name, or nothing when we don't have one. */
function firstName(name?: string | null) {
  return name?.trim().split(/\s+/)[0] ?? "";
}

/** "hey sam," when we know the name, otherwise "hey,". */
function hey(name?: string | null) {
  const first = firstName(name);
  return first ? `hey ${esc(first)},` : "hey,";
}

/* ------------------------------------------------------------------ account emails (Resend, branded) */

/** Confirm a new account's email address: a 6-digit code and a one-tap link. */
export function verifyEmail(p: { code: string; link: string; minutes?: number }): BuiltEmail {
  const minutes = p.minutes ?? 10;
  const preheader = `Your Lazur code is ${p.code}. It works for ${minutes} minutes.`;
  return {
    from: SENDERS.lazur,
    subject: `${p.code} is your Lazur code`,
    preheader,
    html: email({
      preheader,
      stamp: "3 DAYS FREE",
      blocks: [
        heading("Hey, quick check."),
        text(`Is this really your email? Use the code below, or just hit the button. It works for ${minutes} minutes.`),
        ticket({ label: "Your code", value: p.code, stub: "ADMIT ONE" }),
        button("Confirm my email", p.link),
        finePrint(IGNORE),
      ],
      reason: "You got this because someone signed up for Lazur with this address.",
    }),
    text: `Hey, quick check.\n\nYour Lazur code is ${p.code}. It works for ${minutes} minutes.\nOr confirm with this link: ${p.link}\n\n${IGNORE}`,
  };
}

/** Sign in with a code instead of a password. */
export function signInCode(p: { code: string; link: string; minutes?: number }): BuiltEmail {
  const minutes = p.minutes ?? 10;
  const preheader = `Your sign-in code is ${p.code}. It works for ${minutes} minutes.`;
  return {
    from: SENDERS.lazur,
    subject: `${p.code} is your Lazur sign-in code`,
    preheader,
    html: email({
      preheader,
      blocks: [
        heading("Welcome back."),
        text(`Here is your code to sign in. It works for ${minutes} minutes and only once.`),
        ticket({ label: "Sign-in code", value: p.code, stub: "ONE USE" }),
        button("Sign me in", p.link),
        finePrint("Not you? Ignore this email and your account stays as it is."),
      ],
      reason: "You got this because someone asked to sign in to Lazur with this address.",
    }),
    text: `Welcome back.\n\nYour Lazur sign-in code is ${p.code}. It works for ${minutes} minutes and only once.\nOr sign in with this link: ${p.link}\n\nNot you? Ignore this email and your account stays as it is.`,
  };
}

/** Sent when a payment goes through. */
export function receipt(p: { name?: string | null; plan: string; amount: string; date: string; nextDate: string; invoiceUrl: string }): BuiltEmail {
  const preheader = `${p.amount} for Lazur ${p.plan}. Thank you.`;
  const first = firstName(p.name);
  return {
    from: SENDERS.lazur,
    subject: `Your Lazur receipt (${p.amount})`,
    preheader,
    html: email({
      preheader,
      blocks: [
        heading("Paid. Thank you."),
        text(`${first ? `Hey ${esc(first)}, here` : "Here"} is your receipt.`),
        facts([
          { label: "Plan", value: `Lazur ${p.plan}` },
          { label: "Paid on", value: p.date },
          { label: "Next payment", value: p.nextDate },
          { label: "Total", value: p.amount, strong: true },
        ]),
        button("See the invoice", p.invoiceUrl),
        finePrint(`Change or cancel your plan any time from your <a href="${SITE}/dashboard" style="color:#6b6560;">dashboard</a>.`),
      ],
      reason: "You got this because you paid for a Lazur plan.",
    }),
    text: `Paid. Thank you.\n\nPlan: Lazur ${p.plan}\nPaid on: ${p.date}\nNext payment: ${p.nextDate}\nTotal: ${p.amount}\n\nInvoice: ${p.invoiceUrl}\nChange or cancel your plan any time: ${SITE}/dashboard`,
  };
}

/** Sent when a card is declined. */
export function paymentFailed(p: { name?: string | null; plan: string; amount: string; retryDate: string }): BuiltEmail {
  const preheader = `We could not charge ${p.amount}. Update your card to keep Lazur ${p.plan}.`;
  const first = firstName(p.name);
  return {
    from: SENDERS.lazur,
    subject: "Your Lazur payment did not go through",
    preheader,
    html: email({
      preheader,
      blocks: [
        heading("Your card said no."),
        text(`${first ? `Hey ${esc(first)}, we` : "We"} tried to charge ${esc(p.amount)} for Lazur ${esc(p.plan)} and the bank declined it. It happens.`),
        note("What happens next", `We try again on <b>${esc(p.retryDate)}</b>. Until then everything keeps working.`),
        button("Update my card", `${SITE}/billing`),
        finePrint("Already fixed it? Then ignore this."),
      ],
      reason: "You got this because a payment for your Lazur plan failed.",
    }),
    text: `Your card said no.\n\nWe tried to charge ${p.amount} for Lazur ${p.plan} and the bank declined it.\nWe try again on ${p.retryDate}. Until then everything keeps working.\n\nUpdate my card: ${SITE}/billing`,
  };
}

/* ------------------------------------------------------------------ personal notes (team mailboxes, plain) */

/** Right after the email is confirmed. From Veer. */
export function welcome(p: { name?: string | null }): BuiltEmail {
  const preheader = "it's veer, one of the people who built lazur. two keys and you're set.";
  const paragraphs = [
    hey(p.name),
    "it's veer, one of the people who built lazur. saw you just signed up, so i wanted to say hi myself instead of sending you some newsletter.",
    `quick version of how it works: open lazur on your mac, hold <b>&#8997; &#8984;</b> and just talk. let go and it does the thing, in whatever app you're in. if you haven't downloaded it yet, it's ${link("here", `${SITE}/download`)}.`,
    "the first thing i'd try: open an email and say \"reply that thursday works for me\". that's usually the moment it clicks.",
    "you've got 3 days of pro, no card. and if anything feels off or confusing, just hit reply. it comes straight to me and i actually read these.",
  ];
  return {
    from: SENDERS.veer,
    subject: "hey, it's veer from lazur",
    preheader,
    html: plainEmail({ preheader, paragraphs, signature: "veer" }),
    text: `${hey(p.name)}\n\nit's veer, one of the people who built lazur. saw you just signed up, so i wanted to say hi myself.\n\nopen lazur on your mac, hold option + command and just talk. let go and it does the thing, in whatever app you're in. download: ${SITE}/download\n\nfirst thing to try: open an email and say "reply that thursday works for me".\n\nyou've got 3 days of pro, no card. anything off, just hit reply.\n\nveer`,
  };
}

/** A day after signing up, when the app was never opened. From Aayush. */
export function notOpenedYet(p: { name?: string | null }): BuiltEmail {
  const preheader = "noticed lazur hasn't been opened yet. stuck somewhere?";
  const paragraphs = [
    hey(p.name),
    "aayush here from lazur. i noticed you signed up yesterday but lazur hasn't been opened on your mac yet. totally fine, life happens.",
    "if it got stuck somewhere, it's usually one of these: the download is sitting in your Downloads folder, mac asked for a permission and it got closed, or the shortcut didn't do anything the first time.",
    `if you just want to give it another go, the download is ${link("right here", `${SITE}/download`)}. takes about a minute.`,
    "and if something actually broke, reply and tell me what you saw. i'll sort it out with you.",
  ];
  return {
    from: SENDERS.aayush,
    subject: "did lazur get stuck?",
    preheader,
    html: plainEmail({ preheader, paragraphs, signature: "aayush" }),
    text: `${hey(p.name)}\n\naayush here from lazur. i noticed you signed up yesterday but lazur hasn't been opened on your mac yet.\n\nusually it's one of these: the download is still in your Downloads folder, mac asked for a permission and it got closed, or the shortcut didn't do anything the first time.\n\nanother go: ${SITE}/download\n\nif something broke, reply and tell me what you saw.\n\naayush`,
  };
}

/** A day before the trial ends. From Vaidik. */
export function trialEnding(p: { name?: string | null; hoursLeft: number; wordsDictated?: number }): BuiltEmail {
  const when = p.hoursLeft <= 24 ? "tomorrow" : `in ${Math.round(p.hoursLeft / 24)} days`;
  const preheader = `your lazur trial ends ${when}. no pressure, just a heads up.`;
  const words = p.wordsDictated
    ? [`so far you've spoken <b>${p.wordsDictated.toLocaleString("en-US")} words</b> to it instead of typing them, which is honestly more than i expected.`]
    : [];
  const paragraphs = [
    hey(p.name),
    `vaidik from lazur. just a heads up that your free trial ends ${when}.`,
    ...words,
    `if it's been useful, pro is $18 a month and you can keep going ${link("from here", `${SITE}/pricing`)}. if it hasn't, you don't need to do anything. you won't be charged.`,
    "either way i'd really like to know what you thought. one line is plenty, just reply.",
  ];
  return {
    from: SENDERS.vaidik,
    subject: `your trial ends ${when}`,
    preheader,
    html: plainEmail({ preheader, paragraphs, signature: "vaidik" }),
    text: `${hey(p.name)}\n\nvaidik from lazur. just a heads up that your free trial ends ${when}.\n\nif it's been useful, pro is $18 a month: ${SITE}/pricing\nif not, do nothing, you won't be charged.\n\nwhat did you think? one line is plenty, just reply.\n\nvaidik`,
  };
}

/** When someone asks to hear about the Windows app. From Aayush. */
export function windowsWaitlist(p: { name?: string | null }): BuiltEmail {
  const preheader = "you're on the list for lazur on windows.";
  const paragraphs = [
    hey(p.name),
    "aayush from lazur. got your name down for the windows version.",
    "right now lazur only runs on mac, but windows is being built as we speak. you'll get one email from me the day it's ready, nothing else in between.",
    "out of curiosity, what would you use it for first? reply and tell me, it helps us decide what to get right first.",
  ];
  return {
    from: SENDERS.aayush,
    subject: "you're on the windows list",
    preheader,
    html: plainEmail({ preheader, paragraphs, signature: "aayush" }),
    text: `${hey(p.name)}\n\naayush from lazur. got your name down for the windows version.\n\nlazur only runs on mac right now, but windows is being built. you'll get one email from me the day it's ready.\n\nwhat would you use it for first? just reply.\n\naayush`,
  };
}

/* ------------------------------------------------------------------ the preview list */

/** One of each, with made-up people, for /lab/emails and for tests. In the order a person meets them. */
export const EMAIL_SAMPLES: { id: string; name: string; when: string; build: () => BuiltEmail }[] = [
  { id: "verify", name: "Confirm your email", when: "Someone signs up with an email address.", build: () => verifyEmail({ code: "482916", link: `${SITE}/auth/callback` }) },
  { id: "signin", name: "Sign-in code", when: "Someone signs in with their email.", build: () => signInCode({ code: "730254", link: `${SITE}/auth/callback` }) },
  { id: "welcome", name: "Welcome", when: "Right after the email is confirmed.", build: () => welcome({ name: "Sam Carter" }) },
  { id: "nudge", name: "Not opened yet", when: "24 hours after signing up, if the app was never opened.", build: () => notOpenedYet({ name: "Sam Carter" }) },
  { id: "trial", name: "Trial ending", when: "A day before the 3-day trial ends.", build: () => trialEnding({ name: "Sam Carter", hoursLeft: 20, wordsDictated: 4380 }) },
  { id: "receipt", name: "Receipt", when: "A payment goes through.", build: () => receipt({ name: "Sam Carter", plan: "Pro", amount: "$18.00", date: "Nov 22, 2026", nextDate: "Dec 22, 2026", invoiceUrl: `${SITE}/billing` }) },
  { id: "failed", name: "Payment failed", when: "A card is declined.", build: () => paymentFailed({ name: "Sam Carter", plan: "Pro", amount: "$18.00", retryDate: "Nov 25" }) },
  { id: "windows", name: "Windows waitlist", when: "Someone asks to hear about the Windows app.", build: () => windowsWaitlist({ name: "Sam Carter" }) },
];
