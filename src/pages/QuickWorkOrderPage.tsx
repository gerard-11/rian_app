import { useNavigate } from "react-router-dom";
import { useCreateQuickEntry } from "../hooks/useWorkOrders";
import { buildQuickWorkOrderPayload } from "../utils/quickWorkOrderForm";
import { QuickEntryForm } from "./work-orders/components/QuickEntryForm";

export function QuickWorkOrderPage() {
  const createQuickEntry = useCreateQuickEntry();
  const navigate = useNavigate();

  return (
    <QuickEntryForm
      isError={createQuickEntry.isError}
      isPending={createQuickEntry.isPending}
      mode="order"
      onSubmit={(values) =>
        createQuickEntry.mutate(buildQuickWorkOrderPayload(values), {
          onSuccess: () =>
            navigate("/work-orders", {
              replace: true,
              state: { workOrderCreated: true },
            }),
        })
      }
    />
  );
}
