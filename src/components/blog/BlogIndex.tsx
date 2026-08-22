"use client";

import { useMemo, useState } from "react";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import type { BlogPost } from "@/lib/blog/types";

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
      <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
        Blog
      </p>
      <h1 className="mt-2 max-w-2xl font-display text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--foreground)] md:text-[3.25rem]">
        Voice writing, explained.
      </h1>
      <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-[#5c564f] md:text-[17px]">
        Comparisons, guides, and product notes for people who write by voice -
        and want the output to sound like they typed it.
      </p>

      <div className="mt-8 overflow-x-auto pb-1">
        <div
          className="inline-flex items-center gap-1 rounded-full bg-[var(--foreground)] p-1.5"
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
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-[13px] font-medium whitespace-nowrap transition-colors ${
                  selected
                    ? "bg-white text-[var(--foreground)]"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 divide-y divide-[var(--border)]">
          {filtered.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-[15px] text-[var(--foreground-muted)]">
          No posts in this category yet.
        </p>
      )}
    </div>
  );
}
