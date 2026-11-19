import { lazy, Suspense, type ComponentType } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { ProfitsAccessGuard } from "./components/ProfitsAccessGuard";
import { RequireAuth } from "./components/RequireAuth";
import { RequireRole } from "./components/RequireRole";
import { PublicLayout } from "./layouts/PublicLayout";
import { PublicTireDetailPage } from "./pages/PublicTireDetailPage";
import { PublicTiresPage } from "./pages/PublicTiresPage";
import { AlignmentPage } from "./pages/site/AlignmentPage";
import { ContactPage } from "./pages/site/ContactPage";
import { HomePage } from "./pages/site/HomePage";
import { MechanicPage } from "./pages/site/MechanicPage";

// Las páginas del CRM se cargan bajo demanda: así el sitio público descarga
// solo el JavaScript que necesita.
const lazyPage = <K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) =>
  lazy(() => load().then((module) => ({ default: module[name] })));

const LoginPage = lazyPage(() => import("./pages/LoginPage"), "LoginPage");
const DashboardPage = lazyPage(() => import("./pages/DashboardPage"), "DashboardPage");
const TiresPage = lazyPage(() => import("./pages/TiresPage"), "TiresPage");
const BudgetsPage = lazyPage(() => import("./pages/BudgetsPage"), "BudgetsPage");
const QuickBudgetPage = lazyPage(() => import("./pages/QuickBudgetPage"), "QuickBudgetPage");
const BudgetNotePage = lazyPage(() => import("./pages/BudgetNotePage"), "BudgetNotePage");
const EditBudgetPage = lazyPage(() => import("./pages/EditBudgetPage"), "EditBudgetPage");
const WorkOrdersPage = lazyPage(() => import("./pages/WorkOrdersPage"), "WorkOrdersPage");
const QuickWorkOrderPage = lazyPage(() => import("./pages/QuickWorkOrderPage"), "QuickWorkOrderPage");
const WorkOrderNotePage = lazyPage(() => import("./pages/WorkOrderNotePage"), "WorkOrderNotePage");
const EditWorkOrderPage = lazyPage(() => import("./pages/EditWorkOrderPage"), "EditWorkOrderPage");
const WeeklyProfitsPage = lazyPage(() => import("./pages/WeeklyProfitsPage"), "WeeklyProfitsPage");
const ExpensesPage = lazyPage(() => import("./pages/ExpensesPage"), "ExpensesPage");
const PersonalExpensesPage = lazyPage(() => import("./pages/PersonalExpensesPage"), "PersonalExpensesPage");
const UsersPage = lazyPage(() => import("./pages/UsersPage"), "UsersPage");

// Enlaces viejos del catálogo (/catalog/:id) → /llantas/:id.
function LegacyTireRedirect() {
  const { id } = useParams();
  return <Navigate replace to={`/llantas/${id ?? ""}`} />;
}

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#B3262D]" />
    </div>
  );
}

// Rutas compartidas por el navegador y el pre-render (src/entry-server.tsx).
export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<PublicLayout />}>
          <Route element={<HomePage />} path="/" />
          <Route element={<AlignmentPage />} path="/alineacion-y-balanceo" />
          <Route element={<MechanicPage />} path="/mecanica" />
          <Route element={<PublicTiresPage />} path="/llantas" />
          <Route element={<PublicTireDetailPage />} path="/llantas/:id" />
          <Route element={<ContactPage />} path="/contacto" />
        </Route>
        <Route element={<Navigate replace to="/llantas" />} path="/catalog" />
        <Route element={<LegacyTireRedirect />} path="/catalog/:id" />
        <Route element={<RequireAuth />}>
          <Route element={<DashboardPage />} path="/dashboard" />
          <Route element={<TiresPage />} path="/tires" />
          <Route element={<BudgetsPage />} path="/budgets" />
          <Route element={<QuickBudgetPage />} path="/budgets/quick-entry" />
          <Route element={<BudgetNotePage />} path="/budgets/:id/note" />
          <Route element={<EditBudgetPage />} path="/budgets/:id/edit" />
          <Route element={<WorkOrdersPage />} path="/work-orders" />
          <Route element={<QuickWorkOrderPage />} path="/work-orders/quick-entry" />
          <Route element={<WorkOrderNotePage />} path="/work-orders/:id/note" />
          <Route element={<EditWorkOrderPage />} path="/work-orders/:id/edit" />
          <Route element={<RequireRole role="ADMIN" />}>
            <Route
              element={
                <ProfitsAccessGuard>
                  <WeeklyProfitsPage />
                </ProfitsAccessGuard>
              }
              path="/profits/weekly"
            />
            <Route element={<ExpensesPage />} path="/expenses" />
            <Route element={<PersonalExpensesPage />} path="/personal-expenses" />
            <Route element={<UsersPage />} path="/users" />
          </Route>
        </Route>
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </Suspense>
  );
}
