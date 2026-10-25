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
            className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#B3262D] px-4 text-sm font-semibold text-white shadow-lg shadow-[#B3262D]/20 transition hover:bg-[#8F1D24] focus:outline-none focus:ring-4 focus:ring-[#B3262D]/25"
            to="/work-orders/quick-entry"
          >
            <ClipboardPlus className="h-4 w-4" />
            Crear orden
          </Link>
          <Link
            className="flex h-11 items-center justify-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            to="/budgets/quick-entry"
          >
            <FileText className="h-4 w-4" />
            Crear presupuesto
          </Link>
          <Link
            className="flex h-11 items-center justify-center gap-2 rounded-md border border-sky-200 bg-sky-50 px-4 text-sm font-semibold text-sky-800 transition hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            to="/work-orders"
          >
            <ClipboardList className="h-4 w-4" />
            Ver ordenes
          </Link>
          {isAdmin ? (
            <>
              <Link
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                to="/expenses"
              >
                <ReceiptText className="h-4 w-4" />
                Registrar gasto
              </Link>
              <Link
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-violet-200 bg-violet-50 px-4 text-sm font-semibold text-violet-800 transition hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
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
