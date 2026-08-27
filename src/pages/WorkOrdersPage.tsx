import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  FileText,
  Pencil,
  LoaderCircle,
  Phone,
  Search,
  Wrench,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CustomerDetailModal } from "./work-orders/components/CustomerDetailModal";
import { capitalizeDisplayText } from "../lib/textFormatters";
import {
  useCancelWorkOrder,
  useCompleteWorkOrder,
  useWorkOrders,
} from "../hooks/useWorkOrders";
import type { WorkOrder } from "../types/workOrders";
import {
  formatDate,
  formatMoney,
  getCustomerName,
  getCustomerPhone,
  getItemSummary,
  getWorkOrderAdvanceAmount,
  getWorkOrderPendingBalance,
  getStatusLabel,
  getVehicleLabel,
  getWorkOrderStatus,
  getWorkOrderCode,
  getWorkOrderTotal,
  normalizeWorkOrdersResponse,
} from "../utils/workOrdersList";

const isActiveWorkOrder = (workOrder: WorkOrder) =>
  (getWorkOrderStatus(workOrder.status) ?? "ACTIVE") === "ACTIVE";

type WorkOrdersLocationState = {
  workOrderCreated?: boolean;
  workOrderUpdated?: boolean;
};

const getStatusBadgeClass = (status?: string) => {
  const workOrderStatus = getWorkOrderStatus(status) ?? "ACTIVE";

  if (workOrderStatus === "COMPLETED") {
    return "inline-flex h-9 items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 text-xs font-bold text-emerald-700";
  }

  if (workOrderStatus === "CANCELLED") {
    return "inline-flex h-9 items-center rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-2 text-xs font-bold text-[#a41218]";
  }

  return "inline-flex h-9 items-center rounded-md border border-slate-200 bg-slate-50 px-2 text-xs font-bold text-slate-700";
};

