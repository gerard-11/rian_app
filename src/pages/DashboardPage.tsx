import { ClipboardPlus } from "lucide-react";
import { Link } from "react-router-dom";

const dashboardStats = [
  ["Ordenes activas", "0"],
  ["Clientes", "0"],
  ["Pendientes", "0"],
  ["Alertas", "0"],
];

export function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4169e1] text-lg font-black text-white">
              R
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">Rian App</p>
              <p className="text-xs font-medium text-slate-500">Admin</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            <Link
              className="flex h-10 items-center rounded-md bg-[#4169e1]/10 px-3 text-sm font-semibold text-[#4169e1]"
              to="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="flex h-10 items-center rounded-md px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              to="/work-orders"
            >
              Ordenes
            </Link>
            <Link
              className="flex h-10 items-center rounded-md px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              to="/work-orders/quick-entry"
            >
              Orden rapida
            </Link>
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase text-[#d71920]">
                  Panel principal
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-950">
                  Dashboard
                </h1>
              </div>
              <div className="h-10 w-10 rounded-md bg-[#4169e1] text-center text-sm font-black leading-10 text-white lg:hidden">
                R
              </div>
            </div>
          </header>

          <div className="p-5 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {dashboardStats.map(([label, value]) => (
                <article
                  className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"
                  key={label}
                >
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-3 text-3xl font-bold text-slate-950">
                    {value}
                  </p>
                </article>
              ))}
            </div>

            <section className="mt-6 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
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
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
