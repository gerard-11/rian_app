import { AlertCircle, ArrowLeft, LoaderCircle } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import { useBudget, useUpdateBudget } from "../hooks/useBudgets";
import { BUDGET_STATUSES, BUDGET_STATUS_LABELS, type BudgetStatus } from "../types/budgets";
import { getBudgetStatus, normalizeBudgetResponse } from "../utils/budgetsList";
import { buildUpdateEntryPayload, getEditWorkOrderValues } from "../utils/editWorkOrderForm";
import { EditEntryForm } from "./work-orders/components/EditEntryForm";

// Un presupuesto solo se edita mientras sigue vigente (pendiente o aceptado).
const EDITABLE_STATUSES = ["PENDING", "ACCEPTED"];

export function EditBudgetPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: authData } = useAuthUser();
  const isAdmin = authData?.user?.role === "ADMIN";
  const budgetQuery = useBudget(id);
  const updateBudget = useUpdateBudget();
  const budget = budgetQuery.data ? normalizeBudgetResponse(budgetQuery.data) : undefined;
  const initialValues = useMemo(() => (budget ? getEditWorkOrderValues(budget) : undefined), [budget]);

  if (budgetQuery.isLoading) return <div className="flex min-h-64 items-center justify-center rounded-md border bg-white"><LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#B3262D]" />Cargando presupuesto...</div>;
  if (budgetQuery.isError || !budget || !initialValues) return <div className="rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-[#a41218]">No se pudo cargar el presupuesto.</div>;
  if (!EDITABLE_STATUSES.includes(getBudgetStatus(budget.status) ?? "PENDING")) return <div className="space-y-4"><div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900"><AlertCircle className="h-5 w-5 shrink-0" />Solo se pueden editar presupuestos pendientes o aceptados.</div><Link className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold" to="/budgets"><ArrowLeft className="h-4 w-4" />Volver</Link></div>;

  return (
    <EditEntryForm
      cancelTo="/budgets"
      error={updateBudget.error}
      initialValues={initialValues}
      isPending={updateBudget.isPending}
      mode="budget"
      statusOptions={isAdmin ? BUDGET_STATUSES.map((value) => ({ value, label: BUDGET_STATUS_LABELS[value] })) : undefined}
      onSubmit={(values) => updateBudget.mutate(
        { id: budget.id, payload: { ...buildUpdateEntryPayload(values), ...(isAdmin && values.status && values.status !== initialValues.status ? { status: values.status as BudgetStatus } : {}) } },
        { onSuccess: () => navigate("/budgets", { replace: true }) },
      )}
    />
  );
}
