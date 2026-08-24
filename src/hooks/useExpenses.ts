import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExpense,
  deleteExpense,
  getExpenses,
} from "../services/expensesService";
import type {
  CreateExpensePayload,
  ListExpensesQuery,
} from "../types/expenses";
import { weeklyProfitsQueryKeys } from "./useWeeklyProfits";

export const expensesQueryKeys = {
  all: ["expenses"] as const,
  lists: () => [...expensesQueryKeys.all, "list"] as const,
  list: (query: ListExpensesQuery = {}) =>
    [
      ...expensesQueryKeys.lists(),
      query.dateFrom || "",
      query.dateTo || "",
      query.search || "",
    ] as const,
};

export const useExpenses = (query: ListExpensesQuery = {}) =>
  useQuery({
    queryFn: () => getExpenses(query),
    queryKey: expensesQueryKeys.list(query),
  });

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExpensePayload) => createExpense(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: expensesQueryKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: weeklyProfitsQueryKeys.all,
      });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: expensesQueryKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: weeklyProfitsQueryKeys.all,
      });
    },
  });
};
