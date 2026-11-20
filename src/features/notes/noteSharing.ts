// Nombre del archivo y mensaje de WhatsApp con los que se comparte una nota.
import { capitalizeDisplayText } from "../../lib/textFormatters";
import type { QuickVehicleInput } from "../../types/workOrders";
import type { NoteKind } from "./noteData";

type NoteSubject = {
  customer?: { name?: string; phone?: string };
  vehicle?: QuickVehicleInput;
};

const clean = (value?: string) => capitalizeDisplayText(value?.trim() ?? "");

/** "Chevrolet Cruze", "Chevrolet" o "Cruze" según lo que se haya registrado. */
const getCarName = (vehicle?: QuickVehicleInput) =>
  [vehicle?.make, vehicle?.model].map(clean).filter(Boolean).join(" ");

/** "Carlos Juárez - Chevrolet Cruze.pdf" */
export const buildNoteFileName = ({ customer, vehicle }: NoteSubject) => {
  const baseName =
    [clean(customer?.name), getCarName(vehicle)].filter(Boolean).join(" - ") ||
    "Nota";

  // Quita caracteres que Windows, Android o iOS no aceptan en nombres de archivo.
  const safeName = baseName
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return `${safeName || "Nota"}.pdf`;
};

/**
 * Convierte el teléfono capturado al formato de wa.me (52 + 10 dígitos).
 * Devuelve null si no parece un número válido.
 */
export const toWhatsappNumber = (phone?: string) => {
  let digits = (phone ?? "").replace(/\D/g, "").replace(/^00/, "");

  // Formato viejo de celulares en México: 52 1 + 10 dígitos.
  if (digits.length === 13 && digits.startsWith("521")) {
    digits = "52" + digits.slice(3);
  }

  if (digits.length === 10) return "52" + digits;
  if (digits.length >= 11 && digits.length <= 15) return digits;

  return null;
};

/** Abre el chat con el cliente (no hace falta guardarlo en contactos). */
export const buildNoteWhatsappUrl = (kind: NoteKind, subject: NoteSubject) => {
  const number = toWhatsappNumber(subject.customer?.phone);

  if (!number) return null;

  const name = clean(subject.customer?.name);
  const car = getCarName(subject.vehicle);
  const documentName = kind === "workOrder" ? "la nota de servicio" : "el presupuesto";
  const message = [
    `Hola${name ? ` ${name}` : ""}, te comparto ${documentName}`,
    car ? ` de tu ${car}` : "",
    " de Rian Automotriz.",
  ].join("");

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
