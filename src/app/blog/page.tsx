import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { getAllPosts, getBlogCategories } from "@/lib/blog";

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

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getBlogCategories();

  return (
    <MarketingPageShell>
      <Navbar />

      <main className="relative mx-auto w-full max-w-4xl px-6 pb-20 pt-24 md:px-8 md:pt-28">
        <BlogIndex posts={posts} categories={categories} />
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
