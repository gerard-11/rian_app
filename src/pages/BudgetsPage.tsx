import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  FileText,
  LoaderCircle,
  Pencil,
  RotateCcw,
  Phone,
  Search,
  Wrench,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { capitalizeDisplayText } from "../lib/textFormatters";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { BudgetPreviewModal } from "./budgets/components/BudgetPreviewModal";
import {
  useAcceptBudget,
  useBudgets,
  useConvertBudget,
  useRejectBudget,
  useReopenBudget,
} from "../hooks/useBudgets";
import { ActionsMenu } from "../components/ActionsMenu";
import { getApiErrorMessage } from "../utils/apiError";
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
    return "inline-flex h-9 items-center rounded-md border border-emerald-600 bg-emerald-600 px-2.5 text-xs font-bold text-white";
  }

  if (budgetStatus === "CONVERTED") {
    return "inline-flex h-9 items-center rounded-md border border-[#B3262D]/30 bg-[#B3262D]/10 px-2 text-xs font-bold text-[#B3262D]";
  }

  if (budgetStatus === "EXPIRED") {
    return "inline-flex h-9 items-center rounded-md border border-slate-300 bg-slate-200 px-2.5 text-xs font-bold text-slate-700";
  }

  if (budgetStatus === "CANCELLED" || budgetStatus === "REJECTED") {
    return "inline-flex h-9 items-center rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-2 text-xs font-bold text-[#a41218]";
  }

  return "inline-flex h-9 items-center rounded-md border border-amber-500 bg-amber-500 px-2.5 text-xs font-bold text-white";
};

// Pendiente y aceptado se marcan con franja y fondo; el resto queda como estaba.
const getRowClass = (status: string) => {
  if (status === "ACCEPTED") return "border-emerald-500 bg-emerald-50";
  if (status === "PENDING") return "border-amber-400 bg-amber-50";

  return "border-transparent";
};

