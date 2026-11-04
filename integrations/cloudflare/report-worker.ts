export interface Env {
  REPORT_SECRET: string;
  APPS_SCRIPT_URL: string;
  TURNSTILE_SECRET: string;
  ALLOWED_ORIGIN: string;
}
const allowedCategories = new Set(["mestiere", "nazionalita", "quartiere"]);
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") || "";
    const headers = { "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Vary": "Origin", "Content-Type": "application/json" };
    if (origin !== env.ALLOWED_ORIGIN) return new Response("Forbidden", { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { headers });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers });
    if (!env.REPORT_SECRET || !env.APPS_SCRIPT_URL || !env.TURNSTILE_SECRET) return new Response("Not configured", { status: 503, headers });
    if (Number(request.headers.get("Content-Length") || 0) > 4096) return new Response("Too large", { status: 413, headers });
    let payload: Record<string, unknown>;
    try { payload = await request.json() as Record<string, unknown>; } catch { return new Response("Invalid JSON", { status: 400, headers }); }
    const category = String(payload.category || "");
    const value = String(payload.value || "").trim();
    const token = String(payload.turnstileToken || "");
    if (!allowedCategories.has(category) || !value || value.length > 120 || /[\r\n]/.test(value) || !token) return new Response("Invalid input", { status: 400, headers });
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: token, remoteip: request.headers.get("CF-Connecting-IP") })
    });
    const result = await verify.json() as { success?: boolean };
    if (!result.success) return new Response("Verification failed", { status: 403, headers });
    const outgoing = {
      secret: env.REPORT_SECRET, category, value,
      suggestions: Array.isArray(payload.suggestions) ? payload.suggestions.slice(0, 6).map(x => String(x).slice(0, 100)) : [],
      description: String(payload.description || "").slice(0, 600)
    };
    const res = await fetch(env.APPS_SCRIPT_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(outgoing), redirect: "follow" });
    if (!res.ok) return new Response(JSON.stringify({ok:false}), { status: 502, headers });
    const data = await res.json() as {ok?:boolean};
    return new Response(JSON.stringify({ok:data.ok === true}), { status: data.ok ? 200 : 502, headers });
  }
};
