import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  FileText,
  LoaderCircle,
  Phone,
  Search,
  Wrench,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { capitalizeDisplayText } from "../lib/textFormatters";
import {
  useAcceptBudget,
  useBudgets,
  useConvertBudget,
  useRejectBudget,
} from "../hooks/useBudgets";
import { useAuthUser } from "../hooks/useAuthUser";
import type { Budget } from "../types/budgets";
import {
  formatDate,
  formatMoney,
  getBudgetCode,
  getBudgetCustomerName,
  getBudgetCustomerPhone,
  getBudgetCreatedBy,
  getBudgetItemSummary,
  getBudgetStatus,
  getBudgetStatusLabel,
  getBudgetTotal,
  getBudgetVehicleLabel,
  normalizeBudgetsResponse,
} from "../utils/budgetsList";

const getStatusBadgeClass = (status?: string) => {
  const budgetStatus = getBudgetStatus(status) ?? "PENDING";

  if (budgetStatus === "ACCEPTED") {
    return "inline-flex h-9 items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 text-xs font-bold text-emerald-700";
  }

  if (budgetStatus === "CONVERTED") {
    return "inline-flex h-9 items-center rounded-md border border-[#B3262D]/30 bg-[#B3262D]/10 px-2 text-xs font-bold text-[#B3262D]";
  }

  if (budgetStatus === "CANCELLED" || budgetStatus === "REJECTED") {
    return "inline-flex h-9 items-center rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-2 text-xs font-bold text-[#a41218]";
  }

  return "inline-flex h-9 items-center rounded-md border border-slate-200 bg-slate-50 px-2 text-xs font-bold text-slate-700";
};

