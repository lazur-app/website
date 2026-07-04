import type { Metadata } from "next";

export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
};

export const noindexMetadata: Metadata = {
  robots: NOINDEX_ROBOTS,
};
