import { AlertCircle, CircleDot, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { TireCatalogPagination } from "../features/tires/TireCatalogPagination";
import { TireCatalogTable } from "../features/tires/TireCatalogTable";
import { TireCatalogToolbar } from "../features/tires/TireCatalogToolbar";
import { useAuthUser } from "../hooks/useAuthUser";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useTires } from "../hooks/useTires";

const PAGE_SIZE = 50;

export function TiresPage() {
  const { data: authData } = useAuthUser();
  const isAdmin = authData?.user?.role === "ADMIN";
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);
  const catalog = useTires({ limit: PAGE_SIZE, page, search: debouncedSearch });
  const tires = catalog.data?.tires ?? [];
  const total = catalog.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / (catalog.data?.limit || PAGE_SIZE)));
  // El costo solo lo ve un admin y solo si el backend lo incluye en la respuesta.
  const showCost = isAdmin && tires.some((tire) => tire.costAmount !== undefined);

  return (
    <>
      <TireCatalogToolbar
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        search={search}
        total={total}
      />

      {catalog.isPending ? (
        <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm">
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#B3262D]" />
          Cargando catálogo...
        </div>
      ) : null}

      {catalog.isError ? (
        <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          No se pudo cargar el catálogo de llantas.
        </div>
      ) : null}

      {catalog.isSuccess && tires.length ? (
        <>
          <TireCatalogTable showCost={showCost} tires={tires} />
          <TireCatalogPagination
            onPageChange={setPage}
            page={page}
            totalPages={totalPages}
          />
        </>
      ) : null}

      {catalog.isSuccess && !tires.length ? (
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
