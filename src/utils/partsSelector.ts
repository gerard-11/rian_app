export const PARTS_STORAGE_KEY = "rian.custom-parts";

export const SUGGESTED_PARTS = [
  "Bujes de horquilla",
  "Rótula",
  "Bieleta",
  "Terminal de dirección",
  "Amortiguadores",
  "Resortes",
  "Base de amortiguador",
  "Gomas de barra estabilizadora",
  "Tornillo estabilizador",
  "Cubrepolvos de flecha",
  "Triceta",
  "Espiga",
  "Balero",
] as const;

export type PartPresentation = "piece" | "pair";

export type PartSelection = {
  description: string;
  quantity: number;
  presentation: PartPresentation;
  costBase: number;
  margin: number;
};

export const calculateFinalPrice = (costBase: number, margin: number) =>
  costBase + margin;

export const isValidAmount = (value: string) => {
  const normalized = value.trim();
  return normalized !== "" && Number.isFinite(Number(normalized)) && Number(normalized) >= 0;
};

export const formatPartDescription = (
  description: string,
  presentation: PartPresentation,
) => {
  const cleanDescription = description.trim();

  if (presentation === "pair") return `Par de ${cleanDescription}`;
  return cleanDescription;
};

export const readCustomParts = (): string[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(window.localStorage.getItem(PARTS_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(stored)) return [];

    return stored.filter((part): part is string => typeof part === "string");
  } catch {
    return [];
  }
};

export const saveCustomPart = (part: string) => {
  if (typeof window === "undefined") return;

  const cleanPart = part.trim();
  if (!cleanPart) return;

  const nextParts = [
    cleanPart,
    ...readCustomParts().filter(
      (storedPart) => storedPart.toLocaleLowerCase() !== cleanPart.toLocaleLowerCase(),
    ),
  ];

  window.localStorage.setItem(PARTS_STORAGE_KEY, JSON.stringify(nextParts));
};
