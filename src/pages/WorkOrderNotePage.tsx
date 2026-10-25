import { AlertCircle, ArrowLeft, LoaderCircle, Printer } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { WorkOrderNoteDocument } from "./work-orders/components/WorkOrderNoteDocument";
import { useWorkOrder } from "../hooks/useWorkOrders";
import { normalizeWorkOrderResponse } from "../utils/workOrdersList";

export function WorkOrderNotePage() {
  const { id } = useParams<{ id: string }>();
  const workOrderQuery = useWorkOrder(id);
  const workOrder = workOrderQuery.data
    ? normalizeWorkOrderResponse(workOrderQuery.data)
    : undefined;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm print:hidden sm:flex-row sm:items-center sm:justify-between">
        <Link
          className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#B3262D] focus:ring-offset-2"
          to="/work-orders"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a ordenes
        </Link>

        <button
          className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#B3262D] px-4 text-sm font-semibold text-white shadow-lg shadow-[#B3262D]/20 transition hover:bg-[#8F1D24] focus:outline-none focus:ring-4 focus:ring-[#B3262D]/25 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
          disabled={!workOrder}
          onClick={handlePrint}
          type="button"
        >
          <Printer className="h-4 w-4" />
          Imprimir / Guardar PDF
        </button>
      </div>

      {workOrderQuery.isLoading ? (
        <div className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm">
          <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-[#B3262D]" />
          Cargando nota...
        </div>
      ) : null}

      {workOrderQuery.isError ? (
        <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          No se pudo cargar la orden para generar la nota.
        </div>
      ) : null}

      {!workOrderQuery.isLoading && !workOrderQuery.isError && !workOrder ? (
        <div className="flex items-start gap-3 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-4 py-3 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          La respuesta no incluye los datos de la orden.
        </div>
      ) : null}

      {workOrder ? <WorkOrderNoteDocument workOrder={workOrder} /> : null}
    </>
  );
}
