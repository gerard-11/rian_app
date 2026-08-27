type TireCatalogPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function TireCatalogPagination({
  page,
  totalPages,
  onPageChange,
}: TireCatalogPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-5 flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <button
        className="h-10 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        type="button"
      >
        Anterior
      </button>
      <p className="text-sm font-semibold text-slate-600">
        Página {page} de {totalPages}
      </p>
      <button
        className="h-10 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        type="button"
      >
        Siguiente
      </button>
    </div>
  );
}
