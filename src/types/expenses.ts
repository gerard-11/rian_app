export type Expense = {
  id: string;
  description: string;
  amount: string;
  spentAt: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseResponse = {
  expense: Expense;
};

export type ExpensesResponse = {
  expenses: Expense[];
};

export type CreateExpensePayload = {
  description: string;
  amount: number;
  spentAt?: string;
  notes?: string;
};

export type UpdateExpensePayload = Partial<CreateExpensePayload>;

export type ListExpensesQuery = {
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};
