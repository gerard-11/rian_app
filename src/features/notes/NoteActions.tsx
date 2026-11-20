import { CheckCircle2, Download, LoaderCircle, MessageCircle, RotateCw } from "lucide-react";
import { useState } from "react";
import { downloadBlob, type NotePdfState } from "./useNotePdf";

type NoteActionsProps = {
  pdf: NotePdfState & { retry: () => void };
  fileName: string;
  /** null cuando el cliente no tiene un teléfono válido. */
  whatsappUrl: string | null;
};

const baseButton =
  "flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none";

export function NoteActions({ pdf, fileName, whatsappUrl }: NoteActionsProps) {
  const [downloaded, setDownloaded] = useState(false);
  const isReady = pdf.status === "ready";

  const handleDownload = () => {
    if (pdf.status !== "ready") return;

    downloadBlob(pdf.blob, fileName);
    setDownloaded(true);
  };

  // Si aún no se descargó, se descarga antes de abrir el chat para que el PDF
  // aparezca primero al adjuntar en WhatsApp.
  const handleSend = () => {
    if (!downloaded) handleDownload();
  };

  if (pdf.status === "error") {
    return (
      <div className="flex flex-col items-start gap-2 sm:items-end">
        <p className="text-sm font-medium text-[#a41218]">No se pudo generar el PDF.</p>
        <button
          className={`${baseButton} border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 focus:ring-[#B3262D]/25`}
          onClick={pdf.retry}
          type="button"
        >
          <RotateCw className="h-4 w-4" />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:items-end">
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          className={`${baseButton} bg-[#B3262D] text-white shadow-lg shadow-[#B3262D]/20 hover:bg-[#8F1D24] focus:ring-[#B3262D]/25`}
          disabled={!isReady}
          onClick={handleDownload}
          type="button"
        >
          {isReady ? (
            <Download className="h-4 w-4" />
          ) : (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          )}
          {isReady ? "Descargar nota" : "Generando nota..."}
        </button>

        {whatsappUrl && isReady ? (
          <a
            className={`${baseButton} bg-[#1FAF54] text-white shadow-lg shadow-[#1FAF54]/20 hover:bg-[#178A42] focus:ring-[#1FAF54]/30`}
            href={whatsappUrl}
            onClick={handleSend}
            rel="noopener noreferrer"
            target="_blank"
          >
            <MessageCircle className="h-4 w-4" />
            Enviar por WhatsApp
          </a>
        ) : (
          <button
            className={`${baseButton} bg-[#1FAF54] text-white`}
            disabled
            title={whatsappUrl ? undefined : "El cliente no tiene un WhatsApp válido registrado"}
            type="button"
          >
            <MessageCircle className="h-4 w-4" />
            Enviar por WhatsApp
          </button>
        )}
      </div>

      {downloaded ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Descargada como “{fileName}”. Adjúntala en el chat.
        </p>
      ) : null}
      {!whatsappUrl ? (
        <p className="text-xs font-medium text-slate-500">
          El cliente no tiene un WhatsApp válido registrado.
        </p>
      ) : null}
    </div>
  );
}
