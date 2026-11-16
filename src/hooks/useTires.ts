import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTires } from "../services/tireCatalogService";
import type { TiresQuery } from "../types/tireCatalog";

export const useTires = (query: TiresQuery, enabled = true) =>
  useQuery({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: () => getTires(query),
    queryKey: ["tires", query],
    staleTime: 60 * 1000,
  });
