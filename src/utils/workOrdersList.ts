import {
  WORK_ORDER_STATUSES,
  WORK_ORDER_STATUS_LABELS,
  type WorkOrder,
  type WorkOrderItem,
  type WorkOrderResponse,
  type WorkOrderStatus,
  type WorkOrdersResponse,
} from "../types/workOrders";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  currency: "MXN",
  style: "currency",
});

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const normalizeWorkOrderResponse = (
  response: WorkOrderResponse,
): WorkOrder | undefined => {
  if ("id" in response) return response;

  return response.data ?? response.workOrder;
};

export const normalizeWorkOrdersResponse = (
  response: WorkOrdersResponse,
): WorkOrder[] => {
  if (Array.isArray(response)) return response;

  return response.data ?? response.items ?? response.workOrders ?? [];
};

const toNumber = (value?: number | string) => {
  if (value === undefined || value === "") return 0;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const getWorkOrderTotal = (workOrder: WorkOrder) => {
  if (workOrder.totalSaleAmount !== undefined) {
    return toNumber(workOrder.totalSaleAmount);
  }

  if (workOrder.totalAmount !== undefined) {
    return toNumber(workOrder.totalAmount);
  }

  return (
    workOrder.items?.reduce(
      (total, item) => total + toNumber(item.saleAmount),
      0,
    ) ?? 0
  );
};

export const getWorkOrderAdvanceAmount = (workOrder: WorkOrder) =>
  toNumber(workOrder.advanceAmount);

export const getWorkOrderPendingBalance = (workOrder: WorkOrder) =>
  getWorkOrderTotal(workOrder) - getWorkOrderAdvanceAmount(workOrder);

export const formatMoney = (value?: number | string) =>
  currencyFormatter.format(toNumber(value));

export const formatDate = (value?: string) => {
  if (!value) return "Sin fecha";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Sin fecha";

  return dateFormatter.format(date);
};

export const getWorkOrderCode = (workOrder: WorkOrder) => {
  const code = workOrder.folio ?? workOrder.orderNumber ?? workOrder.id;

  return "#" + code;
};

export const getCustomerName = (workOrder: WorkOrder) =>
  workOrder.customer?.name?.trim() || "Cliente sin nombre";

export const getCustomerPhone = (workOrder: WorkOrder) =>
  workOrder.customer?.phone?.trim() || "Sin telefono";

export const getWorkOrderCreatedBy = (workOrder: WorkOrder) =>
  workOrder.createdBy?.trim() || "Sin registro";

export const getWorkOrderCancelledBy = (workOrder: WorkOrder) =>
  workOrder.cancelledBy?.trim() || "Sin registro";

export const getVehicleLabel = (workOrder: WorkOrder) => {
  const vehicle = workOrder.vehicle;

  if (!vehicle) return "Vehiculo sin datos";

  const parts = [vehicle.year, vehicle.make, vehicle.model, vehicle.color]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean);
  const vehicleName = parts.join(" ");
  const plate = vehicle.plate?.trim();

  if (vehicleName && plate) return vehicleName + " · " + plate;
  if (vehicleName) return vehicleName;
  if (plate) return plate;

  return "Vehiculo sin datos";
};

export const getItemSummary = (items?: WorkOrderItem[]) => {
  if (!items?.length) return "Sin items";

  if (items.length === 1) return items[0]?.description || "1 item";

  return items.length + " items";
};

export const getWorkOrderStatus = (
  status?: string,
): WorkOrderStatus | undefined => {
  const normalizedStatus = status?.toUpperCase();

  return WORK_ORDER_STATUSES.find(
    (workOrderStatus) => workOrderStatus === normalizedStatus,
  );
};

export const getStatusLabel = (status?: string) => {
  const workOrderStatus = getWorkOrderStatus(status);

  if (workOrderStatus) return WORK_ORDER_STATUS_LABELS[workOrderStatus];
  if (!status) return "Sin estado";

  return status
    .toLowerCase()
    .split(/[ _-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
