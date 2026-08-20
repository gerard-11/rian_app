import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createQuickEntry, getWorkOrders } from "../services/workOrdersService";
import type { CreateQuickWorkOrderInput } from "../types/workOrders";

export const workOrdersQueryKeys = {
  all: ["work-orders"] as const,
  lists: () => [...workOrdersQueryKeys.all, "list"] as const,
};

export const useWorkOrders = () =>
  useQuery({
    queryFn: getWorkOrders,
    queryKey: workOrdersQueryKeys.lists(),
  });

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
