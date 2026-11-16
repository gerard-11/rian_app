// Llanta tal como la devuelve GET /tires. Los precios llegan como texto.
// `costAmount` solo viene para roles que pueden ver costos.
export type TireCatalogItem = {
  id: number | string;
  sku: string;
  rim: string;
  size: string;
  description: string;
  suggestedPrice: string;
  costAmount?: string;
};

export type TiresQuery = {
  search?: string;
  rim?: string;
  page?: number;
  limit?: number;
};

export type TiresResponse = {
  tires: TireCatalogItem[];
  total: number;
  page: number;
  limit: number;
};
