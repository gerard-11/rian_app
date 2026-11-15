import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarClock,
  ClipboardPlus,
  FileText,
  LoaderCircle,
} from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { quickBudgetSchema } from "../../../schemas/quickBudgetSchema";
import {
  quickWorkOrderSchema,
  type QuickWorkOrderFormValues,
} from "../../../schemas/quickWorkOrderSchema";
import { getApiErrorMessage } from "../../../utils/apiError";
import { quickWorkOrderDefaultValues } from "../../../utils/quickWorkOrderForm";
import {
  EntryPartiesFields,
  FieldError,
  SectionHeader,
  entryBareInputClass,
  entryFieldIconClass,
  entryTextareaClass,
  entryWrapperClass,
} from "./EntryPartiesFields";
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

const wrapperClass = entryWrapperClass;
const bareInputClass = entryBareInputClass;
const textareaClass = entryTextareaClass;
const fieldIconClass = entryFieldIconClass;

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
          <EntryPartiesFields />

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
