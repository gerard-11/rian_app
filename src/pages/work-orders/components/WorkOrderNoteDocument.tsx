import type { WorkOrder, WorkOrderItem } from "../../../types/workOrders";
import {
  formatDate,
  formatMoney,
  getCustomerName,
  getCustomerPhone,
  getStatusLabel,
  getVehicleLabel,
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
  LABOR: "Mano de obra",
  OTHER: "Otro",
  PART: "Pieza",
  SERVICE: "Servicio",
  TIRE: "Llanta",
};

const getItemTypeLabel = (item: WorkOrderItem) =>
  itemTypeLabels[item.type] ?? item.type;

const getVehicleField = (value?: number | string) => {
  const normalizedValue = String(value ?? "").trim();

  return normalizedValue || "No registrado";
};

const capitalizeText = (value: string) =>
  value
    .toLocaleLowerCase("es-MX")
    .replace(
      /(^|[\s.'-])([a-záéíóúüñ])/g,
      (_match, separator, letter) =>
        separator + letter.toLocaleUpperCase("es-MX"),
    );

const getCapitalizedCustomerName = (workOrder: WorkOrder) =>
  capitalizeText(getCustomerName(workOrder));

const getPlateValue = (value?: number | string) => {
  const normalizedValue = getVehicleField(value);

  return normalizedValue === "No registrado"
    ? normalizedValue
    : normalizedValue.toLocaleUpperCase("es-MX");
};

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
  const isActive =
    (getWorkOrderStatus(workOrder.status) ?? "ACTIVE") === "ACTIVE";

  return (
    <article className="mx-auto max-w-4xl rounded-md border border-slate-200 bg-white p-6 text-slate-950 shadow-sm print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#4169e1] text-lg font-black text-white">
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
          <p className="mt-1 text-sm font-semibold text-[#4169e1]">
            {getStatusLabel(workOrder.status)}
          </p>
        </div>
      </header>

      <section className="grid gap-4 border-b border-slate-200 py-5 sm:grid-cols-2">
        <div className="rounded-md border border-slate-200 p-4 print:break-inside-avoid">
          <p className="text-xs font-bold uppercase text-[#d71920]">Cliente</p>
          <div className="mt-3 space-y-3">
            <DetailItem
              label="Nombre"
              value={getCapitalizedCustomerName(workOrder)}
            />
            <DetailItem label="Telefono" value={getCustomerPhone(workOrder)} />
          </div>
        </div>

        <div className="rounded-md border border-slate-200 p-4 print:break-inside-avoid">
          <p className="text-xs font-bold uppercase text-[#d71920]">Vehiculo</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Vehiculo" value={getVehicleLabel(workOrder)} />
            <DetailItem label="Placas" value={getPlateValue(vehicle?.plate)} />
            <DetailItem label="Marca" value={getVehicleField(vehicle?.make)} />
            <DetailItem
              label="Modelo"
              value={getVehicleField(vehicle?.model)}
            />
            <DetailItem label="Ano" value={getVehicleField(vehicle?.year)} />
            <DetailItem label="Color" value={getVehicleField(vehicle?.color)} />
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
            <span className="font-black text-[#4169e1]">
              {formatMoney(getWorkOrderPendingBalance(workOrder))}
            </span>
          </div>
        ) : null}
      </section>

      <footer className="mt-8 border-t border-slate-200 pt-4 text-center text-xs font-medium text-slate-500">
        Gracias por confiar en Rian Automotriz.
      </footer>
    </article>
  );
}
