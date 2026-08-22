import type { UseCasePage } from "./types";
import { cursorUseCase } from "./pages/cursor";
import { slackUseCase } from "./pages/slack";
import { gmailUseCase } from "./pages/gmail";
import { chatgptUseCase } from "./pages/chatgpt";

const allUseCases: UseCasePage[] = [
  cursorUseCase,
  slackUseCase,
  gmailUseCase,
  chatgptUseCase,
];

export function getAllUseCases(): UseCasePage[] {
  return [...allUseCases];
}

export function getUseCaseBySlug(slug: string): UseCasePage | undefined {
  return allUseCases.find((page) => page.slug === slug);
}

export function getAllUseCaseSlugs(): string[] {
  return allUseCases.map((page) => page.slug);
}

export type { UseCasePage, UseCaseDemo, UseCaseFaqItem } from "./types";
