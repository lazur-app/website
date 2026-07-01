import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { SoftCard } from "@/components/SoftCard";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Lazur",
  description:
    "Guides, comparisons, and product updates on AI dictation, voice writing, and getting more done with Lazur.",
  openGraph: {
    title: "Blog | Lazur",
    description:
      "Guides, comparisons, and product updates on AI dictation, voice writing, and getting more done with Lazur.",
  },
};

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <MarketingPageShell>
      <Navbar />

      <main className="relative mx-auto max-w-4xl px-6 pb-16 pt-24 md:pt-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
            Blog
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-[2.75rem]">
            Voice writing, explained
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--foreground-muted)] md:text-base">
            Comparisons, guides, and ideas for teams who write by voice — and
            want the output to sound like they typed it.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
              <SoftCard interactive className="p-6 md:p-7">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground-faint)]">
                      {post.category}
                    </p>
                    <h2 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-[var(--foreground)] md:text-[1.35rem]">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-[14px] leading-relaxed text-[var(--foreground-muted)] md:text-[15px]">
                      {post.description}
                    </p>
                  </div>
                  <div className="shrink-0 text-[12px] text-[var(--foreground-faint)] md:text-right">
                    <p>{formatDate(post.publishedAt)}</p>
                    <p className="mt-1">{post.readingTimeMinutes} min read</p>
                  </div>
                </div>
              </SoftCard>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