export function BudgetsPage() {
  const [search, setSearch] = useState("");
  const [selectedBudget, setSelectedBudget] =
    useState<Budget>();
  const [budgetToAccept, setBudgetToAccept] = useState<Budget>();
  const [budgetToConvert, setBudgetToConvert] = useState<Budget>();
  const [budgetToReject, setBudgetToReject] = useState<Budget>();
  const [budgetToReopen, setBudgetToReopen] = useState<Budget>();
  const { data: authData } = useAuthUser();
  const isAdmin = authData?.user?.role === "ADMIN";
  const budgetsQuery = useBudgets();
  const acceptBudget = useAcceptBudget();
  const convertBudget = useConvertBudget();
  const rejectBudget = useRejectBudget();
  const reopenBudget = useReopenBudget();
  const actionError =
    acceptBudget.error ?? convertBudget.error ?? rejectBudget.error ?? reopenBudget.error;
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

  const handleAccept = (budget: Budget) => {
    setBudgetToAccept(budget);
  };

  const confirmAccept = () => {
    if (!budgetToAccept) return;

    acceptBudget.mutate(
      { id: budgetToAccept.id },
      { onSuccess: () => setBudgetToAccept(undefined) },
    );
  };

  const handleConvert = (budget: Budget) => {
    setBudgetToConvert(budget);
  };

  const confirmConvert = () => {
    if (!budgetToConvert) return;

    convertBudget.mutate(
      { id: budgetToConvert.id },
      { onSuccess: () => setBudgetToConvert(undefined) },
    );
  };

  const handleReject = (budget: Budget) => {
    if (!isAdmin) return;

    setBudgetToReject(budget);
  };

  const confirmReopen = () => {
    if (!budgetToReopen) return;

    reopenBudget.mutate({ id: budgetToReopen.id }, {
      onSuccess: () => setBudgetToReopen(undefined),
    });
  };

  const confirmReject = () => {
    if (!budgetToReject) return;

    rejectBudget.mutate({ id: budgetToReject.id }, {
      onSuccess: () => setBudgetToReject(undefined),
    });
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

      {actionError ? (
        <div className="mb-5 flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          {getApiErrorMessage(actionError, "No se pudo actualizar el presupuesto. Intenta de nuevo.")}
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
                const isRejected = status === "REJECTED";
                const isConverted = status === "CONVERTED";
                const canEdit = status === "PENDING" || status === "ACCEPTED";
                const canReject = isAdmin && status === "PENDING";
                // El backend permite reabrir presupuestos vencidos y rechazados.
                const canReopen = isAdmin && (status === "EXPIRED" || isRejected);
                const isMutating =
                  acceptBudget.isPending ||
                  convertBudget.isPending ||
                  rejectBudget.isPending ||
                  reopenBudget.isPending;

                return (
                  <article
                    className={`grid gap-4 border-l-4 px-4 py-4 lg:grid-cols-[130px_minmax(0,1.2fr)_minmax(0,1fr)_150px_300px] lg:items-center ${getRowClass(status)}`}
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
                      <button
                        className="block max-w-full cursor-pointer truncate text-left text-sm font-semibold text-slate-950 underline-offset-4 transition hover:text-[#B3262D] hover:underline focus:outline-none focus:ring-2 focus:ring-[#B3262D] focus:ring-offset-2"
                        onClick={() => setSelectedBudget(budget)}
                        title="Ver detalle"
                        type="button"
                      >
                        {capitalizeDisplayText(getBudgetCustomerName(budget))}
                      </button>
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
                      <div className="mt-2">
                        <ActionsMenu
                          actions={[
                            ...(isConverted ? [] : [isRejected
                              ? { key: "view", label: "Ver presupuesto", icon: <FileText className="h-4 w-4" />, onClick: () => setSelectedBudget(budget) }
                              : { key: "note", label: "Crear nota", icon: <FileText className="h-4 w-4" />, to: "/budgets/" + budget.id + "/note" }]),
                            ...(canEdit ? [{ key: "edit", label: "Editar", icon: <Pencil className="h-4 w-4" />, to: "/budgets/" + budget.id + "/edit" }] : []),
                            ...(canAccept ? [{ key: "accept", label: "Aceptar", icon: <CheckCircle2 className="h-4 w-4" />, tone: "success" as const, disabled: isMutating, onClick: () => handleAccept(budget) }] : []),
                            ...(canConvert ? [{ key: "convert", label: "Convertir en orden", icon: <Wrench className="h-4 w-4" />, disabled: isMutating, onClick: () => handleConvert(budget) }] : []),
                            ...(canReopen ? [{ key: "reopen", label: "Reabrir", icon: <RotateCcw className="h-4 w-4" />, disabled: isMutating, onClick: () => setBudgetToReopen(budget) }] : []),
                            ...(canReject ? [{ key: "reject", label: "Rechazar", icon: <XCircle className="h-4 w-4" />, tone: "danger" as const, disabled: isMutating, onClick: () => handleReject(budget) }] : []),
                          ]}
                        />
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
      {selectedBudget ? (
        <BudgetPreviewModal
          budget={selectedBudget}
          isAdmin={isAdmin}
          onClose={() => setSelectedBudget(undefined)}
        />
      ) : null}
      {budgetToReopen ? (
        <ConfirmationModal
          confirmLabel="Sí, reabrir presupuesto"
          isPending={reopenBudget.isPending}
          message={
            <>
              ¿Quieres reabrir el presupuesto{" "}
              <strong className="text-slate-900">
                {getBudgetCode(budgetToReopen)}
              </strong>
              ? Volverá a estar pendiente.
            </>
          }
          onClose={() => {
            if (!reopenBudget.isPending) setBudgetToReopen(undefined);
          }}
          onConfirm={confirmReopen}
          title="Reabrir presupuesto"
        />
      ) : null}
      {budgetToReject ? (
        <ConfirmationModal
          confirmLabel="Sí, rechazar presupuesto"
          isPending={rejectBudget.isPending}
          message={
            <>
              ¿Quieres rechazar el presupuesto{" "}
              <strong className="text-slate-900">
                {getBudgetCode(budgetToReject)}
              </strong>
              ? Permanecerá disponible en el historial.
            </>
          }
          onClose={() => {
            if (!rejectBudget.isPending) setBudgetToReject(undefined);
          }}
          onConfirm={confirmReject}
          title="Rechazar presupuesto"
        />
      ) : null}
      {budgetToAccept ? (
        <ConfirmationModal
          confirmLabel="Sí, aceptar presupuesto"
          isPending={acceptBudget.isPending}
          message={
            <>
              ¿Quieres aceptar el presupuesto{" "}
              <strong className="text-slate-900">
                {getBudgetCode(budgetToAccept)}
              </strong>
              ? Después podrás convertirlo en una orden.
            </>
          }
          onClose={() => {
            if (!acceptBudget.isPending) setBudgetToAccept(undefined);
          }}
          onConfirm={confirmAccept}
          title="Aceptar presupuesto"
        />
      ) : null}
      {budgetToConvert ? (
        <ConfirmationModal
          confirmLabel="Sí, convertir en orden"
          isPending={convertBudget.isPending}
          message={
            <>
              ¿Quieres convertir el presupuesto{" "}
              <strong className="text-slate-900">
                {getBudgetCode(budgetToConvert)}
              </strong>
              ? Se creará una orden de trabajo.
            </>
          }
          onClose={() => {
            if (!convertBudget.isPending) setBudgetToConvert(undefined);
          }}
          onConfirm={confirmConvert}
          title="Convertir presupuesto"
        />
      ) : null}
    </>
  );
}
