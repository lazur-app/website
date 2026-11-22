/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { ROWS } from "@/components/landing/WorksInWall";

/**
 * A wide, dark dome under the hero with app logos riding just inside its rim: they sit on a huge circle
 * that turns slowly, so only the top arc is on screen and the logos rise, cross the crown and sink
 * away at the far side. CSS only (see .app-dome in globals.css); the ring stands still under
 * prefers-reduced-motion. `mono` shows the logos in black and white.
 */
const APPS = ROWS.flat();
/** Logos that are plain black and need flipping to show on the dark dome. */
const BLACK_LOGOS = new Set(["github", "x", "notion", "cursor", "openai", "intercom", "framer", "linear"]);
/** Three times round, so the rim of the very large circle stays evenly beaded. */
const BEADS = [...APPS, ...APPS, ...APPS];

export function AppDome({ mono = false }: { mono?: boolean }) {
  return (
    <section className="app-dome mt-12 md:mt-16" aria-label="Apps Lazur works in">
      <div className="app-dome__body" aria-hidden />
      <div className="app-dome__ring">
        {BEADS.map((app, i) => (
          <img
            key={i}
            src={`/app-logos/${app.slug}.svg`}
            alt={i < APPS.length ? app.name : ""}
            decoding="async"
            className={`app-dome__logo ${mono ? "app-dome__logo--mono" : ""} ${BLACK_LOGOS.has(app.slug) ? "app-dome__logo--flip" : ""}`}
            style={{ "--a": `${(i * 360) / BEADS.length}deg` } as CSSProperties}
          />
        ))}
      </div>
      <p className="absolute inset-x-0 top-[112px] text-center text-[14px] text-white/55 md:top-[128px]">
        works in every app on your Mac
      </p>
    </section>
  );
}

/**
 * The same apps again along the bottom of the dark band, this time in one straight line, drifting
 * the other way.
 */
export function AppLine() {
  return (
    <div className="overflow-hidden" aria-hidden>
      <div className="logo-wall-row flex w-max" data-reverse="" style={{ animationDuration: "150s" }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-12 pr-12 md:gap-16 md:pr-16">
            {APPS.map((app) => (
              <img
                key={app.slug}
                src={`/app-logos/${app.slug}.svg`}
                alt=""
                decoding="async"
                loading="lazy"
                className={`h-[26px] w-[26px] max-w-none shrink-0 object-contain md:h-[34px] md:w-[34px] ${BLACK_LOGOS.has(app.slug) ? "app-dome__logo--flip" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
