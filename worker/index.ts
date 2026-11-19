// Worker de Cloudflare: sirve el sitio (dist/) y hace de proxy del backend.
//
// Cloudflare responde primero con los archivos estáticos que existan en dist/
// (landing pre-renderizada, assets, imágenes). Este código solo corre para:
//   - /api/*  → proxy al backend de Railway (mismo dominio = cookies de sesión).
//   - rutas sin archivo (CRM, /llantas/:id) → shell de la SPA (app.html).

type Env = {
  ASSETS: { fetch: (request: Request | URL | string) => Promise<Response> };
  API_ORIGIN: string;
};

const proxyToApi = (request: Request, url: URL, env: Env) => {
  const target = new URL(url.pathname.replace(/^\/api/, "") + url.search, env.API_ORIGIN);
  const headers = new Headers(request.headers);
  headers.set("X-Forwarded-Host", url.host);
  headers.set("X-Forwarded-Proto", url.protocol.replace(":", ""));
  const clientIp = request.headers.get("CF-Connecting-IP");
  if (clientIp) headers.set("X-Forwarded-For", clientIp);

  return fetch(target, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "manual",
  });
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      return proxyToApi(request, url, env);
    }

    // Un archivo que no existe (p. ej. /assets/viejo.js) es 404, no la SPA.
    if (/\.[a-z0-9]+$/i.test(url.pathname)) {
      return new Response("No encontrado", { status: 404 });
    }

    // Rutas de la SPA: se sirve el shell. Se pide "/app" (sin .html) porque
    // Cloudflare redirige /app.html → /app y eso cambiaría la URL del usuario.
    const shell = await env.ASSETS.fetch(new URL("/app", url));
    return new Response(shell.body, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" },
    });
  },
};
