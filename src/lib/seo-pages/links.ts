import "server-only";

import { getAllPosts } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog/types";
import { APPS, ROLES } from "@/lib/content/sources.mjs";
import {
  getAlternativesPages,
  getAppPages,
  getComparePages,
  getHowTos,
  getProblemPages,
  getRoleAppPages,
  getRolePages,
} from "./load";
import { HUB_PATHS, seoPath } from "./routes";
import type { SeoLink, SeoPage } from "./types";

/**
 * Internal linking. Every page links across types (app ↔ how-to ↔ role ↔ role × app ↔ compare ↔
 * blog), always to its hub, and only to pages that exist. Mirrors SRCo's links.ts idea: links come
 * from the data graph, never from the model, so a generated page cannot link to a 404.
 */

const appName = (slug: string) => APPS.find((a) => a.slug === slug)?.name ?? slug;
const roleName = (slug: string) => ROLES.find((r) => r.slug === slug)?.name ?? slug;

function toLink(page: SeoPage): SeoLink {
  const kicker =
    page.type === "howto"
      ? `How-to · ${page.appName}`
      : page.type === "app"
        ? `Lazur in ${page.appName}`
        : page.type === "role"
          ? `For ${page.roleName.toLowerCase()}`
          : page.type === "role-app"
            ? `${page.appName} for ${page.roleName.toLowerCase()}`
            : page.type === "problem"
              ? `Problem · ${page.roleName}`
            : page.type === "alternatives"
              ? "Alternatives"
              : "Comparison";
  return { href: seoPath(page), title: page.title, description: page.description, kicker };
}

function postLink(post: BlogPost): SeoLink {
  return { href: `/blog/${post.slug}`, title: post.title, description: post.description, kicker: `Blog · ${post.category}` };
}

