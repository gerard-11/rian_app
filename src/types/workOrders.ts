export const ITEM_TYPES = [
  "SERVICE",
  "LABOR",
  "PART",
  "TIRE",
  "OTHER",
] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

export type QuickCustomerInput = {
  name: string;
  phone?: string;
};

export type QuickVehicleInput = {
  plate?: string;
  make?: string;
  model?: string;
  year?: number | string;
  color?: string;
};

export type QuickWorkOrderItemInput = {
  type: ItemType;
  description: string;
  saleAmount: number | string;
  costAmount?: number | string;
};

export type CreateQuickWorkOrderInput = {
  customer: QuickCustomerInput;
  vehicle: QuickVehicleInput;
  diagnosis?: string;
  notes?: string;
  advanceAmount?: number | string;
  items: QuickWorkOrderItemInput[];
};

export type QuickWorkOrderResponse = {
  [key: string]: unknown;
};
