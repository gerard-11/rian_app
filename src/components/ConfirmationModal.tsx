import { AlertTriangle, X } from "lucide-react";
import type { ReactNode } from "react";

type ConfirmationModalProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  isPending?: boolean;
  message: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
};

export function ConfirmationModal({
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
  isPending = false,
  message,
  onClose,
  onConfirm,
  title,
}: ConfirmationModalProps) {
  return (
    <div
      aria-labelledby="confirmation-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 p-4"
      role="dialog"
    >
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2
                className="text-lg font-bold text-slate-950"
                id="confirmation-modal-title"
              >
                {title}
              </h2>
              <div className="mt-2 text-sm leading-6 text-slate-600">
                {message}
              </div>
            </div>
          </div>
          <button
            aria-label="Cerrar confirmación"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B3262D]"
            disabled={isPending}
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#B3262D] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            onClick={onClose}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className="flex h-10 items-center justify-center rounded-md bg-[#B3262D] px-4 text-sm font-semibold text-white shadow-lg shadow-[#B3262D]/20 transition hover:bg-[#8F1D24] focus:outline-none focus:ring-4 focus:ring-[#B3262D]/25 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
            disabled={isPending}
            onClick={onConfirm}
            type="button"
          >
            {isPending ? "Procesando..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
