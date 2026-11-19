import type { PublicTire } from "../../types/publicTires";

// URL de cada llanta: medida y modelo legibles + SKU al final para que sea
// única y estable, p. ej. /llantas/torque-145-70-r12-tq021-69t-200t2093.
// Google posiciona mejor "205-55-r16" en la URL que un id sin significado.

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const tireSlug = (tire: Pick<PublicTire, "description" | "sku">) => {
  const sku = slugify(tire.sku);
  const name = slugify(tire.description);
  return name.endsWith(`-${sku}`) ? name : `${name}-${sku}`;
};

export const tirePath = (tire: Pick<PublicTire, "description" | "sku">) => `/llantas/${tireSlug(tire)}`;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Enlaces viejos (/llantas/<uuid>) que ya circulan por WhatsApp. */
export const isTireId = (param: string) => UUID_PATTERN.test(param);

/** El SKU es el último segmento del slug. */
export const skuFromSlug = (slug: string) => slug.split("-").pop() ?? "";
