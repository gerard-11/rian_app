// Datos ya formateados que necesita la nota en PDF. Órdenes y presupuestos se
// convierten a esta misma forma para compartir un solo diseño de documento.
import { capitalizeDisplayText, formatPlate } from "../../lib/textFormatters";
import type { Budget } from "../../types/budgets";
import type { QuickVehicleInput, WorkOrder } from "../../types/workOrders";
import {
  formatDate,
  formatMoney,
  getCustomerName,
  getCustomerPhone,
  getStatusLabel,
  getWorkOrderAdvanceAmount,
  getWorkOrderCode,
  getWorkOrderCreatedBy,
  getWorkOrderPendingBalance,
  getWorkOrderStatus,
  getWorkOrderTotal,
} from "../../utils/workOrdersList";
import {
  getBudgetCode,
  getBudgetCreatedBy,
  getBudgetCustomerName,
  getBudgetCustomerPhone,
  getBudgetStatusLabel,
  getBudgetTotal,
} from "../../utils/budgetsList";

export type NoteKind = "workOrder" | "budget";

export type NoteTotalRow = {
  label: string;
  value: string;
  emphasis?: boolean;
};

export type NoteData = {
  kind: NoteKind;
  title: string;
  code: string;
  date: string;
  createdBy: string;
  statusLabel: string;
  paid: boolean;
  customer: { name: string; phone: string };
  vehicle: {
    description: string;
    plate: string;
    make: string;
    model: string;
    year: string;
    color: string;
  };
  diagnosis: string;
  notes: string;
  items: { type: string; description: string; amount: string }[];
  totals: NoteTotalRow[];
  footer: { strong?: string; text: string };
};

const ITEM_TYPE_LABELS: Record<string, string> = {
  ALIGNMENT: "Alineación",
  ALIGNMENT_BALANCE: "Alineación y balanceo",
  BALANCE: "Balanceo",
  LABOR: "Mano de obra",
  OTHER: "Otro",
  PART: "Pieza",
  TIRE: "Llanta",
  TUNE_UP: "Afinación",
};

const text = (value?: number | string) => String(value ?? "").trim();

const capitalized = (value?: number | string) => capitalizeDisplayText(text(value));

const buildVehicle = (vehicle?: QuickVehicleInput): NoteData["vehicle"] => ({
  description: capitalized(vehicle?.model) || "Vehículo sin datos",
  plate: formatPlate(vehicle?.plate),
  make: capitalized(vehicle?.make) || "No registrado",
  model: capitalized(vehicle?.model) || "No registrado",
  year: text(vehicle?.year) || "No registrado",
  color: capitalized(vehicle?.color) || "No registrado",
});

const buildItems = (
  items: { type: string; description?: string; saleAmount?: number | string }[] = [],
) =>
  items.map((item) => ({
    type: ITEM_TYPE_LABELS[item.type] ?? item.type,
    description: item.description || "Sin descripción",
    amount: formatMoney(item.saleAmount),
  }));

export const buildWorkOrderNoteData = (workOrder: WorkOrder): NoteData => {
  const status = getWorkOrderStatus(workOrder.status) ?? "ACTIVE";
  const totals: NoteTotalRow[] = [
    { label: "Total", value: formatMoney(getWorkOrderTotal(workOrder)) },
    { label: "Anticipo", value: formatMoney(getWorkOrderAdvanceAmount(workOrder)) },
  ];

  if (status === "ACTIVE") {
    totals.push({
      label: "Saldo pendiente",
      value: formatMoney(getWorkOrderPendingBalance(workOrder)),
      emphasis: true,
    });
  }

  return {
    kind: "workOrder",
    title: "Nota de servicio",
    code: `Orden ${getWorkOrderCode(workOrder)}`,
    date: formatDate(workOrder.createdAt),
    createdBy: getWorkOrderCreatedBy(workOrder),
    statusLabel: getStatusLabel(workOrder.status),
    paid: status === "COMPLETED",
    customer: {
      name: capitalizeDisplayText(getCustomerName(workOrder)),
      phone: getCustomerPhone(workOrder),
    },
    vehicle: buildVehicle(workOrder.vehicle),
    diagnosis: workOrder.diagnosis?.trim() || "Sin diagnóstico registrado.",
    notes: workOrder.notes?.trim() || "Sin notas registradas.",
    items: buildItems(workOrder.items),
    totals,
    footer: {
      strong:
        "Garantía: 1 semana solo en mano de obra, alineación y balanceo. En refacciones o llantas no aplica.",
      text: "Gracias por confiar en Rian Automotriz.",
    },
  };
};

export const buildBudgetNoteData = (budget: Budget): NoteData => ({
  kind: "budget",
  title: "Presupuesto",
  code: `Presupuesto ${getBudgetCode(budget)}`,
  date: formatDate(budget.createdAt),
  createdBy: getBudgetCreatedBy(budget),
  statusLabel: getBudgetStatusLabel(budget.status),
  paid: false,
  customer: {
    name: capitalizeDisplayText(getBudgetCustomerName(budget)),
    phone: getBudgetCustomerPhone(budget),
  },
  vehicle: buildVehicle(budget.vehicle),
  diagnosis: budget.diagnosis?.trim() || "Sin diagnóstico registrado.",
  notes: budget.notes?.trim() || "Sin notas registradas.",
  items: buildItems(budget.items),
  totals: [
    {
      label: "Total presupuesto",
      value: formatMoney(getBudgetTotal(budget)),
      emphasis: true,
    },
  ],
  footer: {
    text: "Presupuesto sujeto a disponibilidad de piezas y autorización del cliente.",
  },
});
