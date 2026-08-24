import {
  BUDGET_STATUSES,
  BUDGET_STATUS_LABELS,
  type Budget,
  type BudgetItem,
  type BudgetResponse,
  type BudgetStatus,
  type BudgetsResponse,
} from "../types/budgets";
import { formatDate, formatMoney } from "./workOrdersList";

const toNumber = (value?: number | string) => {
  if (value === undefined || value === "") return 0;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const normalizeBudgetResponse = (
  response: BudgetResponse,
): Budget | undefined => {
  if ("id" in response) return response;

  return response.data ?? response.budget;
};

export const normalizeBudgetsResponse = (
  response: BudgetsResponse,
): Budget[] => {
  if (Array.isArray(response)) return response;

  return response.data ?? response.items ?? response.budgets ?? [];
};

export const getBudgetTotal = (budget: Budget) => {
  if (budget.totalSaleAmount !== undefined) {
    return toNumber(budget.totalSaleAmount);
  }

  if (budget.totalAmount !== undefined) {
    return toNumber(budget.totalAmount);
  }

  return (
    budget.items?.reduce(
      (total, item) => total + toNumber(item.saleAmount),
      0,
    ) ?? 0
  );
};

export const getBudgetCode = (budget: Budget) => {
  const code = budget.folio ?? budget.budgetNumber ?? budget.id;

  return "#" + code;
};

export const getBudgetCustomerName = (budget: Budget) =>
  budget.customer?.name?.trim() || "Cliente sin nombre";

export const getBudgetCustomerPhone = (budget: Budget) =>
  budget.customer?.phone?.trim() || "Sin telefono";

export const getBudgetVehicleLabel = (budget: Budget) => {
  const vehicle = budget.vehicle;

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

export const getBudgetItemSummary = (items?: BudgetItem[]) => {
  if (!items?.length) return "Sin items";

  if (items.length === 1) return items[0]?.description || "1 item";

  return items.length + " items";
};

export const getBudgetStatus = (status?: string): BudgetStatus | undefined => {
  const normalizedStatus = status?.toUpperCase();

  return BUDGET_STATUSES.find(
    (budgetStatus) => budgetStatus === normalizedStatus,
  );
};

export const getBudgetStatusLabel = (status?: string) => {
  const budgetStatus = getBudgetStatus(status);

  if (budgetStatus) return BUDGET_STATUS_LABELS[budgetStatus];
  if (!status) return "Sin estado";

  return status
    .toLowerCase()
    .split(/[ _-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export { formatDate, formatMoney };
