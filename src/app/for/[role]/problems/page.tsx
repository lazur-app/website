import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HubCard, HubHeader, HubSection, SeoPageFrame } from "@/components/seo-pages";
import { ROLES } from "@/lib/content/sources.mjs";
import { getProblemPages } from "@/lib/seo-pages/load";
import { breadcrumbSchema } from "@/lib/seo-pages/schema";
import { SITE_URL } from "@/lib/seo/constants";

type Props = { params: Promise<{ role: string }> };

export function generateStaticParams() {
  const used = new Set(getProblemPages().map((p) => p.role));
  return ROLES.filter((r) => used.has(r.slug)).map((r) => ({ role: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).role;
  const role = ROLES.find((r) => r.slug === slug);
  if (!role) return { title: "Not found | Lazur" };
  return {
    title: `Common problems ${role.name.toLowerCase()} face, and how to fix them | Lazur`,
    description: `The problems ${role.name.toLowerCase()} run into every week, why they happen, and practical fixes, with and without Lazur on the Mac.`,
    alternates: { canonical: `${SITE_URL}/for/${role.slug}/problems` },
  };
}

export default async function RoleProblemsHub({ params }: Props) {
  const slug = (await params).role;
  const role = ROLES.find((r) => r.slug === slug);
  if (!role) notFound();
  const pages = getProblemPages().filter((p) => p.role === role.slug);
  if (pages.length === 0) notFound();
  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/for", label: "Roles" },
    { href: `/for/${role.slug}`, label: role.name },
    { href: `/for/${role.slug}/problems`, label: "Problems" },
  ];
  return (
    <SeoPageFrame schema={[breadcrumbSchema(crumbs)]}>
      <HubHeader crumbs={crumbs} kicker={`${role.name} · problems and fixes`} title={`Common problems ${role.name.toLowerCase()} face, and how to fix them`} intro={`Each page takes one problem ${role.name.toLowerCase()} tell us about, explains why it happens, and gives fixes you can use today.`} />
      <div className="seo-wrap">
        <HubSection title={`${pages.length} problems`} more={{ href: `/for/${role.slug}`, label: `Lazur for ${role.name.toLowerCase()}` }}>
          {pages.map((p) => (
            <HubCard key={p.slug} image={p.images?.[0]} href={`/for/${p.role}/problems/${p.slug}`} kicker={`${p.roleName} · problem`} title={p.title} description={p.description} />
          ))}
        </HubSection>
      </div>
    </SeoPageFrame>
  );
}
