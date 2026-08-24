import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { QuickWorkOrderPage } from "./pages/QuickWorkOrderPage";
import { WeeklyProfitsPage } from "./pages/WeeklyProfitsPage";
import { WorkOrdersPage } from "./pages/WorkOrdersPage";

function AuthEvents() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
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
      <Routes>
        <Route element={<Navigate replace to="/login" />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<DashboardPage />} path="/dashboard" />
        <Route element={<WorkOrdersPage />} path="/work-orders" />
        <Route
          element={<QuickWorkOrderPage />}
          path="/work-orders/quick-entry"
        />
        <Route element={<WeeklyProfitsPage />} path="/profits/weekly" />
        <Route element={<Navigate replace to="/login" />} path="*" />
      </Routes>
    </>
  );
}

export default App;
