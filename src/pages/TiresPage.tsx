import { AlertCircle, CircleDot, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { TireCatalogPagination } from "../features/tires/TireCatalogPagination";
import { TireCatalogTable } from "../features/tires/TireCatalogTable";
import { TireCatalogToolbar } from "../features/tires/TireCatalogToolbar";
import { usePaginatedTires } from "../features/tires/usePaginatedTires";
import { useTireCatalog } from "../hooks/useTireCatalog";

export function TiresPage() {
  const [search, setSearch] = useState("");
  const catalog = useTireCatalog();
  const { filteredTires, page, setPage, totalPages, visibleTires } =
    usePaginatedTires(catalog.data, search);

  return (
    <>
      <TireCatalogToolbar
        onSearchChange={setSearch}
        resultCount={filteredTires.length}
        search={search}
        tireCount={catalog.data?.length ?? 0}
      />

      {catalog.isPending ? (
        <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm">
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#4169e1]" />
          Cargando catálogo...
        </div>
      ) : null}

      {catalog.isError ? (
        <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          No se pudo cargar el catálogo de llantas.
        </div>
      ) : null}

      {catalog.isSuccess && visibleTires.length ? (
        <>
          <TireCatalogTable tires={visibleTires} />
          <TireCatalogPagination
            onPageChange={setPage}
            page={page}
            totalPages={totalPages}
          />
        </>
      ) : null}

      {catalog.isSuccess && !visibleTires.length ? (
        <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-center shadow-sm">
          <div>
            <CircleDot className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-950">
              No encontramos llantas
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Prueba con otra medida o parte del nombre.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
