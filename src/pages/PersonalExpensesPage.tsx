import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CalendarDays,
  Edit3,
  LoaderCircle,
  Plus,
  ReceiptText,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import {
  useCreatePersonalExpense,
  useDeletePersonalExpense,
  usePersonalExpenses,
  usePersonalExpensesSummary,
  useUpdatePersonalExpense,
} from "../hooks/usePersonalExpenses";
import {
  personalExpenseSchema,
  type PersonalExpenseFormValues,
} from "../schemas/personalExpenseSchema";
import type {
  ListPersonalExpensesQuery,
  PersonalExpense,
  PersonalExpensesResponse,
  PersonalExpensesSummary,
  PersonalExpensesSummaryResponse,
} from "../types/personalExpenses";
import { formatMoney } from "../utils/workOrdersList";

const emptyPersonalExpenses: PersonalExpense[] = [];

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

const toNumber = (value?: number | string) => {
  if (value === undefined || value === "") return 0;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizePersonalExpensesResponse = (
  response?: PersonalExpensesResponse,
) => {
  if (!response) return emptyPersonalExpenses;
  if (Array.isArray(response)) return response;

  return response.data ?? response.items ?? response.personalExpenses ?? [];
};

const normalizePersonalExpensesSummary = (
  response?: PersonalExpensesSummaryResponse,
): PersonalExpensesSummary | undefined => {
  if (!response) return undefined;
  if ("data" in response || "summary" in response) {
    return response.data ?? response.summary;
  }

  return response;
};

const getSummaryTotal = (response?: PersonalExpensesSummaryResponse) => {
  const summary = normalizePersonalExpensesSummary(response);

  return toNumber(
    summary?.totalAmount ?? summary?.totalPersonalExpenses ?? summary?.total,
  );
};

const getExpensesTotal = (expenses: PersonalExpense[]) =>
  expenses.reduce((total, expense) => total + toNumber(expense.amount), 0);

const buildPersonalExpensePayload = (values: PersonalExpenseFormValues) => {
  const trimmedNotes = values.notes?.trim();

  return {
    amount: Number(values.amount.trim()),
    description: values.description.trim(),
    notes: trimmedNotes || undefined,
    spentAt: values.spentAt,
  };
};

export function PersonalExpensesPage() {
  const [editingExpense, setEditingExpense] = useState<PersonalExpense>();
  const [query, setQuery] = useState<ListPersonalExpensesQuery>({});
  const personalExpensesQuery = usePersonalExpenses(query);
  const summaryQuery = usePersonalExpensesSummary();
  const createPersonalExpense = useCreatePersonalExpense();
  const updatePersonalExpense = useUpdatePersonalExpense();
  const deletePersonalExpense = useDeletePersonalExpense();
  const personalExpenses = normalizePersonalExpensesResponse(
    personalExpensesQuery.data,
  );
  const filteredTotal = useMemo(
    () => getExpensesTotal(personalExpenses),
    [personalExpenses],
  );
  const summaryTotal = getSummaryTotal(summaryQuery.data);
  const isSaving = createPersonalExpense.isPending || updatePersonalExpense.isPending;
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<PersonalExpenseFormValues>({
    defaultValues: {
      amount: "",
      description: "",
      notes: "",
      spentAt: getLocalDateInputValue(),
    },
    resolver: zodResolver(personalExpenseSchema),
  });

  const handleQueryChange =
    (key: keyof ListPersonalExpensesQuery) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setQuery((currentQuery) => ({
        ...currentQuery,
        [key]: value || undefined,
      }));
    };

  const clearForm = () => {
    setEditingExpense(undefined);
    reset({
      amount: "",
      description: "",
      notes: "",
      spentAt: getLocalDateInputValue(),
    });
  };

  const handleEditExpense = (expense: PersonalExpense) => {
    setEditingExpense(expense);
    reset({
      amount: String(expense.amount),
      description: expense.description,
      notes: expense.notes ?? "",
      spentAt: expense.spentAt.slice(0, 10),
    });
  };

  const handleDeleteExpense = (expense: PersonalExpense) => {
    const shouldDelete = window.confirm(
      'Eliminar el gasto personal "' + expense.description + '"?',
    );

    if (!shouldDelete) return;

    deletePersonalExpense.mutate(expense.id, {
      onSuccess: () => {
        if (editingExpense?.id === expense.id) {
          clearForm();
        }
      },
    });
  };

  const onSubmit = (values: PersonalExpenseFormValues) => {
    const payload = buildPersonalExpensePayload(values);

    if (editingExpense) {
      updatePersonalExpense.mutate(
        { id: editingExpense.id, payload },
        { onSuccess: clearForm },
      );
      return;
    }

    createPersonalExpense.mutate(payload, { onSuccess: clearForm });
  };

  return (
    <>
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase text-[#d71920]">
            Resumen
          </p>
          <p className="mt-2 text-2xl font-black text-slate-950">
            {summaryQuery.isLoading ? "Calculando..." : formatMoney(summaryTotal)}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Total de gastos personales
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <p className="text-sm font-bold text-slate-950">
            {personalExpenses.length} gastos personales
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Total filtrado {formatMoney(filteredTotal)}
          </p>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B3262D]/10 text-[#B3262D]">
                <ReceiptText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950">
                  {editingExpense ? "Editar gasto personal" : "Registrar gasto personal"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Los gastos personales no forman parte de la utilidad operativa.
                </p>
              </div>
            </div>

            {editingExpense ? (
              <button
                className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#B3262D] focus:ring-offset-2"
                onClick={clearForm}
                type="button"
              >
                <X className="h-4 w-4" />
                Cancelar edición
              </button>
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_160px_180px]">
            <div>
              <label
                className="text-sm font-semibold text-slate-800"
                htmlFor="personalExpenseDescription"
              >
                Descripción
              </label>
              <input
                aria-invalid={Boolean(errors.description)}
                className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15"
                id="personalExpenseDescription"
                placeholder="Comida"
                {...register("description")}
              />
              {errors.description ? (
                <p
                  className="mt-2 text-sm font-medium text-[#d71920]"
                  role="alert"
                >
                  {errors.description.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                className="text-sm font-semibold text-slate-800"
                htmlFor="personalExpenseAmount"
              >
                Monto
              </label>
              <input
                aria-invalid={Boolean(errors.amount)}
                className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15"
                id="personalExpenseAmount"
                inputMode="decimal"
                placeholder="0.00"
                {...register("amount")}
              />
              {errors.amount ? (
                <p
                  className="mt-2 text-sm font-medium text-[#d71920]"
                  role="alert"
                >
                  {errors.amount.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                className="text-sm font-semibold text-slate-800"
                htmlFor="personalExpenseSpentAt"
              >
                Fecha
              </label>
              <input
                aria-invalid={Boolean(errors.spentAt)}
                className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15"
                id="personalExpenseSpentAt"
                type="date"
                {...register("spentAt")}
              />
              {errors.spentAt ? (
                <p
                  className="mt-2 text-sm font-medium text-[#d71920]"
                  role="alert"
                >
                  {errors.spentAt.message}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label
              className="text-sm font-semibold text-slate-800"
              htmlFor="personalExpenseNotes"
            >
              Notas
            </label>
            <textarea
              className="mt-2 min-h-20 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15"
              id="personalExpenseNotes"
              placeholder="Detalle opcional"
              {...register("notes")}
            />
          </div>

          {createPersonalExpense.isError || updatePersonalExpense.isError ? (
            <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              No se pudo guardar el gasto personal.
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#B3262D] px-4 text-sm font-semibold text-white shadow-lg shadow-[#B3262D]/20 transition hover:bg-[#8F1D24] focus:outline-none focus:ring-4 focus:ring-[#B3262D]/25 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {isSaving
                ? "Guardando..."
                : editingExpense
                  ? "Guardar cambios"
                  : "Crear gasto"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-950">
              Filtros de gastos personales
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Busca por descripción o acota por fecha.
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-3xl">
            <div className="flex h-11 items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#B3262D] focus-within:ring-4 focus-within:ring-[#B3262D]/15">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-400"
                onChange={handleQueryChange("search")}
                placeholder="Buscar"
                value={query.search ?? ""}
              />
            </div>
            <div className="flex h-11 items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#B3262D] focus-within:ring-4 focus-within:ring-[#B3262D]/15">
              <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
                onChange={handleQueryChange("dateFrom")}
                type="date"
                value={query.dateFrom ?? ""}
              />
            </div>
            <div className="flex h-11 items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#B3262D] focus-within:ring-4 focus-within:ring-[#B3262D]/15">
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

      {personalExpensesQuery.isLoading ? (
        <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm">
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#B3262D]" />
          Cargando gastos personales...
        </div>
      ) : null}

      {personalExpensesQuery.isError || summaryQuery.isError ? (
        <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          No se pudieron cargar los gastos personales.
        </div>
      ) : null}

      {deletePersonalExpense.isError ? (
        <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          No se pudo eliminar el gasto personal.
        </div>
      ) : null}

      {!personalExpensesQuery.isLoading && !personalExpensesQuery.isError ? (
        personalExpenses.length ? (
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[minmax(0,1fr)_140px_140px_120px] gap-4 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-bold uppercase text-slate-500 lg:grid">
              <span>Gasto</span>
              <span>Fecha</span>
              <span>Monto</span>
              <span>Acciones</span>
            </div>
            <div className="divide-y divide-slate-200">
              {personalExpenses.map((expense) => (
                <article
                  className="grid gap-3 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_140px_140px_120px] lg:items-center"
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
                  <div className="flex gap-2">
                    <button
                      aria-label="Editar gasto personal"
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-[#B3262D]/15"
                      disabled={isSaving}
                      onClick={() => handleEditExpense(expense)}
                      type="button"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Eliminar gasto personal"
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-[#d71920]/30 bg-white text-[#a41218] transition hover:bg-[#d71920]/10 focus:outline-none focus:ring-4 focus:ring-[#d71920]/15 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                      disabled={deletePersonalExpense.isPending}
                      onClick={() => handleDeleteExpense(expense)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-center shadow-sm">
            <div>
              <ReceiptText className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-950">
                No hay gastos personales para mostrar
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Registra un gasto personal para verlo aqui.
              </p>
            </div>
          </div>
        )
      ) : null}
    </>
  );
}
