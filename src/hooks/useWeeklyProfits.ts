import { useQuery } from "@tanstack/react-query";
import { getWeeklyProfit } from "../services/profitsService";
import type { WeeklyProfitFilters } from "../types/profits";

export const weeklyProfitsQueryKeys = {
  all: ["profits", "weekly"] as const,
  detail: (filters: WeeklyProfitFilters = {}) =>
    [...weeklyProfitsQueryKeys.all, filters.weekStart || "current"] as const,
};

export const useWeeklyProfit = (filters: WeeklyProfitFilters = {}) =>
  useQuery({
    queryFn: () => getWeeklyProfit(filters),
    queryKey: weeklyProfitsQueryKeys.detail(filters),
  });
