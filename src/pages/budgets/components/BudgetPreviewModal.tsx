import { X } from "lucide-react";
import type { Budget } from "../../../types/budgets";
import {
  formatDate,
  formatMoney,
  getBudgetCode,
  getBudgetCustomerName,
  getBudgetCustomerPhone,
  getBudgetCreatedBy,
  getBudgetStatusLabel,
  getBudgetTotal,
  getBudgetVehicleLabel,
} from "../../../utils/budgetsList";

type BudgetPreviewModalProps = {
  budget: Budget;
  onClose: () => void;
};

export function BudgetPreviewModal({
  budget,
  onClose,
}: BudgetPreviewModalProps) {
  return (
    <div
      aria-label="Vista previa del presupuesto"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
      role="dialog"
    >
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#B3262D]">
              Presupuesto rechazado
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">
              {getBudgetCode(budget)}
            </h2>
          </div>
          <button
            aria-label="Cerrar presupuesto"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#B3262D]"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Cliente
            </p>
            <p className="mt-1 text-sm font-bold text-slate-950">
              {getBudgetCustomerName(budget)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {getBudgetCustomerPhone(budget)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Vehículo
            </p>
            <p className="mt-1 text-sm font-bold text-slate-950">
              {getBudgetVehicleLabel(budget)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Creado por
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {getBudgetCreatedBy(budget)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Fecha
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {formatDate(budget.createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Conceptos
          </p>
          <div className="mt-3 divide-y divide-slate-200">
            {budget.items?.length ? (
              budget.items.map((item, index) => (
                <div
                  className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  key={item.id ?? `${item.description}-${index}`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.description || "Sin descripción"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.type}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-slate-900">
                    {formatMoney(item.saleAmount)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Sin conceptos registrados.</p>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Diagnóstico
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
              {budget.diagnosis || "Sin diagnóstico"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Notas
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
              {budget.notes || "Sin notas"}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-md bg-[#B3262D]/10 px-4 py-3">
          <span className="text-sm font-semibold text-[#8F1D24]">
            {getBudgetStatusLabel(budget.status)}
          </span>
          <span className="text-lg font-black text-[#8F1D24]">
            {formatMoney(getBudgetTotal(budget))}
          </span>
        </div>
      </div>
    </div>
  );
}
