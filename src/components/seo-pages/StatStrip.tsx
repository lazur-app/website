"use client";

import { useEffect, useRef, useState } from "react";
import type { SeoChart, SeoStat } from "@/lib/seo-pages/types";

/** Runs once when the element scrolls into view (immediately for reduced motion or no observer). */
function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setSeen(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen };
}

/** "1,048,576" / "65%" / "237+" / "$12.50" / "2.93x": counts up the number, keeps the rest. */
function AnimatedValue({ value, run }: { value: string; run: boolean }) {
  const m = value.match(/^([^0-9]*)([0-9][0-9,]*\.?[0-9]*)(.*)$/);
  const target = m ? Number(m[2].replace(/,/g, "")) : NaN;
  const decimals = m && m[2].includes(".") ? m[2].split(".")[1].length : 0;
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!run || !m || !Number.isFinite(target)) return;
    const start = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const n = target * eased;
      const txt = decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-US");
      setShown(`${m[1]}${t >= 1 ? m[2] : txt}${m[3]}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);
  return <>{shown}</>;
}

/** 2 to 4 sourced numbers as stat cards with counters. Each links to where it came from. */
export function StatStrip({ stats }: { stats: SeoStat[] }) {
  const { ref, seen } = useInView<HTMLDivElement>();
  if (stats.length === 0) return null;
  return (
    <div ref={ref} className="seo-stats" role="list">
      {stats.slice(0, 4).map((s) => (
        <div key={s.label} className="seo-stats__item" role="listitem">
          <p className="seo-stats__value">
            <AnimatedValue value={s.value} run={seen} />
          </p>
          <p className="seo-stats__label">{s.label}</p>
          {s.sourceUrl ? (
            <a className="seo-stats__src" href={s.sourceUrl} rel="noopener noreferrer nofollow" target="_blank">
              {s.sourceTitle ?? "Source"} ↗
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** Horizontal bar chart in HTML/CSS; bars grow in when scrolled into view; a table for screen readers. */
export function BarChart({ chart }: { chart: SeoChart }) {
  const { ref, seen } = useInView<HTMLElement>();
  const max = Math.max(...chart.bars.map((b) => b.value), 1);
  const fmt = (v: number) => `${Number.isInteger(v) ? v.toLocaleString("en-US") : v.toFixed(1)}${chart.unit ? ` ${chart.unit}` : ""}`;
  let host = "";
  try {
    host = chart.sourceUrl ? new URL(chart.sourceUrl).hostname.replace(/^www\./, "") : "";
  } catch {
    host = "";
  }
  return (
    <figure ref={ref} className="seo-chart">
      <figcaption className="seo-chart__title">{chart.title}</figcaption>
      <div className="seo-chart__bars" aria-hidden>
        {chart.bars.map((b, i) => (
          <div key={b.label} className="seo-chart__row">
            <span className="seo-chart__label">{b.label}</span>
            <span className="seo-chart__track">
              <span
                className={`seo-chart__bar ${b.highlight ? "seo-chart__bar--hi" : ""}`}
                style={{ width: seen ? `${Math.max(4, (b.value / max) * 100)}%` : "0%", transitionDelay: `${i * 90}ms` }}
              />
            </span>
            <span className="seo-chart__value">{fmt(b.value)}</span>
          </div>
        ))}
      </div>
      <div className="sr-only">
        <table>
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
      </div>
      {chart.note || chart.sourceUrl ? (
        <p className="seo-chart__note">
          {chart.note}
          {chart.sourceUrl ? (
            <>
              {chart.note ? " " : ""}
              Source:{" "}
              <a href={chart.sourceUrl} rel="noopener noreferrer nofollow" target="_blank">
                {chart.sourceTitle ?? host}
              </a>
            </>
          ) : null}
        </p>
      ) : null}
    </figure>
  );
}
