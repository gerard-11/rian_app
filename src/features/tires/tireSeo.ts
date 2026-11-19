import { absoluteUrl, type PageSeo } from "../../site/seo";
import { BUSINESS } from "../../site/siteConfig";
import type { PublicTire } from "../../types/publicTires";
import { formatTireMoney } from "./tireCatalogUtils";
import { getTireImages, TIRE_PLACEHOLDER } from "./tireImages";
import { tirePath } from "./tireSlug";

const tireName = (tire: PublicTire) => `Llanta Torque ${tire.model ?? ""} ${tire.size}`.replace(/\s+/g, " ").trim();

// SEO de la ficha de una llanta. Lo usan la página (al navegar) y el
// pre-render (HTML estático), así que ambos generan exactamente lo mismo.
export const tireSeo = (tire: PublicTire): PageSeo => {
  const path = tirePath(tire);
  const name = tireName(tire);
  const images = getTireImages(tire.model).filter((image) => image !== TIRE_PLACEHOLDER);

  return {
    path,
    title: `${name} | ${BUSINESS.name}`,
    description: `${tire.description}. Precio ${formatTireMoney(tire.suggestedPrice)} por llanta. Cotiza con instalación, alineación y balanceo en ${BUSINESS.address.locality}, Puebla.`,
    image: images[0],
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description: tire.description,
        sku: tire.sku,
        brand: { "@type": "Brand", name: "Torque" },
        ...(tire.model ? { model: tire.model } : {}),
        ...(images.length ? { image: images.map(absoluteUrl) } : {}),
        offers: {
          "@type": "Offer",
          url: absoluteUrl(path),
          price: Number(tire.suggestedPrice).toFixed(2),
          priceCurrency: "MXN",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@type": "AutoRepair", name: BUSINESS.name },
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Llantas", item: absoluteUrl("/llantas") },
          { "@type": "ListItem", position: 3, name: tire.size, item: absoluteUrl(path) },
        ],
      },
    ],
  };
};
