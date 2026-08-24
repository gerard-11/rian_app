import type { ReactNode } from "react";
import { ArrowLeft, ClipboardPlus } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

type AdminLayoutPage = "dashboard" | "orders" | "profits" | "none";

type AdminRouteMeta = {
  actions?: ReactNode;
  eyebrow: string;
  page: AdminLayoutPage;
  title: string;
};

const navItems: Array<{
  label: string;
  page: Exclude<AdminLayoutPage, "none">;
  to: string;
}> = [
  { label: "Dashboard", page: "dashboard", to: "/dashboard" },
  { label: "Ordenes", page: "orders", to: "/work-orders" },
  { label: "Ganancias", page: "profits", to: "/profits/weekly" },
];

const getNavLinkClass = (isActive: boolean) =>
  isActive
    ? "flex h-10 items-center rounded-md bg-[#4169e1]/10 px-3 text-sm font-semibold text-[#4169e1]"
    : "flex h-10 items-center rounded-md px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950";

const orderCreateAction = (
  <Link
    className="flex h-10 items-center gap-2 rounded-md bg-[#4169e1] px-3 text-sm font-semibold text-white shadow-lg shadow-[#4169e1]/20 transition hover:bg-[#3658c9] focus:outline-none focus:ring-4 focus:ring-[#4169e1]/25"
    to="/work-orders/quick-entry"
  >
    <ClipboardPlus className="h-4 w-4" />
    Crear orden
  </Link>
);

const quickOrderActions = (
  <div className="flex flex-wrap gap-3">
    <Link
      className="flex h-10 items-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
      to="/work-orders"
    >
      Ver ordenes
    </Link>
    <Link
      className="flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
      to="/dashboard"
    >
      <ArrowLeft className="h-4 w-4" />
      Dashboard
    </Link>
  </div>
);

const dashboardAction = (
  <Link
    className="flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
    to="/dashboard"
  >
    <ArrowLeft className="h-4 w-4" />
    Dashboard
  </Link>
);

const routeMetaByPath: Record<string, AdminRouteMeta> = {
  "/dashboard": {
    eyebrow: "Panel principal",
    page: "dashboard",
    title: "Dashboard",
  },
  "/expenses": {
    eyebrow: "Gastos",
    page: "none",
    title: "Gastos",
  },
  "/profits/weekly": {
    actions: dashboardAction,
    eyebrow: "Ganancias",
    page: "profits",
    title: "Ganancias semanales",
  },
  "/work-orders": {
    actions: orderCreateAction,
    eyebrow: "Ordenes de trabajo",
    page: "orders",
    title: "Ordenes",
  },
  "/work-orders/quick-entry": {
    actions: quickOrderActions,
    eyebrow: "Ordenes de trabajo",
    page: "orders",
    title: "Orden rapida",
  },
};

const defaultRouteMeta: AdminRouteMeta = {
  eyebrow: "Admin",
  page: "none",
  title: "Rian Automotriz",
};

export function AdminLayout() {
  const location = useLocation();
  const meta = routeMetaByPath[location.pathname] ?? defaultRouteMeta;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#4169e1] text-lg font-black text-white">
              RA
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">
                Rian Automotriz
              </p>
              <p className="text-xs font-medium text-slate-500">Admin</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            {navItems.map((item) => (
              <Link
                className={getNavLinkClass(item.page === meta.page)}
                key={item.to}
                to={item.to}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase text-[#d71920]">
                  {meta.eyebrow}
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-950">
                  {meta.title}
                </h1>
              </div>
              {meta.actions}
            </div>
          </header>

          <div className="space-y-5 px-5 py-6 sm:px-8">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}
