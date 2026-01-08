/**
 * Utilidades para manejo de años
 * NOTA: El campo 'anio' en el backend ahora es de tipo number (no Date)
 * Estas funciones se mantienen por compatibilidad pero ahora son muy simples
 */

/**
 * Obtiene el año como número
 * @param year - Año como número o string
 * @returns Año como número
 */
export const getYearFromDate = (
  year: number | string | null | undefined
): number => {
  if (year === null || year === undefined) return new Date().getFullYear();

  // Si ya es número, devolverlo directamente
  if (typeof year === "number") return year;

  // Si es string, convertir a número
  const parsed = parseInt(year, 10);
  return isNaN(parsed) ? new Date().getFullYear() : parsed;
};

/**
 * Formatea un año para enviar al backend
 * Como el backend ahora acepta number, simplemente devolvemos el número como string
 * @param year - Año como número o string
 * @returns Año como string para FormData
 */
export const formatYearForBackend = (year: number | string): string => {
  const yearNum = typeof year === "string" ? parseInt(year, 10) : year;

  // Validar que el año es razonable
  if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
    return new Date().getFullYear().toString();
  }

  return yearNum.toString();
};
