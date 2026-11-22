"use client";

import { useMemo, useState } from "react";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { AccentTitle } from "@/components/seo-pages/AccentTitle";
import { Sticker } from "@/components/landing/Sticker";
import type { BlogPost } from "@/lib/blog/types";
import { track } from "@/lib/productAnalytics";

type BlogIndexProps = {
  posts: BlogPost[];
  categories: string[];
};

export function BlogIndex({ posts, categories }: BlogIndexProps) {
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    if (category === "All") return posts;
    return posts.filter((post) => post.category === category);
  }, [category, posts]);

  return (
    <div>
      <header className="relative text-center">
        <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden>
          <Sticker name="bubble" size={84} rotate={-10} className="absolute left-0 top-0" />
          <Sticker name="mic" size={80} rotate={10} className="absolute right-0 top-16" />
        </div>
        <p className="inline-flex min-h-[28px] items-center rounded-full bg-[#5b4bd6] px-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white">Blog</p>
        <h1 className="mx-auto mt-4 max-w-3xl font-sans text-[clamp(2.4rem,5.4vw,4.6rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[var(--foreground)]">
          <AccentTitle title="Voice writing, explained." accent="explained." />
        </h1>
        <p className="mx-auto mt-6 max-w-[36rem] text-[clamp(1rem,1.4vw,1.12rem)] font-medium leading-snug text-[var(--foreground-muted)]">
          Comparisons, guides, and product notes for people who write by voice, and want the output to sound like they typed it.
        </p>
      </header>

      <div className="-mx-4 mt-12 overflow-x-auto px-4 pb-2">
        <div
          className="mx-auto flex w-max items-center gap-2"
          role="tablist"
          aria-label="Filter posts by category"
        >
          {["All", ...categories].map((item) => {
            const selected = category === item;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  setCategory(item);
                  if (item !== category) {
                    const count = item === "All" ? posts.length : posts.filter((post) => post.category === item).length;
                    track("blog_filter_selected", { category: item, result_count: count });
                  }
                }}
                className={`inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-[#1c1917] px-4 text-[14px] font-bold whitespace-nowrap transition-colors ${
                  selected
                    ? "bg-[#1c1917] text-white"
                    : "bg-white text-[var(--foreground)] shadow-[0_2px_0_rgba(28,25,23,0.9)] hover:bg-black/[0.03]"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mx-auto mt-8 grid max-w-[52rem] gap-6">
          {filtered.map((post, i) => (
            <BlogPostCard
              key={post.slug}
              post={post}
              event="hub_item_clicked"
              eventProps={{ hub: "blog", item: `/blog/${post.slug}`, item_type: "card", category: post.category, filter: category, position: i + 1 }}
            />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-[15px] text-[var(--foreground-muted)]">
          No posts in this category yet.
        </p>
      )}
    </div>
  );
}
