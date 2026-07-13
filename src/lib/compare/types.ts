import type { BlogBlock } from "@/lib/blog/types";

export type CompareTableRow = {
  feature: string;
  lazur: string;
  competitor: string;
};

export type CompareFaqItem = {
  question: string;
  answer: string;
};

export type ComparisonPage = {
  slug: string;
  title: string;
  description: string;
  competitorName: string;
  targetKeyword: string;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  tldr: string[];
  chooseLazur: string[];
  chooseCompetitor: string[];
  table: CompareTableRow[];
  faq: CompareFaqItem[];
  blocks: BlogBlock[];
  relatedSlugs: string[];
};
