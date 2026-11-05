import { LAZUR_CAPABILITIES } from "@/lib/content/lazur-facts.mjs";
import type { LazurDemo } from "@/lib/seo-pages/types";
import { ScreenMock } from "./ScreenMock";

/**
 * Lazur's product visual for SEO pages: a MacBook screen edge with the notch, the listening capsule
 * hanging from it, what you said and what Lazur answers, over the app you are in. CSS only; the
 * waveform animation stops for people who prefer reduced motion.
 */
export function NotchCapsule({ label = "Listening" }: { label?: string }) {
  return (
    <div className="seo-notch" aria-hidden>
      <div className="seo-notch__cut" />
      <div className="seo-notch__capsule">
        <span className="seo-wave">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${(i % 5) * 0.12}s` }} />
          ))}
        </span>
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}

export function NotchScene({ demo, appName, compact = false }: { demo: LazurDemo; appName: string; compact?: boolean }) {
  const cap = LAZUR_CAPABILITIES[demo.capability];
  return (
    <div className={`seo-scene ${compact ? "seo-scene--compact" : ""}`}>
      <NotchCapsule />
      <div className="seo-scene__talk">
        <p className="seo-bubble seo-bubble--you">
          <span className="seo-label !text-[9px] !text-white/50">You say</span>
          <span className="mt-1 block">“{demo.spoken}”</span>
        </p>
        <p className="seo-bubble seo-bubble--lazur">
          <span className="seo-label !text-[9px]">Lazur · {cap.label.toLowerCase()}</span>
          <span className="mt-1 block">{demo.result}</span>
        </p>
      </div>
      <div className="seo-scene__screen">
        <ScreenMock demo={demo} appName={appName} />
      </div>
    </div>
  );
}
