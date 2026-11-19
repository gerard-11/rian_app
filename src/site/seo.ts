import { ALIGNMENT_SERVICE, MECHANIC_SERVICES } from "./services";
import { BUSINESS, OG_IMAGE_URL, OPENING_HOURS, SHOP_PHOTOS, SITE_URL } from "./siteConfig";

// Metadatos SEO de cada página pública. Los usa el pre-render (HTML estático
// al compilar) y el hook usePageSeo (al navegar dentro del sitio).

export type PageSeo = {
  path: string;
  title: string;
  description: string;
  image?: string;
  jsonLd?: object[];
};

export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path === "/" ? "/" : path.replace(/\/$/, "")}`;

const BUSINESS_ID = `${SITE_URL}/#negocio`;

const serviceOffer = (name: string, description: string) => ({
  "@type": "Offer",
  itemOffered: { "@type": "Service", name, description },
});

const allServices = [ALIGNMENT_SERVICE, ...MECHANIC_SERVICES].flatMap((group) =>
  group.items.map((item) => serviceOffer(item.name, item.description)),
);

export const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["AutoRepair", "TireShop"],
  "@id": BUSINESS_ID,
  name: BUSINESS.name,
  description: `${BUSINESS.tagline} en ${BUSINESS.address.locality}, ${BUSINESS.address.region}.`,
  url: `${SITE_URL}/`,
  telephone: BUSINESS.landline,
  contactPoint: [
    { "@type": "ContactPoint", telephone: BUSINESS.landline, contactType: "customer service", name: "Teléfono fijo" },
    { "@type": "ContactPoint", telephone: BUSINESS.phone, contactType: "customer service", name: "Celular y WhatsApp" },
  ],
  openingHoursSpecification: OPENING_HOURS.map((slot) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [...slot.days],
    opens: slot.opens,
    closes: slot.closes,
  })),
  image: [absoluteUrl(SHOP_PHOTOS.facadeJpg), absoluteUrl(SHOP_PHOTOS.lifts), absoluteUrl(OG_IMAGE_URL)],
  logo: absoluteUrl("/brand/logo-rian.png"),
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.locality,
    addressRegion: BUSINESS.address.region,
    postalCode: BUSINESS.address.postalCode,
    addressCountry: BUSINESS.address.country,
  },
  areaServed: BUSINESS.areaServed.map((name) => ({ "@type": "City", name })),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios automotrices",
    itemListElement: [
      ...allServices,
      serviceOffer("Venta de llantas", "Llantas Torque para auto, SUV, pickup y camioneta de carga."),
    ],
  },
};

const breadcrumb = (name: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name, item: absoluteUrl(path) },
  ],
});

const serviceJsonLd = (name: string, description: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  url: absoluteUrl(path),
  provider: { "@id": BUSINESS_ID },
  areaServed: BUSINESS.areaServed.map((city) => ({ "@type": "City", name: city })),
});

const place = `${BUSINESS.address.locality}, Puebla`;

