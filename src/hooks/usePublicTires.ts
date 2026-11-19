import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { isTireId, skuFromSlug } from "../features/tires/tireSlug";
import { getPublicTireById, getPublicTireBySku, getPublicTires } from "../services/publicTireService";
import type { PublicTiresQuery } from "../types/publicTires";

// Mismo criterio que useTires: el catálogo casi no cambia y el endpoint
// público tiene rate limit, así que se reutiliza el resultado un buen rato.
const PUBLIC_TIRES_STALE_TIME = 10 * 60 * 1000;
const PUBLIC_TIRES_GC_TIME = 30 * 60 * 1000;

/** Llantas por página en /llantas (el pre-render usa la misma consulta). */
export const PUBLIC_CATALOG_PAGE_SIZE = 24;

// Claves compartidas con el pre-render, que siembra estos datos en el HTML.
export const publicTiresQueryKey = (query: PublicTiresQuery) => ["public-tires", query] as const;
export const publicTireQueryKey = (param: string | undefined) => ["public-tires", "detail", param] as const;

export const usePublicTires = (query: PublicTiresQuery) =>
  useQuery({
    gcTime: PUBLIC_TIRES_GC_TIME,
    placeholderData: keepPreviousData,
    queryFn: () => getPublicTires(query),
    queryKey: publicTiresQueryKey(query),
    staleTime: PUBLIC_TIRES_STALE_TIME,
  });

/** Acepta el slug (/llantas/<medida>-<sku>) o el id de los enlaces viejos. */
export const usePublicTire = (param: string | undefined) =>
  useQuery({
    enabled: Boolean(param),
    gcTime: PUBLIC_TIRES_GC_TIME,
    queryFn: () => (isTireId(param!) ? getPublicTireById(param!) : getPublicTireBySku(skuFromSlug(param!))),
    queryKey: publicTireQueryKey(param),
    retry: false,
    staleTime: PUBLIC_TIRES_STALE_TIME,
  });
