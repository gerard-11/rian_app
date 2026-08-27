import { useMemo } from "react";
import { ClipboardCheck, ClipboardList, FileText, Wrench } from "lucide-react";
import { DashboardMetricCard } from "./dashboard/components/DashboardMetricCard";
import { DashboardQuickActions } from "./dashboard/components/DashboardQuickActions";
import { DashboardRecentWorkOrders } from "./dashboard/components/DashboardRecentWorkOrders";
import { DashboardStatusCard } from "./dashboard/components/DashboardStatusCard";
import {
  getBudgetCounts,
  getRecentWorkOrders,
  getWorkOrderCounts,
} from "./dashboard/dashboardUtils";
import { useBudgets } from "../hooks/useBudgets";
import { useWorkOrders } from "../hooks/useWorkOrders";
import { normalizeBudgetsResponse } from "../utils/budgetsList";
import { normalizeWorkOrdersResponse } from "../utils/workOrdersList";

export function DashboardPage() {
  const workOrdersQuery = useWorkOrders();
  const budgetsQuery = useBudgets();

  const workOrders = useMemo(
    () =>
      workOrdersQuery.data
        ? normalizeWorkOrdersResponse(workOrdersQuery.data)
        : [],
    [workOrdersQuery.data],
  );
  const budgets = useMemo(
    () =>
      budgetsQuery.data ? normalizeBudgetsResponse(budgetsQuery.data) : [],
    [budgetsQuery.data],
  );
  const workOrderCounts = useMemo(
    () => getWorkOrderCounts(workOrders),
    [workOrders],
  );
  const budgetCounts = useMemo(() => getBudgetCounts(budgets), [budgets]);
  const recentWorkOrders = useMemo(
    () => getRecentWorkOrders(workOrders),
    [workOrders],
  );

  const isWorkOrdersLoading = workOrdersQuery.isLoading;
  const isBudgetsLoading = budgetsQuery.isLoading;

  return (
    <div className="space-y-5">
      <DashboardQuickActions />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          icon={<Wrench className="h-5 w-5" />}
          label="Ordenes activas"
          tone="blue"
          value={isWorkOrdersLoading ? "..." : workOrderCounts.active}
        />
        <DashboardMetricCard
          icon={<ClipboardCheck className="h-5 w-5" />}
          label="Ordenes completadas"
          tone="green"
          value={isWorkOrdersLoading ? "..." : workOrderCounts.completed}
        />
        <DashboardMetricCard
          icon={<ClipboardList className="h-5 w-5" />}
          label="Ordenes totales"
          tone="slate"
          value={isWorkOrdersLoading ? "..." : workOrderCounts.total}
        />
        <DashboardMetricCard
          icon={<FileText className="h-5 w-5" />}
          label="Presupuestos"
          tone="red"
          value={isBudgetsLoading ? "..." : budgetCounts.total}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <DashboardStatusCard
          errorText="No se pudieron cargar las ordenes."
          isError={workOrdersQuery.isError}
          isLoading={workOrdersQuery.isLoading}
          items={[
            { label: "Activas", value: workOrderCounts.active },
            { label: "Completadas", value: workOrderCounts.completed },
            { label: "Canceladas", value: workOrderCounts.cancelled },
          ]}
          loadingText="Cargando estado de ordenes..."
          title="Estado de ordenes"
        />
        <DashboardStatusCard
          errorText="No se pudieron cargar los presupuestos."
          isError={budgetsQuery.isError}
          isLoading={budgetsQuery.isLoading}
          items={[
            { label: "Pendientes", value: budgetCounts.pending },
            { label: "Aceptados", value: budgetCounts.accepted },
            { label: "Convertidos", value: budgetCounts.converted },
            { label: "Cancelados o rechazados", value: budgetCounts.rejected },
          ]}
          loadingText="Cargando estado de presupuestos..."
          title="Estado de presupuestos"
        />
      </section>

      <DashboardRecentWorkOrders
        isError={workOrdersQuery.isError}
        isLoading={workOrdersQuery.isLoading}
        workOrders={recentWorkOrders}
      />
    </div>
  );
}
