/**
 * masks.ts — Mostrador (A0R). Máscaras de formato para campos elderly-first:
 * teléfono AR, precio ARS, patente (viejo y Mercosur), fecha DD/MM/AAAA.
 * Funciones puras: reciben el string crudo tipeado y devuelven el string
 * formateado a mostrar en el input (controlado).
 */

/** Teléfono argentino: "011 4567-8900" / "0341 456-7890". */
export function formatTelefonoAR(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";

  let area = "";
  let rest = digits;

  if (digits.startsWith("0")) {
    // Buenos Aires "011" (3 dígitos) vs resto del país "0341", "0294", etc. (4 dígitos)
    area = digits.startsWith("011") ? digits.slice(0, 3) : digits.slice(0, 4);
    rest = digits.slice(area.length);
  } else {
    area = digits.slice(0, 3);
    rest = digits.slice(3);
  }

  if (!rest) return area;

  const cut = rest.length > 4 ? rest.length - 4 : Math.ceil(rest.length / 2);
  const p1 = rest.slice(0, cut);
  const p2 = rest.slice(cut);
  return p2 ? `${area} ${p1}-${p2}` : `${area} ${p1}`;
}

/** Precio en pesos argentinos con separador de miles: "1.234.567". */
export function formatPrecioARS(raw: string | number): string {
  const digits = typeof raw === "number" ? String(Math.round(raw)) : raw.replace(/\D/g, "");
  if (!digits) return "";
  const n = Number(digits);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(n);
}

/** Convierte "1.234.567" (o cualquier string con separadores) al número plano 1234567. */
export function parsePrecioARS(value: string): number {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

/**
 * Patente argentina — detecta automáticamente el formato mientras se tipea:
 * viejo "AAA 111" (3 letras + 3 números) o Mercosur "AA 111 AA" (2 letras +
 * 3 números + 2 letras).
 */
export function formatPatente(raw: string): string {
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!clean) return "";

  const leadingLetters = clean.match(/^[A-Z]*/)?.[0].length ?? 0;

  if (leadingLetters >= 3) {
    const letters = clean.slice(0, 3);
    const digits = clean.slice(3, 6).replace(/[^0-9]/g, "");
    return digits ? `${letters} ${digits}` : letters;
  }

  const letters1 = clean.slice(0, 2);
  const digits = clean.slice(2, 5).replace(/[^0-9]/g, "");
  const letters2 = clean.slice(5, 7).replace(/[^A-Z]/g, "");
  return [letters1, digits, letters2].filter(Boolean).join(" ");
}

/** Fecha DD/MM/AAAA mientras se tipea sólo números. */
export function formatFecha(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return [day, month, year].filter(Boolean).join("/");
}

export type MaskType = "telefono" | "precio" | "patente" | "fecha";

export function applyMask(mask: MaskType, raw: string): string {
  switch (mask) {
    case "telefono":
      return formatTelefonoAR(raw);
    case "precio":
      return formatPrecioARS(raw);
    case "patente":
      return formatPatente(raw);
    case "fecha":
      return formatFecha(raw);
    default:
      return raw;
  }
}

export const MASK_EXAMPLE: Record<MaskType, string> = {
  telefono: "Ejemplo: 011 4567-8900",
  precio: "Ejemplo: 15.500.000",
  patente: "Ejemplo: AAA 111 o AB 123 CD",
  fecha: "Ejemplo: 24/12/2026",
};