export function BudgetsPage() {
  const [search, setSearch] = useState("");
  const { data: authData } = useAuthUser();
  const isAdmin = authData?.user?.role === "ADMIN";
  const budgetsQuery = useBudgets();
  const acceptBudget = useAcceptBudget();
  const convertBudget = useConvertBudget();
  const rejectBudget = useRejectBudget();
  const budgets = useMemo(
    () =>
      budgetsQuery.data ? normalizeBudgetsResponse(budgetsQuery.data) : [],
    [budgetsQuery.data],
  );
  const filteredBudgets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return budgets;

    return budgets.filter((budget) => {
      const searchableText = [
        getBudgetCode(budget),
        getBudgetCustomerName(budget),
        getBudgetCustomerPhone(budget),
        getBudgetVehicleLabel(budget),
        getBudgetStatusLabel(budget.status),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [budgets, search]);

  const handleAccept = (id: Budget["id"]) => {
    acceptBudget.mutate({ id });
  };

  const handleConvert = (id: Budget["id"]) => {
    convertBudget.mutate({ id });
  };

  const handleReject = (budget: Budget) => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      `¿Rechazar el presupuesto ${getBudgetCode(budget)}? Se conservará en el historial.`,
    );

    if (!confirmed) return;

    rejectBudget.mutate({ id: budget.id });
  };

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B3262D]/10 text-[#B3262D]">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950">
              {budgets.length} presupuestos registrados
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Captura, autorizacion y conversion a orden.
            </p>
          </div>
        </div>

        <div className="flex h-11 w-full items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#B3262D] focus-within:ring-4 focus-within:ring-[#B3262D]/15 sm:max-w-sm">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-400"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar presupuesto, cliente, telefono o vehiculo"
            value={search}
          />
        </div>
      </div>

      {budgetsQuery.isLoading ? (
        <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm">
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#B3262D]" />
          Cargando presupuestos...
        </div>
      ) : null}

      {budgetsQuery.isError ? (
        <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          No se pudieron cargar los presupuestos.
        </div>
      ) : null}

      {acceptBudget.isError || convertBudget.isError || rejectBudget.isError ? (
        <div className="mb-5 flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          No se pudo actualizar el presupuesto. Intenta de nuevo.
        </div>
      ) : null}

      {!budgetsQuery.isLoading && !budgetsQuery.isError ? (
        filteredBudgets.length ? (
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[130px_minmax(0,1.2fr)_minmax(0,1fr)_150px_300px] gap-4 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-bold uppercase text-slate-500 lg:grid">
              <span>Presupuesto</span>
              <span>Cliente</span>
              <span>Vehiculo</span>
              <span>Total</span>
              <span>Acciones</span>
            </div>

            <div className="divide-y divide-slate-200">
              {filteredBudgets.map((budget) => {
                const status = getBudgetStatus(budget.status) ?? "PENDING";
                const canAccept = status === "PENDING";
                const canConvert = status === "ACCEPTED";
                const canReject = isAdmin && status === "PENDING";
                const isMutating =
                  acceptBudget.isPending ||
                  convertBudget.isPending ||
                  rejectBudget.isPending;

                return (
                  <article
                    className="grid gap-4 px-4 py-4 lg:grid-cols-[130px_minmax(0,1.2fr)_minmax(0,1fr)_150px_300px] lg:items-center"
                    key={budget.id}
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-950">
                        {getBudgetCode(budget)}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {formatDate(budget.createdAt)}
                      </p>
                      <p className="mt-1 truncate text-xs font-medium text-slate-500">
                        Creado por: {getBudgetCreatedBy(budget)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {capitalizeDisplayText(getBudgetCustomerName(budget))}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                        <Phone className="h-3.5 w-3.5" />
                        {getBudgetCustomerPhone(budget)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="flex items-center gap-1 truncate text-sm font-semibold text-slate-800">
                        <Wrench className="h-4 w-4 shrink-0 text-slate-400" />
                        {getBudgetVehicleLabel(budget)}
                      </p>
                      <p className="mt-1 truncate text-xs font-medium text-slate-500">
                        {getBudgetItemSummary(budget.items)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-950">
                        {formatMoney(getBudgetTotal(budget))}
                      </p>
                    </div>

                    <div>
                      <span className={getStatusBadgeClass(budget.status)}>
                        {getBudgetStatusLabel(budget.status)}
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Link
                          className="flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-[#B3262D]/15"
                          to={"/budgets/" + budget.id + "/note"}
                        >
                          <FileText className="h-4 w-4" />
                          Crear nota
                        </Link>
                        {canAccept ? (
                          <button
                            className="flex h-9 items-center gap-1.5 rounded-md bg-emerald-600 px-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-slate-300"
                            disabled={isMutating}
                            onClick={() => handleAccept(budget.id)}
                            type="button"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Aceptar
                          </button>
                        ) : null}
                        {canReject ? (
                          <button
                            className="flex h-9 items-center gap-1.5 rounded-md border border-[#d71920]/30 bg-white px-2.5 text-xs font-bold text-[#a41218] transition hover:bg-[#d71920]/10 focus:outline-none focus:ring-4 focus:ring-[#d71920]/15 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                            disabled={isMutating}
                            onClick={() => handleReject(budget)}
                            type="button"
                          >
                            <XCircle className="h-4 w-4" />
                            Rechazar
                          </button>
                        ) : null}
                        {canConvert ? (
                          <button
                            className="flex h-9 items-center gap-1.5 rounded-md bg-[#B3262D] px-2.5 text-xs font-bold text-white transition hover:bg-[#8F1D24] focus:outline-none focus:ring-4 focus:ring-[#B3262D]/20 disabled:cursor-not-allowed disabled:bg-slate-300"
                            disabled={isMutating}
                            onClick={() => handleConvert(budget.id)}
                            type="button"
                          >
                            <Wrench className="h-4 w-4" />
                            Convertir
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-center shadow-sm">
            <div>
              <ClipboardList className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-950">
                No hay presupuestos para mostrar
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Crea un presupuesto rapido para verlo aqui.
              </p>
            </div>
          </div>
        )
      ) : null}
    </>
  );
}
