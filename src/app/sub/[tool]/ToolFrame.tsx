import { FounderSticker } from "@/components/landing/FounderSticker";
import { Sticker } from "@/components/landing/Sticker";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { Navbar } from "@/components/Navbar";
import { SiteBaseProvider } from "@/components/SiteBase";
import { LazurLetterProvider } from "@/components/free-tools/Letter";
import { HubCard } from "@/components/seo-pages/Hub";
import { FaqList } from "@/components/seo-pages/Primitives";
import { toolOrigin } from "@/lib/free-tools/host";
import { FREE_TOOLS, freeToolBySubdomain, type FreeTool } from "@/lib/free-tools/registry";
import { SITE_URL } from "@/lib/seo/constants";
import { renderWidget } from "./widgets";

/**
 * Page body for a tool subdomain, built from the same pieces as the rest of lazur.app: the
 * marketing shell and backdrop, the real navbar and footer (their links point at www through
 * SiteBaseProvider), the hub-style header with the hand-drawn underline and chrome stickers.
 * The tool comes first, right under the title.
 */
export function ToolFrame({
  tool,
  h1,
  intro,
  showFaq,
  jsonLd,
  page,
}: {
  tool: FreeTool;
  h1: string;
  intro: string;
  showFaq: boolean;
  jsonLd: Record<string, unknown>[];
  page?: string;
}) {
  const related = tool.related.map(freeToolBySubdomain).filter((t): t is FreeTool => !!t);
  const widget = renderWidget(tool.subdomain, page);
  const faq = tool.faq.filter((f) => f.a).map((f) => ({ question: f.q, answer: f.a as string }));
  const download = `${SITE_URL}/download?src=tool-${tool.subdomain}`;

  return (
    <SiteBaseProvider base={SITE_URL}>
      <LazurLetterProvider tool={tool.subdomain} name={tool.name}>
      <MarketingPageShell>
        {jsonLd.map((d, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
        ))}
        <Navbar />
        <main className="seo-main">
          <header className="seo-hub-head">
            <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden>
              <Sticker name={tool.sticker} size={92} rotate={-10} className="absolute left-[6%] top-[8px]" />
              <Sticker name={tool.sticker2} size={80} rotate={10} className="absolute right-[6%] top-[36px]" />
            </div>
            <div className="relative text-center">
              <div className="mb-2 flex items-center justify-center gap-1 xl:hidden" aria-hidden>
                <Sticker name={tool.sticker} size={56} rotate={-8} />
                <Sticker name={tool.sticker2} size={48} rotate={10} />
              </div>
              <h1 className="seo-h1 mx-auto max-w-4xl">{h1}</h1>
              <p className="seo-hero__intro mx-auto max-w-[34rem]">Don&apos;t worry, we won&apos;t ask you to log in or pay anything before you use this tool.</p>
              {/* What the tool does, for search engines and screen readers. */}
              <p className="sr-only">{intro}</p>
            </div>
          </header>

          <div className="pt-12 md:pt-16">
            <div className="seo-wrap">{widget}</div>
          </div>

          {tool.pages.length > 0 ? (
            <nav aria-label={`More ${tool.name.toLowerCase()} pages`} className="seo-wrap flex flex-wrap justify-center gap-2 !mt-10">
              {tool.pages.map((p) => (
                <a key={p.slug} href={`/${p.slug}`} className="rounded-full border-[1.5px] border-[#1c1917]/15 bg-white px-4 py-2 text-[14px] text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
                  {p.h1}
                </a>
              ))}
            </nav>
          ) : null}

          {showFaq && faq.length > 0 ? (
            <section className="mt-20 border-y-[1.5px] border-[#1c1917] bg-white/80 py-14 md:mt-28 md:py-20" aria-label="Frequently asked questions">
              <div className="seo-col">
                <FaqList items={faq} title={`${tool.name}: questions people ask`} />
              </div>
            </section>
          ) : null}

          {related.length > 0 ? (
            <section className="pt-16 md:pt-24" aria-labelledby="more-tools">
              <div className="seo-wrap">
              <div className="flex items-baseline justify-between gap-4">
                <h2 id="more-tools" className="seo-h2">
                  More free tools
                </h2>
                <a href={`${SITE_URL}/tools`} target="_blank" rel="noopener" className="shrink-0 text-[14px] font-semibold underline decoration-[var(--foreground)]/25 underline-offset-4 hover:decoration-[var(--foreground)]">
                  All free tools
                </a>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {related.map((t) => (
                  <HubCard key={t.subdomain} href={toolOrigin(t.subdomain)} kicker="Free tool" title={t.name} description={t.tagline} aside={<Sticker name={t.sticker} size={44} />} />
                ))}
              </div>
            </div>
            </section>
          ) : null}

          <section className="pt-16 md:pt-24" aria-label="Get Lazur">
            <div className="seo-wrap">
            <div className="relative mx-auto max-w-[760px] overflow-hidden rounded-[28px] border-[1.5px] border-[#1c1917] bg-white px-6 py-10 text-center shadow-[0_2px_0_rgba(28,25,23,0.9),0_18px_40px_-16px_rgba(28,25,23,0.25)] md:px-12 md:py-14">
              <Sticker name="bolt" size={64} rotate={-12} className="absolute -left-2 top-4 hidden sm:block" />
              <Sticker name="heart" size={56} rotate={12} className="absolute -right-1 top-6 hidden sm:block" />
              <h2 className="text-[30px] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--foreground)] md:text-[40px]">want this in every app?</h2>
              <p className="mx-auto mt-3 max-w-[30rem] text-[17px] leading-[1.55] text-[var(--foreground-muted)]">Hold two keys and talk. Lazur types it, answers it and gets it done, wherever your cursor is.</p>
              <a href={download} target="_blank" rel="noopener" className="mt-7 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#1c1917] px-8 text-[16px] font-bold tracking-[-0.01em] text-white transition-colors hover:bg-black">
                meet my companion
              </a>
              <FounderSticker who="veer" pose="wave" size={96} className="!absolute -bottom-2 left-4 hidden md:block" />
            </div>
            </div>
          </section>
        </main>
        <Footer base={SITE_URL} />
      </MarketingPageShell>
      </LazurLetterProvider>
    </SiteBaseProvider>
  );
}

export { FREE_TOOLS };

export function toolJsonLd(tool: FreeTool, url: string, title: string, includeFaq: boolean): Record<string, unknown>[] {
  const app = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (runs in the browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Lazur", url: SITE_URL },
  };
  const out: Record<string, unknown>[] = [app];
  if (includeFaq && tool.faq.some((f) => f.a)) {
    out.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tool.faq.filter((f) => f.a).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a ?? "" } })),
    });
  }
  void title;
  return out;
}
