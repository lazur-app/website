import type { ReactNode } from "react";
import { notFound } from "next/navigation";

/**
 * The lab pages (hero designs, email previews) are kept in the code to work on, but they are not
 * part of the website: anywhere other than `npm run dev` on a laptop, every /lab page is a 404.
 */
export default function LabLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV !== "development") notFound();
  return children;
}
