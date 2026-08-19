import { z } from "zod";
import { ITEM_TYPES } from "../types/workOrders";

const numericStringSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || Number.isFinite(Number(value)), {
    message: "Ingresa un numero valido",
  });

const optionalAmountSchema = numericStringSchema.optional();

const quickWorkOrderItemSchema = z
  .object({
    type: z.enum(ITEM_TYPES),
    description: z.string().trim(),
    saleAmount: numericStringSchema.refine((value) => value !== "", {
      message: "Ingresa el precio de venta",
    }),
    costAmount: optionalAmountSchema,
  })
  .superRefine((item, context) => {
    if (item.type !== "LABOR" && item.description.length < 2) {
      context.addIssue({
        code: "custom",
        message: "Ingresa la descripcion del item",
        path: ["description"],
      });
    }
  });

export const quickWorkOrderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, "Ingresa el nombre del cliente"),
    phone: z.string().trim().optional(),
  }),
  vehicle: z.object({
    plate: z.string().trim().optional(),
    make: z.string().trim().optional(),
    model: z.string().trim().optional(),
    year: numericStringSchema.refine(
      (value) => {
        if (value === "") return true;

        const year = Number(value);

        return Number.isInteger(year) && year >= 1900 && year <= 2100;
      },
      { message: "Ingresa un año entre 1900 y 2100" },
    ),
    color: z.string().trim().optional(),
  }),
  diagnosis: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  advanceAmount: optionalAmountSchema,
  items: z.array(quickWorkOrderItemSchema).min(1, "Agrega al menos un item"),
});

export type QuickWorkOrderFormValues = z.infer<typeof quickWorkOrderSchema>;
