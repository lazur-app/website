// @ts-check
/**
 * What Lazur is and can do, as of the date below. Every prompt gets LAZUR_FACTS_PROMPT, and the
 * "Faster with Lazur" blocks are limited to the capabilities listed here (the schema only accepts
 * these ids). Update this file when the product changes; pages refresh against it weekly.
 * Source of truth: public/llms.txt, src/lib/pricingPlans.ts, the homepage FAQ.
 */

export const LAZUR_FACTS_UPDATED = "2026-11-05";

export const LAZUR = {
  name: "Lazur",
  oneLiner: "A voice assistant for the Mac that lives in the notch.",
  pitch:
    "Hold a key and talk. Lazur sees your screen, points at things, answers out loud and helps you get the work done in any app.",
  platform: "macOS (Apple silicon and Intel). Windows is planned, not available.",
  askShortcut: "⌥ ⌘ (hold Option + Command)",
  dictateShortcut: "fn (hold)",
  trial: "3-day Pro trial, no credit card. Starts when you first open the app.",
  plans: [
    { name: "Pro", monthly: 18, annualPerMonth: 15, actions: 250, note: "250 AI actions a month, unlimited dictation" },
    { name: "Power", monthly: 120, annualPerMonth: 96, actions: 1000, note: "1,000 AI actions a month, unlimited dictation" },
  ],
  privacy:
    "Listens and looks at the screen only while you hold the shortcut. Audio and the screenshot are sent to AI providers to answer and are not stored. Content is never used to train AI models.",
  downloadPath: "/download",
  pricingPath: "/pricing",
};

/**
 * The only things a "Faster with Lazur" block may show Lazur doing. `does` is how pages phrase it.
 * Keep these honest: Lazur does not click inside other apps or edit their files.
 */
export const LAZUR_CAPABILITIES = {
  explain: {
    label: "Explains what's on screen",
    does: "Lazur looks at your screen and answers out loud.",
  },
  point: {
    label: "Points at it",
    does: "Lazur draws a circle and a label around the button or menu you need.",
  },
  guide: {
    label: "Walks you through it",
    does: "Lazur guides you one click at a time and waits for each click.",
  },
  dictate: {
    label: "Types what you say",
    does: "Hold fn and talk. Clean, formatted text appears at your cursor.",
  },
  draft: {
    label: "Drafts it",
    does: "Lazur reads what's on screen and writes the draft at your cursor for you to check.",
  },
  research: {
    label: "Researches in the background",
    does: "Lazur runs the research in its own Chrome tabs and comes back with a summary and a report.",
  },
  everyday: {
    label: "Handles the small stuff",
    does: "Timers, reminders, calendar events, notes, music, opening apps and links, Shortcuts.",
  },
};

export const LAZUR_CAPABILITY_IDS = /** @type {(keyof typeof LAZUR_CAPABILITIES)[]} */ (
  Object.keys(LAZUR_CAPABILITIES)
);

export const LAZUR_FACTS_PROMPT = `ABOUT LAZUR (the product this site sells; facts as of ${LAZUR_FACTS_UPDATED}, do not add to them):
- ${LAZUR.oneLiner} ${LAZUR.pitch}
- Hold ${LAZUR.askShortcut} to ask about anything on screen; Lazur answers out loud.
- Ask where something is and Lazur draws a circle and a label around it on your screen.
- Ask how to do something and Lazur guides you one click at a time, waiting for each click.
- Everyday actions by voice: timers, Apple Reminders, Calendar events, notes, music and volume, opening apps and links, web search, Shortcuts.
- Background jobs: research runs in Lazur's own Chrome tabs (Lazur for Chrome extension) and comes back with a summary and a report.
- Hold ${LAZUR.dictateShortcut} to dictate clean, formatted text at the cursor in any app. Snippets, a personal dictionary and clipboard slots. Dictation is included, it is not the headline.
- Memory of what you asked and did, kept on the Mac.
- Platform: ${LAZUR.platform}
- Pricing: ${LAZUR.trial} Pro $18/month ($15/month billed annually, 250 AI actions). Power $120/month ($96/month annually, 1,000 AI actions). Dictation is unlimited on both.
- Privacy: ${LAZUR.privacy}
- Lazur does NOT click buttons, edit files, or operate other apps for you. It is not a plugin or add-in for any app. No partnerships with any app maker.
- In "Faster with Lazur" blocks pick one capability id: ${LAZUR_CAPABILITY_IDS.join(", ")}.`;
