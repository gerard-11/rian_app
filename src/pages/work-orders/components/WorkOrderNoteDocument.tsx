import noteBackgroundImage from "../../../assets/rianimg.jpeg";
import {
  capitalizeDisplayText,
  formatPlate,
} from "../../../lib/textFormatters";
import type { WorkOrder, WorkOrderItem } from "../../../types/workOrders";
import {
  formatDate,
  formatMoney,
  getCustomerName,
  getCustomerPhone,
  getWorkOrderCreatedBy,
  getStatusLabel,
  getWorkOrderAdvanceAmount,
  getWorkOrderCode,
  getWorkOrderPendingBalance,
  getWorkOrderStatus,
  getWorkOrderTotal,
} from "../../../utils/workOrdersList";

type WorkOrderNoteDocumentProps = {
  workOrder: WorkOrder;
};

const itemTypeLabels: Record<string, string> = {
  ALIGNMENT: "Alineacion",
  ALIGNMENT_BALANCE: "Alineacion y balanceo",
  BALANCE: "Balanceo",
  LABOR: "Mano de obra",
  OTHER: "Otro",
  PART: "Pieza",
  TIRE: "Llanta",
  TUNE_UP: "Afinacion",
};

const getItemTypeLabel = (item: WorkOrderItem) =>
  itemTypeLabels[item.type] ?? item.type;

const getVehicleField = (value?: number | string) => {
  const normalizedValue = String(value ?? "").trim();

  return normalizedValue || "No registrado";
};

const getVehicleDescription = (value?: number | string) => {
  const normalizedValue = String(value ?? "").trim();

  return normalizedValue || "Vehiculo sin datos";
};

const getCapitalizedCustomerName = (workOrder: WorkOrder) =>
  capitalizeDisplayText(getCustomerName(workOrder));

type DetailItemProps = {
  label: string;
  value: string;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-normal text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export function WorkOrderNoteDocument({
  workOrder,
}: WorkOrderNoteDocumentProps) {
  const vehicle = workOrder.vehicle;
  const items = workOrder.items ?? [];
  const workOrderStatus = getWorkOrderStatus(workOrder.status) ?? "ACTIVE";
  const isActive = workOrderStatus === "ACTIVE";
  const isCompleted = workOrderStatus === "COMPLETED";

  return (
    <article className="relative mx-auto max-w-4xl overflow-hidden rounded-md border border-slate-200 bg-white p-6 text-slate-950 shadow-sm print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 print:opacity-15"
        src={noteBackgroundImage}
      />
      {isCompleted ? (
        <div
          aria-label="Pagado"
          className="pointer-events-none absolute right-8 top-28 z-20 rotate-[-12deg] rounded-md border-4 border-emerald-600 px-5 py-2 text-3xl font-black uppercase tracking-normal text-emerald-700 opacity-80 print:right-10 print:top-24"
          role="img"
        >
          PAGADO
        </div>
      ) : null}

      <div className="relative z-10">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#B3262D] text-lg font-black text-white">
                RA
              </div>
              <div>
                <p className="text-xl font-black text-slate-950">
                  Rian Automotriz
                </p>
                <p className="text-sm font-medium text-slate-500">
                  Nota de servicio
                </p>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-sm font-bold text-slate-950">
              Orden {getWorkOrderCode(workOrder)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Fecha {formatDate(workOrder.createdAt)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Creado por {getWorkOrderCreatedBy(workOrder)}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#B3262D]">
              {getStatusLabel(workOrder.status)}
            </p>
          </div>
        </header>

        <section className="grid gap-4 border-b border-slate-200 py-5 sm:grid-cols-2">
          <div className="rounded-md border border-slate-200 p-4 print:break-inside-avoid">
            <p className="text-xs font-bold uppercase text-[#d71920]">
              Cliente
            </p>
            <div className="mt-3 space-y-3">
              <DetailItem
                label="Nombre"
                value={getCapitalizedCustomerName(workOrder)}
              />
              <DetailItem
                label="Telefono"
                value={getCustomerPhone(workOrder)}
              />
            </div>
          </div>

          <div className="rounded-md border border-slate-200 p-4 print:break-inside-avoid">
            <p className="text-xs font-bold uppercase text-[#d71920]">
              Vehiculo
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Vehiculo"
                value={getVehicleDescription(vehicle?.model)}
              />
              <DetailItem label="Placas" value={formatPlate(vehicle?.plate)} />
              <DetailItem
                label="Marca"
                value={getVehicleField(vehicle?.make)}
              />
              <DetailItem
                label="Modelo"
                value={getVehicleField(vehicle?.model)}
              />
              <DetailItem label="Año" value={getVehicleField(vehicle?.year)} />
              <DetailItem
                label="Color"
                value={getVehicleField(vehicle?.color)}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 border-b border-slate-200 py-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase text-[#d71920]">
              Diagnostico
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {workOrder.diagnosis?.trim() || "Sin diagnostico registrado."}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-[#d71920]">Notas</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {workOrder.notes?.trim() || "Sin notas registradas."}
            </p>
          </div>
        </section>

        <section className="py-5">
          <p className="text-xs font-bold uppercase text-[#d71920]">
            Piezas y mano de obra
          </p>

          <div className="mt-3 overflow-hidden rounded-md border border-slate-200">
            <div className="grid grid-cols-[120px_minmax(0,1fr)_130px] gap-3 bg-slate-100 px-4 py-3 text-xs font-bold uppercase text-slate-500">
              <span>Tipo</span>
              <span>Descripcion</span>
              <span className="text-right">Importe</span>
            </div>

            {items.length ? (
              <div className="divide-y divide-slate-200">
                {items.map((item, index) => (
                  <div
                    className="grid grid-cols-[120px_minmax(0,1fr)_130px] gap-3 px-4 py-3 text-sm print:break-inside-avoid"
                    key={item.id ?? index}
                  >
                    <span className="font-semibold text-slate-700">
                      {getItemTypeLabel(item)}
                    </span>
                    <span className="text-slate-700">
                      {item.description || "Sin descripcion"}
                    </span>
                    <span className="text-right font-bold text-slate-950">
                      {formatMoney(item.saleAmount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-sm font-medium text-slate-500">
                Sin items registrados.
              </div>
            )}
          </div>
        </section>

        <section className="ml-auto grid max-w-sm gap-2 border-t border-slate-200 pt-5">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-semibold text-slate-600">Total</span>
            <span className="font-bold text-slate-950">
              {formatMoney(getWorkOrderTotal(workOrder))}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-semibold text-slate-600">Anticipo</span>
            <span className="font-bold text-slate-950">
              {formatMoney(getWorkOrderAdvanceAmount(workOrder))}
            </span>
          </div>
          {isActive ? (
            <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-2 text-base">
              <span className="font-bold text-slate-950">Saldo pendiente</span>
              <span className="font-black text-[#B3262D]">
                {formatMoney(getWorkOrderPendingBalance(workOrder))}
              </span>
            </div>
          ) : null}
        </section>

        <footer className="mt-8 border-t border-slate-200 pt-4 text-center text-xs font-medium text-slate-500">
          <p className="font-semibold text-slate-700">
            Garantía: 1 semana solo en mano de obra, alineación y balanceo. En
            refacciones o llantas no aplica.
          </p>
          <p className="mt-2">Gracias por confiar en Rian Automotriz.</p>
        </footer>
      </div>
    </article>
  );
}
