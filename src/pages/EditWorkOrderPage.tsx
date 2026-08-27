import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, LoaderCircle, Save } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUpdateWorkOrder, useWorkOrder } from "../hooks/useWorkOrders";
import { editWorkOrderSchema, type EditWorkOrderFormValues } from "../schemas/editWorkOrderSchema";
import { buildUpdateWorkOrderPayload, getEditWorkOrderValues } from "../utils/editWorkOrderForm";
import { normalizeWorkOrderResponse } from "../utils/workOrdersList";
import { WorkOrderItemsFields } from "./work-orders/components/WorkOrderItemsFields";

const inputClass = "mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15";
const areaClass = "mt-2 min-h-24 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15";

export function EditWorkOrderPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const orderQuery = useWorkOrder(id);
  const updateOrder = useUpdateWorkOrder();
  const form = useForm<EditWorkOrderFormValues>({ resolver: zodResolver(editWorkOrderSchema), defaultValues: { diagnosis: "", notes: "", advanceAmount: "", items: [] } });
  const { register, handleSubmit, reset, formState: { errors } } = form;
  const workOrder = orderQuery.data ? normalizeWorkOrderResponse(orderQuery.data) : undefined;

  useEffect(() => { if (workOrder) reset(getEditWorkOrderValues(workOrder)); }, [reset, workOrder]);

  if (orderQuery.isLoading) return <div className="flex min-h-64 items-center justify-center rounded-md border bg-white"><LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#4169e1]" />Cargando orden...</div>;
  if (orderQuery.isError || !workOrder) return <div className="rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-[#a41218]">No se pudo cargar la orden.</div>;
  if ((workOrder.status ?? "ACTIVE") !== "ACTIVE") return <div className="space-y-4"><div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900"><AlertCircle className="h-5 w-5 shrink-0" />Solo se pueden editar órdenes activas.</div><Link className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold" to="/work-orders"><ArrowLeft className="h-4 w-4" />Volver</Link></div>;

  const onSubmit = (values: EditWorkOrderFormValues) => updateOrder.mutate(
    { id: workOrder.id, payload: buildUpdateWorkOrderPayload(values) },
    { onSuccess: () => navigate("/work-orders", { replace: true, state: { workOrderUpdated: true } }) },
  );

  return <FormProvider {...form}><form className="max-w-6xl space-y-5" onSubmit={handleSubmit(onSubmit)}>
    {updateOrder.isError ? <div className="rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">No se pudo actualizar la orden. Verifica que siga activa e intenta de nuevo.</div> : null}
    <section className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-bold text-slate-950">Datos de la orden</h2><p className="mt-1 text-sm text-slate-500">Cliente y vehículo se conservan sin cambios.</p></div>
      <div className="grid gap-5 p-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div><label className="text-sm font-semibold" htmlFor="advanceAmount">Anticipo</label><input className={inputClass} id="advanceAmount" inputMode="decimal" {...register("advanceAmount")} />{errors.advanceAmount ? <p className="mt-1 text-sm text-[#d71920]">{errors.advanceAmount.message}</p> : null}</div>
        <div><label className="text-sm font-semibold" htmlFor="diagnosis">Diagnóstico</label><textarea className={areaClass} id="diagnosis" {...register("diagnosis")} />{errors.diagnosis ? <p className="mt-1 text-sm text-[#d71920]">{errors.diagnosis.message}</p> : null}</div>
        <div className="lg:col-span-2"><label className="text-sm font-semibold" htmlFor="notes">Notas generales</label><textarea className={areaClass} id="notes" {...register("notes")} /></div>
      </div>
    </section>
    <WorkOrderItemsFields showItemNotes />
    <div className="flex justify-end gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm"><Link className="flex h-11 items-center rounded-md border border-slate-300 px-4 text-sm font-semibold" to="/work-orders">Cancelar</Link><button className="flex h-11 items-center gap-2 rounded-md bg-[#4169e1] px-5 text-sm font-semibold text-white disabled:bg-slate-400" disabled={updateOrder.isPending} type="submit">{updateOrder.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{updateOrder.isPending ? "Guardando..." : "Guardar cambios"}</button></div>
  </form></FormProvider>;
}
