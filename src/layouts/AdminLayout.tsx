import { useEffect, useState, type ReactNode } from "react";
import logoRian from "../assets/logo-rian.jpeg";
import { ArrowLeft, ClipboardPlus, FileText, Menu, X } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ProfitsLockButton } from "../components/ProfitsLockButton";
import { ThemeToggle } from "../components/ThemeToggle";
import { queryClient } from "../lib/queryClient";
import { logout } from "../services/authService";

type AdminLayoutPage =
  | "budgets"
  | "dashboard"
  | "expenses"
  | "orders"
  | "personal-expenses"
  | "profits"
  | "tires"
  | "none";

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
  { label: "Presupuestos", page: "budgets", to: "/budgets" },
  { label: "Ordenes", page: "orders", to: "/work-orders" },
  { label: "Llantas", page: "tires", to: "/tires" },
  { label: "Gastos del negocio", page: "expenses", to: "/expenses" },
  { label: "Ganancias", page: "profits", to: "/profits/weekly" },
  {
    label: "Gastos personales",
    page: "personal-expenses",
    to: "/personal-expenses",
  },
];

const getNavLinkClass = (isActive: boolean) =>
  isActive
    ? "flex h-10 items-center rounded-md bg-[#4169e1]/10 px-3 text-sm font-semibold text-[#4169e1]"
    : "flex h-10 items-center rounded-md px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950";

const budgetCreateAction = (
  <Link
    className="flex h-10 items-center gap-2 rounded-md bg-[#4169e1] px-3 text-sm font-semibold text-white shadow-lg shadow-[#4169e1]/20 transition hover:bg-[#3658c9] focus:outline-none focus:ring-4 focus:ring-[#4169e1]/25"
    to="/budgets/quick-entry"
  >
    <FileText className="h-4 w-4" />
    Crear presupuesto
  </Link>
);

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

const profitsActions = (
  <div className="flex flex-wrap gap-3">
    <ProfitsLockButton />
    {dashboardAction}
  </div>
);

const budgetNoteRouteMeta: AdminRouteMeta = {
  eyebrow: "Presupuestos",
  page: "budgets",
  title: "Nota de presupuesto",
};

const workOrderNoteRouteMeta: AdminRouteMeta = {
  eyebrow: "Ordenes de trabajo",
  page: "orders",
  title: "Nota de servicio",
};

const routeMetaByPath: Record<string, AdminRouteMeta> = {
  "/budgets": {
    actions: budgetCreateAction,
    eyebrow: "Presupuestos",
    page: "budgets",
    title: "Presupuestos",
  },
  "/budgets/quick-entry": {
    actions: dashboardAction,
    eyebrow: "Presupuestos",
    page: "budgets",
    title: "Presupuesto rapido",
  },
  "/dashboard": {
    eyebrow: "Panel principal",
    page: "dashboard",
    title: "Dashboard",
  },
  "/expenses": {
    eyebrow: "Gastos del negocio",
    page: "expenses",
    title: "Gastos del negocio",
  },
  "/personal-expenses": {
    eyebrow: "Gastos personales",
    page: "personal-expenses",
    title: "Gastos personales",
  },
  "/profits/weekly": {
    actions: profitsActions,
    eyebrow: "Ganancias",
    page: "profits",
    title: "Ganancias semanales",
  },
  "/tires": {
    eyebrow: "Catálogo",
    page: "tires",
    title: "Llantas",
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

const getRouteMeta = (pathname: string): AdminRouteMeta => {
  if (/^\/budgets\/[^/]+\/note$/.test(pathname)) {
    return budgetNoteRouteMeta;
  }

  if (/^\/work-orders\/[^/]+\/note$/.test(pathname)) {
    return workOrderNoteRouteMeta;
  }

  if (/^\/work-orders\/[^/]+\/edit$/.test(pathname)) {
    return {
      eyebrow: "Ordenes de trabajo",
      page: "orders",
      title: "Editar orden",
    };
  }

  return routeMetaByPath[pathname] ?? defaultRouteMeta;
};

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const meta = getRouteMeta(location.pathname);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await logout();
    } finally {
      queryClient.clear();
      setIsLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 print:bg-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-slate-200 bg-white px-5 py-6 print:hidden lg:block">
          <div className="px-1">
            <img
              alt="Rian Automotriz"
              className="h-auto w-full rounded-2xl object-cover opacity-100 [mask-image:radial-gradient(circle_at_center,black_88%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,black_88%,transparent_100%)]"
              src={logoRian}
            />
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
          <header className="border-b border-slate-200 bg-white px-5 py-4 print:hidden sm:px-8">
            <div className="mb-4 flex items-center justify-between gap-3 sm:hidden">
              <button
                aria-controls="mobile-admin-menu"
                aria-expanded={isMobileMenuOpen}
                aria-label={
                  isMobileMenuOpen
                    ? "Cerrar menu de navegacion"
                    : "Abrir menu de navegacion"
                }
                className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                type="button"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase text-[#d71920]">
                  {meta.eyebrow}
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-950">
                  {meta.title}
                </h1>
              </div>
              <div className="hidden flex-wrap items-center gap-3 sm:flex">
                {meta.actions}
                {meta.page === "dashboard" ? (
                  <button
                    className="flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    type="button"
                  >
                    {isLoggingOut ? "Cerrando sesion..." : "Cerrar sesion"}
                  </button>
                ) : null}
                <ThemeToggle />
              </div>
            </div>
          </header>

          {isMobileMenuOpen ? (
            <div className="fixed inset-0 z-40 bg-slate-950/35 sm:hidden print:hidden">
              <button
                aria-label="Cerrar menu"
                className="absolute inset-0"
                onClick={() => setIsMobileMenuOpen(false)}
                type="button"
              />
              <aside
                className="absolute left-0 top-0 flex h-full w-[88vw] max-w-xs flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-2xl"
                id="mobile-admin-menu"
              >
                <div className="flex items-center justify-between gap-3">
                  <img
                    alt="Rian Automotriz"
                    className="h-12 w-12 rounded-xl object-cover"
                    src={logoRian}
                  />
                  <button
                    aria-label="Cerrar menu de navegacion"
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                    type="button"
                  >
                    <X className="h-5 w-5" />
                  </button>
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

                <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
                  {meta.actions}
                  {meta.page === "dashboard" ? (
                    <button
                      className="flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-[#4169e1] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isLoggingOut}
                      onClick={handleLogout}
                      type="button"
                    >
                      {isLoggingOut ? "Cerrando sesion..." : "Cerrar sesion"}
                    </button>
                  ) : null}
                  <ThemeToggle />
                </div>
              </aside>
            </div>
          ) : null}

          <div className="space-y-5 px-5 py-6 print:space-y-0 print:p-0 sm:px-8">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}
