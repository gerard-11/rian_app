import type { ReactNode } from "react";

type DashboardMetricCardProps = {
  icon: ReactNode;
  label: string;
  tone: "blue" | "green" | "red" | "slate";
  value: number | string;
};

const toneClassByName: Record<DashboardMetricCardProps["tone"], string> = {
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  red: "border-[#B3262D]/25 bg-[#B3262D]/10 text-[#8F1D24]",
  slate: "border-violet-200 bg-violet-50 text-violet-700",
};

export function DashboardMetricCard({
  icon,
  label,
  tone,
  value,
}: DashboardMetricCardProps) {
  return (
    <article
      className={
        "rounded-md border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md " +
        toneClassByName[tone]
      }
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
        </div>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white/75"
        >
          {icon}
        </div>
      </div>
    </article>
  );
}
