import {
  AlertCircle,
  ClipboardList,
  ClipboardPlus,
  LoaderCircle,
  Phone,
  Search,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useWorkOrders } from "../hooks/useWorkOrders";
import {
  formatDate,
  formatMoney,
  getCustomerName,
  getCustomerPhone,
  getItemSummary,
  getStatusLabel,
  getVehicleLabel,
  getWorkOrderCode,
  getWorkOrderTotal,
  normalizeWorkOrdersResponse,
} from "../utils/workOrdersList";

export function             WorkOrdersPage() {
  const [search, setSearch] = useState("");
  const workOrdersQuery = useWorkOrders();
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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4169e1] text-lg font-black text-white">
              RA
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">Rian Automotriz</p>
              <p className="text-xs font-medium text-slate-500">Admin</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            <Link
              className="flex h-10 items-center rounded-md px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              to="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="flex h-10 items-center rounded-md bg-[#4169e1]/10 px-3 text-sm font-semibold text-[#4169e1]"
              to="/work-orders"
            >
              Ordenes
            </Link>
            <Link
              className="flex h-10 items-center rounded-md px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              to="/work-orders/quick-entry"
            >
              Orden rapida
            </Link>
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase text-[#d71920]">
                  Ordenes de trabajo
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-950">
                  Ordenes
                </h1>
              </div>
              <Link
                className="flex h-10 items-center gap-2 rounded-md bg-[#4169e1] px-3 text-sm font-semibold text-white shadow-lg shadow-[#4169e1]/20 transition hover:bg-[#3658c9] focus:outline-none focus:ring-4 focus:ring-[#4169e1]/25"
                to="/work-orders/quick-entry"
              >
                <ClipboardPlus className="h-4 w-4" />
                Crear orden
              </Link>
            </div>
          </header>

          <div className="px-5 py-6 sm:px-8">
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
                No se pudieron cargar las ordenes. Revisa la conexion con el
                backend e intenta de nuevo.
              </div>
            ) : null}

            {!workOrdersQuery.isLoading && !workOrdersQuery.isError ? (
              filteredWorkOrders.length ? (
                <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                  <div className="hidden grid-cols-[120px_minmax(0,1.4fr)_minmax(0,1.2fr)_120px_130px] gap-4 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-bold uppercase text-slate-500 lg:grid">
                    <span>Orden</span>
                    <span>Cliente</span>
                    <span>Vehiculo</span>
                    <span>Total</span>
                    <span>Estado</span>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {filteredWorkOrders.map((workOrder) => (
                      <article
                        className="grid gap-4 px-4 py-4 lg:grid-cols-[120px_minmax(0,1.4fr)_minmax(0,1.2fr)_120px_130px] lg:items-center"
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
                          <p className="truncate text-sm font-semibold text-slate-950">
                            {getCustomerName(workOrder)}
                          </p>
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
                          {workOrder.advanceAmount !== undefined ? (
                            <p className="mt-1 text-xs font-medium text-slate-500">
                              Anticipo {formatMoney(workOrder.advanceAmount)}
                            </p>
                          ) : null}
                        </div>

                        <div>
                          <span className="inline-flex rounded-md bg-[#4169e1]/10 px-2.5 py-1 text-xs font-bold text-[#4169e1]">
                            {getStatusLabel(workOrder.status)}
                          </span>
                        </div>
                      </article>
                    ))}
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
          </div>
        </section>
      </div>
    </main>
  );
}
