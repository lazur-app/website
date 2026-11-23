export const SITE_URL = "https://www.lazur.app";

export const SITE_NAME = "Lazur";

export const DEFAULT_TITLE =
  "Lazur: your AI companion by your cursor | AI assistant for Mac";

export const DEFAULT_DESCRIPTION =
  "Hold a key and talk. Lazur sees your screen, points at things, answers out loud and gets things done in any Mac app: timers, reminders, background research and dictation.";

export const OG_DESCRIPTION =
  "Your AI companion, right at the notch or by your cursor. Hold a key and talk: Lazur sees your screen, points at things and gets things done in any Mac app.";

/**
 * Link preview cards, one set per page, each in three sizes (public/og/<page>-<size>.jpg):
 *   og     1200x630   Open Graph: Facebook, LinkedIn, WhatsApp, iMessage, Slack, Discord, Telegram
 *   x      1200x675   X (Twitter) summary_large_image
 *   square 1200x1200  a second og:image for apps that show square previews
 * Drawn at /lab/share in the site's own look; re-render with `node scripts/og/render-cards.mjs` (dev server running).
 * Give the files new names when they change: apps cache previews by image URL.
 */
export type SharePage = "home" | "team" | "download" | "pricing";

const SHARE_ALT: Record<SharePage, string> = {
  home: "Lazur: your AI companion, right by your cursor. The Lazur wordmark as a jigsaw with Vaidik, Veer and Ayush sitting on it.",
  team: "The three of us behind Lazur: photos of Vaidik, Veer and Ayush.",
  download: "Get Lazur on your Mac: one download, free 3-day Pro trial, no card.",
  pricing: "Lazur pricing: 3 days free, then $18 a month for Pro.",
};

/** The Open Graph and X images for a page, ready to drop into `openGraph.images` / `twitter.images`. */
export function shareImages(page: SharePage) {
  const alt = SHARE_ALT[page];
  return {
    openGraph: [
      { url: `/og/${page}-og.jpg`, width: 1200, height: 630, alt, type: "image/jpeg" },
      { url: `/og/${page}-square.jpg`, width: 1200, height: 1200, alt, type: "image/jpeg" },
    ],
    twitter: [{ url: `/og/${page}-x.jpg`, width: 1200, height: 675, alt }],
  };
}

/** The site-wide link preview (the homepage card), for pages that don't have their own. */
export const OG_IMAGE = shareImages("home").openGraph[0];
