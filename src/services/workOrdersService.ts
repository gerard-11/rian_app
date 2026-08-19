import api from "./api";
import type {
  CreateQuickWorkOrderInput,
  QuickWorkOrderResponse,
} from "../types/workOrders";

export const createQuickEntry = async (payload: CreateQuickWorkOrderInput) => {
  const response = await api.post<QuickWorkOrderResponse>(
    "/work-orders/quick-entry",
    payload,
  );

  return response.data;
};
