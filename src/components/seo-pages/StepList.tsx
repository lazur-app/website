import type { HowToStep, SeoImage } from "@/lib/seo-pages/types";
import { ImageFigure } from "./ImageFigure";
import { InlineText } from "./InlineText";
import { Kbd, MenuPath } from "./Primitives";

/** Numbered steps with the menu path and shortcut pulled out, so people can scan for them. */
export function StepList({ steps, images }: { steps: HowToStep[]; images: SeoImage[] }) {
  return (
    <ol className="seo-steps">
      {steps.map((step, i) => (
        <li key={step.name} id={`step-${i + 1}`} className="scroll-mt-28">
          <span className="seo-steps__n" aria-hidden>
            {i + 1}
          </span>
          <div className="min-w-0">
            <h3 className="seo-steps__name">{step.name}</h3>
            {step.menuPath?.length || step.shortcut ? (
              <p className="mt-2 flex flex-wrap items-center gap-2">
                {step.menuPath?.length ? <MenuPath path={step.menuPath} /> : null}
                {step.shortcut ? <Kbd keys={step.shortcut} /> : null}
              </p>
            ) : null}
            <p className="seo-steps__text">
              <InlineText text={step.text} />
            </p>
            {step.tip ? (
              <p className="seo-steps__tip">
                <span className="font-semibold text-[var(--foreground)]">Tip: </span>
                <InlineText text={step.tip} />
              </p>
            ) : null}
            {step.image !== undefined && images[step.image] ? (
              <ImageFigure image={images[step.image]} className="mt-4" />
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ShortcutTable({ rows, appName }: { rows: { action: string; keys: string }[]; appName: string }) {
  if (rows.length === 0) return null;
  return (
    <div className="seo-table-wrap">
      <table className="seo-table">
        <caption className="sr-only">{appName} keyboard shortcuts on Mac</caption>
        <thead>
          <tr>
            <th scope="col">To do this</th>
            <th scope="col">Press</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.action}>
              <td>{r.action}</td>
              <td>
                <Kbd keys={r.keys} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Troubleshooting({ items }: { items: { problem: string; fix: string }[] }) {
  if (items.length === 0) return null;
  return (
    <dl className="seo-trouble">
      {items.map((t) => (
        <div key={t.problem}>
          <dt>{t.problem}</dt>
          <dd>
            <InlineText text={t.fix} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
