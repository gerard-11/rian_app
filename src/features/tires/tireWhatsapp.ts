import type { PublicTire } from "../../types/publicTires";
import { BUSINESS, SITE_URL } from "../../site/siteConfig";
import { formatTireMoney } from "./tireCatalogUtils";
import { tirePath } from "./tireSlug";

// Número del taller en formato internacional sin "+" ni espacios (52 + 10 dígitos).
// Si no está configurado se usa el teléfono del negocio.
const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || BUSINESS.phone).replace(/\D/g, "");

export type WhatsappIntent = "quote" | "tomorrow" | "install";

export const WHATSAPP_INTENTS: Array<{ intent: WhatsappIntent; label: string }> = [
  { intent: "quote", label: "Quiero cotizar" },
  { intent: "tomorrow", label: "La quiero para mañana" },
  { intent: "install", label: "Cotizar con instalación" },
];

const intentText: Record<WhatsappIntent, (quantity: number) => string> = {
  quote: (quantity) => `Hola, quiero cotizar ${quantity} llanta${quantity > 1 ? "s" : ""}:`,
  tomorrow: (quantity) =>
    `Hola, necesito ${quantity} llanta${quantity > 1 ? "s" : ""} para mañana, ¿la tienen disponible?`,
  install: (quantity) =>
    `Hola, quiero cotizar ${quantity} llanta${quantity > 1 ? "s" : ""} con instalación, alineación y balanceo:`,
};

export const buildWhatsappUrl = (text: string) => {
  const base = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
};

export const buildTireWhatsappUrl = (
  tire: PublicTire,
  intent: WhatsappIntent = "quote",
  quantity = 1,
) => {
  const lines = [
    intentText[intent](quantity),
    "",
    `• Llanta: Torque ${tire.model ?? ""} ${tire.size}`.replace(/\s+/g, " "),
    `• Descripción: ${tire.description}`,
    `• SKU: ${tire.sku}`,
    `• Precio en catálogo: ${formatTireMoney(tire.suggestedPrice)} c/u`,
    "",
    `${SITE_URL}${tirePath(tire)}`,
  ];

  return buildWhatsappUrl(lines.join("\n"));
};

export const GENERAL_WHATSAPP_URL = buildWhatsappUrl(
  "Hola, vi su página y quiero información.",
);
