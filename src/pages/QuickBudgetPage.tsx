import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardPlus, FileText, LoaderCircle, Phone, User, Wrench } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateQuickBudget } from "../hooks/useBudgets";
import { quickBudgetSchema, type QuickBudgetFormValues } from "../schemas/quickBudgetSchema";
import { buildQuickBudgetPayload, quickBudgetDefaultValues } from "../utils/quickBudgetForm";
import { WorkOrderItemsFields } from "./work-orders/components/WorkOrderItemsFields";

const inputClass = "mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15";
const fieldIconClass = "h-5 w-5 shrink-0 text-slate-400";

export function QuickBudgetPage() {
  const createQuickBudget = useCreateQuickBudget();
  const navigate = useNavigate();
  const form = useForm<QuickBudgetFormValues>({
    resolver: zodResolver(quickBudgetSchema),
    defaultValues: quickBudgetDefaultValues,
  });
  const { register, handleSubmit, reset, formState: { errors } } = form;

  const onSubmit = (values: QuickBudgetFormValues) => {
    createQuickBudget.mutate(buildQuickBudgetPayload(values), {
      onSuccess: () => navigate("/budgets", { replace: true }),
    });
  };

  const vehicleFields = [
    ["plate", "Placa", "ABC-123"],
    ["make", "Marca", "Marca"],
    ["model", "Modelo", "Modelo"],
    ["year", "Año", "2026"],
    ["color", "Color", "Color"],
  ] as const;

  return (
    <div className="w-full max-w-6xl">
      {createQuickBudget.isError ? <div className="mb-5 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">No se pudo registrar el presupuesto. Revisa los datos e intenta de nuevo.</div> : null}
      <FormProvider {...form}>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <SectionHeader icon={<User className="h-5 w-5" />} title="Cliente" description="El telefono es opcional para clientes de mostrador." />
            <div className="grid min-w-0 gap-5 px-5 py-5 sm:px-6 [&>*]:min-w-0 lg:grid-cols-2">
              <div><label className="text-sm font-semibold text-slate-800" htmlFor="budgetCustomerName">Nombre</label><div className="mt-2 flex h-12 items-center rounded-md border border-slate-300 bg-white px-3"><User className={fieldIconClass} /><input aria-invalid={Boolean(errors.customer?.name)} autoComplete="name" className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none" id="budgetCustomerName" placeholder="Nombre del cliente" {...register("customer.name")} /></div>{errors.customer?.name ? <FieldError>{errors.customer.name.message}</FieldError> : null}</div>
              <div><label className="text-sm font-semibold text-slate-800" htmlFor="budgetCustomerPhone">Telefono</label><div className="mt-2 flex h-12 items-center rounded-md border border-slate-300 bg-white px-3"><Phone className={fieldIconClass} /><input aria-invalid={Boolean(errors.customer?.phone)} autoComplete="tel" className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none" id="budgetCustomerPhone" placeholder="Numero de contacto opcional" type="tel" {...register("customer.phone")} /></div>{errors.customer?.phone ? <FieldError>{errors.customer.phone.message}</FieldError> : null}</div>
            </div>
          </section>

          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <SectionHeader icon={<Wrench className="h-5 w-5" />} title="Vehiculo" description="Todos los datos del vehiculo son opcionales." />
            <div className="grid min-w-0 gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6 [&>*]:min-w-0 xl:grid-cols-5">
              {vehicleFields.map(([name, label, placeholder]) => <div key={name}><label className="text-sm font-semibold text-slate-800" htmlFor={`budgetVehicle${name}`}>{label}</label><input aria-invalid={name === "year" && Boolean(errors.vehicle?.year)} className={inputClass} id={`budgetVehicle${name}`} inputMode={name === "year" ? "numeric" : undefined} placeholder={placeholder} {...register(`vehicle.${name}`)} />{name === "year" && errors.vehicle?.year ? <FieldError>{errors.vehicle.year.message}</FieldError> : null}</div>)}
            </div>
          </section>

          <WorkOrderItemsFields />

          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <SectionHeader icon={<FileText className="h-5 w-5" />} title="Presupuesto" description="Diagnostico y notas generales opcionales." />
            <div className="grid min-w-0 gap-5 px-5 py-5 sm:px-6 [&>*]:min-w-0">
              <div><label className="text-sm font-semibold text-slate-800" htmlFor="budgetDiagnosis">Diagnostico</label><textarea aria-invalid={Boolean(errors.diagnosis)} className="mt-2 min-h-24 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-base outline-none focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15" id="budgetDiagnosis" placeholder="Falla reportada, revision inicial o diagnostico preliminar" {...register("diagnosis")} />{errors.diagnosis ? <FieldError>{errors.diagnosis.message}</FieldError> : null}</div>
              <div><label className="text-sm font-semibold text-slate-800" htmlFor="budgetNotes">Notas generales</label><textarea className="mt-2 min-h-24 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-base outline-none focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15" id="budgetNotes" placeholder="Condiciones, autorizaciones, entrega estimada o instrucciones internas" {...register("notes")} /></div>
            </div>
          </section>

          <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-end sm:px-6"><button className="h-11 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700" disabled={createQuickBudget.isPending} onClick={() => reset(quickBudgetDefaultValues)} type="button">Limpiar</button><button className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#B3262D] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400" disabled={createQuickBudget.isPending} type="submit">{createQuickBudget.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ClipboardPlus className="h-4 w-4" />}{createQuickBudget.isPending ? "Guardando..." : "Crear presupuesto"}</button></div>
        </form>
      </FormProvider>
    </div>
  );
}

function SectionHeader({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return <div className="border-b border-slate-200 px-5 py-4 sm:px-6"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B3262D]/10 text-[#B3262D]">{icon}</div><div><h2 className="text-lg font-bold text-slate-950">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div></div></div>;
}

function FieldError({ children }: { children?: React.ReactNode }) {
  return <p className="mt-2 text-sm font-medium text-[#d71920]">{children}</p>;
}
