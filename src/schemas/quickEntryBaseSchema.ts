import { z } from "zod";
import { numericStringSchema, quickItemSchema } from "./quickItemSchema";

export const quickEntryBaseSchema = z.object({
  customer: z.object({
    name: z.string().trim().refine((name) => name === "" || name.length >= 2, "Ingresa el nombre del cliente"),
    phone: z.string().trim(),
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
  diagnosis: z.string().trim(),
  notes: z.string().trim().optional(),
  items: z.array(quickItemSchema).min(1, "Agrega al menos un item"),
});
