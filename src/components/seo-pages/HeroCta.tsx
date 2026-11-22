"use client";

import { GlowCta } from "@/components/GlowCta";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { CTA_REDUCERS } from "./ctaCopy";

/**
 * First-screen CTA row under the hero intro: the download button, the same for every visitor. Clicks are classified as `content_cta_clicked` / `hero` by
 * ContentClickTracker via the `.seo-herocta` class.
 */
export function HeroCta({ label, suffix, href }: { label: string; suffix?: string; href: string }) {
  return (
    <div className="seo-herocta mt-6" data-cta-location="hero">
      <GlowCta href={href} wrapClassName="final-cta-btn-wrap--subtle">
        <AppleIcon className="h-4 w-4" />
        <span>
          {label}
          {suffix ? <span className="hidden sm:inline"> — {suffix}</span> : null}
        </span>
      </GlowCta>
      <p className="mt-2.5 text-[13px] text-[var(--foreground-muted)]">{CTA_REDUCERS}</p>
    </div>
  );
}
