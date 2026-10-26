import type {
  ItemType,
  QuickCustomerInput,
  QuickVehicleInput,
} from "./workOrders";

export type QuickBudgetItemInput = {
  type: ItemType;
  description: string;
  quantity?: number | string;
  saleAmount: number | string;
  costAmount?: number | string;
};

export type CreateQuickBudgetInput = {
  customer: QuickCustomerInput;
  vehicle: QuickVehicleInput;
  diagnosis?: string;
  notes?: string;
  items: QuickBudgetItemInput[];
};

export type BudgetCustomer = QuickCustomerInput & {
  id?: number | string;
};

export type BudgetVehicle = QuickVehicleInput & {
  id?: number | string;
};

export type BudgetItem = QuickBudgetItemInput & {
  id?: number | string;
};

export const BUDGET_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "CONVERTED",
  "CANCELLED",
  "REJECTED",
] as const;

export type BudgetStatus = (typeof BUDGET_STATUSES)[number];

export const BUDGET_STATUS_LABELS: Record<BudgetStatus, string> = {
  ACCEPTED: "Aceptado",
  CANCELLED: "Cancelado",
  CONVERTED: "Convertido",
  PENDING: "Pendiente",
  REJECTED: "Rechazado",
};

export type Budget = {
  id: number | string;
  folio?: number | string;
  budgetNumber?: number | string;
  status?: BudgetStatus | string;
  customer?: BudgetCustomer;
  vehicle?: BudgetVehicle;
  diagnosis?: string;
  notes?: string;
  totalAmount?: number | string;
  totalSaleAmount?: number | string;
  createdBy?: string;
  items?: BudgetItem[];
  createdAt?: string;
  updatedAt?: string;
  acceptedAt?: string;
  convertedAt?: string;
  workOrderId?: number | string;
};

export type BudgetResponse =
  | Budget
  | {
      budget?: Budget;
      data?: Budget;
    };

export type BudgetsResponse =
  | Budget[]
  | {
      budgets?: Budget[];
      data?: Budget[];
      items?: Budget[];
    };

export type BudgetActionInput = {
  id: Budget["id"];
};
