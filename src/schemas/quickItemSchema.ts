import { z } from "zod";
import { ITEM_TYPES } from "../types/workOrders";

export const numericStringSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || Number.isFinite(Number(value)), {
    message: "Ingresa un numero valido",
  });

export const optionalAmountSchema = numericStringSchema.optional();

const isPositiveAmount = (value: string | undefined) =>
  value !== undefined && value !== "" && Number(value) > 0;

const toAmount = (value: string | undefined) => {
  if (value === undefined || value === "") return undefined;

  const amount = Number(value);

  return Number.isFinite(amount) ? amount : undefined;
};

export const quickItemSchema = z
  .object({
    type: z.enum(ITEM_TYPES),
    description: z.string().trim(),
    quantity: numericStringSchema.optional(),
    // Llanta elegida del catalogo; unitPrice es el precio sugerido por pieza.
    tireId: z.string().optional(),
    unitPrice: z.string().optional(),
    saleAmount: numericStringSchema.refine(isPositiveAmount, {
      message: "El precio de venta debe ser mayor que 0",
    }),
    costAmount: optionalAmountSchema,
  })
  .superRefine((item, context) => {
    const fromCatalog = item.type === "TIRE" && Boolean(item.tireId);

    if (["OTHER", "PART", "TIRE"].includes(item.type) && !fromCatalog && item.description.length < 2) {
      context.addIssue({
        code: "custom",
        message: item.type === "TIRE" ? "Selecciona una llanta del catalogo" : "Ingresa la descripcion del item",
        path: ["description"],
      });
    }

    if (item.type === "BALANCE" && (!item.quantity || Number(item.quantity) < 1)) {
      context.addIssue({
        code: "custom",
        message: "Indica cuántas llantas se van a balancear",
        path: ["quantity"],
      });
    }

    if (
      (item.type === "PART" || (item.type === "TIRE" && !fromCatalog)) &&
      !isPositiveAmount(item.costAmount)
    ) {
      context.addIssue({
        code: "custom",
        message: "El costo debe ser mayor que 0",
        path: ["costAmount"],
      });
    }

    const saleAmount = toAmount(item.saleAmount);
    const costAmount = toAmount(item.costAmount);

    if (
      saleAmount !== undefined &&
      costAmount !== undefined &&
      costAmount > saleAmount
    ) {
      context.addIssue({
        code: "custom",
        message: "Alerta: el costo no puede ser mayor que la venta",
        path: ["costAmount"],
      });
    }
  });