export function WorkOrdersPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as WorkOrdersLocationState | null;
  const [successMessage, setSuccessMessage] = useState<string | undefined>(
    locationState?.workOrderCreated
      ? "La orden se creó correctamente."
      : locationState?.workOrderUpdated
        ? "La orden se actualizó correctamente."
        : undefined,
  );
  const [search, setSearch] = useState("");
  const [selectedCustomerWorkOrder, setSelectedCustomerWorkOrder] =
    useState<WorkOrder>();
  const workOrdersQuery = useWorkOrders();
  const completeWorkOrder = useCompleteWorkOrder();
  const cancelWorkOrder = useCancelWorkOrder();

  useEffect(() => {
    if (!successMessage) return;

    navigate(location.pathname, { replace: true, state: null });

    const timeout = window.setTimeout(() => {
      setSuccessMessage(undefined);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [location.pathname, navigate, successMessage]);
  const workOrders = useMemo(
    () =>
      workOrdersQuery.data
        ? normalizeWorkOrdersResponse(workOrdersQuery.data)
        : [],
    [workOrdersQuery.data],
  );
  const filteredWorkOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return workOrders;

    return workOrders.filter((workOrder) => {
      const searchableText = [
        getWorkOrderCode(workOrder),
        getCustomerName(workOrder),
        getCustomerPhone(workOrder),
        getVehicleLabel(workOrder),
        getStatusLabel(workOrder.status),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [search, workOrders]);

  const handleComplete = (id: WorkOrder["id"]) => {
    completeWorkOrder.mutate({ id });
  };

  const handleCancel = (id: WorkOrder["id"]) => {
    cancelWorkOrder.mutate({ id });
  };

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4169e1]/10 text-[#4169e1]">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950">
              {workOrders.length} ordenes registradas
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Creacion por orden rapida y consulta general.
            </p>
          </div>
        </div>

        <div className="flex h-11 w-full items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#4169e1] focus-within:ring-4 focus-within:ring-[#4169e1]/15 sm:max-w-sm">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-400"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar orden, cliente, telefono o vehiculo"
            value={search}
          />
        </div>
      </div>

      {workOrdersQuery.isLoading ? (
        <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm">
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#4169e1]" />
          Cargando ordenes...
        </div>
      ) : null}

      {workOrdersQuery.isError ? (
        <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          No se pudieron cargar las ordenes. Revisa la conexion con el backend e
          intenta de nuevo.
        </div>
      ) : null}

      {completeWorkOrder.isError ? (
        <div className="mb-5 flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          No se pudo liquidar la orden. Intenta de nuevo.
        </div>
      ) : null}

      {cancelWorkOrder.isError ? (
        <div className="mb-5 flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          No se pudo cancelar la orden. Intenta de nuevo.
        </div>
      ) : null}

      {!workOrdersQuery.isLoading && !workOrdersQuery.isError ? (
        filteredWorkOrders.length ? (
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[120px_minmax(0,1.2fr)_minmax(0,1fr)_190px_260px] gap-4 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-bold uppercase text-slate-500 lg:grid">
              <span>Orden</span>
              <span>Cliente</span>
              <span>Vehiculo</span>
              <span>Total</span>
              <span>Acciones</span>
            </div>

            <div className="divide-y divide-slate-200">
              {filteredWorkOrders.map((workOrder) => {
                const isActive = isActiveWorkOrder(workOrder);
                const isMutating =
                  completeWorkOrder.isPending || cancelWorkOrder.isPending;

                return (
                  <article
                    className="grid gap-4 px-4 py-4 lg:grid-cols-[120px_minmax(0,1.2fr)_minmax(0,1fr)_190px_260px] lg:items-center"
                    key={workOrder.id}
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-950">
                        {getWorkOrderCode(workOrder)}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {formatDate(workOrder.createdAt)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <button
                        className="block max-w-full truncate text-left text-sm font-semibold text-slate-950 transition hover:text-[#4169e1] focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
                        onClick={() => setSelectedCustomerWorkOrder(workOrder)}
                        type="button"
                      >
                        {capitalizeDisplayText(getCustomerName(workOrder))}
                      </button>
                      <p className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                        <Phone className="h-3.5 w-3.5" />
                        {getCustomerPhone(workOrder)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="flex items-center gap-1 truncate text-sm font-semibold text-slate-800">
                        <Wrench className="h-4 w-4 shrink-0 text-slate-400" />
                        {getVehicleLabel(workOrder)}
                      </p>
                      <p className="mt-1 truncate text-xs font-medium text-slate-500">
                        {getItemSummary(workOrder.items)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-950">
                        {formatMoney(getWorkOrderTotal(workOrder))}
                      </p>
                      {isActive ? (
                        <>
                          <p className="mt-1 text-xs font-medium text-slate-500">
                            Anticipo{" "}
                            {formatMoney(getWorkOrderAdvanceAmount(workOrder))}
                          </p>
                          <p className="mt-1 text-xs font-bold text-[#4169e1]">
                            Saldo{" "}
                            {formatMoney(getWorkOrderPendingBalance(workOrder))}
                          </p>
                        </>
                      ) : null}
                    </div>

                    <div>
                      <span className={getStatusBadgeClass(workOrder.status)}>
                        {getStatusLabel(workOrder.status)}
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Link
                          className="flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-[#4169e1]/15"
                          to={"/work-orders/" + workOrder.id + "/note"}
                        >
                          <FileText className="h-4 w-4" />
                          Crear nota
                        </Link>
                        {isActive ? (
                          <>
                            <Link
                              className="flex h-9 items-center gap-1.5 rounded-md border border-[#4169e1]/40 bg-white px-2.5 text-xs font-bold text-[#4169e1] transition hover:bg-[#4169e1]/10 focus:outline-none focus:ring-4 focus:ring-[#4169e1]/15"
                              to={"/work-orders/" + workOrder.id + "/edit"}
                            >
                              <Pencil className="h-4 w-4" />
                              Editar
                            </Link>
                            <button
                              className="flex h-9 items-center gap-1.5 rounded-md bg-emerald-600 px-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-slate-300"
                              disabled={isMutating}
                              onClick={() => handleComplete(workOrder.id)}
                              type="button"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Liquidar
                            </button>
                            <button
                              className="flex h-9 items-center gap-1.5 rounded-md border border-[#d71920]/30 bg-white px-2.5 text-xs font-bold text-[#a41218] transition hover:bg-[#d71920]/10 focus:outline-none focus:ring-4 focus:ring-[#d71920]/15 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                              disabled={isMutating}
                              onClick={() => handleCancel(workOrder.id)}
                              type="button"
                            >
                              <XCircle className="h-4 w-4" />
                              Cancelar
                            </button>
                          </>
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
                No hay ordenes para mostrar
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Crea una orden rapida para verla en este listado.
              </p>
            </div>
          </div>
        )
      ) : null}
      {selectedCustomerWorkOrder ? (
        <CustomerDetailModal
          onClose={() => setSelectedCustomerWorkOrder(undefined)}
          selectedWorkOrder={selectedCustomerWorkOrder}
          workOrders={workOrders}
        />
      ) : null}
      {successMessage ? (
        <div
          aria-live="polite"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-lg sm:inset-x-auto sm:right-6 sm:bottom-6"
          role="status"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="flex-1">{successMessage}</span>
          <button
            aria-label="Cerrar mensaje"
            className="rounded p-1 text-emerald-700 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            onClick={() => setSuccessMessage(undefined)}
            type="button"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </>
  );
}
