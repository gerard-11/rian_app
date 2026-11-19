// Datos del negocio que usa el sitio público (landing, SEO, JSON-LD, contacto).
// Mantener aquí una sola fuente de verdad: Google compara que nombre,
// dirección y teléfono (NAP) sean idénticos en todo el sitio.

export const SITE_URL = "https://rianautomotriz.com.mx";

const MOBILE_E164 = "+522482084881";
const LANDLINE_E164 = "+522482918300";

export const BUSINESS = {
  name: "Rian Automotriz",
  tagline: "Llantas, alineación y balanceo y mecánica automotriz",
  // Celular / WhatsApp.
  phone: MOBILE_E164,
  phoneDisplay: "248 208 4881",
  phoneHref: `tel:${MOBILE_E164}`,
  // Teléfono fijo: el número para llamadas.
  landline: LANDLINE_E164,
  landlineDisplay: "248 291 8300",
  landlineHref: `tel:${LANDLINE_E164}`,
  address: {
    street: "Carretera Federal México-Puebla km 82.5",
    locality: "San Matías Tlalancaleca",
    region: "Puebla",
    regionCode: "MX-PUE",
    postalCode: "74110",
    country: "MX",
  },
  areaServed: [
    "San Matías Tlalancaleca",
    "San Martín Texmelucan",
    "San Salvador el Verde",
    "Puebla",
  ],
} as const;

// Horario del taller. `days`/`opens`/`closes` alimentan el JSON-LD de Google.
export const OPENING_HOURS = [
  {
    label: "Lunes a viernes",
    shortLabel: "Lun a Vie",
    time: "10:00 am a 6:00 pm",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "10:00",
    closes: "18:00",
  },
  {
    label: "Sábado",
    shortLabel: "Sáb",
    time: "10:00 am a 2:00 pm",
    days: ["Saturday"],
    opens: "10:00",
    closes: "14:00",
  },
] as const;

export const CLOSED_LABEL = "Domingo cerrado";

export const ADDRESS_ONE_LINE = `${BUSINESS.address.street}, ${BUSINESS.address.locality}, ${BUSINESS.address.postalCode} ${BUSINESS.address.region}, Pue.`;

const mapsQuery = encodeURIComponent(`${BUSINESS.name}, ${ADDRESS_ONE_LINE}`);

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;

export const LOGO_URL = "/brand/logo-rian.webp";
export const LOGO_LIGHT_URL = "/brand/logo-rian-light.webp";
export const OG_IMAGE_URL = "/brand/og-image.jpg";

// Fotos reales del taller (public/taller).
export const SHOP_PHOTOS = {
  facade: "/taller/fachada.webp",
  facadeJpg: "/taller/fachada.jpg",
  lifts: "/taller/elevadores.webp",
  service: "/taller/servicio.webp",
} as const;
