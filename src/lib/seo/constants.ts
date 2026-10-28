export const SITE_URL = "https://www.lazur.app";

export const SITE_NAME = "Lazur";

export const DEFAULT_TITLE =
  "Lazur: your AI buddy, right in the notch | AI assistant for Mac";

export const DEFAULT_DESCRIPTION =
  "Hold a key and talk. Lazur sees your screen, points at things, answers out loud and gets things done in any Mac app: timers, reminders, background research and dictation.";

export const OG_DESCRIPTION =
  "Your AI buddy, right in the notch. Hold a key and talk: Lazur sees your screen, points at things and gets things done in any Mac app.";

/**
 * Link preview image (WhatsApp, X, LinkedIn, iMessage, Slack). Source: scripts/og/og-buddy.html,
 * re-render with `node scripts/og/render.mjs`. Give it a new file name when it changes: apps cache
 * previews by image URL.
 */
export const OG_IMAGE = {
  url: "/og-buddy.png",
  width: 1200,
  height: 630,
  alt: "Lazur: your AI buddy, right in the notch. It sees your screen, points at things and gets it done.",
};
