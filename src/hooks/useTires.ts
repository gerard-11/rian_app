import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTires } from "../services/tireCatalogService";
import type { TiresQuery } from "../types/tireCatalog";

// El catalogo casi no cambia: se reutiliza el resultado 10 minutos y se
// conserva en memoria 30 para ahorrar datos en movil. Solo vive en memoria.
const TIRES_STALE_TIME = 10 * 60 * 1000;
const TIRES_GC_TIME = 30 * 60 * 1000;

export const useTires = (query: TiresQuery, enabled = true) =>
  useQuery({
    enabled,
    gcTime: TIRES_GC_TIME,
    placeholderData: keepPreviousData,
    queryFn: () => getTires(query),
    queryKey: ["tires", query],
    staleTime: TIRES_STALE_TIME,
  });
