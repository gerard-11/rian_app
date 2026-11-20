import { useEffect, useState } from "react";
import type { NoteData } from "./noteData";

export type NotePdfState =
  | { status: "idle" | "generating" | "error"; blob?: undefined }
  | { status: "ready"; blob: Blob };

// react-pdf pesa cientos de KB: se descarga solo cuando se abre una nota.
const renderNotePdf = async (data: NoteData) => {
  const [{ pdf }, { NotePdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./NotePdfDocument"),
  ]);

  return pdf(NotePdfDocument({ data })).toBlob();
};

/**
 * Genera el PDF en segundo plano en cuanto hay datos, para que "Descargar" y
 * "Enviar" respondan al instante (y el navegador no bloquee la descarga).
 */
export function useNotePdf(data: NoteData | undefined) {
  const [state, setState] = useState<NotePdfState>({ status: "idle" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!data) return;

    let cancelled = false;
    setState({ status: "generating" });

    renderNotePdf(data)
      .then((blob) => {
        if (!cancelled) setState({ status: "ready", blob });
      })
      .catch((error: unknown) => {
        console.error("No se pudo generar el PDF de la nota", error);
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [data, attempt]);

  return { ...state, retry: () => setAttempt((value) => value + 1) };
}

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  // Safari necesita que la URL siga viva un momento después del clic.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
};
