import {
  AlertCircle,
  CalendarDays,
  LoaderCircle,
  Plus,
  ReceiptText,
  Search,
  Trash2,
} from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useCreateExpense,
  useDeleteExpense,
  useExpenses,
} from "../hooks/useExpenses";
import type { Expense, ListExpensesQuery } from "../types/expenses";
import { formatMoney } from "../utils/workOrdersList";

const emptyExpenses: Expense[] = [];

const getLocalDateInputValue = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
};

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const parseLocalDate = (value: string) => {
  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
};

const formatExpenseDate = (value: string) => {
  const date = parseLocalDate(value);

  return date ? dateFormatter.format(date) : value.slice(0, 10);
};

const getExpensesTotal = (expenses: Expense[]) =>
  expenses.reduce((total, expense) => {
    const amount = Number(expense.amount);

    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);

export function ExpensesPage() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [spentAt, setSpentAt] = useState(() => getLocalDateInputValue());
  const [notes, setNotes] = useState("");
  const [query, setQuery] = useState<ListExpensesQuery>({});
  const expensesQuery = useExpenses(query);
  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();
  const expenses = expensesQuery.data?.expenses ?? emptyExpenses;
  const expensesTotal = useMemo(() => getExpensesTotal(expenses), [expenses]);

  const handleQueryChange =
    (key: keyof ListExpensesQuery) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setQuery((currentQuery) => ({
        ...currentQuery,
        [key]: value || undefined,
      }));
    };

  const handleDeleteExpense = (expense: Expense) => {
    const shouldDelete = window.confirm(
      'Eliminar el gasto "' + expense.description + '"?',
    );

    if (!shouldDelete) return;

    deleteExpense.mutate(expense.id);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedDescription = description.trim();
    const parsedAmount = Number(amount);
    const trimmedNotes = notes.trim();

    if (!trimmedDescription || !Number.isFinite(parsedAmount)) return;

    createExpense.mutate(
      {
        amount: parsedAmount,
        description: trimmedDescription,
        notes: trimmedNotes || undefined,
        spentAt: spentAt || undefined,
      },
      {
        onSuccess: () => {
          setDescription("");
          setAmount("");
          setNotes("");
        },
      },
    );
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
                  Gastos
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-950">
                  Gastos
                </h1>
              </div>
            </div>
          </header>

          <div className="space-y-5 px-5 py-6 sm:px-8">
            <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4169e1]/10 text-[#4169e1]">
                    <ReceiptText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-950">
                      Registrar gasto
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Los gastos registrados afectan la utilidad semanal.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_160px_180px]">
                  <div>
                    <label
                      className="text-sm font-semibold text-slate-800"
                      htmlFor="expenseDescription"
                    >
                      Descripcion
                    </label>
                    <input
                      className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                      id="expenseDescription"
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Compra de insumos"
                      required
                      value={description}
                    />
                  </div>

                  <div>
                    <label
                      className="text-sm font-semibold text-slate-800"
                      htmlFor="expenseAmount"
                    >
                      Monto
                    </label>
                    <input
                      className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                      id="expenseAmount"
                      inputMode="decimal"
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder="0.00"
                      required
                      value={amount}
                    />
                  </div>

                  <div>
                    <label
                      className="text-sm font-semibold text-slate-800"
                      htmlFor="expenseSpentAt"
                    >
                      Fecha
                    </label>
                    <input
                      className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                      id="expenseSpentAt"
                      onChange={(event) => setSpentAt(event.target.value)}
                      type="date"
                      value={spentAt}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="text-sm font-semibold text-slate-800"
                    htmlFor="expenseNotes"
                  >
                    Notas
                  </label>
                  <textarea
                    className="mt-2 min-h-20 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                    id="expenseNotes"
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Detalle interno opcional"
                    value={notes}
                  />
                </div>

                {createExpense.isError ? (
                  <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    No se pudo registrar el gasto.
                  </div>
                ) : null}

                <div className="flex justify-end">
                  <button
                    className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#4169e1] px-4 text-sm font-semibold text-white shadow-lg shadow-[#4169e1]/20 transition hover:bg-[#3658c9] focus:outline-none focus:ring-4 focus:ring-[#4169e1]/25 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                    disabled={createExpense.isPending}
                    type="submit"
                  >
                    {createExpense.isPending ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {createExpense.isPending ? "Guardando..." : "Crear gasto"}
                  </button>
                </div>
              </form>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-950">
                    {expenses.length} gastos
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Total filtrado {formatMoney(expensesTotal)}
                  </p>
                </div>

                <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-3xl">
                  <div className="flex h-11 items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#4169e1] focus-within:ring-4 focus-within:ring-[#4169e1]/15">
                    <Search className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-400"
                      onChange={handleQueryChange("search")}
                      placeholder="Buscar"
                      value={query.search ?? ""}
                    />
                  </div>
                  <div className="flex h-11 items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#4169e1] focus-within:ring-4 focus-within:ring-[#4169e1]/15">
                    <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
                      onChange={handleQueryChange("dateFrom")}
                      type="date"
                      value={query.dateFrom ?? ""}
                    />
                  </div>
                  <div className="flex h-11 items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#4169e1] focus-within:ring-4 focus-within:ring-[#4169e1]/15">
                    <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
                      onChange={handleQueryChange("dateTo")}
                      type="date"
                      value={query.dateTo ?? ""}
                    />
                  </div>
                </div>
              </div>
            </section>

            {expensesQuery.isLoading ? (
              <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm">
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#4169e1]" />
                Cargando gastos...
              </div>
            ) : null}

            {expensesQuery.isError ? (
              <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                No se pudieron cargar los gastos.
              </div>
            ) : null}

            {deleteExpense.isError ? (
              <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                No se pudo eliminar el gasto.
              </div>
            ) : null}

            {!expensesQuery.isLoading && !expensesQuery.isError ? (
              expenses.length ? (
                <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                  <div className="hidden grid-cols-[minmax(0,1fr)_140px_140px_80px] gap-4 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-bold uppercase text-slate-500 lg:grid">
                    <span>Gasto</span>
                    <span>Fecha</span>
                    <span>Monto</span>
                    <span></span>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {expenses.map((expense) => (
                      <article
                        className="grid gap-3 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_140px_140px_80px] lg:items-center"
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
                </div>
              ) : (
                <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-center shadow-sm">
                  <div>
                    <ReceiptText className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-3 text-sm font-bold text-slate-950">
                      No hay gastos para mostrar
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Registra un gasto para verlo en este listado.
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
