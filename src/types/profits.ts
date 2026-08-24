export type WeeklyProfit = {
  weekStart: string;
  weekEnd: string;
  grossProfitAmount: string;
  expenseAmount: string;
  netProfitAmount: string;
  workOrderCount: number;
  expenseCount: number;
};

export type WeeklyProfitResponse = {
  weeklyProfit: WeeklyProfit;
};

export type WeeklyProfitFilters = {
  weekStart?: string;
};
