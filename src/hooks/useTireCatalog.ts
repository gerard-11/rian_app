import { useQuery } from "@tanstack/react-query";
import { getTireCatalog } from "../services/tireCatalogService";

export const useTireCatalog = () =>
  useQuery({
    queryKey: ["tire-catalog"],
    queryFn: getTireCatalog,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
