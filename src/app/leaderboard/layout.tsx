import { noindexMetadata } from "@/lib/seo/noindex";

export const metadata = noindexMetadata;

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
