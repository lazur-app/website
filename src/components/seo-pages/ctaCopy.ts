/**
 * Copy shared by the SEO page CTAs (hero row, sticky bar, closing band). Plain module, not a client
 * one, so server components get the real strings. Only verified claims go here.
 */
export const CTA_REDUCERS = "Free 3-day Pro trial · No credit card · Apple Silicon & Intel";

export const CTA_GENERIC_LABEL = "Download Lazur free for Mac";

/**
 * /download link tagged with the CTA placement (e.g. `howto-<slug>`) for analytics. Uses `src`,
 * not `ref`: `ref` is the referral-code param and would overwrite a visitor's real referral code.
 */
export function downloadHref(source?: string) {
  return source ? `/download?src=${encodeURIComponent(source)}` : "/download";
}
