import api from "./api";
import type {
  CreatePersonalExpenseInput,
  ListPersonalExpensesQuery,
  PersonalExpenseResponse,
  PersonalExpensesResponse,
  PersonalExpensesSummaryResponse,
  UpdatePersonalExpenseInput,
} from "../types/personalExpenses";

export const getPersonalExpenses = async (
  query: ListPersonalExpensesQuery = {},
) => {
  const response = await api.get<PersonalExpensesResponse>(
    "/personal-expenses",
    {
      params: {
        dateFrom: query.dateFrom || undefined,
        dateTo: query.dateTo || undefined,
        search: query.search || undefined,
      },
    },
  );

  return response.data;
};

export const getPersonalExpensesSummary = async () => {
  const response = await api.get<PersonalExpensesSummaryResponse>(
    "/personal-expenses/summary",
  );

  return response.data;
};

export const getPersonalExpenseById = async (id: string) => {
  const response = await api.get<PersonalExpenseResponse>(
    "/personal-expenses/" + id,
  );

  return response.data;
};

export const createPersonalExpense = async (
  payload: CreatePersonalExpenseInput,
) => {
  const response = await api.post<PersonalExpenseResponse>(
    "/personal-expenses",
    payload,
  );

  return response.data;
};

export const updatePersonalExpense = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdatePersonalExpenseInput;
}) => {
  const response = await api.patch<PersonalExpenseResponse>(
    "/personal-expenses/" + id,
    payload,
  );

  return response.data;
};

export const deletePersonalExpense = async (id: string) => {
  await api.delete("/personal-expenses/" + id);
};
