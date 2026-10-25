import { LoaderCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  filterTires,
  formatTireMoney,
  normalizeTireSearch,
} from "../features/tires/tireCatalogUtils";
import { useTireCatalog } from "../hooks/useTireCatalog";
import type { TireCatalogItem } from "../types/tireCatalog";

type TireCatalogPickerProps = {
  onSelect: (tire: TireCatalogItem) => void;
};

export function TireCatalogPicker({ onSelect }: TireCatalogPickerProps) {
  const [query, setQuery] = useState("");
  const catalog = useTireCatalog();
  const normalizedQuery = normalizeTireSearch(query);

  const matches = useMemo(() => {
    if (!catalog.data || normalizedQuery.length < 2) return [];
    return filterTires(catalog.data, normalizedQuery).slice(0, 12);
  }, [catalog.data, normalizedQuery]);

  return (
    <div className="relative mb-3">
      <label className="text-sm font-semibold text-[#B3262D]">
        Buscar en catálogo
      </label>
      <div className="mt-2 flex h-11 items-center rounded-md border border-[#B3262D]/40 bg-white px-3 focus-within:border-[#B3262D] focus-within:ring-4 focus-within:ring-[#B3262D]/15">
        {catalog.isPending ? (
          <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-[#B3262D]" />
        ) : (
          <Search className="h-4 w-4 shrink-0 text-[#B3262D]" />
        )}
        <input
          className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Medida, descripción o SKU"
          type="search"
          value={query}
        />
      </div>

      {catalog.isError ? (
        <p className="mt-2 text-sm font-medium text-[#d71920]">
          No se pudo cargar el catálogo. Puedes capturar la llanta manualmente.
        </p>
      ) : null}

      {normalizedQuery.length >= 2 && catalog.isSuccess ? (
        <div className="absolute z-30 mt-1 max-h-80 w-full overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-xl">
          {matches.length ? (
            matches.map((tire) => (
              <button
                className="block w-full rounded px-3 py-2 text-left transition hover:bg-[#B3262D]/10 focus:bg-[#B3262D]/10 focus:outline-none"
                key={tire.sku}
                onClick={() => {
                  onSelect(tire);
                  setQuery("");
                }}
                type="button"
              >
                <span className="block text-sm font-semibold text-slate-900">
                  {tire.size} · {tire.description}
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  SKU {tire.sku} · Costo {formatTireMoney(tire.cost)} · Venta {formatTireMoney(tire.suggestedPrice)}
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-3 text-sm text-slate-500">
              No encontramos llantas con esa búsqueda.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
