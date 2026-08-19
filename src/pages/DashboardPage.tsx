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

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8 xl:grid-cols-4">
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
        </section>
      </div>
    </main>
  );
}
