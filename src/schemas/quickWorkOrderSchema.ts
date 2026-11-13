import { z } from "zod";
import { quickEntryBaseSchema } from "./quickEntryBaseSchema";
import { optionalAmountSchema } from "./quickItemSchema";

export const quickWorkOrderSchema = quickEntryBaseSchema.extend({
  advanceAmount: optionalAmountSchema,
});

export type QuickWorkOrderFormValues = z.infer<typeof quickWorkOrderSchema>;
