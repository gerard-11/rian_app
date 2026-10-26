import { User, X } from "lucide-react";
import { useMemo } from "react";
import { capitalizeDisplayText } from "../../../lib/textFormatters";
import type { WorkOrder } from "../../../types/workOrders";
import {
  formatDate,
  formatMoney,
  getWorkOrderCancelledBy,
  getWorkOrderCreatedBy,
  getCustomerName,
  getCustomerPhone,
  getStatusLabel,
  getVehicleLabel,
  getWorkOrderCode,
  getWorkOrderPendingBalance,
  getWorkOrderStatus,
  getWorkOrderTotal,
} from "../../../utils/workOrdersList";

type CustomerDetailModalProps = {
  isAdmin: boolean;
  onClose: () => void;
  selectedWorkOrder: WorkOrder;
  workOrders: WorkOrder[];
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

const getCustomerKey = (workOrder: WorkOrder) => {
  const customer = workOrder.customer;
  const id = String(customer?.id ?? "").trim();

  if (id) return "id:" + id;

  const phone = customer?.phone?.trim();

  if (phone) return "phone:" + phone;

  return "name:" + getCustomerName(workOrder).toLowerCase();
};

const isSameCustomer = (selectedWorkOrder: WorkOrder, workOrder: WorkOrder) =>
  getCustomerKey(selectedWorkOrder) === getCustomerKey(workOrder);

export function CustomerDetailModal({
  isAdmin,
  onClose,
  selectedWorkOrder,
  workOrders,
}: CustomerDetailModalProps) {
  const customerOrders = useMemo(
    () =>
      workOrders.filter((workOrder) =>
        isSameCustomer(selectedWorkOrder, workOrder),
      ),
    [selectedWorkOrder, workOrders],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 px-4 py-4 sm:items-center sm:justify-center">
      <section className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-md bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B3262D]/10 text-[#B3262D]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-[#d71920]">
                Cliente
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-950">
                {capitalizeDisplayText(getCustomerName(selectedWorkOrder))}
              </h2>
            </div>
          </div>
          <button
            aria-label="Cerrar detalle del cliente"
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-[#B3262D] focus:ring-offset-2"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-5 px-5 py-5">
          <section className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase text-slate-500">
                Telefono
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                {getCustomerPhone(selectedWorkOrder)}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase text-slate-500">
                Ordenes
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                {customerOrders.length}
              </p>
            </div>
          </section>

          <section>
            <p className="text-sm font-bold text-slate-950">
              Ordenes del cliente
            </p>
            <div className="mt-3 space-y-3">
              {customerOrders.map((workOrder) => (
                <article
                  className="rounded-md border border-slate-200 px-4 py-4"
                  key={workOrder.id}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-slate-950">
                          {getWorkOrderCode(workOrder)}
                        </p>
                        <span className={getStatusBadgeClass(workOrder.status)}>
                          {getStatusLabel(workOrder.status)}
                        </span>
                      </div>
                      <p className="mt-2 truncate text-sm font-semibold text-slate-800">
                        {getVehicleLabel(workOrder)}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {formatDate(workOrder.createdAt)}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        Creada por: {getWorkOrderCreatedBy(workOrder)}
                      </p>
                      {getWorkOrderStatus(workOrder.status) === "CANCELLED" ? (
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          Cancelada por: {getWorkOrderCancelledBy(workOrder)}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-950">
                        {formatMoney(getWorkOrderTotal(workOrder))}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Saldo: {formatMoney(getWorkOrderPendingBalance(workOrder))}
                      </p>
                      {isAdmin ? (
                        <p className="mt-1 text-xs font-bold text-emerald-700">
                          Ganancia total: {workOrder.grossProfitAmount !== undefined
                            ? formatMoney(workOrder.grossProfitAmount)
                            : "No disponible"}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {workOrder.diagnosis ? (
                    <div className="mt-4 rounded-md bg-slate-50 p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Diagnostico
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm font-medium text-slate-700">
                        {workOrder.diagnosis}
                      </p>
                    </div>
                  ) : null}

                  {workOrder.notes ? (
                    <div className="mt-3 rounded-md bg-slate-50 p-3">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Notas
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm font-medium text-slate-700">
                        {workOrder.notes}
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Items
                    </p>
                    {workOrder.items?.length ? (
                      <div className="mt-2 divide-y divide-slate-200 rounded-md border border-slate-200">
                        {workOrder.items.map((item, index) => (
                          <div
                            className={`grid gap-2 px-3 py-3 sm:items-center ${isAdmin ? "sm:grid-cols-[minmax(0,1fr)_110px_110px]" : "sm:grid-cols-[minmax(0,1fr)_110px]"}`}
                            key={item.id ?? index}
                          >
                            <p className="min-w-0 text-sm font-semibold text-slate-800">
                              {item.description}
                            </p>
                            <p className="text-sm font-bold text-slate-950">
                              {formatMoney(item.saleAmount)}
                            </p>
                            {isAdmin ? (
                              <p className="text-xs font-semibold text-slate-500">
                                Costo {formatMoney(item.costAmount)}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm font-medium text-slate-500">
                        Sin items registrados.
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
