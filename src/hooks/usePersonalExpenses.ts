import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPersonalExpense,
  deletePersonalExpense,
  getPersonalExpenseById,
  getPersonalExpenses,
  getPersonalExpensesSummary,
  updatePersonalExpense,
} from "../services/personalExpensesService";
import type {
  CreatePersonalExpenseInput,
  ListPersonalExpensesQuery,
  PersonalExpense,
  UpdatePersonalExpenseInput,
} from "../types/personalExpenses";

export const personalExpensesQueryKeys = {
  all: ["personal-expenses"] as const,
  detail: (id: PersonalExpense["id"]) =>
    [...personalExpensesQueryKeys.all, "detail", id] as const,
  lists: () => [...personalExpensesQueryKeys.all, "list"] as const,
  list: (query: ListPersonalExpensesQuery = {}) =>
    [
      ...personalExpensesQueryKeys.lists(),
      query.dateFrom || "",
      query.dateTo || "",
      query.search || "",
    ] as const,
  summary: () => [...personalExpensesQueryKeys.all, "summary"] as const,
};

export const usePersonalExpenses = (
  query: ListPersonalExpensesQuery = {},
) =>
  useQuery({
    queryFn: () => getPersonalExpenses(query),
    queryKey: personalExpensesQueryKeys.list(query),
  });

export const usePersonalExpensesSummary = () =>
  useQuery({
    queryFn: getPersonalExpensesSummary,
    queryKey: personalExpensesQueryKeys.summary(),
  });

export const usePersonalExpense = (id?: PersonalExpense["id"]) =>
  useQuery({
    enabled: id !== undefined && id !== "",
    queryFn: () => getPersonalExpenseById(id as PersonalExpense["id"]),
    queryKey: personalExpensesQueryKeys.detail(id ?? ""),
  });

export const useCreatePersonalExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePersonalExpenseInput) =>
      createPersonalExpense(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: personalExpensesQueryKeys.all,
      });
    },
  });
};

export const useUpdatePersonalExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      id: PersonalExpense["id"];
      payload: UpdatePersonalExpenseInput;
    }) => updatePersonalExpense(variables),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: personalExpensesQueryKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: personalExpensesQueryKeys.detail(variables.id),
      });
    },
  });
};

export const useDeletePersonalExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: PersonalExpense["id"]) => deletePersonalExpense(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: personalExpensesQueryKeys.all,
      });
    },
  });
};
