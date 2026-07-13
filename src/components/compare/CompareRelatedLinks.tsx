import Link from "next/link";
import {
  getAllComparisons,
  getComparisonBySlug,
  type ComparisonPage,
} from "@/lib/compare";

type CompareRelatedLinksProps = {
  page: ComparisonPage;
};

export function CompareRelatedLinks({ page }: CompareRelatedLinksProps) {
  const related = page.relatedSlugs
    .map((slug) => getComparisonBySlug(slug))
    .filter(Boolean) as ComparisonPage[];

  const others = getAllComparisons()
    .filter(
      (c) => c.slug !== page.slug && !page.relatedSlugs.includes(c.slug),
    )
    .slice(0, 2);

  const links = [...related, ...others].slice(0, 4);

  return (
    <aside className="mt-10 border-t border-[var(--border)] pt-8">
      <h2 className="font-display text-lg font-semibold tracking-tight text-[var(--foreground)]">
        More comparisons
      </h2>
      <ul className="mt-4 space-y-2">
        {links.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/compare/${item.slug}`}
              className="text-[14px] font-medium text-[var(--brand-ink)] underline decoration-[var(--brand)]/30 underline-offset-2 transition-colors hover:text-[var(--brand)]"
            >
              {item.title}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/blog/best-ai-dictation-apps-2026"
            className="text-[14px] font-medium text-[var(--brand-ink)] underline decoration-[var(--brand)]/30 underline-offset-2 transition-colors hover:text-[var(--brand)]"
          >
            Best AI dictation apps in 2026
          </Link>
        </li>
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/download" className="btn-dark px-5 py-2 text-[13px]">
          Download for Mac
        </Link>
        <Link
          href="/pricing"
          className="btn-outline-dark px-5 py-2 text-[13px]"
        >
          View pricing
        </Link>
      </div>
    </aside>
  );
}