function postsMentioning(words: string[], limit: number, exclude?: string): SeoLink[] {
  const needles = words.map((w) => w.toLowerCase()).filter(Boolean);
  return getAllPosts()
    .filter((p) => p.slug !== exclude)
    .map((post) => {
      const hay = `${post.title} ${post.description} ${post.targetKeyword ?? ""}`.toLowerCase();
      const score = needles.reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0);
      return { post, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => postLink(x.post));
}

function uniq(links: SeoLink[], selfHref: string, limit: number): SeoLink[] {
  const seen = new Set([selfHref]);
  const out: SeoLink[] = [];
  for (const l of links) {
    if (seen.has(l.href)) continue;
    seen.add(l.href);
    out.push(l);
    if (out.length >= limit) break;
  }
  return out;
}

export type RelatedGroups = { title: string; links: SeoLink[]; hub?: { href: string; label: string } }[];

export function relatedFor(page: SeoPage): RelatedGroups {
  const self = seoPath(page);
  const howtos = getHowTos();
  const apps = getAppPages();
  const roles = getRolePages();
  const roleApps = getRoleAppPages();
  const compares = [...getComparePages(), ...getAlternativesPages()];
  const problems = getProblemPages();
  const groups: RelatedGroups = [];

  if (page.type === "problem") {
    const rolePage = roles.find((r) => r.role === page.role);
    groups.push({
      title: `More problems ${page.roleName.toLowerCase()} run into`,
      links: uniq(problems.filter((p) => p.role === page.role).map(toLink), self, 6),
      hub: { href: `/for/${page.role}/problems`, label: `All ${page.roleName.toLowerCase()} problems` },
    });
    groups.push({
      title: `Lazur for ${page.roleName.toLowerCase()}`,
      links: uniq(
        [...(rolePage ? [toLink(rolePage)] : []), ...roleApps.filter((r) => r.role === page.role).map(toLink), ...apps.filter((a) => page.apps.includes(a.app)).map(toLink)],
        self,
        6,
      ),
      hub: { href: HUB_PATHS.role, label: "All roles" },
    });
    groups.push({
      title: "Guides that help",
      links: uniq([...howtos.filter((h) => page.apps.includes(h.app)).map(toLink), ...postsMentioning([page.roleSingular, page.roleName, ...page.problem.split(" ").filter((w) => w.length > 4)], 4)], self, 6),
      hub: { href: HUB_PATHS.howto, label: "All how-to guides" },
    });
    groups.push({ title: "Other jobs, same kind of problem", links: uniq(problems.filter((p) => p.role !== page.role).map(toLink), self, 4) });
  }

  if (page.type === "howto") {
    const app = apps.find((a) => a.app === page.app);
    groups.push({
      title: `More ${page.appName} how-tos`,
      links: uniq(howtos.filter((h) => h.app === page.app).map(toLink), self, 6),
      hub: { href: HUB_PATHS.howto, label: "All how-to guides" },
    });
    groups.push({
      title: `${page.appName} with Lazur`,
      links: uniq(
        [
          ...(app ? [toLink(app)] : []),
          ...roleApps.filter((r) => r.app === page.app).map(toLink),
          ...roles.filter((r) => r.apps.includes(page.app)).map(toLink),
        ],
        self,
        6,
      ),
      hub: { href: HUB_PATHS.app, label: "All apps" },
    });
    groups.push({
      title: "Further reading",
      links: uniq([...postsMentioning([page.appName, "learn", "mac app"], 3), ...compares.slice(0, 2).map(toLink)], self, 4),
    });
  }

  if (page.type === "app") {
    groups.push({
      title: `How to do it in ${page.appName}`,
      links: uniq(howtos.filter((h) => h.app === page.app).map(toLink), self, 8),
      hub: { href: HUB_PATHS.howto, label: "All how-to guides" },
    });
    groups.push({
      title: `Who uses ${page.appName} with Lazur`,
      links: uniq(
        [...roleApps.filter((r) => r.app === page.app).map(toLink), ...roles.filter((r) => r.apps.includes(page.app)).map(toLink)],
        self,
        6,
      ),
      hub: { href: HUB_PATHS.role, label: "All roles" },
    });
    groups.push({
      title: "Other apps",
      links: uniq(apps.filter((a) => a.appCategory === page.appCategory).concat(apps).map(toLink), self, 6),
      hub: { href: HUB_PATHS.app, label: "All apps" },
    });
    groups.push({ title: "Further reading", links: uniq([...postsMentioning([page.appName], 3), ...compares.slice(0, 1).map(toLink)], self, 4) });
  }

  if (page.type === "role") {
    groups.push({
      title: `Problems ${page.roleName.toLowerCase()} run into, and fixes`,
      links: uniq(problems.filter((p) => p.role === page.role).map(toLink), self, 8),
      hub: { href: `/for/${page.role}/problems`, label: "All of them" },
    });
    groups.push({
      title: `Lazur for ${page.roleName.toLowerCase()}, app by app`,
      links: uniq(roleApps.filter((r) => r.role === page.role).map(toLink), self, 8),
    });
    groups.push({
      title: "The apps in this job",
      links: uniq(
        [...apps.filter((a) => page.apps.includes(a.app)).map(toLink), ...howtos.filter((h) => page.apps.includes(h.app)).map(toLink)],
        self,
        6,
      ),
      hub: { href: HUB_PATHS.app, label: "All apps" },
    });
    groups.push({
      title: "Other roles",
      links: uniq(roles.map(toLink), self, 6),
      hub: { href: HUB_PATHS.role, label: "All roles" },
    });
    groups.push({ title: "Further reading", links: uniq(postsMentioning([page.roleSingular, page.roleName], 3), self, 3) });
  }

  if (page.type === "role-app") {
    const rolePage = roles.find((r) => r.role === page.role);
    const appPage = apps.find((a) => a.app === page.app);
    groups.push({
      title: "Start here",
      links: uniq([...(rolePage ? [toLink(rolePage)] : []), ...(appPage ? [toLink(appPage)] : [])], self, 2),
    });
    groups.push({
      title: `Problems ${page.roleName.toLowerCase()} run into`,
      links: uniq(problems.filter((p) => p.role === page.role).map(toLink), self, 4),
      hub: { href: `/for/${page.role}/problems`, label: "All of them" },
    });
    groups.push({
      title: `${page.appName} how-tos`,
      links: uniq(howtos.filter((h) => h.app === page.app).map(toLink), self, 6),
      hub: { href: HUB_PATHS.howto, label: "All how-to guides" },
    });
    groups.push({
      title: `More for ${page.roleName.toLowerCase()}`,
      links: uniq(
        [...roleApps.filter((r) => r.role === page.role).map(toLink), ...roleApps.filter((r) => r.app === page.app).map(toLink)],
        self,
        6,
      ),
      hub: { href: `/for/${page.role}`, label: `Lazur for ${roleName(page.role).toLowerCase()}` },
    });
  }

  if (page.type === "compare" || page.type === "alternatives") {
    groups.push({
      title: "More comparisons",
      links: uniq(compares.map(toLink), self, 6),
      hub: { href: HUB_PATHS.compare, label: "All comparisons" },
    });
    groups.push({
      title: "See Lazur in your apps",
      links: uniq(apps.map(toLink), self, 4),
      hub: { href: HUB_PATHS.app, label: "All apps" },
    });
    groups.push({
      title: "Further reading",
      links: uniq(postsMentioning(page.products.map((p) => p.name).concat(["alternative", "vs"]), 4), self, 4),
    });
  }

  return groups.filter((g) => g.links.length > 0);
}

/** Cross-type links for a markdown blog post (blog posts are not SeoPage, but get the same grid). */
export function relatedForPost(post: BlogPost): RelatedGroups {
  const text = `${post.title} ${post.description} ${post.targetKeyword ?? ""} ${post.body.slice(0, 4000)}`.toLowerCase();
  const apps = getAppPages().filter((a) => text.includes(a.appName.toLowerCase()));
  const roles = getRolePages().filter((r) => text.includes(r.roleSingular.toLowerCase()));
  const problems = getProblemPages().filter((p) => roles.some((r) => r.role === p.role));
  const howtos = getHowTos().filter((h) => apps.some((a) => a.app === h.app));
  const compares = [...getComparePages(), ...getAlternativesPages()].filter((c) =>
    c.products.some((p) => !p.isLazur && text.includes(p.name.toLowerCase())),
  );
  const self = `/blog/${post.slug}`;
  const groups: RelatedGroups = [
    { title: "Lazur in these apps", links: uniq(apps.map(toLink), self, 4), hub: { href: HUB_PATHS.app, label: "All apps" } },
    { title: "How-to guides", links: uniq(howtos.map(toLink), self, 4), hub: { href: HUB_PATHS.howto, label: "All how-to guides" } },
    { title: "For your role", links: uniq(roles.map(toLink), self, 3), hub: { href: HUB_PATHS.role, label: "All roles" } },
    { title: "Problems and fixes", links: uniq(problems.map(toLink), self, 4) },
    { title: "Comparisons", links: uniq(compares.map(toLink), self, 3), hub: { href: HUB_PATHS.compare, label: "All comparisons" } },
  ];
  return groups.filter((g) => g.links.length > 0);
}

export function breadcrumbsFor(page: SeoPage): { href: string; label: string }[] {
  const home = { href: "/", label: "Home" };
  switch (page.type) {
    case "howto":
      return [home, { href: "/how-to", label: "How-to" }, { href: `/how-to/app/${page.app}`, label: page.appName }, { href: seoPath(page), label: page.task }];
    case "app":
      return [home, { href: "/apps", label: "Apps" }, { href: seoPath(page), label: page.appName }];
    case "role":
      return [home, { href: "/for", label: "Roles" }, { href: seoPath(page), label: page.roleName }];
    case "role-app":
      return [
        home,
        { href: "/for", label: "Roles" },
        { href: `/for/${page.role}`, label: page.roleName },
        { href: seoPath(page), label: appName(page.app) },
      ];
    case "problem":
      return [
        home,
        { href: "/for", label: "Roles" },
        { href: `/for/${page.role}`, label: page.roleName },
        { href: `/for/${page.role}/problems`, label: "Problems" },
        { href: seoPath(page), label: page.problem },
      ];
    case "compare":
      return [home, { href: "/compare", label: "Compare" }, { href: seoPath(page), label: page.title }];
    case "alternatives":
      return [home, { href: "/alternatives", label: "Alternatives" }, { href: seoPath(page), label: page.title }];
  }
}
