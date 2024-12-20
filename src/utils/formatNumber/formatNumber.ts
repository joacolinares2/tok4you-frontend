export const formatNumber = (value: number) => {
  if (isNaN(value)) return "0";
  return value.toLocaleString("es-ES", { minimumFractionDigits: 2 });
};
