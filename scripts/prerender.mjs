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

const {
  render,
  renderHeadTags,
  PRERENDER_PAGES,
  SITE_URL,
  tireSeo,
  tirePath,
  tireSlug,
  PUBLIC_CATALOG_PAGE_SIZE,
  publicTireQueryKey,
  publicTiresQueryKey,
} = await import(pathToFileURL(SSR_ENTRY).href);

const template = await readFile(path.join(DIST, "index.html"), "utf8");
if (!template.includes("<!--app-html-->") || !template.includes("<!-- seo:start -->")) {
  throw new Error("dist/index.html no tiene los marcadores <!--app-html--> / <!-- seo:start -->");
}

// Shell del CRM: sin contenido ni canonical. El Worker (worker/index.ts) lo
// sirve para las rutas que no tienen archivo propio.
await writeFile(path.join(DIST, "app.html"), template.replace("<!--app-html-->", ""));

// ---------------------------------------------------------------------------
// Llantas desde el API (mismo backend al que el Worker redirige /api).
// Si el API no responde, se compila igual, solo sin fichas de llantas.
const env = loadEnv("production", process.cwd(), "");
const API_URL = (env.PRERENDER_API_URL || "https://backend-rian-automotriz-production.up.railway.app").replace(/\/$/, "");

const fetchJson = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`${response.status} en ${url}`);
  return response.json();
};

let tires = [];
let catalogFirstPage = null;
try {
  for (let page = 1; page <= 50; page += 1) {
    const data = await fetchJson(`${API_URL}/public/tires?page=${page}&limit=100`);
    tires.push(...(data.tires ?? []));
    if (!data.tires?.length || tires.length >= (data.total ?? 0)) break;
  }
  catalogFirstPage = await fetchJson(`${API_URL}/public/tires?page=1&limit=${PUBLIC_CATALOG_PAGE_SIZE}`);
} catch (error) {
  console.warn(`llantas: no se pudo leer el API (${error.message}); se compila sin fichas.`);
  tires = [];
}

// ---------------------------------------------------------------------------
// JSON dentro de <script>: se escapa "<" para que nunca cierre la etiqueta.
const jsonForScript = (value) => JSON.stringify(value).replace(/</g, "\\u003c");

const writePage = async (urlPath, seo, seed = []) => {
  const { html: appHtml, state } = render(urlPath, seed);
  const stateScript = state ? `<script>window.__RQ_STATE__=${jsonForScript(state)}</script>` : "";
  const html = template
    // Reemplazos con función: el HTML trae precios ("$870") y "$" es especial en replace().
    .replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, () => renderHeadTags(seo))
    .replace(
      '<div id="root"><!--app-html--></div>',
      () => `<div id="root" data-prerendered="${urlPath}">${appHtml}</div>${stateScript}`,
    );

  const file = urlPath === "/" ? path.join(DIST, "index.html") : path.join(DIST, urlPath, "index.html");
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
  return file;
};

for (const page of PRERENDER_PAGES) {
  // /llantas sale con la primera página del catálogo ya en el HTML.
  const seed =
    page.path === "/llantas" && catalogFirstPage
      ? [[publicTiresQueryKey({ limit: PUBLIC_CATALOG_PAGE_SIZE, page: 1, search: "" }), catalogFirstPage]]
      : [];
  const file = await writePage(page.path, page, seed);
  console.log(`prerender  ${page.path}  →  ${path.relative(DIST, file)}`);
}

for (const tire of tires) {
  await writePage(tirePath(tire), tireSeo(tire), [[publicTireQueryKey(tireSlug(tire)), tire]]);
}
console.log(`prerender  ${tires.length} fichas de llantas en /llantas/<medida>-<sku>`);

// ---------------------------------------------------------------------------
// Enlaces viejos con el id de la llanta (/llantas/<uuid>, /catalog/<uuid>)
// → 301 a la URL nueva. Van antes de las reglas de public/_redirects.
const redirectsFile = path.join(DIST, "_redirects");
const baseRedirects = await readFile(redirectsFile, "utf8").catch(() => "");
const tireRedirects = tires.flatMap((tire) => [
  `/llantas/${tire.id}  ${tirePath(tire)}  301`,
  `/catalog/${tire.id}  ${tirePath(tire)}  301`,
]);
await writeFile(
  redirectsFile,
  `# Generado por scripts/prerender.mjs: ids viejos de llantas → URL con medida.\n${tireRedirects.join("\n")}\n\n${baseRedirects}`,
);

// ---------------------------------------------------------------------------
// Sitemap. Las llantas van sin <lastmod>: el API no da fecha de cambio y una
// fecha falsa (la del build) hace que Google ignore el dato.
const today = new Date().toISOString().slice(0, 10);
const urlEntry = (loc, priority, lastmod) =>
  `  <url>\n    <loc>${loc}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}    <priority>${priority}</priority>\n  </url>`;

const entries = [
  ...PRERENDER_PAGES.map((page) => urlEntry(`${SITE_URL}${page.path}`, page.path === "/" ? "1.0" : "0.8", today)),
  ...tires.map((tire) => urlEntry(`${SITE_URL}${tirePath(tire)}`, "0.6")),
];

await writeFile(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`,
);
console.log(`sitemap.xml: ${entries.length} URLs (${tires.length} llantas)`);

await rm(path.resolve("dist-ssr"), { recursive: true, force: true });

// React Query deja timers (gcTime) vivos tras el render; se termina explícitamente.
process.exit(0);
