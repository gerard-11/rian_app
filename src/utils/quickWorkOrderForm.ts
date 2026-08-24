import type { QuickWorkOrderFormValues } from "../schemas/quickWorkOrderSchema";
import type { CreateQuickWorkOrderInput, ItemType } from "../types/workOrders";

export const emptyQuickWorkOrderItem = {
  type: "SERVICE" as ItemType,
  description: "",
  saleAmount: "",
  costAmount: "",
};

export const quickWorkOrderDefaultValues: QuickWorkOrderFormValues = {
  customer: {
    name: "",
    phone: "",
  },
  vehicle: {
    plate: "",
    make: "",
    model: "",
    year: "",
    color: "",
  },
  diagnosis: "",
  notes: "",
  advanceAmount: "",
  items: [emptyQuickWorkOrderItem],
};

export const itemTypeLabels: Record<ItemType, string> = {
  SERVICE: "Servicio",
  LABOR: "Mano de obra",
  PART: "Refaccion",
  TIRE: "Llanta",
  OTHER: "Otro",
};

const optionalText = (value?: string) => {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
};

const optionalNumber = (value?: string) => {
  const trimmed = optionalText(value);

  return trimmed === undefined ? undefined : Number(trimmed);
};

const getItemDescription = (
  item: QuickWorkOrderFormValues["items"][number],
) => {
  if (item.type === "LABOR") return itemTypeLabels.LABOR;

  return item.description.trim();
};

export const buildQuickWorkOrderPayload = (
  values: QuickWorkOrderFormValues,
): CreateQuickWorkOrderInput => ({
  customer: {
    name: values.customer.name.trim(),
    phone: values.customer.phone.trim(),
  },
  vehicle: {
    plate: optionalText(values.vehicle.plate),
    make: optionalText(values.vehicle.make),
    model: optionalText(values.vehicle.model),
    year: optionalNumber(values.vehicle.year),
    color: optionalText(values.vehicle.color),
  },
  diagnosis: optionalText(values.diagnosis),
  notes: optionalText(values.notes),
  advanceAmount: optionalNumber(values.advanceAmount),
  items: values.items.map((item) => ({
    type: item.type,
    description: getItemDescription(item),
    saleAmount: Number(item.saleAmount.trim()),
    costAmount:
      item.type === "LABOR" ? undefined : optionalNumber(item.costAmount),
  })),
});
