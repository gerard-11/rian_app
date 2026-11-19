// oxlint-disable react/only-export-components -- entrada del pre-render, no usa Fast Refresh.
// Entrada del pre-render (solo se usa al compilar, ver scripts/prerender.mjs).
// Renderiza las mismas rutas que el navegador para que React pueda hidratar
// el HTML sin diferencias.
import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";

export { PRERENDER_PAGES, renderHeadTags } from "./site/seo";
export { SITE_URL } from "./site/siteConfig";

export const render = (url: string) =>
  renderToString(
    <StrictMode>
      <QueryClientProvider client={new QueryClient()}>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </QueryClientProvider>
    </StrictMode>,
  );
