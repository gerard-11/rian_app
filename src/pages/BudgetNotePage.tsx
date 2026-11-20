import { AlertCircle, ArrowLeft, LoaderCircle } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { BudgetNoteDocument } from "./budgets/components/BudgetNoteDocument";
import { NoteActions } from "../features/notes/NoteActions";
import { buildBudgetNoteData } from "../features/notes/noteData";
import { buildNoteFileName, buildNoteWhatsappUrl } from "../features/notes/noteSharing";
import { useNotePdf } from "../features/notes/useNotePdf";
import { useBudget } from "../hooks/useBudgets";
import { normalizeBudgetResponse } from "../utils/budgetsList";

export function BudgetNotePage() {
  const { id } = useParams<{ id: string }>();
  const budgetQuery = useBudget(id);
  const budget = useMemo(
    () =>
      budgetQuery.data ? normalizeBudgetResponse(budgetQuery.data) : undefined,
    [budgetQuery.data],
  );
  const noteData = useMemo(
    () => (budget ? buildBudgetNoteData(budget) : undefined),
    [budget],
  );
  const notePdf = useNotePdf(noteData);

  return (
    <>
      <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm print:hidden sm:flex-row sm:items-center sm:justify-between">
        <Link
          className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#B3262D] focus:ring-offset-2"
          to="/budgets"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a presupuestos
        </Link>
        {budget ? (
          <NoteActions
            fileName={buildNoteFileName(budget)}
            pdf={notePdf}
            whatsappUrl={buildNoteWhatsappUrl("budget", budget)}
          />
        ) : null}
      </div>

      {budgetQuery.isLoading ? (
        <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm">
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#B3262D]" />
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
