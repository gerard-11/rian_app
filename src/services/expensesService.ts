import api from "./api";
import type {
  CreateExpensePayload,
  ExpenseResponse,
  ExpensesResponse,
  ListExpensesQuery,
} from "../types/expenses";

export const getExpenses = async (query: ListExpensesQuery = {}) => {
  const response = await api.get<ExpensesResponse>("/expenses", {
    params: {
      dateFrom: query.dateFrom || undefined,
      dateTo: query.dateTo || undefined,
      search: query.search || undefined,
    },
  });

  return response.data;
};

export const createExpense = async (payload: CreateExpensePayload) => {
  const response = await api.post<ExpenseResponse>("/expenses", payload);

  return response.data;
};

export const deleteExpense = async (id: string) => {
  await api.delete("/expenses/" + id);
};
