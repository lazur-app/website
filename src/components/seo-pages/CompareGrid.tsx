import type { CompareProduct } from "@/lib/seo-pages/types";
import { InlineText } from "./InlineText";

/** Feature table for any number of products. Lazur's column is tinted, never bolded into a "winner". */
export function CompareGrid({ products, rows }: { products: CompareProduct[]; rows: { feature: string; values: string[] }[] }) {
  return (
    <div className="seo-table-wrap">
      <table className="seo-table seo-table--compare">
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Feature</span>
            </th>
            {products.map((p) => (
              <th key={p.slug} scope="col" className={p.isLazur ? "is-lazur" : ""}>
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.feature}>
              <th scope="row">{r.feature}</th>
              {products.map((p, i) => (
                <td key={p.slug} className={p.isLazur ? "is-lazur" : ""}>
                  <InlineText text={r.values[i] ?? ""} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProductCards({ products }: { products: CompareProduct[] }) {
  return (
    <div className="seo-products">
      {products.map((p) => (
        <article key={p.slug} className={`seo-card ${p.isLazur ? "seo-card--lazur" : ""}`}>
          <p className="seo-label">{p.isLazur ? "Our app" : "Alternative"}</p>
          <h3 className="mt-1 font-display text-[1.2rem] font-semibold tracking-[-0.02em]">{p.name}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-[#3d3834]">
            <InlineText text={p.summary} />
          </p>
          <dl className="mt-4 space-y-2 text-[14px]">
            <div>
              <dt className="seo-label !text-[10px]">Price</dt>
              <dd className="mt-0.5 text-[var(--foreground)]">
                {p.pricing}
                {p.pricingSourceUrl ? (
                  <a className="seo-link ml-1 text-[12px]" href={p.pricingSourceUrl} rel="noopener noreferrer nofollow" target="_blank">
                    (source{p.pricingCheckedAt ? `, ${p.pricingCheckedAt}` : ""})
                  </a>
                ) : null}
              </dd>
            </div>
            <div>
              <dt className="seo-label !text-[10px]">Runs on</dt>
              <dd className="mt-0.5 text-[var(--foreground)]">{p.platforms}</dd>
            </div>
          </dl>
          {p.bestFor.length > 0 ? (
            <>
              <p className="seo-label mt-4 !text-[10px]">Pick it if</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-[#3d3834]">
                {p.bestFor.map((b) => (
                  <li key={b}>
                    <InlineText text={b} />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </article>
      ))}
    </div>
  );
}
