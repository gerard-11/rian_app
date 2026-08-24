import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workOrdersQueryKeys } from "./useWorkOrders";
import {
  acceptBudget,
  convertBudget,
  createQuickBudget,
  getBudgetById,
  getBudgets,
} from "../services/budgetsService";
import type {
  BudgetActionInput,
  CreateQuickBudgetInput,
} from "../types/budgets";

export const budgetsQueryKeys = {
  all: ["budgets"] as const,
  lists: () => [...budgetsQueryKeys.all, "list"] as const,
  detail: (id: BudgetActionInput["id"]) =>
    [...budgetsQueryKeys.all, "detail", id] as const,
};

export const useBudgets = () =>
  useQuery({
    queryFn: getBudgets,
    queryKey: budgetsQueryKeys.lists(),
  });

export const useBudget = (id?: BudgetActionInput["id"]) =>
  useQuery({
    enabled: id !== undefined && id !== "",
    queryFn: () => getBudgetById(id as BudgetActionInput["id"]),
    queryKey: budgetsQueryKeys.detail(id ?? ""),
  });

export const useCreateQuickBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQuickBudgetInput) => createQuickBudget(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: budgetsQueryKeys.all });
    },
  });
};

export const useAcceptBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BudgetActionInput) => acceptBudget(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: budgetsQueryKeys.all });
    },
  });
};

export const useConvertBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BudgetActionInput) => convertBudget(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: budgetsQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: workOrdersQueryKeys.all });
    },
  });
};
