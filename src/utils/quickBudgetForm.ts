import type { QuickBudgetFormValues } from "../schemas/quickBudgetSchema";
import type { CreateQuickBudgetInput } from "../types/budgets";
import { buildQuickEntryPayload } from "./quickWorkOrderForm";

export const buildQuickBudgetPayload = (
  values: QuickBudgetFormValues,
): CreateQuickBudgetInput => buildQuickEntryPayload(values);
