import {
  ClipboardList,
  ClipboardPlus,
  FileText,
  ReceiptText,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthUser } from "../../../hooks/useAuthUser";

export function DashboardQuickActions() {
  const { data: authData } = useAuthUser();
  const isAdmin = authData?.user?.role === "ADMIN";

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-[#d71920]">
            Operacion
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">
            Acciones rapidas
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Captura trabajo nuevo, consulta ordenes y registra gastos sin salir
            del panel.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
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
            className="flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
            to="/work-orders"
          >
            <ClipboardList className="h-4 w-4" />
            Ver ordenes
          </Link>
          {isAdmin ? (
            <>
              <Link
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
                to="/expenses"
              >
                <ReceiptText className="h-4 w-4" />
                Registrar gasto
              </Link>
              <Link
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
                to="/users"
              >
                <UserPlus className="h-4 w-4" />
                Usuarios
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
