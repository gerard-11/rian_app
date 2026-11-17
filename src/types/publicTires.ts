// Llanta del catálogo público (GET /public/tires). Solo Torque y nunca trae costo.
// `model` lo calcula el backend desde la descripción, p. ej. "TQ-AT701".
export type PublicTire = {
  id: string;
  sku: string;
  rim: string;
  size: string;
  description: string;
  suggestedPrice: string;
  model: string | null;
};

export type PublicTiresQuery = {
  search?: string;
  rim?: string;
  page?: number;
  limit?: number;
};

export type PublicTiresResponse = {
  tires: PublicTire[];
  total: number;
  page: number;
  limit: number;
};

export type PublicTireResponse = {
  tire: PublicTire;
};
