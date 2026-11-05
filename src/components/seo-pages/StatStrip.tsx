import type { SeoChart, SeoStat } from "@/lib/seo-pages/types";

/** 2 to 4 sourced numbers in a row. Each links to where it came from. */
export function StatStrip({ stats }: { stats: SeoStat[] }) {
  if (stats.length === 0) return null;
  return (
    <div className="seo-stats" role="list">
      {stats.slice(0, 4).map((s) => (
        <div key={s.label} className="seo-stats__item" role="listitem">
          <p className="seo-stats__value">{s.value}</p>
          <p className="seo-stats__label">{s.label}</p>
          {s.sourceUrl ? (
            <a className="seo-stats__src" href={s.sourceUrl} rel="noopener noreferrer nofollow" target="_blank">
              {s.sourceTitle ?? "Source"}
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** Horizontal bar chart in plain HTML/CSS: no chart library, readable without JS, a table for screen readers. */
export function BarChart({ chart }: { chart: SeoChart }) {
  const max = Math.max(...chart.bars.map((b) => b.value), 1);
  const fmt = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)}${chart.unit ? ` ${chart.unit}` : ""}`;
  return (
    <figure className="seo-chart">
      <figcaption className="seo-chart__title">{chart.title}</figcaption>
      <div className="seo-chart__bars" aria-hidden>
        {chart.bars.map((b) => (
          <div key={b.label} className="seo-chart__row">
            <span className="seo-chart__label">{b.label}</span>
            <span className="seo-chart__track">
              <span
                className={`seo-chart__bar ${b.highlight ? "seo-chart__bar--hi" : ""}`}
                style={{ width: `${Math.max(4, (b.value / max) * 100)}%` }}
              />
            </span>
            <span className="seo-chart__value">{fmt(b.value)}</span>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>{chart.title}</caption>
        <tbody>
          {chart.bars.map((b) => (
            <tr key={b.label}>
              <th scope="row">{b.label}</th>
              <td>{fmt(b.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {chart.note || chart.sourceUrl ? (
        <p className="seo-chart__note">
          {chart.note}
          {chart.sourceUrl ? (
            <>
              {chart.note ? " " : ""}
              Source:{" "}
              <a href={chart.sourceUrl} rel="noopener noreferrer nofollow" target="_blank">
                {chart.sourceTitle ?? new URL(chart.sourceUrl).hostname}
              </a>
            </>
          ) : null}
        </p>
      ) : null}
    </figure>
  );
}
