import { z } from "zod";
import { optionalAmountSchema, quickItemSchema } from "./quickItemSchema";

const editableItemSchema = quickItemSchema.extend({
  notes: z.string().trim().optional(),
});

export const editWorkOrderSchema = z
  .object({
    diagnosis: z.string().trim().min(2, "Ingresa el diagnóstico"),
    notes: z.string().trim().optional(),
    advanceAmount: optionalAmountSchema,
    items: z.array(editableItemSchema).min(1, "Agrega al menos un item"),
  })
  .superRefine((order, context) => {
    const advanceAmount = Number(order.advanceAmount || 0);
    const totalAmount = order.items.reduce(
      (total, item) => total + Number(item.saleAmount || 0),
      0,
    );

    if (advanceAmount < 0) {
      context.addIssue({
        code: "custom",
        message: "El anticipo no puede ser negativo",
        path: ["advanceAmount"],
      });
    } else if (advanceAmount > totalAmount) {
      context.addIssue({
        code: "custom",
        message: "El anticipo no puede ser mayor que el total de la orden",
        path: ["advanceAmount"],
      });
    }

    order.items.forEach((item, index) => {
      if (Number(item.costAmount || 0) < 0) {
        context.addIssue({
          code: "custom",
          message: "El costo no puede ser negativo",
          path: ["items", index, "costAmount"],
        });
      }
    });
  });

export type EditWorkOrderFormValues = z.infer<typeof editWorkOrderSchema>;
