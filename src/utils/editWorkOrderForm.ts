import type { EditWorkOrderFormValues } from "../schemas/editWorkOrderSchema";
import type {
  ItemType,
  QuickVehicleInput,
  UpdateWorkOrderInput,
  WorkOrderStatus,
} from "../types/workOrders";
import { DEFAULT_PUBLIC_NAME, DEFAULT_PUBLIC_PHONE } from "./customerDefaults";
import { itemTypeLabels } from "./quickWorkOrderForm";

const amount = (value?: string) => Number(value?.trim() || 0);

const optionalText = (value?: string) => value?.trim() || undefined;

// Forma minima que comparten ordenes y presupuestos para editarse.
export type EditableEntry = {
  status?: string;
  customer?: { name?: string; phone?: string };
  vehicle?: QuickVehicleInput;
  diagnosis?: string;
  notes?: string;
  advanceAmount?: number | string;
  items?: {
    type: ItemType;
    description?: string;
    saleAmount?: number | string;
    costAmount?: number | string;
    notes?: string;
  }[];
};

export const editEntryDefaultValues: EditWorkOrderFormValues = {
  customer: { name: "", phone: "" },
  vehicle: { plate: "", make: "", model: "", year: "", color: "" },
  status: "",
  diagnosis: "",
  notes: "",
  advanceAmount: "",
  items: [],
};

export const getEditWorkOrderValues = (
  entry: EditableEntry,
): EditWorkOrderFormValues => ({
  customer: {
    name: entry.customer?.name === DEFAULT_PUBLIC_NAME ? "" : entry.customer?.name ?? "",
    phone: entry.customer?.phone === DEFAULT_PUBLIC_PHONE ? "" : entry.customer?.phone ?? "",
  },
  vehicle: {
    plate: entry.vehicle?.plate ?? "",
    make: entry.vehicle?.make ?? "",
    model: entry.vehicle?.model ?? "",
    year: String(entry.vehicle?.year ?? ""),
    color: entry.vehicle?.color ?? "",
  },
  status: entry.status?.toUpperCase() ?? "",
  diagnosis: entry.diagnosis ?? "",
  notes: entry.notes ?? "",
  advanceAmount: String(entry.advanceAmount ?? ""),
  items: (entry.items?.length ? entry.items : [{
    type: "OTHER" as const,
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

// Calculo compartido por ordenes y presupuestos (sin anticipo).
export const buildUpdateEntryPayload = (values: EditWorkOrderFormValues) => ({
  customer: {
    name: values.customer.name.trim() || DEFAULT_PUBLIC_NAME,
    phone: values.customer.phone.trim() || DEFAULT_PUBLIC_PHONE,
  },
  vehicle: {
    plate: optionalText(values.vehicle.plate),
    make: optionalText(values.vehicle.make),
    model: optionalText(values.vehicle.model),
    year: optionalText(values.vehicle.year) ? Number(values.vehicle.year) : undefined,
    color: optionalText(values.vehicle.color),
  },
  diagnosis: values.diagnosis.trim(),
  notes: values.notes?.trim() ?? "",
  items: values.items.map((item) => ({
    type: item.type,
    description:
      ["OTHER", "PART", "TIRE"].includes(item.type)
        ? item.description.trim()
        : itemTypeLabels[item.type],
    saleAmount: amount(item.saleAmount),
    costAmount: amount(item.costAmount),
    notes: item.notes?.trim() ?? "",
  })),
});

export const buildUpdateWorkOrderPayload = (
  values: EditWorkOrderFormValues,
): UpdateWorkOrderInput => ({
  ...buildUpdateEntryPayload(values),
  advanceAmount: amount(values.advanceAmount),
  ...(values.status ? { status: values.status as WorkOrderStatus } : {}),
});
