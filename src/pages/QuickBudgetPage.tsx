import { zodResolver } from "@hookform/resolvers/zod";
import {
  ClipboardPlus,
  LoaderCircle,
  Minus,
  Phone,
  Plus,
  ReceiptText,
  User,
  Wrench,
} from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TireCatalogPicker } from "../components/TireCatalogPicker";
import { PartSelector } from "../components/PartSelector";
import { ItemTypeSelect } from "../components/ItemTypeSelect";
import { useCreateQuickBudget } from "../hooks/useBudgets";
import {
  quickBudgetSchema,
  type QuickBudgetFormValues,
} from "../schemas/quickBudgetSchema";
import {
  buildQuickBudgetPayload,
  emptyQuickBudgetItem,
  quickBudgetDefaultValues,
} from "../utils/quickBudgetForm";

const fieldIconClass = "h-5 w-5 shrink-0 text-slate-400";

export function QuickBudgetPage() {
  const createQuickBudget = useCreateQuickBudget();
  const navigate = useNavigate();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QuickBudgetFormValues>({
    defaultValues: quickBudgetDefaultValues,
    resolver: zodResolver(quickBudgetSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const items = useWatch({ control, name: "items" });

  const onSubmit = (values: QuickBudgetFormValues) => {
    createQuickBudget.mutate(buildQuickBudgetPayload(values), {
      onSuccess: () => {
        navigate("/dashboard", { replace: true });
      },
    });
  };

  return (
    <div className="w-full max-w-6xl">
      {createQuickBudget.isError ? (
        <div className="mb-5 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          No se pudo registrar el presupuesto. Revisa los datos e intenta de
          nuevo.
        </div>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <section className="rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B3262D]/10 text-[#B3262D]">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-950">Cliente</h2>
                <p className="mt-1 text-sm text-slate-500">
                  El telefono es opcional para clientes de mostrador.
                </p>
              </div>
            </div>
          </div>

          <div className="grid min-w-0 gap-5 px-5 py-5 sm:px-6 [&>*]:min-w-0 lg:grid-cols-2">
            <div>
              <label
                className="text-sm font-semibold text-slate-800"
                htmlFor="budgetCustomerName"
              >
                Nombre
              </label>
              <div className="mt-2 flex h-12 items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#B3262D] focus-within:ring-4 focus-within:ring-[#B3262D]/15">
                <User className={fieldIconClass} />
                <input
                  aria-invalid={Boolean(errors.customer?.name)}
                  autoComplete="name"
                  className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-slate-400"
                  id="budgetCustomerName"
                  placeholder="Nombre del cliente"
                  {...register("customer.name")}
                />
              </div>
              {errors.customer?.name ? (
                <p className="mt-2 text-sm font-medium text-[#d71920]">
                  {errors.customer.name.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                className="text-sm font-semibold text-slate-800"
                htmlFor="budgetCustomerPhone"
              >
                Telefono
              </label>
              <div className="mt-2 flex h-12 items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#B3262D] focus-within:ring-4 focus-within:ring-[#B3262D]/15">
                <Phone className={fieldIconClass} />
                <input
                  aria-invalid={Boolean(errors.customer?.phone)}
                  autoComplete="tel"
                  className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-slate-400"
                  id="budgetCustomerPhone"
                  placeholder="Numero de contacto opcional"
                  type="tel"
                  {...register("customer.phone")}
                />
              </div>
              {errors.customer?.phone ? (
                <p className="mt-2 text-sm font-medium text-[#d71920]">
                  {errors.customer.phone.message}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B3262D]/10 text-[#B3262D]">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-950">Vehiculo</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Placa, marca, modelo, año y color son opcionales.
                </p>
              </div>
            </div>
          </div>

          <div className="grid min-w-0 gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6 [&>*]:min-w-0 xl:grid-cols-5">
            <input
              className="h-12 rounded-md border border-slate-300 bg-white px-3 text-base outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15"
              placeholder="Placa"
              {...register("vehicle.plate")}
            />
            <input
              className="h-12 rounded-md border border-slate-300 bg-white px-3 text-base outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15"
              placeholder="Marca"
              {...register("vehicle.make")}
            />
            <input
              className="h-12 rounded-md border border-slate-300 bg-white px-3 text-base outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15"
              placeholder="Modelo"
              {...register("vehicle.model")}
            />
            <div>
              <input
                aria-invalid={Boolean(errors.vehicle?.year)}
                className="h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15"
                inputMode="numeric"
                placeholder="Año"
                {...register("vehicle.year")}
              />
              {errors.vehicle?.year ? (
                <p className="mt-2 text-sm font-medium text-[#d71920]">
                  {errors.vehicle.year.message}
                </p>
              ) : null}
            </div>
            <input
              className="h-12 rounded-md border border-slate-300 bg-white px-3 text-base outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15"
              placeholder="Color"
              {...register("vehicle.color")}
            />
          </div>
        </section>

        <section className="rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B3262D]/10 text-[#B3262D]">
                <ReceiptText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-950">Items</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Agrega piezas, servicios o mano de obra del presupuesto.
                </p>
              </div>
            </div>
            <button
              className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#B3262D] bg-white px-3 text-sm font-semibold text-[#B3262D] transition hover:bg-[#B3262D]/10 focus:outline-none focus:ring-2 focus:ring-[#B3262D] focus:ring-offset-2"
              onClick={() => append({ ...emptyQuickBudgetItem })}
              type="button"
            >
              <Plus className="h-4 w-4" />
              Agregar item
            </button>
          </div>

          <div className="space-y-4 px-5 py-5 sm:px-6">
            {fields.map((field, index) => {
              const isLabor = items?.[index]?.type === "LABOR";
              const isTire = items?.[index]?.type === "TIRE";
              const isPart = items?.[index]?.type === "PART";
              const itemErrors = errors.items?.[index];

              return (
                <div
                  className={
                    isLabor
                      ? "grid min-w-0 gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 [&>*]:min-w-0 lg:grid-cols-[160px_140px_44px]"
                      : "grid min-w-0 gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 [&>*]:min-w-0 lg:grid-cols-[160px_minmax(0,1fr)_140px_140px_44px]"
                  }
                  key={field.id}
                >
                  <div>
                    <label
                      className="text-sm font-semibold text-slate-800"
                      htmlFor={`budget-item-${field.id}-type`}
                    >
                      Tipo
                    </label>
                    <input type="hidden" {...register(`items.${index}.type`)} />
                    <ItemTypeSelect
                      id={`budget-item-${field.id}-type`}
                      onChange={(type) => setValue(`items.${index}.type`, type, { shouldDirty: true, shouldValidate: true })}
                      value={items?.[index]?.type ?? "SERVICE"}
                    />
                  </div>

                  {!isLabor ? (
                    <div>
                      {isPart ? (
                        <PartSelector
                          idPrefix={`budget-part-${field.id}`}
                          onAdd={(part) => {
                            setValue(`items.${index}.description`, part.description, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            setValue(`items.${index}.costAmount`, String(part.costBase), {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            setValue(`items.${index}.saleAmount`, String(part.finalPrice), {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                        />
                      ) : null}
                      {isTire ? (
                        <TireCatalogPicker
                          onSelect={(tire) => {
                            setValue(`items.${index}.description`, tire.description, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            setValue(`items.${index}.costAmount`, tire.cost, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            setValue(
                              `items.${index}.saleAmount`,
                              tire.suggestedPrice,
                              { shouldDirty: true, shouldValidate: true },
                            );
                          }}
                        />
                      ) : null}
                      <label
                        className="text-sm font-semibold text-slate-800"
                        htmlFor={`budget-item-${field.id}-description`}
                      >
                        Descripción
                      </label>
                      <input
                        aria-invalid={Boolean(itemErrors?.description)}
                        className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15"
                        id={`budget-item-${field.id}-description`}
                        placeholder="Servicio o producto"
                        {...register(`items.${index}.description`)}
                      />
                      {itemErrors?.description ? (
                        <p
                          className="mt-2 text-sm font-medium text-[#d71920]"
                          role="alert"
                        >
                          {itemErrors.description.message}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <div>
                    <label
                      className="text-sm font-semibold text-emerald-700"
                      htmlFor={`budget-item-${field.id}-sale`}
                    >
                      Venta
                    </label>
                    <input
                      aria-invalid={Boolean(itemErrors?.saleAmount)}
                      id={`budget-item-${field.id}-sale`}
                      inputMode="decimal"
                        readOnly={isPart}
                        className={`mt-2 h-11 w-full rounded-md border px-3 text-sm font-semibold outline-none transition placeholder:text-emerald-700/45 focus:ring-4 focus:ring-emerald-600/15 ${isPart ? "border-emerald-200 bg-emerald-50/40 text-emerald-800" : "border-emerald-300 bg-emerald-50/60 text-emerald-900 focus:border-emerald-600"}`}
                      placeholder="0.00"
                      {...register(`items.${index}.saleAmount`)}
                    />
                    {itemErrors?.saleAmount ? (
                      <p
                        className="mt-2 text-sm font-medium text-[#d71920]"
                        role="alert"
                      >
                        {itemErrors.saleAmount.message}
                      </p>
                    ) : null}
                  </div>

                  {!isLabor ? (
                    <div>
                      <label
                        className="text-sm font-semibold text-[#a41218]"
                        htmlFor={`budget-item-${field.id}-cost`}
                      >
                        Costo
                      </label>
                      <input
                        aria-invalid={Boolean(itemErrors?.costAmount)}
                        className="mt-2 h-11 w-full rounded-md border border-[#d71920]/40 bg-[#d71920]/5 px-3 text-sm font-semibold text-[#8f1116] outline-none transition placeholder:text-[#a41218]/45 focus:border-[#d71920] focus:ring-4 focus:ring-[#d71920]/15"
                        id={`budget-item-${field.id}-cost`}
                        inputMode="decimal"
                        placeholder="0.00"
                        {...register(`items.${index}.costAmount`)}
                      />
                      {itemErrors?.costAmount ? (
                        <p
                          className="mt-2 text-sm font-medium text-[#d71920]"
                          role="alert"
                        >
                          {itemErrors.costAmount.message}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <button
                    aria-label="Eliminar item"
                    className="flex h-11 w-11 items-center justify-center self-end rounded-md border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                    type="button"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="grid min-w-0 gap-5 px-5 py-5 sm:px-6 [&>*]:min-w-0 lg:grid-cols-2">
            <div>
              <label
                className="text-sm font-semibold text-slate-800"
                htmlFor="budgetDiagnosis"
              >
                Diagnóstico
              </label>
              <textarea
                aria-invalid={Boolean(errors.diagnosis)}
                className="mt-2 min-h-28 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-base outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15"
                id="budgetDiagnosis"
                placeholder="Falla reportada, revision inicial o diagnostico preliminar"
                {...register("diagnosis")}
              />
              {errors.diagnosis ? (
                <p
                  className="mt-2 text-sm font-medium text-[#d71920]"
                  role="alert"
                >
                  {errors.diagnosis.message}
                </p>
              ) : null}
            </div>
            <div>
              <label
                className="text-sm font-semibold text-slate-800"
                htmlFor="budgetNotes"
              >
                Notas
              </label>
              <textarea
                className="mt-2 min-h-28 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-base outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15"
                id="budgetNotes"
                placeholder="Notas"
                {...register("notes")}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end rounded-md border border-slate-200 bg-white px-5 py-4 shadow-sm sm:px-6">
          <button
            className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#B3262D] px-5 text-sm font-semibold text-white shadow-lg shadow-[#B3262D]/20 transition hover:bg-[#8F1D24] focus:outline-none focus:ring-4 focus:ring-[#B3262D]/25 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
            disabled={createQuickBudget.isPending}
            type="submit"
          >
            {createQuickBudget.isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <ClipboardPlus className="h-4 w-4" />
            )}
            {createQuickBudget.isPending ? "Guardando..." : "Crear presupuesto"}
          </button>
        </div>
      </form>
    </div>
  );
}
