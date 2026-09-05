import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/blog/lazur-vs-wispr-flow",
        destination: "/compare/lazur-vs-wispr-flow",
        permanent: true,
      },
      {
        source: "/blog/lazur-vs-aqua-voice",
        destination: "/compare/lazur-vs-aqua-voice",
        permanent: true,
      },
      {
        source: "/blog/lazur-vs-macwhisper",
        destination: "/compare/lazur-vs-macwhisper",
        permanent: true,
      },
      {
        source: "/blog/lazur-vs-super-whisper",
        destination: "/compare/lazur-vs-super-whisper",
        permanent: true,
      },
      {
        source: "/blog/lazur-vs-willow-voice",
        destination: "/compare/lazur-vs-willow-voice",
        permanent: true,
      },
      {
        source: "/blog/lazur-vs-apple-dictation",
        destination: "/compare/lazur-vs-apple-dictation",
        permanent: true,
      },
      {
        source: "/blog/google-voice-typing-alternative",
        destination: "/compare/google-voice-typing-alternative",
        permanent: true,
      },
      {
        source: "/blog/README",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/readme",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
  outputFileTracingIncludes: {
    "/blog/[slug]": ["./content/blog/**/*"],
    "/blog": ["./content/blog/**/*"],
  },
};

export default nextConfig;
