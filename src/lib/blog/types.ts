export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level?: 2 | 3 }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "blockquote"; text: string };

export type BlogCoverTone =
  | "waveform"
  | "apps"
  | "compare"
  | "mail"
  | "code"
  | "privacy";

export type BlogFaqItem = {
  question: string;
  answer: string;
};

export type BlogHowToStep = {
  name: string;
  text: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: string;
  cover: BlogCoverTone;
  targetKeyword?: string;
  tldr: string[];
  faq: BlogFaqItem[];
  howto?: {
    name: string;
    steps: BlogHowToStep[];
  };
  relatedSlugs: string[];
  readingTimeMinutes: number;
  body: string;
};
