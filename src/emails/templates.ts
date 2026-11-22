/**
 * Every email Lazur sends, each built from the blocks in ./system. A template takes the facts
 * for one person and returns the subject, the preview line, the HTML and a plain-text copy.
 * To add an email, add a function here and list it in EMAIL_SAMPLES so it shows on /lab/emails.
 */
import { button, divider, email, esc, facts, finePrint, heading, note, sayThis, steps, text, ticket } from "./system";

export type BuiltEmail = { subject: string; preheader: string; html: string; text: string };

const SITE = "https://www.lazur.app";
const IGNORE = "Didn't ask for this? Ignore it and nothing happens.";

/** "Hey Sam," when we know the first name, otherwise just "Hey,". */
function hey(name?: string | null) {
  const first = name?.trim().split(/\s+/)[0];
  return first ? `Hey ${esc(first)},` : "Hey,";
}

/** Confirm a new account's email address: a 6-digit code and a one-tap link. */
export function verifyEmail(p: { code: string; link: string; minutes?: number }): BuiltEmail {
  const minutes = p.minutes ?? 10;
  const preheader = `Your Lazur code is ${p.code}. It works for ${minutes} minutes.`;
  return {
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

/** The first email after the address is confirmed: what to do in the first minute. */
export function welcome(p: { name?: string | null }): BuiltEmail {
  const preheader = "Three steps and your companion is by your cursor.";
  return {
    subject: "You just got a companion",
    preheader,
    html: email({
      preheader,
      stamp: "3 DAYS FREE",
      blocks: [
        heading("You just got a companion."),
        text(`${hey(p.name)} your 3-day Pro trial has started. No card needed. Here is the whole manual:`),
        steps(["Open Lazur on your Mac.", "Hold <b>&#8997; &#8984;</b> and talk.", "Let go. Lazur does the rest, in any app."]),
        note("Try this first", "Open any email and say:"),
        sayThis("reply that Thursday works for me"),
        button("Download Lazur for Mac", `${SITE}/download`),
        finePrint("Already installed? Then you are done. Go talk to it."),
      ],
      reason: "You got this because you created a Lazur account.",
    }),
    text: `You just got a companion.\n\nYour 3-day Pro trial has started. No card needed.\n\n1. Open Lazur on your Mac.\n2. Hold Option and Command, and talk.\n3. Let go. Lazur does the rest, in any app.\n\nTry this first: open any email and say "reply that Thursday works for me".\n\nDownload Lazur for Mac: ${SITE}/download`,
  };
}

/** Sent near the end of the trial. */
export function trialEnding(p: { name?: string | null; hoursLeft: number; wordsDictated?: number }): BuiltEmail {
  const left = p.hoursLeft <= 24 ? "ends tomorrow" : `ends in ${Math.round(p.hoursLeft / 24)} days`;
  const preheader = `Your Pro trial ${left}. Keep your companion for $18 a month.`;
  const used = p.wordsDictated ? [note("So far", `You have spoken <b>${p.wordsDictated.toLocaleString("en-US")} words</b> instead of typing them.`)] : [];
  return {
    subject: `Your Lazur trial ${left}`,
    preheader,
    html: email({
      preheader,
      stamp: "LAST DAY",
      blocks: [
        heading(`Your trial ${left}.`),
        text(`${hey(p.name)} after that Lazur stops answering until you pick a plan. Pro is $18 a month, and you can cancel any time.`),
        ...used,
        button("Keep my companion", `${SITE}/pricing`),
        finePrint("Do nothing and you are never charged."),
      ],
      reason: "You got this because your Lazur trial is about to end.",
    }),
    text: `Your trial ${left}.\n\nAfter that Lazur stops answering until you pick a plan. Pro is $18 a month, and you can cancel any time.\n\nKeep my companion: ${SITE}/pricing\n\nDo nothing and you are never charged.`,
  };
}

/** Sent when a payment goes through. */
export function receipt(p: { name?: string | null; plan: string; amount: string; date: string; nextDate: string; invoiceUrl: string }): BuiltEmail {
  const preheader = `${p.amount} for Lazur ${p.plan}. Thank you.`;
  return {
    subject: `Your Lazur receipt (${p.amount})`,
    preheader,
    html: email({
      preheader,
      blocks: [
        heading("Paid. Thank you."),
        text(`${hey(p.name)} here is your receipt.`),
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
  return {
    subject: "Your Lazur payment did not go through",
    preheader,
    html: email({
      preheader,
      blocks: [
        heading("Your card said no."),
        text(`${hey(p.name)} we tried to charge ${esc(p.amount)} for Lazur ${esc(p.plan)} and the bank declined it. It happens.`),
        note("What happens next", `We try again on <b>${esc(p.retryDate)}</b>. Until then everything keeps working.`),
        button("Update my card", `${SITE}/billing`),
        finePrint("Already fixed it? Then ignore this."),
      ],
      reason: "You got this because a payment for your Lazur plan failed.",
    }),
    text: `Your card said no.\n\nWe tried to charge ${p.amount} for Lazur ${p.plan} and the bank declined it.\nWe try again on ${p.retryDate}. Until then everything keeps working.\n\nUpdate my card: ${SITE}/billing`,
  };
}

/** Sent when someone joins the Windows waitlist. */
export function windowsWaitlist(): BuiltEmail {
  const preheader = "We will email you the moment Lazur is ready for Windows.";
  return {
    subject: "You are on the Lazur for Windows list",
    preheader,
    html: email({
      preheader,
      stamp: "ON THE LIST",
      blocks: [
        heading("You are on the list."),
        text("Lazur is a Mac app for now. The Windows version is being built, and you will hear from us the moment it is ready. One email, no noise."),
        divider(),
        text("Have a Mac nearby? You can start today."),
        button("Download Lazur for Mac", `${SITE}/download`),
      ],
      reason: "You got this because you asked to hear when Lazur is ready for Windows.",
    }),
    text: `You are on the list.\n\nLazur is a Mac app for now. The Windows version is being built, and you will hear from us the moment it is ready.\n\nHave a Mac nearby? Download Lazur for Mac: ${SITE}/download`,
  };
}

/** One of each, with made-up people, for the preview page and for tests. */
export const EMAIL_SAMPLES: { id: string; name: string; when: string; build: () => BuiltEmail }[] = [
  { id: "verify", name: "Confirm your email", when: "Someone signs up with an email address.", build: () => verifyEmail({ code: "482916", link: `${SITE}/auth/callback` }) },
  { id: "signin", name: "Sign-in code", when: "Someone signs in with their email.", build: () => signInCode({ code: "730254", link: `${SITE}/auth/callback` }) },
  { id: "welcome", name: "Welcome", when: "Right after the email is confirmed.", build: () => welcome({ name: "Sam Carter" }) },
  { id: "trial", name: "Trial ending", when: "A day before the 3-day trial ends.", build: () => trialEnding({ name: "Sam Carter", hoursLeft: 20, wordsDictated: 4380 }) },
  { id: "receipt", name: "Receipt", when: "A payment goes through.", build: () => receipt({ name: "Sam Carter", plan: "Pro", amount: "$18.00", date: "Nov 22, 2026", nextDate: "Dec 22, 2026", invoiceUrl: `${SITE}/billing` }) },
  { id: "failed", name: "Payment failed", when: "A card is declined.", build: () => paymentFailed({ name: "Sam Carter", plan: "Pro", amount: "$18.00", retryDate: "Nov 25" }) },
  { id: "windows", name: "Windows waitlist", when: "Someone asks to hear about the Windows app.", build: () => windowsWaitlist() },
];
