// oxlint-disable react/only-export-components -- entrada del pre-render, no usa Fast Refresh.
// Entrada del pre-render (solo se usa al compilar, ver scripts/prerender.mjs).
// Renderiza las mismas rutas que el navegador para que React pueda hidratar
// el HTML sin diferencias.
import { StrictMode } from "react";
import { dehydrate, QueryClient, QueryClientProvider, type QueryKey } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";

export { PRERENDER_PAGES, renderHeadTags } from "./site/seo";
export { SITE_URL } from "./site/siteConfig";
export { tireSeo } from "./features/tires/tireSeo";
export { tirePath, tireSlug } from "./features/tires/tireSlug";
export { PUBLIC_CATALOG_PAGE_SIZE, publicTireQueryKey, publicTiresQueryKey } from "./hooks/usePublicTires";

/**
 * Renderiza una ruta. `seed` precarga datos del API (llantas) para que el HTML
 * salga completo; `state` se incrusta en la página y el navegador lo usa al
 * hidratar, así no vuelve a pedir lo mismo ni hay diferencias de render.
 */
export const render = (url: string, seed: Array<[QueryKey, unknown]> = []) => {
  const queryClient = new QueryClient();
  for (const [key, data] of seed) queryClient.setQueryData(key, data);

  const html = renderToString(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </QueryClientProvider>
    </StrictMode>,
  );

  return { html, state: seed.length ? dehydrate(queryClient) : null };
};
