import type { Budget } from "../../types/budgets";
import type { WorkOrder } from "../../types/workOrders";
import { getBudgetStatus } from "../../utils/budgetsList";
import { getWorkOrderStatus } from "../../utils/workOrdersList";

const getCreatedTime = (value?: string) => {
  if (!value) return 0;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

export const getWorkOrderCounts = (workOrders: WorkOrder[]) => ({
  active: workOrders.filter(
    (workOrder) =>
      (getWorkOrderStatus(workOrder.status) ?? "ACTIVE") === "ACTIVE",
  ).length,
  cancelled: workOrders.filter(
    (workOrder) => getWorkOrderStatus(workOrder.status) === "CANCELLED",
  ).length,
  completed: workOrders.filter(
    (workOrder) => getWorkOrderStatus(workOrder.status) === "COMPLETED",
  ).length,
  total: workOrders.length,
});

export const getBudgetCounts = (budgets: Budget[]) => ({
  accepted: budgets.filter(
    (budget) => getBudgetStatus(budget.status) === "ACCEPTED",
  ).length,
  converted: budgets.filter(
    (budget) => getBudgetStatus(budget.status) === "CONVERTED",
  ).length,
  pending: budgets.filter(
    (budget) => (getBudgetStatus(budget.status) ?? "PENDING") === "PENDING",
  ).length,
  rejected: budgets.filter((budget) =>
    ["CANCELLED", "REJECTED"].includes(getBudgetStatus(budget.status) ?? ""),
  ).length,
  total: budgets.length,
});

export const getRecentWorkOrders = (workOrders: WorkOrder[], limit = 5) =>
  [...workOrders]
    .sort((firstWorkOrder, secondWorkOrder) => {
      return (
        getCreatedTime(secondWorkOrder.createdAt) -
        getCreatedTime(firstWorkOrder.createdAt)
      );
    })
    .slice(0, limit);
