import { z } from "zod";

const amountSchema = z
  .string()
  .trim()
  .refine((value) => value !== "" && Number.isFinite(Number(value)), {
    message: "Ingresa un monto valido",
  })
  .refine((value) => Number(value) > 0, {
    message: "El monto debe ser mayor que 0",
  });

export const personalExpenseSchema = z.object({
  amount: amountSchema,
  description: z.string().trim().min(2, "Ingresa la descripcion"),
  notes: z.string().trim().optional(),
  spentAt: z.string().trim().min(1, "Selecciona la fecha"),
});

export type PersonalExpenseFormValues = z.infer<
  typeof personalExpenseSchema
>;
