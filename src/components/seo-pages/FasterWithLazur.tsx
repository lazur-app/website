import Link from "next/link";
import { LAZUR_CAPABILITIES } from "@/lib/content/lazur-facts.mjs";
import type { LazurAsk, LazurDemo } from "@/lib/seo-pages/types";
import { InlineText } from "./InlineText";
import { NotchScene } from "./NotchScene";
import { Kbd } from "./Primitives";

/**
 * The "Faster with Lazur" block. Honest by construction: it can only show one of the capabilities in
 * src/lib/content/lazur-facts.mjs, and says what Lazur does in that capability's own words.
 */
export function FasterWithLazur({
  demo,
  appName,
  title,
  intro,
  asks = [],
}: {
  demo: LazurDemo;
  appName: string;
  title?: string;
  intro?: string;
  asks?: LazurAsk[];
}) {
  const cap = LAZUR_CAPABILITIES[demo.capability];
  return (
    <section className="seo-faster" aria-labelledby="faster-with-lazur">
      <div className="seo-faster__copy">
        <p className="seo-kicker !text-[var(--brand-ink)]">Faster with Lazur</p>
        <h2 id="faster-with-lazur" className="seo-h2 mt-2">
          {title ?? `Ask instead of hunting through ${appName} menus`}
        </h2>
        <p className="mt-3 text-[16px] leading-[1.7] text-[#3d3834]">
          <InlineText
            text={
              intro ??
              `Hold ⌥ ⌘ and say what you want. Lazur sees your ${appName} window. ${cap.does}`
            }
          />
        </p>
        <ul className="mt-5 space-y-3">
          <li className="seo-step-mini">
            <span>1</span>
            <p>
              Hold <Kbd keys="⌥ + ⌘" /> and talk
            </p>
          </li>
          <li className="seo-step-mini">
            <span>2</span>
            <p>{cap.does}</p>
          </li>
          <li className="seo-step-mini">
            <span>3</span>
            <p>You stay in {appName}. Nothing to copy into a chat window.</p>
          </li>
        </ul>
        {asks.length > 0 ? (
          <div className="mt-6">
            <p className="seo-label">More things to say in {appName}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {asks.slice(0, 6).map((a) => (
                <li key={a.say} className="seo-chip" title={a.result}>
                  “{a.say}”
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="mt-6 text-[14px] text-[var(--foreground-muted)]">
          Free for 3 days, then $18/month.{" "}
          <Link href="/download" className="seo-link">
            Download for Mac
          </Link>
        </p>
      </div>
      <div className="seo-faster__visual">
        <NotchScene demo={demo} appName={appName} />
      </div>
    </section>
  );
}

/** Compact card for lists of asks (app, role and role × app pages). */
export function AskGrid({ asks, appName }: { asks: LazurAsk[]; appName?: string }) {
  return (
    <ul className="seo-asks">
      {asks.map((a) => (
        <li key={a.say}>
          <p className="seo-asks__say">“{a.say}”</p>
          <p className="seo-asks__result">
            <InlineText text={a.result} />
          </p>
          <p className="seo-label mt-3 !text-[10px]">
            {LAZUR_CAPABILITIES[a.capability].label}
            {appName ? ` · ${appName}` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}
