import { Phone, User, Wrench } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { QuickWorkOrderFormValues } from "../../../schemas/quickWorkOrderSchema";

// Secciones de cliente y vehiculo compartidas por los formularios de
// alta y edicion de ordenes y presupuestos.
type PartiesFormValues = Pick<QuickWorkOrderFormValues, "customer" | "vehicle">;

export const entryInputClass = "mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15";
export const entryTextareaClass = "mt-2 min-h-24 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15";
export const entryWrapperClass = "mt-2 flex h-12 items-center rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-[#B3262D] focus-within:ring-4 focus-within:ring-[#B3262D]/15";
export const entryBareInputClass = "h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-slate-400";
export const entryFieldIconClass = "h-5 w-5 shrink-0 text-slate-400";

const vehicleFields = [
  ["plate", "Placa", "ABC-123"],
  ["make", "Marca", "Marca"],
  ["model", "Modelo", "Modelo"],
  ["year", "Año", "2026"],
  ["color", "Color", "Color"],
] as const;

export function EntryPartiesFields() {
  const { register, formState: { errors } } = useFormContext<PartiesFormValues>();

  return (
    <>
      <section className="rounded-md border border-slate-200 bg-white shadow-sm">
        <SectionHeader icon={<User className="h-5 w-5" />} title="Cliente" description="El telefono es opcional para clientes de mostrador." />
        <div className="grid min-w-0 gap-5 px-5 py-5 sm:px-6 [&>*]:min-w-0 lg:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-800" htmlFor="customerName">Nombre</label>
            <div className={entryWrapperClass}><User className={entryFieldIconClass} /><input aria-invalid={Boolean(errors.customer?.name)} autoComplete="name" className={entryBareInputClass} id="customerName" placeholder="Nombre del cliente" {...register("customer.name")} /></div>
            {errors.customer?.name ? <FieldError>{errors.customer.name.message}</FieldError> : null}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-800" htmlFor="customerPhone">Telefono</label>
            <div className={entryWrapperClass}><Phone className={entryFieldIconClass} /><input aria-invalid={Boolean(errors.customer?.phone)} autoComplete="tel" className={entryBareInputClass} id="customerPhone" placeholder="Numero de contacto opcional" type="tel" {...register("customer.phone")} /></div>
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
              <input aria-invalid={name === "year" && Boolean(errors.vehicle?.year)} className={entryInputClass} id={`vehicle-${name}`} inputMode={name === "year" ? "numeric" : undefined} placeholder={placeholder} {...register(`vehicle.${name}`)} />
              {name === "year" && errors.vehicle?.year ? <FieldError>{errors.vehicle.year.message}</FieldError> : null}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function SectionHeader({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
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

export function FieldError({ children }: { children?: React.ReactNode }) {
  return <p className="mt-2 text-sm font-medium text-[#d71920]" role="alert">{children}</p>;
}
