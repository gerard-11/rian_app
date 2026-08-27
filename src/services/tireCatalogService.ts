import type { TireCatalogItem } from "../types/tireCatalog";

const catalogUrl =
  import.meta.env.VITE_TIRE_CATALOG_URL?.trim() || "/data/llantas.csv";

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

  const [, ...rows] = parseCsvRows(await response.text());

  return rows
    .filter((row) => row.length >= 6 && row[0] && row[3])
    .map(([sku, rim, size, description, cost, suggestedPrice]) => ({
      cost,
      description,
      rim,
      size,
      sku,
      suggestedPrice,
    }));
};
