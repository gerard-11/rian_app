import { ClipboardPlus, FileText, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardPage() {
  return (
    <>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#d71920]">
              Captura rapida
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">
              Nueva orden de trabajo
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Abre una orden con cliente, vehiculo, items, anticipo y
              diagnostico inicial.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
              to="/work-orders"
            >
              Ver ordenes
            </Link>
            <Link
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#4169e1] px-4 text-sm font-semibold text-white shadow-lg shadow-[#4169e1]/20 transition hover:bg-[#3658c9] focus:outline-none focus:ring-4 focus:ring-[#4169e1]/25"
              to="/work-orders/quick-entry"
            >
              <ClipboardPlus className="h-4 w-4" />
              Crear orden
            </Link>
            <Link
              className="flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
              to="/budgets/quick-entry"
            >
              <FileText className="h-4 w-4" />
              Crear presupuesto
            </Link>
            <Link
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#4169e1] px-4 text-sm font-semibold text-white shadow-lg shadow-[#4169e1]/20 transition hover:bg-[#3658c9] focus:outline-none focus:ring-4 focus:ring-[#4169e1]/25"
              to="/expenses"
            >
              <ReceiptText className="h-4 w-4" />
              Registrar gasto
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
