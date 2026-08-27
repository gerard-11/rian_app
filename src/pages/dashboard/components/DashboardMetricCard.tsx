import type { ReactNode } from "react";

type DashboardMetricCardProps = {
  icon: ReactNode;
  label: string;
  tone: "blue" | "green" | "red" | "slate";
  value: number | string;
};

const toneClassByName: Record<DashboardMetricCardProps["tone"], string> = {
  blue: "bg-[#4169e1]/10 text-[#4169e1]",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-[#d71920]/10 text-[#a41218]",
  slate: "bg-slate-100 text-slate-700",
};

export function DashboardMetricCard({
  icon,
  label,
  tone,
  value,
}: DashboardMetricCardProps) {
  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
        </div>
        <div
          className={
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-md " +
            toneClassByName[tone]
          }
        >
          {icon}
        </div>
      </div>
    </article>
  );
}
