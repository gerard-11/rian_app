import { CircleDot, Search } from "lucide-react";

type TireCatalogToolbarProps = {
  resultCount: number;
  search: string;
  tireCount: number;
  onSearchChange: (value: string) => void;
};

export function TireCatalogToolbar({
  resultCount,
  search,
  tireCount,
  onSearchChange,
}: TireCatalogToolbarProps) {
  return (
    <section className="mb-5 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4169e1]/10 text-[#4169e1]">
            <CircleDot className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950">
              {tireCount} llantas en el catálogo
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Precios sugeridos al público con IVA incluido.
            </p>
          </div>
        </div>

        <div className="flex h-11 w-full items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#4169e1] focus-within:ring-4 focus-within:ring-[#4169e1]/15 sm:max-w-md">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            autoFocus
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-400"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por medida o nombre"
            type="search"
            value={search}
          />
        </div>
      </div>
      {search.trim() ? (
        <p className="mt-3 text-sm font-medium text-slate-600">
          {resultCount} resultados para “{search.trim()}”
        </p>
      ) : null}
    </section>
  );
}
