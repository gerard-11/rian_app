import { AlertCircle, LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { WorkOrder } from "../../../types/workOrders";
import {
  formatDate,
  formatMoney,
  getCustomerName,
  getStatusLabel,
  getVehicleLabel,
  getWorkOrderCode,
  getWorkOrderStatus,
  getWorkOrderTotal,
} from "../../../utils/workOrdersList";

type DashboardRecentWorkOrdersProps = {
  isError: boolean;
  isLoading: boolean;
  workOrders: WorkOrder[];
};

const getStatusBadgeClass = (status?: string) => {
  const workOrderStatus = getWorkOrderStatus(status) ?? "ACTIVE";

  if (workOrderStatus === "COMPLETED") {
    return "inline-flex h-8 items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 text-xs font-bold text-emerald-700";
  }

  if (workOrderStatus === "CANCELLED") {
    return "inline-flex h-8 items-center rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-2 text-xs font-bold text-[#a41218]";
  }

  return "inline-flex h-8 items-center rounded-md border border-slate-200 bg-slate-50 px-2 text-xs font-bold text-slate-700";
};

export function DashboardRecentWorkOrders({
  isError,
  isLoading,
  workOrders,
}: DashboardRecentWorkOrdersProps) {
  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-950">
            Ordenes recientes
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ultimos trabajos capturados en el sistema.
          </p>
        </div>
        <Link
          className="flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
          to="/work-orders"
        >
          Ver todas
        </Link>
      </div>

      {isLoading ? (
        <div className="flex min-h-40 items-center justify-center text-sm font-semibold text-slate-600">
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#4169e1]" />
          Cargando ordenes...
        </div>
      ) : null}

      {isError ? (
        <div className="m-5 flex items-start gap-2 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-3 py-2 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          No se pudieron cargar las ordenes recientes.
        </div>
      ) : null}

      {!isLoading && !isError ? (
        workOrders.length ? (
          <div>
            <div className="hidden grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)_120px_120px] gap-4 border-b border-slate-200 bg-slate-100 px-5 py-3 text-xs font-bold uppercase text-slate-500 lg:grid">
              <span>Orden</span>
              <span>Cliente</span>
              <span>Vehiculo</span>
              <span>Estado</span>
              <span>Total</span>
            </div>
            <div className="divide-y divide-slate-200">
              {workOrders.map((workOrder) => (
                <article
                  className="grid gap-3 px-5 py-4 lg:grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)_120px_120px] lg:items-center"
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
                  <p className="min-w-0 truncate text-sm font-semibold text-slate-950">
                    {getCustomerName(workOrder)}
                  </p>
                  <p className="min-w-0 truncate text-sm font-medium text-slate-600">
                    {getVehicleLabel(workOrder)}
                  </p>
                  <div>
                    <span className={getStatusBadgeClass(workOrder.status)}>
                      {getStatusLabel(workOrder.status)}
                    </span>
                  </div>
                  <p className="text-sm font-black text-slate-950">
                    {formatMoney(getWorkOrderTotal(workOrder))}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-bold text-slate-950">
              No hay ordenes recientes
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Crea una orden para verla aqui.
            </p>
          </div>
        )
      ) : null}
    </section>
  );
}
