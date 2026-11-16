import api from "./api";
import type { TiresQuery, TiresResponse } from "../types/tireCatalog";

export const getTires = async ({ search, rim, page, limit }: TiresQuery) => {
  const response = await api.get<TiresResponse>("/tires", {
    params: {
      search: search?.trim() || undefined,
      rim: rim || undefined,
      page,
      limit,
    },
  });

  return response.data;
};
