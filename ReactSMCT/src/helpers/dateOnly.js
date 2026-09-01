const getDateParts = (value) => {
  const isoDate = String(value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  return isoDate ? { year: isoDate[1], month: isoDate[2], day: isoDate[3] } : null;
};

// Las fechas de mantenimiento representan un día calendario, no un instante.
// No deben convertirse a la zona horaria del navegador.
export const toDateInputValue = (value) => {
  const parts = getDateParts(value);
  return parts ? `${parts.year}-${parts.month}-${parts.day}` : "";
};

export const formatDateOnly = (value) => {
  const parts = getDateParts(value);
  return parts ? `${parts.day}-${parts.month}-${parts.year}` : "";
};

export const ARGENTINA_TIME_ZONE = "America/Argentina/Buenos_Aires";
