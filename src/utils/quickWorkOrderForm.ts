import type { QuickWorkOrderFormValues } from "../schemas/quickWorkOrderSchema";
import type { CreateQuickWorkOrderInput, ItemType } from "../types/workOrders";
import { DEFAULT_PUBLIC_PHONE } from "./customerDefaults";

export const emptyQuickWorkOrderItem = {
  type: "OTHER" as ItemType,
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

export const itemTypeLabels: Record<string, string> = {
  SERVICE: "Servicio",
  LABOR: "Mano de obra",
  PART: "Refaccion",
  TIRE: "Llanta",
  BALANCE: "Balanceo",
  ALIGNMENT_BALANCE: "Alineacion y balanceo",
  ALIGNMENT: "Alineacion",
  TUNE_UP: "Afinacion",
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

const amountOrZero = (value?: string) => optionalNumber(value) ?? 0;

const getItemDescription = (
  item: QuickWorkOrderFormValues["items"][number],
) => {
  if (item.type === "BALANCE") {
    const quantity = Math.max(1, Number(item.quantity || 1));
    return `${itemTypeLabels.BALANCE} (${quantity} llantas)`;
  }

  if (!["OTHER", "PART", "TIRE"].includes(item.type)) {
    return itemTypeLabels[item.type];
  }

  return item.description.trim();
};

export const buildQuickWorkOrderPayload = (
  values: QuickWorkOrderFormValues,
): CreateQuickWorkOrderInput => ({
  customer: {
    name: values.customer.name.trim(),
    phone: values.customer.phone.trim() || DEFAULT_PUBLIC_PHONE,
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
  advanceAmount: amountOrZero(values.advanceAmount),
  items: values.items.map((item) => ({
    type: item.type,
    description: getItemDescription(item),
    saleAmount:
      Number(item.saleAmount.trim()) *
      (item.type === "BALANCE" ? Math.max(1, Number(item.quantity || 1)) : 1),
    costAmount:
      item.type === "PART" || item.type === "TIRE"
        ? Number(item.costAmount?.trim())
        : amountOrZero(item.costAmount),
  })),
});
