import type { TireCatalogItem } from "../../types/tireCatalog";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
});

export const normalizeTireSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-MX")
    .replace(/\s+/g, " ")
    .trim();

export const filterTires = (tires: TireCatalogItem[], query: string) => {
  const normalizedQuery = normalizeTireSearch(query);
  if (!normalizedQuery) return tires;
  const terms = normalizedQuery.split(" ");

  return tires.filter((tire) => {
    const searchable = normalizeTireSearch(
      `${tire.size} ${tire.description} ${tire.sku} ${tire.rim}`,
    );
    return terms.every((term) => searchable.includes(term));
  });
};

export const formatTireMoney = (value: string) =>
  currencyFormatter.format(Number(value));
