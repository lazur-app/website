import { defineConfig } from "cf/config";

export default defineConfig({
  accountId: "757e338376ceb0b7f84a35f256911236",
  worker: {
    name: "lazur-web-proxy",
    entrypoint: "./src/index.ts",
    compatibilityDate: "2026-11-01",
    workersDev: false,
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
  },
});
