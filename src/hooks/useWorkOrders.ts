import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuickEntry } from "../services/workOrdersService";
import type { CreateQuickWorkOrderInput } from "../types/workOrders";

export const workOrdersQueryKeys = {
  all: ["work-orders"] as const,
};

export const useCreateQuickEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQuickWorkOrderInput) =>
      createQuickEntry(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: workOrdersQueryKeys.all,
      });
    },
  });
};
