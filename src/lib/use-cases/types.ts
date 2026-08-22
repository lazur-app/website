import type { BlogBlock } from "@/lib/blog/types";

export type UseCaseMode = "dictation" | "command";

export type UseCaseDemo = {
  spoken: string;
  output: string;
  context?: string;
  caption: string;
};

export type UseCaseFaqItem = {
  question: string;
  answer: string;
};

export type UseCaseHowToStep = {
  name: string;
  text: string;
};

export type UseCasePage = {
  slug: string;
  title: string;
  description: string;
  appName: string;
  mode: UseCaseMode;
  targetKeyword: string;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  tldr: string[];
  demo: UseCaseDemo;
  howto: {
    name: string;
    steps: UseCaseHowToStep[];
  };
  faq: UseCaseFaqItem[];
  blocks: BlogBlock[];
  relatedSlugs: string[];
};
