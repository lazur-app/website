"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * The origin that the navbar's links point at. On www it is "" (links stay relative). On a free-tool
 * subdomain (mic-test.lazur.app) the provider sets it to the main site, so "/pricing" goes to
 * www.lazur.app/pricing instead of a page that doesn't exist on the subdomain.
 */
const SiteBaseContext = createContext("");

export const useSiteBase = () => useContext(SiteBaseContext);

export function SiteBaseProvider({ base, children }: { base: string; children: ReactNode }) {
  return <SiteBaseContext.Provider value={base}>{children}</SiteBaseContext.Provider>;
}
