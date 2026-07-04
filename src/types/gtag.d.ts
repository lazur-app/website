type GtagCommand = "config" | "event" | "js" | "set";

interface Window {
  dataLayer?: unknown[];
  gtag?: (command: GtagCommand, ...args: unknown[]) => void;
}
