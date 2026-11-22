import { DownloadMacPill } from "./Buttons";
import { CTA_REDUCERS } from "./ctaCopy";

/**
 * First-screen CTA row under the hero intro: the download button, the same "Download for Mac" pill
 * for every visitor. Clicks are classified as `content_cta_clicked` / `hero` by ContentClickTracker
 * via the `.seo-herocta` class. `label` / `suffix` are still accepted from the templates but the
 * button reads "Download for Mac" everywhere, like the rest of the site.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HeroCta({ href, label, suffix }: { label: string; suffix?: string; href: string }) {
  return (
    <div className="seo-herocta mt-8" data-cta-location="hero">
      <DownloadMacPill href={href} size="lg" />
      <p className="mt-3 text-[13px] text-[var(--foreground-muted)]">{CTA_REDUCERS}</p>
    </div>
  );
}
