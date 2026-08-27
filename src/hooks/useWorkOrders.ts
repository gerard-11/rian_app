import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { weeklyProfitsQueryKeys } from "./useWeeklyProfits";
import {
  cancelWorkOrder,
  completeWorkOrder,
  createQuickEntry,
  deleteWorkOrder,
  getWorkOrderById,
  getWorkOrders,
  updateWorkOrder,
} from "../services/workOrdersService";
import type {
  CreateQuickWorkOrderInput,
  WorkOrderActionInput,
  UpdateWorkOrderActionInput,
} from "../types/workOrders";

export const workOrdersQueryKeys = {
  all: ["work-orders"] as const,
  lists: () => [...workOrdersQueryKeys.all, "list"] as const,
  detail: (id: WorkOrderActionInput["id"]) =>
    [...workOrdersQueryKeys.all, "detail", id] as const,
};

export const useWorkOrders = () =>
  useQuery({
    queryFn: getWorkOrders,
    queryKey: workOrdersQueryKeys.lists(),
  });

export const useWorkOrder = (id?: WorkOrderActionInput["id"]) =>
  useQuery({
    enabled: id !== undefined && id !== "",
    queryFn: () => getWorkOrderById(id as WorkOrderActionInput["id"]),
    queryKey: workOrdersQueryKeys.detail(id ?? ""),
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

export const useUpdateWorkOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateWorkOrderActionInput) => updateWorkOrder(payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: workOrdersQueryKeys.all });
      void queryClient.invalidateQueries({
        queryKey: workOrdersQueryKeys.detail(variables.id),
      });
    },
  });
};

export const useCompleteWorkOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WorkOrderActionInput) => completeWorkOrder(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: workOrdersQueryKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: weeklyProfitsQueryKeys.all,
      });
    },
  });
};

export const useCancelWorkOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WorkOrderActionInput) => cancelWorkOrder(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: workOrdersQueryKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: weeklyProfitsQueryKeys.all,
      });
    },
  });
};

export const useDeleteWorkOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WorkOrderActionInput) => deleteWorkOrder(payload),
    onSuccess: (_data, variables) => {
      queryClient.removeQueries({
        exact: true,
        queryKey: workOrdersQueryKeys.detail(variables.id),
      });
      void queryClient.invalidateQueries({
        queryKey: workOrdersQueryKeys.lists(),
      });
      void queryClient.invalidateQueries({
        queryKey: weeklyProfitsQueryKeys.all,
      });
    },
  });
};
