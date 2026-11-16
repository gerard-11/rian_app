import type { QuickWorkOrderFormValues } from "../schemas/quickWorkOrderSchema";
import type { CreateQuickWorkOrderInput, ItemType } from "../types/workOrders";
import { DEFAULT_PUBLIC_NAME, DEFAULT_PUBLIC_PHONE } from "./customerDefaults";

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

// La cantidad de llantas viaja en la descripcion, p. ej. "205/55R16 (4 llantas)",
// porque el backend solo guarda totales.
const TIRE_QUANTITY_PATTERN = /\s*\((\d+) llantas?\)$/;

export const withTireQuantity = (description: string, quantity?: string) => {
  const count = Math.max(1, Math.floor(Number(quantity || 1)));
  const base = description.trim();

  return count > 1 ? `${base} (${count} llantas)` : base;
};

export const splitTireQuantity = (description: string) => {
  const match = description.match(TIRE_QUANTITY_PATTERN);

  return {
    description: match ? description.replace(TIRE_QUANTITY_PATTERN, "") : description,
    quantity: match ? match[1] : "1",
  };
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

  if (item.type === "TIRE") {
    return withTireQuantity(item.description, item.quantity);
  }

  if (!["OTHER", "PART", "TIRE"].includes(item.type)) {
    return itemTypeLabels[item.type];
  }

  return item.description.trim();
};

// Calculo y normalizacion compartidos por ordenes y presupuestos.
export const buildQuickEntryPayload = (values: QuickWorkOrderFormValues) => ({
  customer: {
    name: values.customer.name.trim() || DEFAULT_PUBLIC_NAME,
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
  items: values.items.map((item) => ({
    type: item.type,
    description: getItemDescription(item),
    // El campo de venta ya contiene el total (el balanceo lo calcula el formulario).
    saleAmount: Number(item.saleAmount.trim()),
    costAmount:
      item.type === "PART" || item.type === "TIRE"
        ? Number(item.costAmount?.trim())
        : amountOrZero(item.costAmount),
  })),
});

export const buildQuickWorkOrderPayload = (
  values: QuickWorkOrderFormValues,
): CreateQuickWorkOrderInput => ({
  ...buildQuickEntryPayload(values),
  advanceAmount: amountOrZero(values.advanceAmount),
});
