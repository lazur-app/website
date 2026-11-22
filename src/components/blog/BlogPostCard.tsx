import { ContentImage } from "@/components/seo-pages/ContentImage";
import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { formatBlogDateLong } from "@/lib/blog/format";
import type { BlogPost } from "@/lib/blog/types";
import type { AnalyticsProps } from "@/lib/productAnalytics";

/** With `eventProps`, the click is tracked as `event` (the blog index uses this; post pages track via ContentAnalytics). */
export function BlogPostCard({ post, event, eventProps }: { post: BlogPost; event?: string; eventProps?: AnalyticsProps }) {
  const CardLink = eventProps ? TrackedLink : Link;
  return (
    <CardLink
      href={`/blog/${post.slug}`}
      {...(eventProps ? { event, eventProps } : {})}
      className="group grid gap-4 rounded-[20px] border-[1.5px] border-[#1c1917] bg-white p-4 shadow-[0_2px_0_rgba(28,25,23,0.9),0_10px_24px_-8px_rgba(28,25,23,0.18)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(28,25,23,0.9),0_16px_30px_-10px_rgba(28,25,23,0.24)] sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6 sm:p-6"
    >
      <div className="text-[13px] leading-relaxed text-[var(--foreground-muted)]">
        {post.heroImage ? (
          <ContentImage
            src={post.heroImage.url}
            alt={post.heroImage.alt}
            width={post.heroImage.width}
            height={post.heroImage.height}
            className="mb-4 aspect-[16/10] w-full rounded-[12px] border-[1.5px] border-[#1c1917] object-cover"
          />
        ) : null}
        <time dateTime={post.publishedAt}>{formatBlogDateLong(post.publishedAt)}</time>
        <p className="mt-2 text-[13px] text-[var(--foreground-muted)]">{post.author}</p>
      </div>
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#5b4bd6]">
          {post.category}
        </p>
        <h2 className="mt-2 text-[1.35rem] font-bold leading-[1.15] tracking-[-0.035em] text-[var(--foreground)] md:text-[1.6rem]">
          {post.title}
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--foreground-muted)] md:text-[16px]">
          {post.description}
        </p>
        <span className="mt-4 inline-block text-[14px] font-bold text-[var(--foreground)] underline decoration-[var(--foreground)]/25 underline-offset-4 group-hover:decoration-[var(--foreground)]">
          Read more
          <span className="ml-1 transition-transform group-hover:translate-x-0.5" aria-hidden>
            →
          </span>
        </span>
      </div>
    </CardLink>
  );
}
