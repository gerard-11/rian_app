import { AlertCircle, CircleDot, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { PublicCatalogHero } from "../features/tires/PublicCatalogHero";
import { PublicTireCard } from "../features/tires/PublicTireCard";
import { TireCatalogPagination } from "../features/tires/TireCatalogPagination";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { PUBLIC_CATALOG_PAGE_SIZE, usePublicTires } from "../hooks/usePublicTires";
import { PAGES } from "../site/seo";
import { usePageSeo } from "../site/usePageSeo";

const PAGE_SIZE = PUBLIC_CATALOG_PAGE_SIZE;

export function PublicTiresPage() {
  usePageSeo(PAGES.tires);
  const [search, setSearch] = useState("");
  const [model, setModel] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);
  // El backend busca por términos en la descripción, así que el modelo se
  // manda como un término más ("TQ-AT701 265/70 R16").
  const query = [model, debouncedSearch].filter(Boolean).join(" ");
  const catalog = usePublicTires({ limit: PAGE_SIZE, page, search: query });
  const tires = catalog.data?.tires ?? [];
  const total = catalog.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / (catalog.data?.limit || PAGE_SIZE)));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-5 md:pt-8">
      <PublicCatalogHero
        onModelChange={(value) => {
          setModel(value);
          setPage(1);
        }}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        search={search}
        selectedModel={model}
        total={total}
      />

      {catalog.isPending ? (
        <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm">
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-brand-red" />
          Cargando catálogo...
        </div>
      ) : null}

      {catalog.isError ? (
        <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          No se pudo cargar el catálogo de llantas. Intenta de nuevo en un momento.
        </div>
      ) : null}

      {catalog.isSuccess && tires.length ? (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {tires.map((tire) => (
              <PublicTireCard key={tire.id} tire={tire} />
            ))}
          </div>
          <TireCatalogPagination
            onPageChange={(next) => {
              setPage(next);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            page={page}
            totalPages={totalPages}
          />
        </>
      ) : null}

      {catalog.isSuccess && !tires.length ? (
        <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-center shadow-sm">
          <div>
            <CircleDot className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-950">No encontramos llantas</p>
            <p className="mt-1 text-sm text-slate-500">
              Prueba con otra medida o modelo.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
