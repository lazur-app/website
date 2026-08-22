import Link from "next/link";
import { formatBlogDateLong } from "@/lib/blog/format";
import type { BlogPost } from "@/lib/blog/types";

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid gap-3 py-10 sm:grid-cols-[13.5rem_minmax(0,1fr)] sm:gap-10"
    >
      <div className="text-[13px] leading-relaxed text-[var(--foreground-muted)] sm:pt-1">
        <time dateTime={post.publishedAt}>{formatBlogDateLong(post.publishedAt)}</time>
        <p className="mt-2 text-[13px] text-[var(--foreground-muted)]">{post.author}</p>
      </div>
      <div>
        <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-faint)]">
          {post.category}
        </p>
        <h2 className="mt-1.5 font-display text-[1.35rem] font-semibold leading-snug tracking-[-0.025em] text-[var(--foreground)] transition-colors group-hover:text-[var(--brand-ink)] md:text-[1.5rem]">
          {post.title}
        </h2>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[#5c564f] md:text-[16px]">
          {post.description}
        </p>
        <span className="mt-4 inline-block text-[14px] font-medium text-[var(--foreground)]">
          Read more
          <span className="ml-1 transition-transform group-hover:translate-x-0.5" aria-hidden>
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
