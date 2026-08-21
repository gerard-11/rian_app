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

export type WorkOrderCustomer = QuickCustomerInput & {
  id?: number | string;
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
  items?: WorkOrderItem[];
  createdAt?: string;
  updatedAt?: string;
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

export type UpdateWorkOrderStatusInput = {
  id: WorkOrder["id"];
  status: WorkOrderStatus;
};
