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
import { quickBudgetSchema } from "../../../schemas/quickBudgetSchema";
import {
  quickWorkOrderSchema,
  type QuickWorkOrderFormValues,
} from "../../../schemas/quickWorkOrderSchema";
import { getApiErrorMessage } from "../../../utils/apiError";
import { quickWorkOrderDefaultValues } from "../../../utils/quickWorkOrderForm";
import { WorkOrderItemsFields } from "./WorkOrderItemsFields";

// Formulario compartido entre ordenes y presupuestos.
// En modo "budget" no se muestra ni se valida el anticipo.
export type QuickEntryMode = "order" | "budget";
export type QuickEntryFormValues = QuickWorkOrderFormValues;

type QuickEntryFormProps = {
  mode: QuickEntryMode;
  isPending: boolean;
  error: unknown;
  onSubmit: (values: QuickEntryFormValues) => void;
};

const copy = {
  order: {
    sectionTitle: "Orden",
    sectionDescription: "Diagnóstico, anticipo y notas generales opcionales.",
    submit: "Crear orden",
    error: "No se pudo registrar la orden. Revisa los datos e intenta de nuevo.",
  },
  budget: {
    sectionTitle: "Presupuesto",
    sectionDescription: "Diagnóstico y notas generales opcionales.",
    submit: "Crear presupuesto",
    error: "No se pudo registrar el presupuesto. Revisa los datos e intenta de nuevo.",
  },
} as const;

const inputClass = "mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15";
const wrapperClass = "mt-2 flex h-12 items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#B3262D] focus-within:ring-4 focus-within:ring-[#B3262D]/15";
const bareInputClass = "h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-slate-400";
const textareaClass = "mt-2 min-h-24 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15";
const fieldIconClass = "h-5 w-5 shrink-0 text-slate-400";

const vehicleFields = [
  ["plate", "Placa", "ABC-123"],
  ["make", "Marca", "Marca"],
  ["model", "Modelo", "Modelo"],
  ["year", "Año", "2026"],
  ["color", "Color", "Color"],
] as const;

export function QuickEntryForm({ mode, isPending, error, onSubmit }: QuickEntryFormProps) {
  const isOrder = mode === "order";
  const text = copy[mode];
  const form = useForm<QuickEntryFormValues>({
    resolver: zodResolver(isOrder ? quickWorkOrderSchema : quickBudgetSchema) as never,
    defaultValues: quickWorkOrderDefaultValues,
  });
  const { register, handleSubmit, reset, formState: { errors } } = form;

  return (
    <div className="w-full max-w-6xl">
      {error ? <div role="alert" className="mb-5 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">{getApiErrorMessage(error, text.error)}</div> : null}
      <FormProvider {...form}>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <SectionHeader icon={<User className="h-5 w-5" />} title="Cliente" description="El telefono es opcional para clientes de mostrador." />
            <div className="grid min-w-0 gap-5 px-5 py-5 sm:px-6 [&>*]:min-w-0 lg:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="customerName">Nombre</label>
                <div className={wrapperClass}><User className={fieldIconClass} /><input aria-invalid={Boolean(errors.customer?.name)} autoComplete="name" className={bareInputClass} id="customerName" placeholder="Nombre del cliente" {...register("customer.name")} /></div>
                {errors.customer?.name ? <FieldError>{errors.customer.name.message}</FieldError> : null}
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="customerPhone">Telefono</label>
                <div className={wrapperClass}><Phone className={fieldIconClass} /><input aria-invalid={Boolean(errors.customer?.phone)} autoComplete="tel" className={bareInputClass} id="customerPhone" placeholder="Numero de contacto opcional" type="tel" {...register("customer.phone")} /></div>
                {errors.customer?.phone ? <FieldError>{errors.customer.phone.message}</FieldError> : null}
              </div>
            </div>
          </section>

          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <SectionHeader icon={<Wrench className="h-5 w-5" />} title="Vehiculo" description="Todos los datos del vehiculo son opcionales." />
            <div className="grid min-w-0 gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6 [&>*]:min-w-0 xl:grid-cols-5">
              {vehicleFields.map(([name, label, placeholder]) => (
                <div key={name}>
                  <label className="text-sm font-semibold text-slate-800" htmlFor={`vehicle-${name}`}>{label}</label>
                  <input aria-invalid={name === "year" && Boolean(errors.vehicle?.year)} className={inputClass} id={`vehicle-${name}`} inputMode={name === "year" ? "numeric" : undefined} placeholder={placeholder} {...register(`vehicle.${name}`)} />
                  {name === "year" && errors.vehicle?.year ? <FieldError>{errors.vehicle.year.message}</FieldError> : null}
                </div>
              ))}
            </div>
          </section>

          <WorkOrderItemsFields />

          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <SectionHeader icon={<FileText className="h-5 w-5" />} title={text.sectionTitle} description={text.sectionDescription} />
            <div className={`grid min-w-0 gap-5 px-5 py-5 sm:px-6 [&>*]:min-w-0 ${isOrder ? "lg:grid-cols-[220px_minmax(0,1fr)]" : ""}`}>
              {isOrder ? (
                <div>
                  <label className="text-sm font-semibold text-slate-800" htmlFor="advanceAmount">Anticipo</label>
                  <div className={wrapperClass}><CalendarClock className={fieldIconClass} /><input aria-invalid={Boolean(errors.advanceAmount)} className={bareInputClass} id="advanceAmount" inputMode="decimal" placeholder="0.00" {...register("advanceAmount")} /></div>
                  {errors.advanceAmount ? <FieldError>{errors.advanceAmount.message}</FieldError> : null}
                </div>
              ) : null}
              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="diagnosis">Diagnóstico</label>
                <textarea aria-invalid={Boolean(errors.diagnosis)} className={textareaClass} id="diagnosis" placeholder="Falla reportada, revision inicial o diagnostico preliminar" {...register("diagnosis")} />
                {errors.diagnosis ? <FieldError>{errors.diagnosis.message}</FieldError> : null}
              </div>
              <div className={isOrder ? "lg:col-span-2" : undefined}>
                <label className="text-sm font-semibold text-slate-800" htmlFor="notes">Notas generales</label>
                <textarea className={textareaClass} id="notes" placeholder="Condiciones, autorizaciones, entrega estimada o instrucciones internas" {...register("notes")} />
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-end sm:px-6">
            <button className="h-11 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#B3262D] focus:ring-offset-2" disabled={isPending} onClick={() => reset(quickWorkOrderDefaultValues)} type="button">Limpiar</button>
            <button className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#B3262D] px-5 text-sm font-semibold text-white shadow-lg shadow-[#B3262D]/20 transition hover:bg-[#8F1D24] focus:outline-none focus:ring-4 focus:ring-[#B3262D]/25 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none" disabled={isPending} type="submit">
              {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ClipboardPlus className="h-4 w-4" />}
              {isPending ? "Guardando..." : text.submit}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

function SectionHeader({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B3262D]/10 text-[#B3262D]">{icon}</div>
        <div>
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

function FieldError({ children }: { children?: React.ReactNode }) {
  return <p className="mt-2 text-sm font-medium text-[#d71920]" role="alert">{children}</p>;
}
