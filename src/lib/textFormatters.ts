export const capitalizeDisplayText = (value: string) =>
  value
    .toLocaleLowerCase("es-MX")
    .replace(
      /(^|[\s.'-])([a-záéíóúüñ])/g,
      (_match, separator, letter) =>
        separator + letter.toLocaleUpperCase("es-MX"),
    );

export const formatPlate = (value?: number | string) => {
  const normalizedValue = String(value ?? "").trim();

  return normalizedValue
    ? normalizedValue.toLocaleUpperCase("es-MX")
    : "No registrado";
};
