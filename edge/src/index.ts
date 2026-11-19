// Cloudflare Worker in front of the Lazur sites on Google Cloud Run.
// - www.lazur.app and admin.lazur.app are proxied to their Cloud Run services
//   (Cloud Run only answers on its own *.run.app host).
// - Every other Lazur hostname gets a permanent redirect to www.lazur.app (as on Vercel).
// - The visitor's country is passed on so /api/pricing-region keeps working.

const CANONICAL_HOST = "www.lazur.app";

const ORIGINS: Record<string, string> = {
  "www.lazur.app": "https://lazur-website-v2w4wqf5qa-uc.a.run.app",
  "admin.lazur.app": "https://lazur-admin-v2w4wqf5qa-uc.a.run.app",
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const origin = ORIGINS[url.hostname];

    if (!origin) {
      url.protocol = "https:";
      url.hostname = CANONICAL_HOST;
      url.port = "";
      return Response.redirect(url.toString(), 308);
    }

    const target = new URL(url.pathname + url.search, origin);
    const headers = new Headers(request.headers);
    const country = (request as Request & { cf?: { country?: string } }).cf?.country;
    if (country) headers.set("x-country-code", country);
    headers.set("x-forwarded-host", url.hostname);
    headers.set("x-forwarded-proto", "https");
    headers.delete("host");

    const upstream = await fetch(target.toString(), {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      redirect: "manual",
    });

    // Keep redirects on our own domain instead of the run.app address.
    const location = upstream.headers.get("location");
    if (location && location.startsWith(origin)) {
      const response = new Response(upstream.body, upstream);
      response.headers.set("location", `https://${url.hostname}${location.slice(origin.length)}`);
      return response;
    }
    return upstream;
  },
};
