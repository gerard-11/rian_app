import api from "./api";
import type {
  BudgetActionInput,
  BudgetResponse,
  BudgetsResponse,
  BudgetStatus,
  CreateQuickBudgetInput,
} from "../types/budgets";

export const getBudgets = async () => {
  const response = await api.get<BudgetsResponse>("/budgets");

  return response.data;
};

export const getBudgetById = async (id: BudgetActionInput["id"]) => {
  const response = await api.get<BudgetResponse>("/budgets/" + id);

  return response.data;
};

export const createQuickBudget = async (payload: CreateQuickBudgetInput) => {
  const response = await api.post<BudgetResponse>(
    "/budgets/quick-entry",
    payload,
  );

  return response.data;
};

export const acceptBudget = async ({ id }: BudgetActionInput) => {
  const response = await api.post<BudgetResponse>("/budgets/" + id + "/accept");

  return response.data;
};

export const updateBudgetStatus = async ({
  id,
  status,
}: BudgetActionInput & { status: BudgetStatus }) => {
  const response = await api.patch<BudgetResponse>(
    "/budgets/" + id + "/status",
    { status },
  );

  return response.data;
};

export const convertBudget = async ({ id }: BudgetActionInput) => {
  const response = await api.post<BudgetResponse>(
    "/budgets/" + id + "/convert",
  );

  return response.data;
};
