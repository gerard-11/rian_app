import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Save } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  editWorkOrderSchema,
  type EditWorkOrderFormValues,
} from "../../../schemas/editWorkOrderSchema";
import { getApiErrorMessage } from "../../../utils/apiError";
import { editEntryDefaultValues } from "../../../utils/editWorkOrderForm";
import {
  EntryPartiesFields,
  entryInputClass,
  entryTextareaClass,
} from "./EntryPartiesFields";
import { WorkOrderItemsFields } from "./WorkOrderItemsFields";

// Formulario de edicion compartido entre ordenes y presupuestos.
// En modo "budget" no se muestra ni se envia el anticipo.
export type EditEntryMode = "order" | "budget";

type EditEntryFormProps = {
  mode: EditEntryMode;
  initialValues: EditWorkOrderFormValues;
  isPending: boolean;
  error: unknown;
  cancelTo: string;
  // Solo se pasa para administradores; sin opciones no se muestra el estado.
  statusOptions?: { value: string; label: string }[];
  onSubmit: (values: EditWorkOrderFormValues) => void;
};

const copy = {
  order: {
    title: "Datos de la orden",
    error: "No se pudo actualizar la orden. Verifica que siga activa e intenta de nuevo.",
  },
  budget: {
    title: "Datos del presupuesto",
    error: "No se pudo actualizar el presupuesto. Verifica que siga vigente e intenta de nuevo.",
  },
} as const;

const inputClass = entryInputClass;
const areaClass = entryTextareaClass;

export function EditEntryForm({ mode, initialValues, isPending, error, cancelTo, statusOptions, onSubmit }: EditEntryFormProps) {
  const isOrder = mode === "order";
  const text = copy[mode];
  const form = useForm<EditWorkOrderFormValues>({
    resolver: zodResolver(editWorkOrderSchema),
    defaultValues: editEntryDefaultValues,
  });
  const { register, handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => { reset(initialValues); }, [reset, initialValues]);

  return (
    <FormProvider {...form}>
      <form className="max-w-6xl space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {error ? <div className="rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]" role="alert">{getApiErrorMessage(error, text.error)}</div> : null}
        <EntryPartiesFields />
        <section className="rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-bold text-slate-950">{text.title}</h2></div>
          <div className={`grid gap-5 p-5 ${isOrder ? "lg:grid-cols-[220px_minmax(0,1fr)]" : ""}`}>
            {statusOptions?.length ? <div className={isOrder ? "lg:col-span-2" : undefined}><label className="text-sm font-semibold" htmlFor="status">Estado</label><select className={inputClass} id="status" {...register("status")}>{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div> : null}
            {isOrder ? <div><label className="text-sm font-semibold" htmlFor="advanceAmount">Anticipo</label><input className={inputClass} id="advanceAmount" inputMode="decimal" {...register("advanceAmount")} />{errors.advanceAmount ? <p className="mt-1 text-sm text-[#d71920]">{errors.advanceAmount.message}</p> : null}</div> : null}
            <div><label className="text-sm font-semibold" htmlFor="diagnosis">Diagnóstico</label><textarea className={areaClass} id="diagnosis" {...register("diagnosis")} />{errors.diagnosis ? <p className="mt-1 text-sm text-[#d71920]">{errors.diagnosis.message}</p> : null}</div>
            <div className={isOrder ? "lg:col-span-2" : undefined}><label className="text-sm font-semibold" htmlFor="notes">Notas generales</label><textarea className={areaClass} id="notes" {...register("notes")} /></div>
          </div>
        </section>
        <WorkOrderItemsFields showItemNotes />
        <div className="flex justify-end gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm"><Link className="flex h-11 items-center rounded-md border border-slate-300 px-4 text-sm font-semibold" to={cancelTo}>Cancelar</Link><button className="flex h-11 items-center gap-2 rounded-md bg-[#B3262D] px-5 text-sm font-semibold text-white disabled:bg-slate-400" disabled={isPending} type="submit">{isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{isPending ? "Guardando..." : "Guardar cambios"}</button></div>
      </form>
    </FormProvider>
  );
}
