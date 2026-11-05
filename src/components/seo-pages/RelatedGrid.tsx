import Link from "next/link";
import type { RelatedGroups } from "@/lib/seo-pages/links";

/** Related pages across types, grouped, each group with a link to its hub. */
export function RelatedGrid({ groups }: { groups: RelatedGroups }) {
  if (groups.length === 0) return null;
  return (
    <section className="seo-related" aria-labelledby="related">
      <h2 id="related" className="seo-h2">
        Keep going
      </h2>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.title}>
            <h3 className="seo-label !text-[12px]">{g.title}</h3>
            <ul className="mt-3 space-y-2">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="seo-related__card">
                    <span className="seo-related__kicker">{l.kicker}</span>
                    <span className="seo-related__title">{l.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {g.hub ? (
              <Link href={g.hub.href} className="mt-3 inline-block text-[14px] font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
                {g.hub.label} →
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
