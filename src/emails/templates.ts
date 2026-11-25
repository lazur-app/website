/**
 * Every email Lazur sends. There are two kinds:
 *
 * - Account emails (codes, receipts) go out through Resend from the Lazur address, in the
 *   branded "Ticket" design from ./system.
 * - Everything else is a personal note from one of the team (Veer, Aayush or Vaidik), sent through
 *   Resend from their own @lazur.app address (replies go to their inbox), written the way you would
 *   write to a friend, in a lighter version of the brand.
 *
 * The backend sends these. It keeps a Python copy of this file (app/email_templates.py in
 * lazur-app/backend and lazur-app/backend-windows) and a test that checks the copy draws exactly
 * what this file draws: after changing an email here, refresh the backend's fixture from
 * http://localhost:3000/lab/emails/samples (npm run dev) and update the Python copy to match.
 *
 * A template takes the facts for one person and returns who it is from, the subject, the preview
 * line, the HTML and a plain-text copy. To add an email, add a function here and list it in
 * EMAIL_SAMPLES so it shows on /lab/emails.
 */
import { button, email, esc, facts, finePrint, heading, link, note, plainEmail, text, ticket } from "./system";

/** Who an email is from. `via`: "resend" is the Lazur address, "mailbox" a person's own address (also sent through Resend, replies go to them). */
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
/** The page a "Copy code" button opens: it copies the code (kept after the #, so it never reaches a server). */
function copyLink(code: string) {
  return `${SITE}/copy#${encodeURIComponent(code)}`;
}

export function verifyEmail(p: { code: string; minutes?: number }): BuiltEmail {
  const minutes = p.minutes ?? 10;
  const preheader = `Your Lazur code is ${p.code}. It works for ${minutes} minutes.`;
  return {
    from: SENDERS.lazur,
    subject: `${p.code} is your Lazur code`,
    preheader,
    html: email({
      preheader,
      sticker: "key",
      stamp: "3 DAYS FREE",
      blocks: [
        heading("Hey, quick check."),
        text(`Is this really your email? Type this code into Lazur. It works for ${minutes} minutes.`),
        ticket({ label: "Your code", value: p.code }),
        button("Copy code", copyLink(p.code)),
        finePrint(IGNORE),
      ],
      reason: "You got this because someone signed up for Lazur with this address.",
    }),
    text: `Hey, quick check.\n\nYour Lazur code is ${p.code}. It works for ${minutes} minutes.\n\n${IGNORE}`,
  };
}

