import type { Metadata } from "next";
import { HubCard, HubHeader, HubSection, SeoPageFrame } from "@/components/seo-pages";
import { CtaBand } from "@/components/seo-pages/Primitives";
import { getProblemPages, getRoleAppPages, getRolePages } from "@/lib/seo-pages/load";
import { breadcrumbSchema } from "@/lib/seo-pages/schema";
import { SITE_URL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Lazur for your job: founders, lawyers, developers, students and more | Lazur",
  description: "How people in different jobs use Lazur on the Mac: what they ask, in which apps, and what it does for them.",
  alternates: { canonical: `${SITE_URL}/for` },
};

export default function RolesHub() {
  const roles = getRolePages();
  const roleApps = getRoleAppPages();
  const problems = getProblemPages();
  const crumbs = [
    { href: "/", label: "Home" },
    { href: "/for", label: "Roles" },
  ];
  return (
    <SeoPageFrame schema={[breadcrumbSchema(crumbs)]}>
      <HubHeader crumbs={crumbs} kicker="Roles" title="Lazur for the work you do" intro="Same notch, different day. See what people in your job ask Lazur, app by app." />
      <div className="seo-wrap">
        <HubSection title="By role">
          {roles.map((r) => (
            <HubCard key={r.slug} image={r.images?.[0]} href={`/for/${r.slug}`} kicker={`For ${r.roleName.toLowerCase()}`} title={r.title} description={r.description} />
          ))}
        </HubSection>
        {problems.length > 0 ? (
          <HubSection title="Problems and fixes">
            {problems.map((p) => (
              <HubCard key={`${p.role}/${p.slug}`} image={p.images?.[0]} href={`/for/${p.role}/problems/${p.slug}`} kicker={`${p.roleName} · problem`} title={p.title} />
            ))}
          </HubSection>
        ) : null}
        {roleApps.length > 0 ? (
          <HubSection title="By role and app">
            {roleApps.map((r) => (
              <HubCard key={`${r.role}/${r.app}`} image={r.images?.[0]} href={`/for/${r.role}/${r.app}`} kicker={`${r.appName} · ${r.roleName}`} title={r.title} />
            ))}
          </HubSection>
        ) : null}
      </div>
      <div className="px-4 sm:px-6">
        <CtaBand source="hub-roles" />
      </div>
    </SeoPageFrame>
  );
}
