import api from "./api";
import type {
  PublicTireResponse,
  PublicTiresQuery,
  PublicTiresResponse,
} from "../types/publicTires";

export const getPublicTires = async ({ search, rim, page, limit }: PublicTiresQuery) => {
  const response = await api.get<PublicTiresResponse>("/public/tires", {
    params: {
      search: search?.trim() || undefined,
      rim: rim || undefined,
      page,
      limit,
    },
  });

  return response.data;
};

export const getPublicTireById = async (id: string) => {
  const response = await api.get<PublicTireResponse>(`/public/tires/${id}`);

  return response.data.tire;
};
