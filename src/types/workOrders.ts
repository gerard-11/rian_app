export const ITEM_TYPES = [
  "LABOR",
  "PART",
  "TIRE",
  "BALANCE",
  "ALIGNMENT_BALANCE",
  "ALIGNMENT",
  "TUNE_UP",
  "OTHER",
] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

export const ITEM_SALE_DEFAULTS: Partial<Record<ItemType, string>> = {
  BALANCE: "80",
  ALIGNMENT: "200",
  ALIGNMENT_BALANCE: "520",
};

export type QuickCustomerInput = {
  name: string;
  phone: string;
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
  quantity?: number | string;
  saleAmount: number | string;
  costAmount?: number | string;
  notes?: string;
};

export type UpdateWorkOrderInput = {
  diagnosis?: string;
  notes?: string;
  status?: WorkOrderStatus;
  advanceAmount?: number | string;
  items?: QuickWorkOrderItemInput[];
};

export type UpdateWorkOrderActionInput = {
  id: number | string;
  payload: UpdateWorkOrderInput;
};

export type CreateQuickWorkOrderInput = {
  customer: QuickCustomerInput;
  vehicle: QuickVehicleInput;
  diagnosis?: string;
  notes?: string;
  advanceAmount?: number | string;
  items: QuickWorkOrderItemInput[];
};

export type WorkOrderCustomer = Omit<QuickCustomerInput, "phone"> & {
  id?: number | string;
  phone?: string;
};

export type WorkOrderVehicle = QuickVehicleInput & {
  id?: number | string;
};

export type WorkOrderItem = QuickWorkOrderItemInput & {
  id?: number | string;
};

export const WORK_ORDER_STATUSES = [
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
] as const;

export type WorkOrderStatus = (typeof WORK_ORDER_STATUSES)[number];

export const WORK_ORDER_STATUS_LABELS: Record<WorkOrderStatus, string> = {
  ACTIVE: "Activa",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
};

export type WorkOrder = {
  id: number | string;
  folio?: number | string;
  orderNumber?: number | string;
  status?: WorkOrderStatus;
  customer?: WorkOrderCustomer;
  vehicle?: WorkOrderVehicle;
  diagnosis?: string;
  notes?: string;
  advanceAmount?: number | string;
  totalAmount?: number | string;
  totalSaleAmount?: number | string;
  grossProfitAmount?: number | string;
  createdBy?: string;
  cancelledBy?: string;
  items?: WorkOrderItem[];
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
};

export type WorkOrderResponse =
  | WorkOrder
  | {
      data?: WorkOrder;
      workOrder?: WorkOrder;
    };

export type WorkOrdersResponse =
  | WorkOrder[]
  | {
      data?: WorkOrder[];
      items?: WorkOrder[];
      workOrders?: WorkOrder[];
    };

export type QuickWorkOrderResponse = {
  [key: string]: unknown;
};

export type WorkOrderActionInput = {
  id: WorkOrder["id"];
};
