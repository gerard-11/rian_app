import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ProfitsAccessGuard } from "./components/ProfitsAccessGuard";
import { RequireAuth } from "./components/RequireAuth";
import { RequireRole } from "./components/RequireRole";
import { UpdatePrompt } from "./components/UpdatePrompt";
import { queryClient } from "./lib/queryClient";
import { BudgetNotePage } from "./pages/BudgetNotePage";
import { BudgetsPage } from "./pages/BudgetsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ExpensesPage } from "./pages/ExpensesPage";
import { LoginPage } from "./pages/LoginPage";
import { PublicLayout } from "./layouts/PublicLayout";
import { PublicTireDetailPage } from "./pages/PublicTireDetailPage";
import { PublicTiresPage } from "./pages/PublicTiresPage";
import { TiresPage } from "./pages/TiresPage";
import { PersonalExpensesPage } from "./pages/PersonalExpensesPage";
import { QuickBudgetPage } from "./pages/QuickBudgetPage";
import { QuickWorkOrderPage } from "./pages/QuickWorkOrderPage";
import { WeeklyProfitsPage } from "./pages/WeeklyProfitsPage";
import { WorkOrderNotePage } from "./pages/WorkOrderNotePage";
import { EditBudgetPage } from "./pages/EditBudgetPage";
import { EditWorkOrderPage } from "./pages/EditWorkOrderPage";
import { WorkOrdersPage } from "./pages/WorkOrdersPage";
import { UsersPage } from "./pages/UsersPage";

function AuthEvents() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [navigate]);

  return null;
}

function App() {
  return (
    <>
      <AuthEvents />
      <UpdatePrompt />
      <Routes>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<PublicLayout />}>
          <Route element={<PublicTiresPage />} path="/" />
          <Route element={<Navigate replace to="/" />} path="/catalog" />
          <Route element={<PublicTireDetailPage />} path="/catalog/:id" />
        </Route>
        <Route element={<RequireAuth />}>
          <Route element={<DashboardPage />} path="/dashboard" />
          <Route element={<TiresPage />} path="/tires" />
          <Route element={<BudgetsPage />} path="/budgets" />
          <Route element={<QuickBudgetPage />} path="/budgets/quick-entry" />
          <Route element={<BudgetNotePage />} path="/budgets/:id/note" />
          <Route element={<EditBudgetPage />} path="/budgets/:id/edit" />
          <Route element={<WorkOrdersPage />} path="/work-orders" />
          <Route
            element={<QuickWorkOrderPage />}
            path="/work-orders/quick-entry"
          />
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
    </>
  );
}

export default App;
