import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  LoaderCircle,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import type { ChangeEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useWeeklyProfit } from "../hooks/useWeeklyProfits";
import type { WeeklyProfit } from "../types/profits";
import { formatMoney } from "../utils/workOrdersList";

const metricCardClass =
  "rounded-md border border-slate-200 bg-white p-4 shadow-sm";

const weekDateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

type ProfitMetricProps = {
  label: string;
  value: string;
};

function ProfitMetric({ label, value }: ProfitMetricProps) {
  return (
    <div className={metricCardClass}>
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

const parseLocalDate = (value: string) => {
  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
};

const formatWeekDate = (date: Date) => weekDateFormatter.format(date);

const getWeekRangeLabel = (weeklyProfit?: WeeklyProfit) => {
  if (!weeklyProfit) return "Semana actual";

  const weekStart = parseLocalDate(weeklyProfit.weekStart);

  if (!weekStart) return weeklyProfit.weekStart.slice(0, 10);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 5);

  return formatWeekDate(weekStart) + " - " + formatWeekDate(weekEnd);
};

export function WeeklyProfitsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const weekStart = searchParams.get("weekStart") ?? "";
  const weeklyProfitQuery = useWeeklyProfit({ weekStart });
  const weeklyProfit = weeklyProfitQuery.data?.weeklyProfit;

  const handleWeekStartChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextWeekStart = event.target.value;

    if (!nextWeekStart) {
      setSearchParams({});
      return;
    }

    setSearchParams({ weekStart: nextWeekStart });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4169e1] text-lg font-black text-white">
              RA
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">
                Rian Automotriz
              </p>
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
              className="flex h-10 items-center rounded-md px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
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
            <Link
              className="flex h-10 items-center rounded-md bg-[#4169e1]/10 px-3 text-sm font-semibold text-[#4169e1]"
              to="/profits/weekly"
            >
              Ganancias
            </Link>
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase text-[#d71920]">
                  Ganancias
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-950">
                  Ganancias semanales
                </h1>
              </div>
              <Link
                className="flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
                to="/dashboard"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </div>
          </header>

          <div className="space-y-5 px-5 py-6 sm:px-8">
            <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-950">
                      {getWeekRangeLabel(weeklyProfit)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Ordenes completadas y gastos de lunes a sabado.
                    </p>
                  </div>
                </div>

                <div className="w-full sm:max-w-xs">
                  <label
                    className="text-sm font-semibold text-slate-800"
                    htmlFor="weekStart"
                  >
                    Inicio de semana
                  </label>
                  <div className="mt-2 flex h-11 items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#4169e1] focus-within:ring-4 focus-within:ring-[#4169e1]/15">
                    <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-slate-800 outline-none"
                      id="weekStart"
                      onChange={handleWeekStartChange}
                      type="date"
                      value={weekStart}
                    />
                  </div>
                </div>
              </div>
            </section>

            {weeklyProfitQuery.isLoading ? (
              <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm">
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#4169e1]" />
                Cargando ganancias...
              </div>
            ) : null}

            {weeklyProfitQuery.isError ? (
              <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                No se pudieron cargar las ganancias semanales.
              </div>
            ) : null}

            {weeklyProfit && !weeklyProfitQuery.isLoading ? (
              <>
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <ProfitMetric
                    label="Utilidad bruta"
                    value={formatMoney(weeklyProfit.grossProfitAmount)}
                  />
                  <ProfitMetric
                    label="Gastos"
                    value={formatMoney(weeklyProfit.expenseAmount)}
                  />
                  <ProfitMetric
                    label="Utilidad neta"
                    value={formatMoney(weeklyProfit.netProfitAmount)}
                  />
                  <ProfitMetric
                    label="Ordenes"
                    value={String(weeklyProfit.workOrderCount)}
                  />
                </section>

                <section className="grid gap-4 lg:grid-cols-2">
                  <div className={metricCardClass}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4169e1]/10 text-[#4169e1]">
                        <ClipboardList className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-950">
                          Ordenes completadas
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {weeklyProfit.workOrderCount} ordenes liquidadas.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={metricCardClass}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#d71920]/10 text-[#a41218]">
                        <ReceiptText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-950">
                          Gastos registrados
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {weeklyProfit.expenseCount} gastos aplicados.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
