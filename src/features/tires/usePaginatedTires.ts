import { useEffect, useMemo, useState } from "react";
import type { TireCatalogItem } from "../../types/tireCatalog";
import { filterTires } from "./tireCatalogUtils";

const PAGE_SIZE = 50;

export function usePaginatedTires(
  tires: TireCatalogItem[] | undefined,
  search: string,
) {
  const [page, setPage] = useState(1);
  const filteredTires = useMemo(
    () => filterTires(tires ?? [], search),
    [search, tires],
  );
  const totalPages = Math.max(1, Math.ceil(filteredTires.length / PAGE_SIZE));

  useEffect(() => setPage(1), [search]);
  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  return {
    filteredTires,
    page,
    setPage,
    totalPages,
    visibleTires: filteredTires.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE,
    ),
  };
}
