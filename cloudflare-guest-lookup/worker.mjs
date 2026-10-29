// Linh & Thang private guest-name lookup.
// This file contains NO guest names or invitation data.
const ALLOWED_ORIGIN = "https://linhthangwedding.github.io";
const VALID_SLUG = /^[a-z0-9][a-z0-9-]{1,75}$/;

function json(body, status, origin) {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "X-Content-Type-Options": "nosniff",
    "Vary": "Origin",
  });
  if (!origin || origin === ALLOWED_ORIGIN) {
    headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  }
  return new Response(JSON.stringify(body), { status, headers });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    if (origin && origin !== ALLOWED_ORIGIN) {
      return json({ valid: false }, 403, origin);
    }

    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin",
        },
      });
    }
    if (request.method !== "GET") return json({ valid: false }, 405, origin);

    if (url.pathname === "/health") {
      return json({ ok: true, service: "guest-lookup", ready: Boolean(env.GUEST_NAMES) }, 200, origin);
    }
    if (url.pathname !== "/guest") return json({ valid: false }, 404, origin);

    const slug = String(url.searchParams.get("i") || "").trim();
    if (!VALID_SLUG.test(slug)) return json({ valid: false }, 400, origin);
    if (!env.GUEST_NAMES) return json({ valid: false }, 503, origin);

    try {
      // Each private import changes the active snapshot. Old PREP link keys
      // are never read after the new snapshot is activated.
      const active = await env.GUEST_NAMES.get("__active_snapshot", { cacheTtl: 30 });
      if (!active || !/^[a-zA-Z0-9_-]{1,60}$/.test(active)) {
        return json({ valid: false }, 503, origin);
      }
      // No public list endpoint or write operation; one guest per request.
      const name = await env.GUEST_NAMES.get("guest:" + active + ":" + slug, { cacheTtl: 30 });
      if (typeof name !== "string" || !name.trim()) {
        return json({ valid: false }, 404, origin);
      }
      return json({ valid: true, name: name.trim().slice(0, 120) }, 200, origin);
    } catch (_) {
      return json({ valid: false }, 503, origin);
    }
  }
};
