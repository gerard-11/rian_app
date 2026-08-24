import { AlertCircle, ArrowLeft, LoaderCircle, Printer } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { BudgetNoteDocument } from "./budgets/components/BudgetNoteDocument";
import { useBudget } from "../hooks/useBudgets";
import { normalizeBudgetResponse } from "../utils/budgetsList";

export function BudgetNotePage() {
  const { id } = useParams<{ id: string }>();
  const budgetQuery = useBudget(id);
  const budget = budgetQuery.data
    ? normalizeBudgetResponse(budgetQuery.data)
    : undefined;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm print:hidden sm:flex-row sm:items-center sm:justify-between">
        <Link
          className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
          to="/budgets"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a presupuestos
        </Link>
        <button
          className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#4169e1] px-4 text-sm font-semibold text-white shadow-lg shadow-[#4169e1]/20 transition hover:bg-[#3658c9] focus:outline-none focus:ring-4 focus:ring-[#4169e1]/25 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
          disabled={!budget}
          onClick={handlePrint}
          type="button"
        >
          <Printer className="h-4 w-4" />
          Imprimir / Guardar PDF
        </button>
      </div>

      {budgetQuery.isLoading ? (
        <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm">
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#4169e1]" />
          Cargando presupuesto...
        </div>
      ) : null}

      {budgetQuery.isError ? (
        <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          No se pudo cargar el presupuesto.
        </div>
      ) : null}

      {!budgetQuery.isLoading && !budgetQuery.isError && !budget ? (
        <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          La respuesta no incluye los datos del presupuesto.
        </div>
      ) : null}

      {budget ? <BudgetNoteDocument budget={budget} /> : null}
    </>
  );
}
