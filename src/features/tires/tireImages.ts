// Las imágenes de llantas viven en public/tires/torque y el manifest lo genera
// scripts/tire-images.mjs. Las imágenes son por modelo, no por medida; cada
// modelo puede tener varias (galería). El modelo ("TQ-AT701") lo manda el backend.
import manifest from "./tireImageManifest.json";

export const TIRE_PLACEHOLDER = "/tires/placeholder.svg";

export const TIRE_IMAGE_DISCLAIMER =
  "Imagen de referencia, la figura real puede cambiar.";

const imagesByModel: Record<string, string[]> = manifest;

export const getTireImages = (model: string | null | undefined) => {
  const images = model ? imagesByModel[model.toLowerCase()] : undefined;
  return images?.length ? images : [TIRE_PLACEHOLDER];
};

// Imagen estable por llanta: medidas distintas del mismo modelo alternan entre
// las fotos de la galería para que el catálogo no se vea repetido.
export const getTireImageUrl = (model: string | null | undefined, seed = "") => {
  const images = getTireImages(model);
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return images[hash % images.length];
};
