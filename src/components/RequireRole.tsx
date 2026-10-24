import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthUser } from '../hooks/useAuthUser'
import type { UserRole } from '../services/authService'

type RequireRoleProps = {
  role: UserRole
}

export function RequireRole({ role }: RequireRoleProps) {
  const location = useLocation()
  const { data, isError, isLoading } = useAuthUser()

  if (isLoading) {
    return (
      <main className="flex min-h-64 items-center justify-center rounded-md border border-slate-200 bg-white px-6 text-slate-700">
        <p className="text-sm font-semibold">Validando permisos...</p>
      </main>
    )
  }

  if (isError) return <Navigate replace to="/login" state={{ from: location }} />

  if (data?.user?.role !== role) return <Navigate replace to="/dashboard" />

  return <Outlet />
}
