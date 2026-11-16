const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
});

export const formatTireMoney = (value: string | number) =>
  currencyFormatter.format(Number(value));
