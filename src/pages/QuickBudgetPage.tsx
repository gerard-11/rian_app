import { useNavigate } from "react-router-dom";
import { useCreateQuickBudget } from "../hooks/useBudgets";
import { buildQuickBudgetPayload } from "../utils/quickBudgetForm";
import { QuickEntryForm } from "./work-orders/components/QuickEntryForm";

export function QuickBudgetPage() {
  const createQuickBudget = useCreateQuickBudget();
  const navigate = useNavigate();

  return (
    <QuickEntryForm
      error={createQuickBudget.error}
      isPending={createQuickBudget.isPending}
      mode="budget"
      onSubmit={(values) =>
        createQuickBudget.mutate(buildQuickBudgetPayload(values), {
          onSuccess: () => navigate("/budgets", { replace: true }),
        })
      }
    />
  );
}
