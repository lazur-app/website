import type { SeoBlock, SeoPage } from "@/lib/seo-pages/types";
import { ImageFigure } from "./ImageFigure";
import { InlineText } from "./InlineText";
import { Callout, LazurCallout } from "./Primitives";
import { BarChart, StatStrip } from "./StatStrip";

function anchor(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Renders the body blocks of any programmatic page. */
export function SeoBlocks({ blocks, page, lazurNudge }: { blocks: SeoBlock[]; page: SeoPage; lazurNudge?: string }) {
  return (
    <div className="seo-prose">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "paragraph":
            return (
              <p key={i}>
                <InlineText text={b.text} />
              </p>
            );
          case "heading":
            return b.level === 3 ? (
              <h3 key={i} id={anchor(b.text)} className="scroll-mt-28">
                {b.text}
              </h3>
            ) : (
              <h2 key={i} id={anchor(b.text)} className="scroll-mt-28">
                {b.text}
              </h2>
            );
          case "list": {
            const items = b.items.map((it) => (
              <li key={it}>
                <InlineText text={it} />
              </li>
            ));
            return b.ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
          }
          case "callout":
            return <Callout key={i} tone={b.tone} title={b.title} text={b.text} />;
          case "image":
            return page.images[b.index] ? <ImageFigure key={i} image={page.images[b.index]} /> : null;
          case "table":
            return (
              <div key={i} className="seo-table-wrap">
                <table className="seo-table">
                  {b.caption ? <caption className="seo-table__caption">{b.caption}</caption> : null}
                  <thead>
                    <tr>
                      {b.headers.map((h) => (
                        <th key={h} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri}>
                        {r.map((c, ci) => (
                          <td key={ci}>
                            <InlineText text={c} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "stats":
            return <StatStrip key={i} stats={page.stats} />;
          case "chart":
            return page.chart ? <BarChart key={i} chart={page.chart} /> : null;
          case "lazur":
            return lazurNudge ? <LazurCallout key={i} text={lazurNudge} /> : null;
        }
      })}
    </div>
  );
}
