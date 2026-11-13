import { isAxiosError } from "axios";

type ApiIssue = { path?: (string | number)[]; message?: string };

const fieldLabels: Record<string, string> = {
  customer: "Cliente",
  name: "Nombre",
  phone: "Teléfono",
  vehicle: "Vehículo",
  plate: "Placa",
  make: "Marca",
  model: "Modelo",
  year: "Año",
  color: "Color",
  diagnosis: "Diagnóstico",
  notes: "Notas",
  advanceAmount: "Anticipo",
  items: "Items",
  type: "Tipo",
  description: "Descripción",
  saleAmount: "Precio de venta",
  costAmount: "Costo",
};

const describePath = (path: ApiIssue["path"] = []) =>
  path
    .map((part) =>
      typeof part === "number" ? `#${part + 1}` : (fieldLabels[part] ?? part),
    )
    .join(" › ");

// Convierte un error de la API (400 de validación, etc.) en un texto claro para el usuario.
export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!isAxiosError(error)) return fallback;

  if (!error.response) {
    return "No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.";
  }

  const data = error.response.data as
    | { message?: string; issues?: ApiIssue[] }
    | undefined;

  if (error.response.status === 400 && data?.issues?.length) {
    const details = data.issues
      .map((issue) => {
        const field = describePath(issue.path);
        return field ? `${field}: ${issue.message}` : issue.message;
      })
      .join(" · ");

    return `Faltan o son inválidos algunos datos. ${details}`;
  }

  return data?.message ? `${fallback} (${data.message})` : fallback;
};
