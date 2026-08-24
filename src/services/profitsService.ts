import api from "./api";
import type {
  WeeklyProfitFilters,
  WeeklyProfitResponse,
} from "../types/profits";

export const getWeeklyProfit = async (filters: WeeklyProfitFilters = {}) => {
  const response = await api.get<WeeklyProfitResponse>("/profits/weekly", {
    params: {
      weekStart: filters.weekStart || undefined,
    },
  });

  return response.data;
};
