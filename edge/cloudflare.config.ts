import { bindings, defineConfig, triggers } from "cf/config";

export default defineConfig({
  accountId: "757e338376ceb0b7f84a35f256911236",
  worker: {
    name: "lazur-web-proxy",
    entrypoint: "./src/index.ts",
    compatibilityDate: "2026-11-01",
    workersDev: false,
    // Free-tool limits and sign-ups (see src/index.ts).
    env: {
      LIMITS: bindings.kv({ id: "60c21531d139444d9f58d155fd017cc0" }),
      // The API's Cloud Run address, not api.lazur.app: that host is served by this same Worker,
      // and a Worker can't fetch its own route.
      LAZUR_API: bindings.text("https://lazur-api-632291817180.asia-northeast1.run.app"),
      FREE_TOOLS_INTERNAL_KEY: bindings.secret(),
    },
    domains: [
      "www.lazur.app",
      "lazur.app",
      "lazur.co",
      "www.lazur.co",
      "getlazur.co",
      "www.getlazur.co",
      "admin.lazur.app",
      "api.lazur.app",
    ],
    // Free tools: every other *.lazur.app host reaches the Worker. Known tools (src/tool-subdomains.ts)
    // are served by the website; anything else is redirected to www. Needs a wildcard DNS record
    // (proxied, "*") in the lazur.app zone. Explicit records (www, admin, api, images) still win.
    triggers: [triggers.fetch({ pattern: "*.lazur.app/*", zone: "lazur.app" })],
  },
});
