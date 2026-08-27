import { Minus, Plus, ReceiptText } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import type { EditWorkOrderFormValues } from "../../../schemas/editWorkOrderSchema";
import { ITEM_TYPES } from "../../../types/workOrders";
import {
  emptyQuickWorkOrderItem,
  itemTypeLabels,
} from "../../../utils/quickWorkOrderForm";

type WorkOrderItemsFieldsProps = {
  showItemNotes?: boolean;
};

export function WorkOrderItemsFields({
  showItemNotes = false,
}: WorkOrderItemsFieldsProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<EditWorkOrderFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = useWatch({ control, name: "items" });

  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4169e1]/10 text-[#4169e1]">
            <ReceiptText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-950">Items</h2>
            <p className="mt-1 text-sm text-slate-500">
              Agrega servicios, refacciones, llantas u otros cargos. Para mano
              de obra solo captura el precio de venta.
            </p>
          </div>
        </div>
        <button
          className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#4169e1] bg-white px-3 text-sm font-semibold text-[#4169e1] transition hover:bg-[#4169e1]/10 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
          onClick={() => append({ ...emptyQuickWorkOrderItem, notes: "" })}
          type="button"
        >
          <Plus className="h-4 w-4" /> Item
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
                  className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-[#d71920] disabled:text-slate-300"
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
                  <label className="text-sm font-semibold text-slate-800">Tipo</label>
                  <select className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base outline-none focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15" {...register(`items.${index}.type`)}>
                    {ITEM_TYPES.map((type) => <option key={type} value={type}>{itemTypeLabels[type]}</option>)}
                  </select>
                </div>
                {!isLabor ? <div>
                  <label className="text-sm font-semibold text-slate-800">Descripción</label>
                  <input className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base outline-none focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15" {...register(`items.${index}.description`)} />
                  {errors.items?.[index]?.description ? <p className="mt-2 text-sm text-[#d71920]">{errors.items[index]?.description?.message}</p> : null}
                </div> : null}
                <div>
                  <label className="text-sm font-semibold text-emerald-700">Venta</label>
                  <input className="mt-2 h-12 w-full rounded-md border border-emerald-300 bg-emerald-50/60 px-3 text-base font-semibold text-emerald-900 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/15" inputMode="decimal" {...register(`items.${index}.saleAmount`)} />
                  {errors.items?.[index]?.saleAmount ? <p className="mt-2 text-sm text-[#d71920]">{errors.items[index]?.saleAmount?.message}</p> : null}
                </div>
                {!isLabor ? <div>
                  <label className="text-sm font-semibold text-[#a41218]">Costo</label>
                  <input className="mt-2 h-12 w-full rounded-md border border-[#d71920]/40 bg-[#d71920]/5 px-3 text-base font-semibold text-[#8f1116] outline-none focus:border-[#d71920] focus:ring-4 focus:ring-[#d71920]/15" inputMode="decimal" {...register(`items.${index}.costAmount`)} />
                  {errors.items?.[index]?.costAmount ? <p className="mt-2 text-sm text-[#d71920]">{errors.items[index]?.costAmount?.message}</p> : null}
                </div> : null}
                {showItemNotes && !isLabor ? <div className="lg:col-span-4">
                  <label className="text-sm font-semibold text-slate-800">Notas del item</label>
                  <input className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base outline-none focus:border-[#4169e1] focus:ring-4 focus:ring-[#4169e1]/15" placeholder="Marca, especificaciones u observaciones" {...register(`items.${index}.notes`)} />
                </div> : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
