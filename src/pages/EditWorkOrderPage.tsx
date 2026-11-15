import { AlertCircle, ArrowLeft, LoaderCircle } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import { useUpdateWorkOrder, useWorkOrder } from "../hooks/useWorkOrders";
import { buildUpdateWorkOrderPayload, getEditWorkOrderValues } from "../utils/editWorkOrderForm";
import { WORK_ORDER_STATUSES, WORK_ORDER_STATUS_LABELS } from "../types/workOrders";
import { normalizeWorkOrderResponse } from "../utils/workOrdersList";
import { EditEntryForm } from "./work-orders/components/EditEntryForm";

export function EditWorkOrderPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: authData } = useAuthUser();
  const isAdmin = authData?.user?.role === "ADMIN";
  const orderQuery = useWorkOrder(id);
  const updateOrder = useUpdateWorkOrder();
  const workOrder = orderQuery.data ? normalizeWorkOrderResponse(orderQuery.data) : undefined;
  const initialValues = useMemo(() => (workOrder ? getEditWorkOrderValues(workOrder) : undefined), [workOrder]);

  if (orderQuery.isLoading) return <div className="flex min-h-64 items-center justify-center rounded-md border bg-white"><LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#B3262D]" />Cargando orden...</div>;
  if (orderQuery.isError || !workOrder || !initialValues) return <div className="rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-[#a41218]">No se pudo cargar la orden.</div>;
  if ((workOrder.status ?? "ACTIVE") !== "ACTIVE") return <div className="space-y-4"><div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900"><AlertCircle className="h-5 w-5 shrink-0" />Solo se pueden editar órdenes activas.</div><Link className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold" to="/work-orders"><ArrowLeft className="h-4 w-4" />Volver</Link></div>;

  return (
    <EditEntryForm
      cancelTo="/work-orders"
      error={updateOrder.error}
      initialValues={initialValues}
      isPending={updateOrder.isPending}
      mode="order"
      statusOptions={isAdmin ? WORK_ORDER_STATUSES.map((value) => ({ value, label: WORK_ORDER_STATUS_LABELS[value] })) : undefined}
      onSubmit={(values) => updateOrder.mutate(
        { id: workOrder.id, payload: buildUpdateWorkOrderPayload({ ...values, status: isAdmin && values.status !== initialValues.status ? values.status : "" }) },
        { onSuccess: () => navigate("/work-orders", { replace: true, state: { workOrderUpdated: true } }) },
      )}
    />
  );
}
