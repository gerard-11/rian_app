import {
  AlertCircle,
  CalendarDays,
  ClipboardList,
  LoaderCircle,
  ReceiptText,
  Trash2,
  TrendingUp,
} from "lucide-react";
import type { ChangeEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDeleteExpense, useExpenses } from "../hooks/useExpenses";
import { useWeeklyProfit } from "../hooks/useWeeklyProfits";
import type { WeeklyProfit } from "../types/profits";
import { formatMoney } from "../utils/workOrdersList";
import type { Expense } from "../types/expenses";

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

const formatDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
};

const formatWeekDate = (date: Date) => weekDateFormatter.format(date);

const formatExpenseDate = (value: string) => {
  const date = parseLocalDate(value);

  return date ? formatWeekDate(date) : value.slice(0, 10);
};

const getExpensesTotal = (expenses: Expense[]) =>
  expenses.reduce((total, expense) => {
    const amount = Number(expense.amount);

    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);

const getWeekRange = (
  weeklyProfit?: WeeklyProfit,
  selectedWeekStart?: string,
) => {
  const weekStart = parseLocalDate(
    weeklyProfit?.weekStart ?? selectedWeekStart ?? "",
  );

  if (!weekStart) return undefined;

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 5);

  return {
    dateFrom: formatDateInputValue(weekStart),
    dateTo: formatDateInputValue(weekEnd),
    weekEnd,
    weekStart,
  };
};

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
  const weekRange = getWeekRange(weeklyProfit, weekStart);
  const expensesQuery = useExpenses({
    dateFrom: weekRange?.dateFrom,
    dateTo: weekRange?.dateTo,
  });
  const expenses = expensesQuery.data?.expenses ?? [];
  const expensesTotal = getExpensesTotal(expenses);
  const deleteExpense = useDeleteExpense();

  const handleDeleteExpense = (expense: Expense) => {
    const shouldDelete = window.confirm(
      'Eliminar el gasto "' + expense.description + '"?',
    );

    if (!shouldDelete) return;

    deleteExpense.mutate(expense.id);
  };

  const handleWeekStartChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextWeekStart = event.target.value;

    if (!nextWeekStart) {
      setSearchParams({});
      return;
    }

    setSearchParams({ weekStart: nextWeekStart });
  };

  return (
    <>
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
            <div className="mt-2 flex h-11 items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#B3262D] focus-within:ring-4 focus-within:ring-[#B3262D]/15">
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
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#B3262D]" />
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
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B3262D]/10 text-[#B3262D]">
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

          <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-950">
                  Gastos registrados
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Total listado {formatMoney(expensesTotal)}
                </p>
              </div>
              <Link
                className="flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#B3262D] focus:ring-offset-2"
                to="/expenses"
              >
                Registrar gasto
              </Link>
            </div>

            {expensesQuery.isLoading ? (
              <div className="mt-4 flex min-h-32 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600">
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#B3262D]" />
                Cargando gastos...
              </div>
            ) : null}

            {expensesQuery.isError ? (
              <div className="mt-4 flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                No se pudieron cargar los gastos registrados.
              </div>
            ) : null}

            {deleteExpense.isError ? (
              <div className="mt-4 flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                No se pudo eliminar el gasto.
              </div>
            ) : null}

            {!expensesQuery.isLoading && !expensesQuery.isError ? (
              expenses.length ? (
                <div className="mt-4 divide-y divide-slate-200 rounded-md border border-slate-200">
                  {expenses.map((expense) => (
                    <article
                      className="grid gap-2 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_130px_130px_48px] sm:items-center"
                      key={expense.id}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-950">
                          {expense.description}
                        </p>
                        {expense.notes ? (
                          <p className="mt-1 truncate text-xs font-medium text-slate-500">
                            {expense.notes}
                          </p>
                        ) : null}
                      </div>
                      <p className="text-sm font-semibold text-slate-600">
                        {formatExpenseDate(expense.spentAt)}
                      </p>
                      <p className="text-sm font-bold text-slate-950">
                        {formatMoney(expense.amount)}
                      </p>
                      <button
                        aria-label="Eliminar gasto"
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-[#d71920]/30 bg-white text-[#a41218] transition hover:bg-[#d71920]/10 focus:outline-none focus:ring-4 focus:ring-[#d71920]/15 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                        disabled={deleteExpense.isPending}
                        onClick={() => handleDeleteExpense(expense)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-6 text-center">
                  <ReceiptText className="mx-auto h-9 w-9 text-slate-300" />
                  <p className="mt-2 text-sm font-bold text-slate-950">
                    No hay gastos registrados
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Los gastos de esta semana apareceran aqui.
                  </p>
                </div>
              )
            ) : null}
          </section>
        </>
      ) : null}
    </>
  );
}
