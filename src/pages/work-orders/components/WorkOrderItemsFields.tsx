import { Minus, Plus, ReceiptText } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { TireCatalogPicker } from "../../../components/TireCatalogPicker";
import { PartSelector } from "../../../components/PartSelector";
import { ItemTypeSelect } from "../../../components/ItemTypeSelect";
import type { EditWorkOrderFormValues } from "../../../schemas/editWorkOrderSchema";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { ITEM_SALE_DEFAULTS } from "../../../types/workOrders";
import {
  emptyQuickWorkOrderItem,
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
    setValue,
    formState: { errors },
  } = useFormContext<EditWorkOrderFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = useWatch({ control, name: "items" });
  const { data: authData } = useAuthUser();
  const isAdmin = authData?.user?.role === "ADMIN";

  return (
    <section className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B3262D]/10 text-[#B3262D]">
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
      </div>

      <div className="space-y-4 px-5 py-5 sm:px-6">
        {errors.items?.root?.message ? (
          <p className="text-sm font-medium text-[#d71920]">
            {errors.items.root.message}
          </p>
        ) : null}
        {fields.map((field, index) => {
          const isLabor = items?.[index]?.type === "LABOR";
          const isTire = items?.[index]?.type === "TIRE";
          const isPart = items?.[index]?.type === "PART";
          const isBalance = items?.[index]?.type === "BALANCE";
          const isOther = items?.[index]?.type === "OTHER";
          const showsDescription = isOther || isPart;
          const hidesCost = ["BALANCE", "ALIGNMENT", "ALIGNMENT_BALANCE"].includes(items?.[index]?.type ?? "");
          const fromCatalog = isTire && Boolean(items?.[index]?.tireId);
          // Llanta del catalogo: el costo es informativo (lo calcula el backend) y solo se muestra si llego en la respuesta.
          // El costo de las llantas solo lo ve un administrador.
          const showsCost = !isLabor && !hidesCost && (isAdmin || !isTire) && (!fromCatalog || Boolean(items?.[index]?.costAmount));

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
                    ? "grid min-w-0 gap-4 [&>*]:min-w-0 lg:grid-cols-[180px_160px]"
                    : "grid min-w-0 gap-4 [&>*]:min-w-0 lg:grid-cols-[180px_minmax(0,1fr)_160px_160px]"
                }
              >
                <div>
                  <label className="text-sm font-semibold text-slate-800">Tipo</label>
                  <input type="hidden" {...register(`items.${index}.type`)} />
                  <ItemTypeSelect
                    onChange={(type) => {
                      setValue(`items.${index}.type`, type, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      if (type !== "TIRE") {
                        setValue(`items.${index}.tireId`, "");
                        setValue(`items.${index}.unitPrice`, "");
                      }
                      const defaultSaleAmount = ITEM_SALE_DEFAULTS[type];
                      if (defaultSaleAmount) {
                        setValue(`items.${index}.saleAmount`, defaultSaleAmount, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }
                    }}
                    value={items?.[index]?.type ?? "OTHER"}
                  />
                </div>
                {!isLabor ? <div>
                  {isPart ? (
                    <PartSelector
                      idPrefix={`work-order-part-${field.id}`}
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
                        setValue(`items.${index}.quantity`, String(part.quantity), {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                    />
                  ) : null}
                  {isTire && items?.[index]?.description ? (
                    <div className="mt-2 flex flex-wrap items-center gap-3 rounded-md bg-slate-100 px-3 py-2">
                      <p className="min-w-0 flex-1 text-sm font-semibold text-slate-700">
                        Llanta seleccionada: {items[index]?.description}
                      </p>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        Cantidad de llantas
                        <input
                          className="h-10 w-20 rounded-md border border-slate-300 bg-white px-2 text-base outline-none focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15"
                          inputMode="numeric"
                          min="1"
                          onChange={(event) => {
                            const current = items[index];
                            const previous = Math.max(1, Math.floor(Number(current?.quantity || 1)));
                            const next = Math.max(1, Math.floor(Number(event.target.value || 1)));
                            // Los montos se guardan como total: se escala el precio unitario.
                            const scale = (amount?: string) => {
                              const value = Number(amount);
                              return Number.isFinite(value) && amount?.trim()
                                ? String(Math.round((value / previous) * next * 100) / 100)
                                : amount ?? "";
                            };
                            setValue(`items.${index}.quantity`, String(next), { shouldDirty: true, shouldValidate: true });
                            setValue(`items.${index}.saleAmount`, scale(current?.saleAmount), { shouldDirty: true, shouldValidate: true });
                            setValue(`items.${index}.costAmount`, scale(current?.costAmount), { shouldDirty: true, shouldValidate: true });
                          }}
                          type="number"
                          value={items?.[index]?.quantity || "1"}
                        />
                      </label>
                      <p className="w-full text-xs font-semibold text-slate-500">
                        {Number(items[index]?.quantity || 1) > 1
                          ? `Venta y costo son el total de ${items[index]?.quantity} llantas.`
                          : "Venta y costo de 1 llanta."}
                      </p>
                    </div>
                  ) : null}
                  {isPart && items?.[index]?.quantity ? (
                    <p className="mt-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                      Piezas: {items[index]?.quantity}
                    </p>
                  ) : null}
                  {isTire ? (
                    <TireCatalogPicker
                      onSelect={(tire) => {
                        setValue(`items.${index}.description`, tire.description, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue(`items.${index}.quantity`, "1", {
                          shouldDirty: true,
                        });
                        // Se guarda el id; el backend toma descripcion y costo de la llanta.
                        const unitPrice = String(Number(tire.suggestedPrice));
                        setValue(`items.${index}.tireId`, String(tire.id), {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue(`items.${index}.unitPrice`, unitPrice);
                        setValue(`items.${index}.costAmount`, tire.costAmount ?? "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue(`items.${index}.saleAmount`, unitPrice, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                    />
                  ) : null}
                  {showsDescription ? (
                    <>
                      <label className="text-sm font-semibold text-slate-800">{isPart ? "Descripción de la refacción" : "Descripción"}</label>
                      <input className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base outline-none focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15" placeholder={isPart ? "Ej. Balata delantera" : "Describe el cargo"} {...register(`items.${index}.description`)} />
                      {errors.items?.[index]?.description ? <p className="mt-2 text-sm text-[#d71920]">{errors.items[index]?.description?.message}</p> : null}
                    </>
                  ) : null}
                </div> : null}
                <div>
                  {isBalance ? (
                    <>
                      <label className="text-sm font-semibold text-slate-800">Llantas</label>
                      <input
                        className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base outline-none focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15"
                        inputMode="numeric"
                        min="1"
                        onChange={(event) => {
                          const quantity = Math.max(1, Number(event.target.value || 1));
                          setValue(`items.${index}.quantity`, event.target.value, { shouldDirty: true, shouldValidate: true });
                          setValue(`items.${index}.saleAmount`, String(quantity * 80), { shouldDirty: true, shouldValidate: true });
                        }}
                        type="number"
                        value={items?.[index]?.quantity ?? "1"}
                      />
                      {errors.items?.[index]?.quantity ? <p className="mt-2 text-sm text-[#d71920]">{errors.items[index]?.quantity?.message}</p> : null}
                    </>
                  ) : null}
                  <label className="text-sm font-semibold text-emerald-700">Venta</label>
                  <input className={`mt-2 h-12 w-full rounded-md border px-3 text-base font-semibold outline-none focus:ring-4 focus:ring-emerald-600/15 ${isPart || isBalance ? "border-emerald-200 bg-emerald-50/40 text-emerald-800" : "border-emerald-300 bg-emerald-50/60 text-emerald-900 focus:border-emerald-600"}`} inputMode="decimal" readOnly={isPart || isBalance} {...register(`items.${index}.saleAmount`)} />
                  {errors.items?.[index]?.saleAmount ? <p className="mt-2 text-sm text-[#d71920]">{errors.items[index]?.saleAmount?.message}</p> : null}
                </div>
                {showsCost ? <div>
                  <label className="text-sm font-semibold text-[#a41218]">Costo</label>
                  <input className="mt-2 h-12 w-full rounded-md border border-[#d71920]/40 bg-[#d71920]/5 px-3 text-base font-semibold text-[#8f1116] outline-none focus:border-[#d71920] focus:ring-4 focus:ring-[#d71920]/15" inputMode="decimal" readOnly={fromCatalog} {...register(`items.${index}.costAmount`)} />
                  {errors.items?.[index]?.costAmount ? <p className="mt-2 text-sm text-[#d71920]">{errors.items[index]?.costAmount?.message}</p> : null}
                </div> : null}
                {showItemNotes && !isLabor ? <div className="lg:col-span-4">
                  <label className="text-sm font-semibold text-slate-800">Notas del item</label>
                  <input className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base outline-none focus:border-[#B3262D] focus:ring-4 focus:ring-[#B3262D]/15" placeholder="Marca, especificaciones u observaciones" {...register(`items.${index}.notes`)} />
                </div> : null}
              </div>
            </div>
          );
        })}
          <button
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#B3262D] bg-white px-3 text-sm font-semibold text-[#B3262D] transition hover:bg-[#B3262D]/10 focus:outline-none focus:ring-2 focus:ring-[#B3262D] focus:ring-offset-2 sm:w-auto"
            onClick={() => append({ ...emptyQuickWorkOrderItem, notes: "" })}
            type="button"
          >
            <Plus className="h-4 w-4" /> Agregar item
          </button>
      </div>
    </section>
  );
}
