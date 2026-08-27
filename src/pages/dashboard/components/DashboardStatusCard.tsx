import { AlertCircle, LoaderCircle } from "lucide-react";

type DashboardStatusItem = {
  label: string;
  value: number;
};

type DashboardStatusCardProps = {
  errorText: string;
  isError: boolean;
  isLoading: boolean;
  items: DashboardStatusItem[];
  loadingText: string;
  title: string;
};

export function DashboardStatusCard({
  errorText,
  isError,
  isLoading,
  items,
  loadingText,
  title,
}: DashboardStatusCardProps) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold text-slate-950">{title}</h2>
        {isLoading ? (
          <LoaderCircle className="h-5 w-5 animate-spin text-[#4169e1]" />
        ) : null}
      </div>

      {isLoading ? (
        <p className="mt-4 text-sm font-medium text-slate-500">{loadingText}</p>
      ) : null}

      {isError ? (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-[#d71920]/30 bg-[#d71920]/10 px-3 py-2 text-sm font-medium text-[#a41218]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {errorText}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="mt-4 divide-y divide-slate-200">
          {items.map((item) => (
            <div
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              key={item.label}
            >
              <span className="text-sm font-medium text-slate-600">
                {item.label}
              </span>
              <span className="text-sm font-black text-slate-950">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
