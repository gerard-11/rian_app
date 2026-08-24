import type { QuickBudgetFormValues } from "../schemas/quickBudgetSchema";
import type { CreateQuickBudgetInput } from "../types/budgets";
import type { ItemType } from "../types/workOrders";

export const emptyQuickBudgetItem = {
  type: "SERVICE" as ItemType,
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

export const itemTypeLabels: Record<ItemType, string> = {
  LABOR: "Mano de obra",
  OTHER: "Otro",
  PART: "Refaccion",
  SERVICE: "Servicio",
  TIRE: "Llanta",
};

const optionalText = (value?: string) => {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
};

const optionalNumber = (value?: string) => {
  const trimmed = optionalText(value);

  return trimmed === undefined ? undefined : Number(trimmed);
};

const getItemDescription = (item: QuickBudgetFormValues["items"][number]) => {
  if (item.type === "LABOR") return itemTypeLabels.LABOR;

  return item.description.trim();
};

export const buildQuickBudgetPayload = (
  values: QuickBudgetFormValues,
): CreateQuickBudgetInput => ({
  customer: {
    name: values.customer.name.trim(),
    phone: values.customer.phone.trim(),
  },
  diagnosis: optionalText(values.diagnosis),
  items: values.items.map((item) => ({
    costAmount:
      item.type === "LABOR" ? undefined : optionalNumber(item.costAmount),
    description: getItemDescription(item),
    saleAmount: Number(item.saleAmount.trim()),
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
