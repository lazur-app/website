import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmailGateProvider } from "@/components/free-tools/EmailGate";
import { ToolAnalytics } from "@/components/free-tools/ToolAnalytics";
import { EMBEDDABLE } from "@/lib/free-tools/embeddable";
import { toolOrigin } from "@/lib/free-tools/host";
import { freeToolBySubdomain } from "@/lib/free-tools/registry";
import { renderWidget } from "../widgets";

/**
 * <tool>.lazur.app/embed: just the tool, for other sites to put in an iframe (see EmbedCode on the
 * tool page). Not indexed, canonical to the tool's home, with a credit link back to it.
 */
type Props = { params: Promise<{ tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = freeToolBySubdomain((await params).tool);
  if (!tool) return {};
  return { title: `${tool.name} | Lazur`, robots: { index: false, follow: true }, alternates: { canonical: toolOrigin(tool.subdomain) } };
}

export default async function EmbedPage({ params }: Props) {
  const tool = freeToolBySubdomain((await params).tool);
  if (!tool || !EMBEDDABLE.has(tool.subdomain)) notFound();
  return (
    <main className="min-h-screen bg-[var(--background)] p-3 sm:p-4">
      <ToolAnalytics tool={tool.subdomain} category={tool.category} kind="browser" embedded />
      <EmailGateProvider tool={tool.subdomain}>{renderWidget(tool.subdomain)}</EmailGateProvider>
      <p className="mt-3 text-center text-[13px] text-[var(--foreground-muted)]">
        <a href={toolOrigin(tool.subdomain)} target="_blank" rel="noopener" className="underline underline-offset-2">
          {tool.name}
        </a>{" "}
        · free tool by{" "}
        <a href="https://www.lazur.app" target="_blank" rel="noopener" className="font-semibold underline underline-offset-2">
          Lazur
        </a>
      </p>
    </main>
  );
}
