import { EditorialIndexRow } from "@/components/editorial/EditorialIndexRow";
import {
  getAllComparisons,
  getComparisonBySlug,
  type ComparisonPage,
} from "@/lib/compare";
import { formatBlogDateLong } from "@/lib/blog/format";

export function CompareRelatedLinks({ page }: { page: ComparisonPage }) {
  const related = page.relatedSlugs
    .map((slug) => getComparisonBySlug(slug))
    .filter(Boolean) as ComparisonPage[];

  const others = getAllComparisons()
    .filter((c) => c.slug !== page.slug && !page.relatedSlugs.includes(c.slug))
    .slice(0, 2);

  const links = [...related, ...others].slice(0, 3);

  if (links.length === 0) return null;

  return (
    <section className="mx-auto mt-16 w-full max-w-4xl px-6">
      <h2 className="font-display text-lg font-semibold tracking-tight text-[var(--foreground)]">
        More comparisons
      </h2>
      <div className="mt-2 divide-y divide-[var(--border)]">
        {links.map((item) => {
          const date = item.updatedAt ?? item.publishedAt;
          return (
            <EditorialIndexRow
              key={item.slug}
              href={`/compare/${item.slug}`}
              kicker="Comparison"
              title={item.title}
              description={item.description}
              cta="Read comparison"
              meta={
                <>
                  <time dateTime={date}>{formatBlogDateLong(date)}</time>
                  <p className="mt-2">{item.competitorName}</p>
                </>
              }
            />
          );
        })}
      </div>
    </section>
  );
}
