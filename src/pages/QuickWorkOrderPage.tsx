import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardPlus,
  FileText,
  LoaderCircle,
  Minus,
  Phone,
  Plus,
  ReceiptText,
  User,
  Wrench,
} from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useCreateQuickEntry } from "../hooks/useWorkOrders";
import {
  quickWorkOrderSchema,
  type QuickWorkOrderFormValues,
} from "../schemas/quickWorkOrderSchema";
import { ITEM_TYPES } from "../types/workOrders";
import {
  buildQuickWorkOrderPayload,
  emptyQuickWorkOrderItem,
  itemTypeLabels,
  quickWorkOrderDefaultValues,
} from "../utils/quickWorkOrderForm";

const fieldIconClass = "h-5 w-5 shrink-0 text-slate-400";

export function QuickWorkOrderPage() {
  const createQuickEntry = useCreateQuickEntry();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuickWorkOrderFormValues>({
    resolver: zodResolver(quickWorkOrderSchema),
    defaultValues: quickWorkOrderDefaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const items = useWatch({ control, name: "items" });

  const onSubmit = (values: QuickWorkOrderFormValues) => {
    createQuickEntry.mutate(buildQuickWorkOrderPayload(values), {
      onSuccess: () => {
        reset(quickWorkOrderDefaultValues);
      },
    });
  };

  return (
    <>
      <div className="w-full max-w-6xl">
        {createQuickEntry.isSuccess ? (
          <div className="mb-5 flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            La orden rapida se registro correctamente.
          </div>
        ) : null}

        {createQuickEntry.isError ? (
          <div className="mb-5 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
            No se pudo registrar la orden. Revisa los datos e intenta de nuevo.
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4169e1]/10 text-[#4169e1]">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Cliente</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    El nombre y telefono son requeridos para crear la orden.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-2">
              <div>
                <label
                  className="text-sm font-semibold text-slate-800"
                  htmlFor="customerName"
                >
                  Nombre
                </label>
                <div className="mt-2 flex h-12 items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#4169e1] focus-within:ring-4 focus-within:ring-[#4169e1]/15">
                  <User className={fieldIconClass} />
                  <input
                    aria-invalid={Boolean(errors.customer?.name)}
                    autoComplete="name"
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-slate-400"
                    id="customerName"
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
                  htmlFor="customerPhone"
                >
                  Telefono
                </label>
                <div className="mt-2 flex h-12 items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#4169e1] focus-within:ring-4 focus-within:ring-[#4169e1]/15">
                  <Phone className={fieldIconClass} />
                  <input
                    aria-invalid={Boolean(errors.customer?.phone)}
                    autoComplete="tel"
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-slate-400"
                    id="customerPhone"
                    placeholder="Numero de contacto"
                    required
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
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4169e1]/10 text-[#4169e1]">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Vehiculo</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Todos los datos del vehiculo son opcionales.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6 xl:grid-cols-5">
              <div>
                <label
                  className="text-sm font-semibold text-slate-800"
                  htmlFor="vehiclePlate"
                >
                  Placa
                </label>
                <input
                  className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                  id="vehiclePlate"
                  placeholder="ABC-123"
                  {...register("vehicle.plate")}
                />
              </div>

              <div>
                <label
                  className="text-sm font-semibold text-slate-800"
                  htmlFor="vehicleMake"
                >
                  Marca
                </label>
                <input
                  className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                  id="vehicleMake"
                  placeholder="Marca"
                  {...register("vehicle.make")}
                />
              </div>

              <div>
                <label
                  className="text-sm font-semibold text-slate-800"
                  htmlFor="vehicleModel"
                >
                  Modelo
                </label>
                <input
                  className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                  id="vehicleModel"
                  placeholder="Modelo"
                  {...register("vehicle.model")}
                />
              </div>

              <div>
                <label
                  className="text-sm font-semibold text-slate-800"
                  htmlFor="vehicleYear"
                >
                  Año
                </label>
                <input
                  aria-invalid={Boolean(errors.vehicle?.year)}
                  className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                  id="vehicleYear"
                  inputMode="numeric"
                  placeholder="2026"
                  {...register("vehicle.year")}
                />
                {errors.vehicle?.year ? (
                  <p className="mt-2 text-sm font-medium text-[#d71920]">
                    {errors.vehicle.year.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  className="text-sm font-semibold text-slate-800"
                  htmlFor="vehicleColor"
                >
                  Color
                </label>
                <input
                  className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                  id="vehicleColor"
                  placeholder="Color"
                  {...register("vehicle.color")}
                />
              </div>
            </div>
          </section>

          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4169e1]/10 text-[#4169e1]">
                  <ReceiptText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Items</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Agrega al menos un servicio, refaccion, llanta u otro cargo.
                    Para mano de obra solo captura el precio de venta.
                  </p>
                </div>
              </div>
              <button
                className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#4169e1] bg-white px-3 text-sm font-semibold text-[#4169e1] transition hover:bg-[#4169e1]/10 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
                onClick={() => append({ ...emptyQuickWorkOrderItem })}
                type="button"
              >
                <Plus className="h-4 w-4" />
                Item
              </button>
            </div>

            <div className="space-y-4 px-5 py-5 sm:px-6">
              {errors.items?.root?.message ? (
                <p className="text-sm font-medium text-[#d71920]">
                  {errors.items.root.message}
                </p>
              ) : null}

              {fields.map((field, index) => {
                const isLabor = items?.[index]?.type === "LABOR";

                return (
                  <div
                    className="rounded-md border border-slate-200 bg-slate-50 p-4"
                    key={field.id}
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-slate-950">
                        Item {index + 1}
                      </p>
                      <button
                        aria-label="Eliminar item"
                        className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-[#d71920] focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-slate-300"
                        disabled={fields.length === 1}
                        onClick={() => remove(index)}
                        type="button"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>

                    <div
                      className={
                        isLabor
                          ? "grid gap-4 lg:grid-cols-[180px_160px]"
                          : "grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)_160px_160px]"
                      }
                    >
                      <div>
                        <label
                          className="text-sm font-semibold text-slate-800"
                          htmlFor={`item-${field.id}-type`}
                        >
                          Tipo
                        </label>
                        <select
                          className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                          id={`item-${field.id}-type`}
                          {...register(`items.${index}.type`)}
                        >
                          {ITEM_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {itemTypeLabels[type]}
                            </option>
                          ))}
                        </select>
                      </div>
                      {!isLabor ? (
                        <div>
                          <label
                            className="text-sm font-semibold text-slate-800"
                            htmlFor={`item-${field.id}-description`}
                          >
                            Descripción
                          </label>
                          <input
                            aria-invalid={Boolean(
                              errors.items?.[index]?.description,
                            )}
                            className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                            id={`item-${field.id}-description`}
                            placeholder="Servicio o producto"
                            {...register(`items.${index}.description`)}
                          />
                          {errors.items?.[index]?.description ? (
                            <p className="mt-2 text-sm font-medium text-[#d71920]">
                              {errors.items[index]?.description?.message}
                            </p>
                          ) : null}
                        </div>
                      ) : null}

                      <div>
                        <label
                          className="text-sm font-semibold text-slate-800"
                          htmlFor={`item-${field.id}-sale`}
                        >
                          Venta
                        </label>
                        <input
                          aria-invalid={Boolean(
                            errors.items?.[index]?.saleAmount,
                          )}
                          className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                          id={`item-${field.id}-sale`}
                          inputMode="decimal"
                          placeholder="0.00"
                          {...register(`items.${index}.saleAmount`)}
                        />
                        {errors.items?.[index]?.saleAmount ? (
                          <p className="mt-2 text-sm font-medium text-[#d71920]">
                            {errors.items[index]?.saleAmount?.message}
                          </p>
                        ) : null}
                      </div>
                      {!isLabor ? (
                        <div>
                          <label
                            className="text-sm font-semibold text-slate-800"
                            htmlFor={`item-${field.id}-cost`}
                          >
                            Costo
                          </label>
                          <input
                            aria-invalid={Boolean(
                              errors.items?.[index]?.costAmount,
                            )}
                            className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                            id={`item-${field.id}-cost`}
                            inputMode="decimal"
                            placeholder="0.00"
                            {...register(`items.${index}.costAmount`)}
                          />
                          {errors.items?.[index]?.costAmount ? (
                            <p className="mt-2 text-sm font-medium text-[#d71920]">
                              {errors.items[index]?.costAmount?.message}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4169e1]/10 text-[#4169e1]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Orden</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Diagnostico, anticipo opcional y notas generales.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div>
                <label
                  className="text-sm font-semibold text-slate-800"
                  htmlFor="advanceAmount"
                >
                  Anticipo
                </label>
                <div className="mt-2 flex h-12 items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#4169e1] focus-within:ring-4 focus-within:ring-[#4169e1]/15">
                  <CalendarClock className={fieldIconClass} />
                  <input
                    aria-invalid={Boolean(errors.advanceAmount)}
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-slate-400"
                    id="advanceAmount"
                    inputMode="decimal"
                    placeholder="0.00"
                    {...register("advanceAmount")}
                  />
                </div>
                {errors.advanceAmount ? (
                  <p className="mt-2 text-sm font-medium text-[#d71920]">
                    {errors.advanceAmount.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  className="text-sm font-semibold text-slate-800"
                  htmlFor="diagnosis"
                >
                  Diagnostico
                </label>
                <textarea
                  className="mt-2 min-h-24 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                  id="diagnosis"
                  placeholder="Falla reportada, revision inicial o diagnostico preliminar"
                  {...register("diagnosis")}
                />
              </div>

              <div className="lg:col-span-2">
                <label
                  className="text-sm font-semibold text-slate-800"
                  htmlFor="notes"
                >
                  Notas generales
                </label>
                <textarea
                  className="mt-2 min-h-24 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                  id="notes"
                  placeholder="Condiciones, autorizaciones, entrega estimada o instrucciones internas"
                  {...register("notes")}
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-end sm:px-6">
            <button
              className="h-11 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
              disabled={createQuickEntry.isPending}
              onClick={() => reset(quickWorkOrderDefaultValues)}
              type="button"
            >
              Limpiar
            </button>
            <button
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#4169e1] px-5 text-sm font-semibold text-white shadow-lg shadow-[#4169e1]/20 transition hover:bg-[#3658c9] focus:outline-none focus:ring-4 focus:ring-[#4169e1]/25 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
              disabled={createQuickEntry.isPending}
              type="submit"
            >
              {createQuickEntry.isPending ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <ClipboardPlus className="h-4 w-4" />
              )}
              {createQuickEntry.isPending ? "Guardando..." : "Crear orden"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
