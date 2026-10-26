import type { QuickBudgetFormValues } from "../schemas/quickBudgetSchema";
import type { CreateQuickBudgetInput } from "../types/budgets";
import type { ItemType } from "../types/workOrders";
import { DEFAULT_PUBLIC_PHONE } from "./customerDefaults";

export const emptyQuickBudgetItem = {
  type: "OTHER" as ItemType,
  description: "",
  saleAmount: "",
  costAmount: "",
};

export const quickBudgetDefaultValues: QuickBudgetFormValues = {
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
  items: [emptyQuickBudgetItem],
};

export const itemTypeLabels: Record<string, string> = {
  SERVICE: "Servicio",
  LABOR: "Mano de obra",
  OTHER: "Otro",
  PART: "Refaccion",
  TIRE: "Llanta",
  BALANCE: "Balanceo",
  ALIGNMENT_BALANCE: "Alineacion y balanceo",
  ALIGNMENT: "Alineacion",
  TUNE_UP: "Afinacion",
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

const getItemDescription = (item: QuickBudgetFormValues["items"][number]) => {
  if (item.type === "BALANCE") {
    const quantity = Math.max(1, Number(item.quantity || 1));
    return `${itemTypeLabels.BALANCE} (${quantity} llantas)`;
  }

  if (!["OTHER", "PART", "TIRE"].includes(item.type)) {
    return itemTypeLabels[item.type];
  }

  return item.description.trim();
};

export const buildQuickBudgetPayload = (
  values: QuickBudgetFormValues,
): CreateQuickBudgetInput => ({
  customer: {
    name: values.customer.name.trim(),
    phone: values.customer.phone.trim() || DEFAULT_PUBLIC_PHONE,
  },
  diagnosis: optionalText(values.diagnosis),
  items: values.items.map((item) => ({
    costAmount:
      item.type === "PART" || item.type === "TIRE"
        ? Number(item.costAmount?.trim())
        : amountOrZero(item.costAmount),
    description: getItemDescription(item),
    saleAmount:
      Number(item.saleAmount.trim()) *
      (item.type === "BALANCE" ? Math.max(1, Number(item.quantity || 1)) : 1),
    type: item.type,
  })),
  notes: optionalText(values.notes),
  vehicle: {
    color: optionalText(values.vehicle.color),
    make: optionalText(values.vehicle.make),
    model: optionalText(values.vehicle.model),
    plate: optionalText(values.vehicle.plate),
    year: optionalNumber(values.vehicle.year),
  },
});
