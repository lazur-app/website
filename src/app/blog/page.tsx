import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/seo/constants";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { getAllPosts, getBlogCategories } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Lazur",
  description:
    "Guides, comparisons, and product updates on personal AI assistants, context-aware writing, voice actions, and getting more done with Lazur.",
  openGraph: {
    images: [OG_IMAGE],
    title: "Blog | Lazur",
    description:
      "Guides, comparisons, and product updates on personal AI assistants, context-aware writing, voice actions, and getting more done with Lazur.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getBlogCategories();

  return (
    <MarketingPageShell>
      <Navbar />

      <main className="relative mx-auto w-full max-w-5xl overflow-x-clip px-4 pb-24 pt-32 sm:px-6 md:pt-40">
        <BlogIndex posts={posts} categories={categories} />
      </main>

      <Footer />
    </MarketingPageShell>
  );
}
