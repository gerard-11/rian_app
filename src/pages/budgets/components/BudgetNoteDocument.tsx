import noteBackgroundImage from "../../../assets/rianimg.jpeg";
import {
  capitalizeDisplayText,
  formatPlate,
} from "../../../lib/textFormatters";
import type { Budget, BudgetItem } from "../../../types/budgets";
import {
  formatDate,
  formatMoney,
  getBudgetCode,
  getBudgetCreatedBy,
  getBudgetCustomerName,
  getBudgetCustomerPhone,
  getBudgetStatusLabel,
  getBudgetTotal,
} from "../../../utils/budgetsList";

type BudgetNoteDocumentProps = {
  budget: Budget;
};

const itemTypeLabels: Record<string, string> = {
  LABOR: "Mano de obra",
  OTHER: "Otro",
  PART: "Pieza",
  SERVICE: "Servicio",
  TIRE: "Llanta",
};

const getItemTypeLabel = (item: BudgetItem) =>
  itemTypeLabels[item.type] ?? item.type;

const getVehicleField = (value?: number | string) => {
  const normalizedValue = String(value ?? "").trim();

  return normalizedValue || "No registrado";
};

const getVehicleDescription = (value?: number | string) => {
  const normalizedValue = String(value ?? "").trim();

  return normalizedValue || "Vehiculo sin datos";
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

export function BudgetNoteDocument({ budget }: BudgetNoteDocumentProps) {
  const vehicle = budget.vehicle;
  const items = budget.items ?? [];

  return (
    <article className="relative mx-auto max-w-4xl overflow-hidden rounded-md border border-slate-200 bg-white p-6 text-slate-950 shadow-sm print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 print:opacity-15"
        src={noteBackgroundImage}
      />
      <div className="relative z-10">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#B3262D] text-lg font-black text-white">
              RA
            </div>
            <div>
              <p className="text-xl font-black text-slate-950">
                Rian Automotriz
              </p>
              <p className="text-sm font-medium text-slate-500">Presupuesto</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-sm font-bold text-slate-950">
              Presupuesto {getBudgetCode(budget)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Fecha {formatDate(budget.createdAt)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Creado por {getBudgetCreatedBy(budget)}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#B3262D]">
              {getBudgetStatusLabel(budget.status)}
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
                value={capitalizeDisplayText(getBudgetCustomerName(budget))}
              />
              <DetailItem
                label="Telefono"
                value={getBudgetCustomerPhone(budget)}
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
              {budget.diagnosis?.trim() || "Sin diagnostico registrado."}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-[#d71920]">Notas</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {budget.notes?.trim() || "Sin notas registradas."}
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
          <div className="flex items-center justify-between gap-4 text-base">
            <span className="font-bold text-slate-950">Total presupuesto</span>
            <span className="font-black text-[#B3262D]">
              {formatMoney(getBudgetTotal(budget))}
            </span>
          </div>
        </section>

        <footer className="mt-8 border-t border-slate-200 pt-4 text-center text-xs font-medium text-slate-500">
          Presupuesto sujeto a disponibilidad de piezas y autorizacion del
          cliente.
        </footer>
      </div>
    </article>
  );
}
