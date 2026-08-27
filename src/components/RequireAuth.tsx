import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { getCurrentUser } from "../services/authService";

export function RequireAuth() {
  const { isError, isLoading } = useQuery({
    queryFn: getCurrentUser,
    queryKey: ["auth", "me"],
    retry: false,
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-700">
        <p className="text-sm font-semibold">Validando sesion...</p>
      </main>
    );
  }

  if (isError) {
    return <Navigate replace to="/login" />;
  }

  return <AdminLayout />;
}
