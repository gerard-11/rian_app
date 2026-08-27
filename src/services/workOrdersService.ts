import api from "./api";
import type {
  CreateQuickWorkOrderInput,
  QuickWorkOrderResponse,
  WorkOrderActionInput,
  WorkOrderResponse,
  WorkOrdersResponse,
  UpdateWorkOrderActionInput,
} from "../types/workOrders";

export const getWorkOrders = async () => {
  const response = await api.get<WorkOrdersResponse>("/work-orders");

  return response.data;
};

export const getWorkOrderById = async (id: WorkOrderActionInput["id"]) => {
  const response = await api.get<WorkOrderResponse>("/work-orders/" + id);

  return response.data;
};

export const createQuickEntry = async (payload: CreateQuickWorkOrderInput) => {
  const response = await api.post<QuickWorkOrderResponse>(
    "/work-orders/quick-entry",
    payload,
  );

  return response.data;
};

export const updateWorkOrder = async ({
  id,
  payload,
}: UpdateWorkOrderActionInput) => {
  const response = await api.patch<WorkOrderResponse>(
    "/work-orders/" + id,
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

export const deleteWorkOrder = async ({ id }: WorkOrderActionInput) => {
  const response = await api.delete("/work-orders/" + id);

  return response.data;
};
