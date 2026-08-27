import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarClock,
  ClipboardPlus,
  FileText,
  LoaderCircle,
  Phone,
  User,
  Wrench,
} from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateQuickEntry } from "../hooks/useWorkOrders";
import {
  quickWorkOrderSchema,
  type QuickWorkOrderFormValues,
} from "../schemas/quickWorkOrderSchema";
import {
  buildQuickWorkOrderPayload,
  quickWorkOrderDefaultValues,
} from "../utils/quickWorkOrderForm";
import { WorkOrderItemsFields } from "./work-orders/components/WorkOrderItemsFields";

const fieldIconClass = "h-5 w-5 shrink-0 text-slate-400";

export function QuickWorkOrderPage() {
  const createQuickEntry = useCreateQuickEntry();
  const navigate = useNavigate();
  const form = useForm<QuickWorkOrderFormValues>({
    resolver: zodResolver(quickWorkOrderSchema),
    defaultValues: quickWorkOrderDefaultValues,
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = (values: QuickWorkOrderFormValues) => {
    createQuickEntry.mutate(buildQuickWorkOrderPayload(values), {
      onSuccess: () => {
        navigate("/work-orders", {
          replace: true,
          state: { workOrderCreated: true },
        });
      },
    });
  };

  return (
    <>
      <div className="w-full max-w-6xl">
        {createQuickEntry.isError ? (
          <div className="mb-5 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
            No se pudo registrar la orden. Revisa los datos e intenta de nuevo.
          </div>
        ) : null}

        <FormProvider {...form}>
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
                    El telefono es opcional para clientes de mostrador.
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

          <WorkOrderItemsFields />

          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4169e1]/10 text-[#4169e1]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Orden</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Diagnóstico requerido, anticipo opcional y notas generales.
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
                  Diagnóstico
                </label>
                <textarea
                  aria-invalid={Boolean(errors.diagnosis)}
                  className="mt-2 min-h-24 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15"
                  id="diagnosis"
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
        </FormProvider>
      </div>
    </>
  );
}
