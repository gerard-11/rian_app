import type { TireCatalogItem } from "../types/tireCatalog";

const catalogUrl =
  import.meta.env.VITE_TIRE_CATALOG_URL?.trim() || "/data/llantas.csv";

const requiredHeaders = [
  "SKU",
  "Rin",
  "Medida",
  "Descripcion",
  "Costo",
  "PrecioSugerido",
] as const;

const parseCsvRows = (csv: string) => {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    const nextCharacter = csv[index + 1];

    if (character === '"' && quoted && nextCharacter === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      row.push(value);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  return rows;
};

export const getTireCatalog = async (): Promise<TireCatalogItem[]> => {
  const response = await fetch(catalogUrl, { cache: "no-cache" });

  if (!response.ok) {
    throw new Error("No se pudo descargar el catálogo de llantas");
  }

  const [rawHeaders, ...rows] = parseCsvRows(await response.text());
  const headers = rawHeaders?.map((header) => header.replace(/^\uFEFF/, "").trim());

  if (!headers || requiredHeaders.some((header) => !headers.includes(header))) {
    throw new Error("El catálogo no contiene las columnas requeridas");
  }

  const column = (row: string[], header: (typeof requiredHeaders)[number]) =>
    row[headers.indexOf(header)]?.trim() ?? "";
  const uniqueTires = new Map<string, TireCatalogItem>();

  for (const row of rows) {
    const tire = {
      cost: column(row, "Costo"),
      description: column(row, "Descripcion"),
      rim: column(row, "Rin"),
      size: column(row, "Medida"),
      sku: column(row, "SKU"),
      suggestedPrice: column(row, "PrecioSugerido"),
    };
    const cost = Number(tire.cost);
    const suggestedPrice = Number(tire.suggestedPrice);

    if (
      tire.sku &&
      tire.description &&
      tire.size &&
      Number.isFinite(cost) &&
      cost > 0 &&
      Number.isFinite(suggestedPrice) &&
      suggestedPrice > 0 &&
      !uniqueTires.has(tire.sku)
    ) {
      uniqueTires.set(tire.sku, tire);
    }
  }

  return [...uniqueTires.values()];
};
