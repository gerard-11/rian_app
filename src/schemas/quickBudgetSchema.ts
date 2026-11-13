import { z } from "zod";
import { quickEntryBaseSchema } from "./quickEntryBaseSchema";

export const quickBudgetSchema = quickEntryBaseSchema;

export type QuickBudgetFormValues = z.infer<typeof quickBudgetSchema>;
