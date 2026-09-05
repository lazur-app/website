import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReferralCapture } from "@/components/ReferralCapture";
import { GraveStone } from "@/components/cemetery/GraveStone";
import { GraveShareButton } from "@/components/cemetery/GraveShareButton";
import {
  CEMETERY_PATH,
  fetchGrave,
  formatRetiredOn,
  formatWords,
} from "@/lib/cemetery";
import { SITE_URL } from "@/lib/seo/constants";

type GraveSlugProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: GraveSlugProps): Promise<Metadata> {
  const { slug } = await params;
  const grave = await fetchGrave(slug).catch(() => null);
  if (!grave) {
    return { title: "Grave not found | Lazur" };
  }

  const title = `${grave.display_name} · Keyboard Cemetery`;
  const description = `${grave.display_name} · ${formatRetiredOn(grave.retired_on)} · ${formatWords(grave.words)}`;
  const canonical = `${SITE_URL}${CEMETERY_PATH}/${grave.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
    },
  };
}

export default async function GravePage({ params }: GraveSlugProps) {
  const { slug } = await params;
  const grave = await fetchGrave(slug).catch(() => null);
  if (!grave) notFound();

  return (
    <div className="cemetery-page relative min-h-screen">
      <ReferralCapture />
      <Navbar />
      <main className="relative mx-auto flex w-full max-w-md flex-col items-center px-6 pb-24 pt-24 md:pt-28">
        <p className="text-[28px] leading-none" aria-hidden>
          ⚰️
        </p>
        <div className="cemetery-yard mt-8 w-full px-8 py-12">
          <GraveStone grave={grave} featured />
        </div>
        <div className="mt-8 flex w-full flex-col gap-2 sm:flex-row">
          <GraveShareButton slug={grave.slug} />
          <Link
            href={CEMETERY_PATH}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-[var(--border-strong)] px-5 py-3 text-[14px] font-medium text-[var(--foreground)]"
          >
            ⚰️
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