export const PAGES = {
  home: {
    path: "/",
    title: `Rian Automotriz | Llantas, alineación y balanceo en ${place}`,
    description: `Taller automotriz en ${place}, sobre la carretera federal México-Puebla. Alineación y balanceo, venta de llantas, frenos, cambio de aceite, afinación, suspensión y dirección. Cotiza por WhatsApp.`,
    jsonLd: [businessJsonLd],
  },
  alignment: {
    path: "/alineacion-y-balanceo",
    title: `Alineación y balanceo en ${BUSINESS.address.locality} | Rian Automotriz`,
    description: `Alineación y balanceo para auto, SUV y camioneta en ${place}. Evita que tu auto se jale, la vibración en el volante y el desgaste disparejo de tus llantas.`,
    jsonLd: [
      serviceJsonLd("Alineación y balanceo", ALIGNMENT_SERVICE.summary, "/alineacion-y-balanceo"),
      breadcrumb("Alineación y balanceo", "/alineacion-y-balanceo"),
    ],
  },
  mechanic: {
    path: "/mecanica",
    title: `Taller mecánico en ${BUSINESS.address.locality} | Rian Automotriz`,
    description: `Cambio de balatas, cambio de aceite, afinación, amortiguadores, resortes, rótulas, bujes de horquilla y barra estabilizadora en ${place}.`,
    jsonLd: [
      serviceJsonLd(
        "Mecánica automotriz",
        "Frenos, cambio de aceite, afinación, suspensión y dirección.",
        "/mecanica",
      ),
      breadcrumb("Mecánica", "/mecanica"),
    ],
  },
  tires: {
    path: "/llantas",
    title: `Llantas Torque en ${BUSINESS.address.locality} | Rian Automotriz`,
    description: `Catálogo de llantas Torque para auto, SUV, pickup y camioneta de carga. Busca tu medida, revisa el precio y cotiza con instalación, alineación y balanceo.`,
    jsonLd: [breadcrumb("Llantas", "/llantas")],
  },
  contact: {
    path: "/contacto",
    title: `Contacto y ubicación | Rian Automotriz, ${place}`,
    description: `Encuéntranos en ${BUSINESS.address.street}, ${place}. Abrimos de lunes a viernes de 10 am a 6 pm y sábado de 10 am a 2 pm. Teléfono ${BUSINESS.landlineDisplay}, WhatsApp ${BUSINESS.phoneDisplay}.`,
    jsonLd: [businessJsonLd, breadcrumb("Contacto", "/contacto")],
  },
} satisfies Record<string, PageSeo>;

/** Páginas que se pre-renderizan a HTML y van al sitemap. */
export const PRERENDER_PAGES: PageSeo[] = Object.values(PAGES);

/**
 * Rutas del sitio público para clientes: ahí no se muestra el aviso de
 * actualización de la PWA. El login no cuenta: lo usa el personal.
 */
export const isPublicPath = (pathname: string) =>
  pathname === "/" ||
  pathname.startsWith("/llantas") ||
  pathname.startsWith("/catalog") ||
  PRERENDER_PAGES.some((page) => page.path === pathname.replace(/\/$/, ""));

export type HeadTag =
  | { kind: "title"; value: string }
  | { kind: "meta"; attr: "name" | "property"; key: string; value: string }
  | { kind: "link"; rel: string; href: string }
  | { kind: "jsonld"; value: object[] };

export const buildHeadTags = (seo: PageSeo): HeadTag[] => {
  const url = absoluteUrl(seo.path);
  const image = absoluteUrl(seo.image ?? OG_IMAGE_URL);
  const tags: HeadTag[] = [
    { kind: "title", value: seo.title },
    { kind: "meta", attr: "name", key: "description", value: seo.description },
    { kind: "link", rel: "canonical", href: url },
    { kind: "meta", attr: "property", key: "og:type", value: "website" },
    { kind: "meta", attr: "property", key: "og:title", value: seo.title },
    { kind: "meta", attr: "property", key: "og:description", value: seo.description },
    { kind: "meta", attr: "property", key: "og:url", value: url },
    { kind: "meta", attr: "property", key: "og:image", value: image },
    { kind: "meta", attr: "name", key: "twitter:card", value: "summary_large_image" },
    { kind: "meta", attr: "name", key: "twitter:title", value: seo.title },
    { kind: "meta", attr: "name", key: "twitter:description", value: seo.description },
    { kind: "meta", attr: "name", key: "twitter:image", value: image },
  ];
  if (seo.jsonLd?.length) tags.push({ kind: "jsonld", value: seo.jsonLd });
  return tags;
};

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// JSON dentro de <script>: se escapa "<" para que nunca cierre la etiqueta.
const jsonForScript = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

/** HTML de las etiquetas para insertar en <head> durante el pre-render. */
export const renderHeadTags = (seo: PageSeo) =>
  buildHeadTags(seo)
    .map((tag) => {
      switch (tag.kind) {
        case "title":
          return `<title>${escapeHtml(tag.value)}</title>`;
        case "meta":
          return `<meta data-seo ${tag.attr}="${tag.key}" content="${escapeHtml(tag.value)}" />`;
        case "link":
          return `<link data-seo rel="${tag.rel}" href="${escapeHtml(tag.href)}" />`;
        case "jsonld":
          return `<script data-seo type="application/ld+json">${jsonForScript(tag.value)}</script>`;
      }
    })
    .join("\n    ");
