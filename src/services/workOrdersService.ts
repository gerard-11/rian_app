import api from "./api";
import type {
  CreateQuickWorkOrderInput,
  QuickWorkOrderResponse,
  WorkOrderActionInput,
  WorkOrdersResponse,
} from "../types/workOrders";

export const getWorkOrders = async () => {
  const response = await api.get<WorkOrdersResponse>("/work-orders");

  return response.data;
};

export const createQuickEntry = async (payload: CreateQuickWorkOrderInput) => {
  const response = await api.post<QuickWorkOrderResponse>(
    "/work-orders/quick-entry",
    payload,
  );

  return response.data;
};

export const completeWorkOrder = async ({ id }: WorkOrderActionInput) => {
  const response = await api.post("/work-orders/" + id + "/complete");

  return response.data;
};

export const cancelWorkOrder = async ({ id }: WorkOrderActionInput) => {
  const response = await api.post("/work-orders/" + id + "/cancel");

  return response.data;
};
