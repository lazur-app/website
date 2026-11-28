import { FounderSticker } from "@/components/landing/FounderSticker";
import { Sticker } from "@/components/landing/Sticker";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { Navbar } from "@/components/Navbar";
import { SiteBaseProvider } from "@/components/SiteBase";
import { TrackedAnchor } from "@/components/analytics/TrackedLink";
import { AI_TOOLS } from "@/components/free-tools/ai-config";
import { EmailGateProvider } from "@/components/free-tools/EmailGate";
import { LazurLetterProvider } from "@/components/free-tools/Letter";
import { ToolAnalytics, ToolUsage } from "@/components/free-tools/ToolAnalytics";
import { EmbedCode } from "@/components/free-tools/embed";
import { EMBEDDABLE } from "@/lib/free-tools/embeddable";
import { HubCard } from "@/components/seo-pages/Hub";
import { FaqList } from "@/components/seo-pages/Primitives";
import { toolOrigin } from "@/lib/free-tools/host";
import { FREE_TOOLS, freeToolBySubdomain, type FreeTool } from "@/lib/free-tools/registry";
import { SITE_URL } from "@/lib/seo/constants";
import type { ContentFaq, ContentImage, ContentSection } from "@/lib/free-tools/content";
import { ToolArticle } from "./ToolArticle";
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
  claim,
  article,
  pageLinks = [],
  faqItems,
  challenge,
}: {
  tool: FreeTool;
  h1: string;
  intro: string;
  showFaq: boolean;
  jsonLd: Record<string, unknown>[];
  page?: string;
  /** The direct, factual answer under the H1 (from the written content). */
  claim?: string;
  article?: { sections: ContentSection[]; image?: ContentImage };
  /** Links to the tool's other pages ("" = the tool's home page). */
  pageLinks?: { slug: string; label: string }[];
  /** FAQ for this page; defaults to the tool's FAQ. */
  faqItems?: ContentFaq[];
  /** From a shared score link: "A friend got 9.2 CPS. Can you beat it?" */
  challenge?: string;
}) {
  const related = tool.related.map(freeToolBySubdomain).filter((t): t is FreeTool => !!t);
  const widget = renderWidget(tool.subdomain, page);
  const faq = (faqItems ?? tool.faq.filter((f) => f.a).map((f) => ({ q: f.q, a: f.a as string }))).map((f) => ({ question: f.q, answer: f.a }));
  const download = `${SITE_URL}/download?src=tool-${tool.subdomain}`;
  const kind = AI_TOOLS[tool.subdomain] ? "ai" : "browser";

  return (
    <SiteBaseProvider base={SITE_URL}>
      <LazurLetterProvider tool={tool.subdomain} name={tool.name}>
      <EmailGateProvider tool={tool.subdomain}>
      <MarketingPageShell>
        {jsonLd.map((d, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
        ))}
        <ToolAnalytics tool={tool.subdomain} category={tool.category} kind={kind} />
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
              {challenge ? (
                <p className="mx-auto mb-4 inline-flex max-w-[calc(100%-24px)] -rotate-1 items-center gap-2 rounded-[18px] border-[1.5px] border-[#1c1917] bg-[#ffd84d] px-4 py-2 text-left text-[14px] font-bold leading-[1.3] text-[#1c1917] shadow-[0_3px_0_#1c1917] sm:-rotate-2 sm:rounded-full sm:text-[15px]">
                  <Sticker name="crown" size={26} rotate={-8} className="shrink-0" />
                  {challenge}
                </p>
              ) : null}
              <h1 className="seo-h1 mx-auto max-w-4xl">{h1}</h1>
              {claim ? (
                <>
                  <p className="seo-hero__intro mx-auto max-w-[40rem] text-[var(--foreground)]">{claim}</p>
                  <p className="mx-auto mt-2 max-w-[34rem] text-[14px] text-[var(--foreground-muted)]">Don&apos;t worry, we won&apos;t ask you to log in or pay anything before you use this tool.</p>
                </>
              ) : (
                <>
                  <p className="seo-hero__intro mx-auto max-w-[34rem]">Don&apos;t worry, we won&apos;t ask you to log in or pay anything before you use this tool.</p>
                  {/* What the tool does, for search engines and screen readers. */}
                  <p className="sr-only">{intro}</p>
                </>
              )}
            </div>
          </header>

          <div className="pt-12 md:pt-16">
            <div className="seo-wrap">
              <ToolUsage tool={tool.subdomain} kind={kind}>
                {widget}
              </ToolUsage>
            </div>
          </div>

          {article ? <ToolArticle sections={article.sections} image={article.image} /> : null}

          {EMBEDDABLE.has(tool.subdomain) ? (
            <div className="pt-14">
              <div className="seo-col">
                <EmbedCode tool={tool.subdomain} name={tool.name} />
              </div>
            </div>
          ) : null}

          {pageLinks.length > 0 ? (
            <div className="pt-14">
            <nav aria-labelledby="more-pages" className="seo-col">
              <h2 id="more-pages" className="seo-h2">
                More on {tool.name.toLowerCase()}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {pageLinks.map((p) => (
                  <li key={p.slug}>
                    <a href={`/${p.slug}`} className="inline-flex min-h-[40px] items-center rounded-full border-[1.5px] border-[#1c1917]/15 bg-white px-4 text-[14px] text-[var(--foreground-muted)] hover:border-[#1c1917] hover:text-[var(--foreground)]">
                      {p.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            </div>
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
              <TrackedAnchor href={download} target="_blank" rel="noopener" event="cta_clicked" eventProps={{ location: "tool_cta", tool: tool.subdomain, destination: "/download" }} className="mt-7 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#1c1917] px-8 text-[16px] font-bold tracking-[-0.01em] text-white transition-colors hover:bg-black">
                meet my companion
              </TrackedAnchor>
              <FounderSticker who="veer" pose="wave" size={96} className="!absolute -bottom-2 left-4 hidden md:block" />
            </div>
            </div>
          </section>
        </main>
        <Footer base={SITE_URL} />
      </MarketingPageShell>
      </EmailGateProvider>
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
