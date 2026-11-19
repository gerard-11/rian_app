// Pre-render del sitio público: después de `vite build`, genera el HTML
// estático de cada página (contenido + <title>, meta, Open Graph y JSON-LD)
// para que buscadores y redes sociales lo lean sin ejecutar JavaScript, y el
// visitante vea la página antes de que cargue el JS (luego React la hidrata).
//
// También genera sitemap.xml y app.html (el shell vacío del CRM).
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadEnv } from "vite";

const DIST = path.resolve("dist");
const SSR_ENTRY = path.resolve("dist-ssr/entry-server.js");

const { render, renderHeadTags, PRERENDER_PAGES, SITE_URL } = await import(pathToFileURL(SSR_ENTRY).href);

const template = await readFile(path.join(DIST, "index.html"), "utf8");
if (!template.includes("<!--app-html-->") || !template.includes("<!-- seo:start -->")) {
  throw new Error("dist/index.html no tiene los marcadores <!--app-html--> / <!-- seo:start -->");
}

// Shell del CRM: sin contenido ni canonical (Vercel lo usa como fallback).
await writeFile(path.join(DIST, "app.html"), template.replace("<!--app-html-->", ""));

for (const page of PRERENDER_PAGES) {
  const appHtml = render(page.path);
  const html = template
    .replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, renderHeadTags(page))
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-prerendered="${page.path}">${appHtml}</div>`);

  const file = page.path === "/" ? path.join(DIST, "index.html") : path.join(DIST, page.path, "index.html");
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
  console.log(`prerender  ${page.path}  →  ${path.relative(DIST, file)}`);
}

// Fichas de llantas para el sitemap (si el API responde al compilar).
const fetchTireIds = async () => {
  const env = loadEnv("production", process.cwd(), "");
  // Mismo backend al que Vercel redirige /api (ver vercel.json).
  const apiUrl = (env.PRERENDER_API_URL || "https://backend-rian-automotriz-production.up.railway.app").replace(/\/$/, "");
  if (!apiUrl.startsWith("http")) return [];

  const ids = [];
  try {
    for (let page = 1; page <= 50; page += 1) {
      const response = await fetch(`${apiUrl}/public/tires?page=${page}&limit=100`, {
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) break;
      const data = await response.json();
      const tires = data.tires ?? [];
      ids.push(...tires.map((tire) => tire.id));
      if (!tires.length || ids.length >= (data.total ?? 0)) break;
    }
  } catch (error) {
    console.warn(`sitemap: no se pudieron leer las llantas (${error.message})`);
  }
  return ids;
};

const today = new Date().toISOString().slice(0, 10);
const urlEntry = (loc, priority) =>
  `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;

const tireIds = await fetchTireIds();
const entries = [
  ...PRERENDER_PAGES.map((page) => urlEntry(`${SITE_URL}${page.path}`, page.path === "/" ? "1.0" : "0.8")),
  ...tireIds.map((id) => urlEntry(`${SITE_URL}/llantas/${encodeURIComponent(id)}`, "0.5")),
];

await writeFile(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`,
);
console.log(`sitemap.xml: ${entries.length} URLs (${tireIds.length} llantas)`);

await rm(path.resolve("dist-ssr"), { recursive: true, force: true });

// React Query deja timers (gcTime) vivos tras el render; se termina explícitamente.
process.exit(0);