/** Sign in with a code instead of a password. */
export function signInCode(p: { code: string; minutes?: number }): BuiltEmail {
  const minutes = p.minutes ?? 10;
  const preheader = `Your sign-in code is ${p.code}. It works for ${minutes} minutes.`;
  return {
    from: SENDERS.lazur,
    subject: `${p.code} is your Lazur sign-in code`,
    preheader,
    html: email({
      preheader,
      sticker: "cursor",
      blocks: [
        heading("Welcome back."),
        text(`Here is your code to sign in. It works for ${minutes} minutes and only once.`),
        ticket({ label: "Sign-in code", value: p.code }),
        button("Copy code", copyLink(p.code)),
        finePrint("Not you? Ignore this email and your account stays as it is."),
      ],
      reason: "You got this because someone asked to sign in to Lazur with this address.",
    }),
    text: `Welcome back.\n\nYour Lazur sign-in code is ${p.code}. It works for ${minutes} minutes and only once.\n\nNot you? Ignore this email and your account stays as it is.`,
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
      sticker: "crown",
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
export function paymentFailed(p: { name?: string | null; plan: string; amount: string; retryDate?: string | null }): BuiltEmail {
  const preheader = `We could not charge ${p.amount}. Update your card to keep Lazur ${p.plan}.`;
  const first = firstName(p.name);
  return {
    from: SENDERS.lazur,
    subject: "Your Lazur payment did not go through",
    preheader,
    html: email({
      preheader,
      sticker: "bolt",
      blocks: [
        heading("Your card said no."),
        text(`${first ? `Hey ${esc(first)}, we` : "We"} tried to charge ${esc(p.amount)} for Lazur ${esc(p.plan)} and the bank declined it. It happens.`),
        note("What happens next", `${p.retryDate ? `We try again on <b>${esc(p.retryDate)}</b>. ` : ""}Pro is paused until the payment goes through. Update your card and it comes straight back.`),
        button("Update my card", `${SITE}/billing`),
        finePrint("Already fixed it? Then ignore this."),
      ],
      reason: "You got this because a payment for your Lazur plan failed.",
    }),
    text: `Your card said no.\n\nWe tried to charge ${p.amount} for Lazur ${p.plan} and the bank declined it.\n${p.retryDate ? `We try again on ${p.retryDate}. ` : ""}Pro is paused until the payment goes through. Update your card and it comes straight back.\n\nUpdate my card: ${SITE}/billing`,
  };
}

/* ------------------------------------------------------------------ personal notes (team mailboxes) */

/** The three people the personal notes come from. */
export const TEAM = ["veer", "aayush", "vaidik"] as const;
export type TeamMember = (typeof TEAM)[number];

/** How each one writes their name in the note (lowercase, like the rest of it) and signs off. */
const PEOPLE: Record<TeamMember, { lower: string; signature: string }> = {
  veer: { lower: "veer", signature: "Veer" },
  aayush: { lower: "aayush", signature: "Aayush" },
  vaidik: { lower: "vaidik", signature: "Vaidik" },
};

/**
 * Who an automatic note comes from: one of the three, picked at random for each email (not tied to
 * the person). A reply goes to whoever that email came from. Messages sent from the admin pass
 * `from` instead: the one who is signed in.
 */
export function randomSender(): TeamMember {
  return TEAM[Math.floor(Math.random() * TEAM.length)];
}

type Personal = { to: string; name?: string | null; from?: TeamMember };

function who(p: Personal) {
  const id = p.from ?? randomSender();
  return { id, ...PEOPLE[id], sender: SENDERS[id] };
}

/** The computer and the hold-to-talk keys, for the copy that says how to use it. */
const DEVICE = {
  mac: { computer: "mac", keys: "Option + Command", keysLower: "option + command", download: `${SITE}/download` },
  windows: { computer: "pc", keys: "Ctrl + Space", keysLower: "ctrl + space", download: `${SITE}/download` },
} as const;

/** Right after the account is made (Google sign-in). `platform` is the app they signed up from. */
export function welcome(p: Personal & { platform?: "mac" | "windows" }): BuiltEmail {
  const me = who(p);
  const d = DEVICE[p.platform ?? "mac"];
  const preheader = `it's ${me.lower}, one of the people who built lazur. two keys and you're set.`;
  const paragraphs = [
    hey(p.name),
    `it's ${me.lower}, one of the people who built lazur. saw you just signed up, so i wanted to say hi myself instead of sending you some newsletter.`,
    `quick version of how it works: open lazur on your ${d.computer}, hold <b>${d.keys}</b> and just talk. let go and it does the thing, in whatever app you're in. if you haven't downloaded it yet, it's ${link("here", d.download)}.`,
    "the first thing i'd try: open an email and say \"reply that thursday works for me\". that's usually the moment it clicks.",
    "you've got 3 days of pro, no card. and if anything feels off or confusing, just hit reply. it comes straight to me and i actually read these.",
  ];
  return {
    from: me.sender,
    subject: `hey, it's ${me.lower} from lazur`,
    preheader,
    html: plainEmail({ preheader, sticker: "heart", paragraphs, signature: me.signature }),
    text: `${hey(p.name)}\n\nit's ${me.lower}, one of the people who built lazur. saw you just signed up, so i wanted to say hi myself.\n\nopen lazur on your ${d.computer}, hold ${d.keysLower} and just talk. let go and it does the thing, in whatever app you're in. download: ${d.download}\n\nfirst thing to try: open an email and say "reply that thursday works for me".\n\nyou've got 3 days of pro, no card. anything off, just hit reply.\n\n${me.lower}`,
  };
}

/** A day after signing up, when the app was never opened. */
export function notOpenedYet(p: Personal): BuiltEmail {
  const me = who(p);
  const preheader = "noticed lazur hasn't been opened yet. stuck somewhere?";
  const paragraphs = [
    hey(p.name),
    `${me.lower} here from lazur. i noticed you signed up yesterday but lazur hasn't been opened on your mac yet. totally fine, life happens.`,
    "if it got stuck somewhere, it's usually one of these: the download is sitting in your Downloads folder, mac asked for a permission and it got closed, or the shortcut didn't do anything the first time.",
    `if you just want to give it another go, the download is ${link("right here", `${SITE}/download`)}. takes about a minute.`,
    "and if something actually broke, reply and tell me what you saw. i'll sort it out with you.",
  ];
  return {
    from: me.sender,
    subject: "did lazur get stuck?",
    preheader,
    html: plainEmail({ preheader, sticker: "ghost", paragraphs, signature: me.signature }),
    text: `${hey(p.name)}\n\n${me.lower} here from lazur. i noticed you signed up yesterday but lazur hasn't been opened on your mac yet.\n\nusually it's one of these: the download is still in your Downloads folder, mac asked for a permission and it got closed, or the shortcut didn't do anything the first time.\n\nanother go: ${SITE}/download\n\nif something broke, reply and tell me what you saw.\n\n${me.lower}`,
  };
}

/** A day before the trial ends. */
export function trialEnding(p: Personal & { hoursLeft: number; wordsDictated?: number }): BuiltEmail {
  const me = who(p);
  const when = p.hoursLeft <= 24 ? "tomorrow" : `in ${Math.round(p.hoursLeft / 24)} days`;
  const preheader = `your lazur trial ends ${when}. no pressure, just a heads up.`;
  const words = p.wordsDictated
    ? [`so far you've spoken <b>${p.wordsDictated.toLocaleString("en-US")} words</b> to it instead of typing them, which is honestly more than i expected.`]
    : [];
  const paragraphs = [
    hey(p.name),
    `${me.lower} from lazur. just a heads up that your free trial ends ${when}.`,
    ...words,
    `if it's been useful, pro is $18 a month and you can keep going ${link("from here", `${SITE}/pricing`)}. if it hasn't, you don't need to do anything. you won't be charged.`,
    "either way i'd really like to know what you thought. one line is plenty, just reply.",
  ];
  return {
    from: me.sender,
    subject: `your trial ends ${when}`,
    preheader,
    html: plainEmail({ preheader, sticker: "smiley", paragraphs, signature: me.signature }),
    text: `${hey(p.name)}\n\n${me.lower} from lazur. just a heads up that your free trial ends ${when}.\n\nif it's been useful, pro is $18 a month: ${SITE}/pricing\nif not, do nothing, you won't be charged.\n\nwhat did you think? one line is plenty, just reply.\n\n${me.lower}`,
  };
}

/** When someone asks to hear about the Windows app. */
export function windowsWaitlist(p: Personal): BuiltEmail {
  const me = who(p);
  const preheader = "you're on the list for lazur on windows.";
  const paragraphs = [
    hey(p.name),
    `${me.lower} from lazur. got your name down for the windows version.`,
    "right now lazur only runs on mac, but windows is being built as we speak. you'll get one email from me the day it's ready, nothing else in between.",
    "out of curiosity, what would you use it for first? reply and tell me, it helps us decide what to get right first.",
  ];
  return {
    from: me.sender,
    subject: "you're on the windows list",
    preheader,
    html: plainEmail({ preheader, sticker: "cloud", paragraphs, signature: me.signature }),
    text: `${hey(p.name)}\n\n${me.lower} from lazur. got your name down for the windows version.\n\nlazur only runs on mac right now, but windows is being built. you'll get one email from me the day it's ready.\n\nwhat would you use it for first? just reply.\n\n${me.lower}`,
  };
}

/** Someone on a phone or PC asked for the Mac download link by email, to open later on their Mac. */
export function macLink(p: Personal): BuiltEmail {
  const me = who(p);
  const preheader = "the download link, for when you're at your mac.";
  const paragraphs = [
    hey(p.name),
    `${me.lower} from lazur. here's the link you asked for: ${link("download lazur for mac", `${SITE}/download`)}. open it on your mac and lazur downloads straight away.`,
    "once it's installed, hold <b>Option + Command</b> and just talk. let go and it does the thing, in whatever app you're in.",
    "if anything gets stuck along the way, just reply. it comes straight to me.",
  ];
  return {
    from: me.sender,
    subject: "lazur for your mac",
    preheader,
    html: plainEmail({ preheader, sticker: "mic", paragraphs, signature: me.signature }),
    text: `${hey(p.name)}\n\n${me.lower} from lazur. here's the link you asked for. open it on your mac:\n${SITE}/download\n\nonce it's installed, hold option + command and just talk.\n\nanything stuck, just reply.\n\n${me.lower}`,
  };
}

/** Someone joined the early-access list on the website. */
export function onTheList(p: Personal): BuiltEmail {
  const me = who(p);
  const preheader = "you're on the list. i'll write when your access is ready.";
  const paragraphs = [
    hey(p.name),
    `${me.lower} from lazur. you're on the list, and i'll write the moment your access is ready.`,
    "if you want to tell me what you'd use it for, just reply. i read every one, and it helps us decide what to get right first.",
  ];
  return {
    from: me.sender,
    subject: "you're on the lazur list",
    preheader,
    html: plainEmail({ preheader, sticker: "star", paragraphs, signature: me.signature }),
    text: `${hey(p.name)}\n\n${me.lower} from lazur. you're on the list, and i'll write the moment your access is ready.\n\nwhat would you use it for? just reply.\n\n${me.lower}`,
  };
}

/**
 * A message someone on the team writes in the admin (an update notice, a one-off note) to one person
 * or a list. Their words go into the branded card: a short first line becomes the headline, the
 * rest are paragraphs, and the button is optional. `paragraphs` are plain text (escaped here).
 * `from` is whoever is signed in to the admin and sending it: it goes from their address and is
 * signed with their name. Without it (an admin who isn't Veer, Aayush or Vaidik) it comes from Lazur.
 */
export function adminMessage(p: { from?: TeamMember; subject: string; paragraphs: string[]; button?: string; url?: string }): BuiltEmail {
  const me = p.from ? { ...PEOPLE[p.from], sender: SENDERS[p.from] } : null;
  const escLines = (t: string) => esc(t).replace(/\n/g, "<br>");
  const [first = "", ...rest] = p.paragraphs;
  const headline = first.length <= 40 ? first : "";
  const body = headline ? rest : p.paragraphs;
  const preheader = (body[0] ?? first).slice(0, 140);
  const withButton = Boolean(p.button && p.url);
  const blocks = [
    ...(headline ? [heading(escLines(headline))] : []),
    ...body.map((para) => text(escLines(para))),
    ...(me ? [text(`<span style="font-weight:600;color:#1c1917;">${esc(me.signature)}</span><br>Lazur`)] : []),
    ...(withButton ? [button(p.button!, p.url!), finePrint(`Or open <a href="${esc(p.url!)}" style="color:#6b6560;">${esc(p.url!)}</a>`)] : []),
  ];
  const reason = "You got this because you use Lazur. Reply if you'd rather not hear from us.";
  return {
    from: me ? me.sender : SENDERS.lazur,
    subject: p.subject,
    preheader,
    html: email({ preheader, sticker: "star", blocks, reason }),
    text: `${p.paragraphs.join("\n\n")}${me ? `\n\n${me.signature}\nLazur` : ""}${withButton ? `\n\n${p.button}: ${p.url}` : ""}\n\n--\n${reason}`,
  };
}

/* ------------------------------------------------------------------ the preview list */

/** One of each, with made-up people, for /lab/emails and for tests. In the order a person meets them. */
export const EMAIL_SAMPLES: { id: string; name: string; when: string; build: () => BuiltEmail }[] = [
  { id: "verify", name: "Confirm your email", when: "Someone signs up with an email address.", build: () => verifyEmail({ code: "482916" }) },
  { id: "signin", name: "Sign-in code", when: "Someone signs in with their email.", build: () => signInCode({ code: "730254" }) },
  { id: "welcome", name: "Welcome", when: "Right after someone makes an account (Google sign-in).", build: () => welcome({ to: "sam@example.com", name: "Sam Carter", from: "veer" }) },
  { id: "welcome-windows", name: "Welcome (Windows app)", when: "Right after someone makes an account from the Windows app.", build: () => welcome({ to: "sam@example.com", name: "Sam Carter", from: "vaidik", platform: "windows" }) },
  { id: "nudge", name: "Not opened yet", when: "24 hours after making an account, if the app was never opened.", build: () => notOpenedYet({ to: "sam@example.com", name: "Sam Carter", from: "aayush" }) },
  { id: "trial", name: "Trial ending", when: "A day before the 3-day trial ends.", build: () => trialEnding({ to: "sam@example.com", name: "Sam Carter", from: "vaidik", hoursLeft: 20, wordsDictated: 4380 }) },
  { id: "receipt", name: "Receipt", when: "A payment goes through.", build: () => receipt({ name: "Sam Carter", plan: "Pro", amount: "$18.00", date: "Nov 22, 2026", nextDate: "Dec 22, 2026", invoiceUrl: `${SITE}/billing` }) },
  { id: "failed", name: "Payment failed", when: "A card is declined.", build: () => paymentFailed({ name: "Sam Carter", plan: "Pro", amount: "$18.00", retryDate: "Nov 25" }) },
  { id: "windows", name: "Windows waitlist", when: "Someone asks to hear about the Windows app.", build: () => windowsWaitlist({ to: "sam@example.com", name: "Sam Carter", from: "aayush" }) },
  { id: "maclink", name: "Mac download link", when: "Someone on a phone or PC asks for the Mac link by email.", build: () => macLink({ to: "sam@example.com", from: "veer" }) },
  { id: "list", name: "On the list", when: "Someone joins the early-access list on the website.", build: () => onTheList({ to: "sam@example.com", from: "vaidik" }) },
  {
    id: "admin",
    name: "Message from the admin",
    when: "Someone signed in to the admin sends a message; it comes from them.",
    build: () =>
      adminMessage({
        from: "vaidik",
        subject: "Please update Lazur to 0.1.14",
        paragraphs: [
          "Hi Sam,",
          "You're on Lazur 0.1.12. Version 0.1.14 is out, and from this version on Lazur keeps itself up to date automatically.",
          "Your version can't update itself, so please download the new one once: open the link below, drag Lazur into Applications and replace the old one. Your settings stay as they are.",
          "Thanks for using Lazur!",
        ],
        button: "Download Lazur 0.1.14",
        url: `${SITE}/download`,
      }),
  },
];
