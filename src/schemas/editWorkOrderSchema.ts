import { z } from "zod";
import { optionalAmountSchema, quickItemSchema } from "./quickItemSchema";

const editableItemSchema = quickItemSchema.extend({
  notes: z.string().trim().optional(),
});

export const editWorkOrderSchema = z.object({
  diagnosis: z.string().trim().min(2, "Ingresa el diagnóstico"),
  notes: z.string().trim().optional(),
  advanceAmount: optionalAmountSchema,
  items: z.array(editableItemSchema).min(1, "Agrega al menos un item"),
});

export type EditWorkOrderFormValues = z.infer<typeof editWorkOrderSchema>;
