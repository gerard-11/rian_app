export type PersonalExpense = {
  id: string;
  description: string;
  amount: number | string;
  spentAt: string;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreatePersonalExpenseInput = {
  description: string;
  amount: number;
  spentAt: string;
  notes?: string;
};

export type UpdatePersonalExpenseInput = Partial<CreatePersonalExpenseInput>;

export type PersonalExpenseResponse =
  | PersonalExpense
  | {
      data?: PersonalExpense;
      personalExpense?: PersonalExpense;
    };

export type PersonalExpensesResponse =
  | PersonalExpense[]
  | {
      data?: PersonalExpense[];
      items?: PersonalExpense[];
      personalExpenses?: PersonalExpense[];
    };

export type PersonalExpensesSummary = {
  count?: number;
  total?: number | string;
  totalAmount?: number | string;
  totalPersonalExpenses?: number | string;
};

export type PersonalExpensesSummaryResponse = PersonalExpensesSummary & {
  data?: PersonalExpensesSummary;
  summary?: PersonalExpensesSummary;
};

export type ListPersonalExpensesQuery = {
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};
