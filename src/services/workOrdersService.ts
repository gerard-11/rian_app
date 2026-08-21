import api from "./api";
import type {
  CreateQuickWorkOrderInput,
  QuickWorkOrderResponse,
  UpdateWorkOrderStatusInput,
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

export const updateWorkOrderStatus = async ({
  id,
  status,
}: UpdateWorkOrderStatusInput) => {
  const response = await api.patch("/work-orders/" + id, { status });

  return response.data;
};
