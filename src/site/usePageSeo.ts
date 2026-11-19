import { useEffect } from "react";
import { buildHeadTags, type PageSeo } from "./seo";

const upsert = (selector: string, create: () => HTMLElement) => {
  const existing = document.head.querySelector<HTMLElement>(selector);
  if (existing) return existing;
  const element = create();
  element.setAttribute("data-seo", "");
  document.head.appendChild(element);
  return element;
};

// Actualiza <title>, descripción, canonical, Open Graph y JSON-LD al navegar
// entre páginas públicas. La primera carga ya trae estas etiquetas en el HTML
// pre-renderizado; esto solo mantiene el <head> correcto en la navegación SPA.
export const usePageSeo = (seo: PageSeo | null | undefined) => {
  useEffect(() => {
    if (!seo) return;

    for (const tag of buildHeadTags(seo)) {
      switch (tag.kind) {
        case "title":
          document.title = tag.value;
          break;
        case "meta":
          upsert(`meta[${tag.attr}="${tag.key}"]`, () => {
            const meta = document.createElement("meta");
            meta.setAttribute(tag.attr, tag.key);
            return meta;
          }).setAttribute("content", tag.value);
          break;
        case "link":
          upsert(`link[rel="${tag.rel}"]`, () => {
            const link = document.createElement("link");
            link.rel = tag.rel;
            return link;
          }).setAttribute("href", tag.href);
          break;
        case "jsonld":
          break;
      }
    }

    // JSON-LD: se reemplaza el de la página anterior.
    document.head.querySelectorAll('script[type="application/ld+json"][data-seo]').forEach((node) => node.remove());
    if (seo.jsonLd?.length) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "");
      script.textContent = JSON.stringify(seo.jsonLd);
      document.head.appendChild(script);
    }
  }, [seo]);
};
