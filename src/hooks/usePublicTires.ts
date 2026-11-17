import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPublicTireById, getPublicTires } from "../services/publicTireService";
import type { PublicTiresQuery } from "../types/publicTires";

// Mismo criterio que useTires: el catálogo casi no cambia y el endpoint
// público tiene rate limit, así que se reutiliza el resultado un buen rato.
const PUBLIC_TIRES_STALE_TIME = 10 * 60 * 1000;
const PUBLIC_TIRES_GC_TIME = 30 * 60 * 1000;

export const usePublicTires = (query: PublicTiresQuery) =>
  useQuery({
    gcTime: PUBLIC_TIRES_GC_TIME,
    placeholderData: keepPreviousData,
    queryFn: () => getPublicTires(query),
    queryKey: ["public-tires", query],
    staleTime: PUBLIC_TIRES_STALE_TIME,
  });

export const usePublicTire = (id: string | undefined) =>
  useQuery({
    enabled: Boolean(id),
    gcTime: PUBLIC_TIRES_GC_TIME,
    queryFn: () => getPublicTireById(id!),
    queryKey: ["public-tires", "detail", id],
    retry: false,
    staleTime: PUBLIC_TIRES_STALE_TIME,
  });
