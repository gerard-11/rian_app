import type { EditWorkOrderFormValues } from "../schemas/editWorkOrderSchema";
import type { UpdateWorkOrderInput, WorkOrder } from "../types/workOrders";
import { itemTypeLabels } from "./quickWorkOrderForm";

const text = (value?: string) => value?.trim() || undefined;
const amount = (value?: string) => Number(value?.trim() || 0);

export const getEditWorkOrderValues = (
  workOrder: WorkOrder,
): EditWorkOrderFormValues => ({
  diagnosis: workOrder.diagnosis ?? "",
  notes: workOrder.notes ?? "",
  advanceAmount: String(workOrder.advanceAmount ?? ""),
  items: (workOrder.items?.length ? workOrder.items : [{
    type: "SERVICE" as const,
    description: "",
    saleAmount: "",
    costAmount: "",
    notes: "",
  }]).map((item) => ({
    type: item.type,
    description: item.description ?? "",
    saleAmount: String(item.saleAmount ?? ""),
    costAmount: String(item.costAmount ?? ""),
    notes: item.notes ?? "",
  })),
});

export const buildUpdateWorkOrderPayload = (
  values: EditWorkOrderFormValues,
): UpdateWorkOrderInput => ({
  diagnosis: values.diagnosis.trim(),
  notes: text(values.notes),
  advanceAmount: amount(values.advanceAmount),
  items: values.items.map((item) => ({
    type: item.type,
    description:
      item.type === "LABOR" ? itemTypeLabels.LABOR : item.description.trim(),
    saleAmount: amount(item.saleAmount),
    costAmount: amount(item.costAmount),
    notes: text(item.notes),
  })),
});
