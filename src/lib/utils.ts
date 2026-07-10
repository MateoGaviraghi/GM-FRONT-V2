import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * twMerge extendido: le enseñamos las utilities custom del tema GM
 * (escala display de @theme). Sin esto, twMerge clasifica
 * "text-display-2" como color de texto y la elimina al combinarla
 * con "text-platinum"/"text-ink-0".
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display-1", "display-2", "display-3"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 🚗 Utilidades específicas para Guzmán Motors

/**
 * Formatea precio en pesos argentinos
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formatea fecha en español
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formatea fecha de manera corta
 */
export function formatShortDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export function capitalizeWords(text: string): string {
  return text.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Trunca texto con puntos suspensivos
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength).trim() + "...";
}

/**
 * Genera slug URL-friendly
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Descompone caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remueve acentos
    .replace(/[^a-z0-9 ]/g, "") // Solo letras, números y espacios
    .replace(/\s+/g, "-") // Reemplaza espacios por guiones
    .replace(/^-+|-+$/g, ""); // Remueve guiones al inicio/final
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida teléfono argentino
 */
export function isValidPhone(phone: string): boolean {
  // Acepta formatos: +54 9 11 1234-5678, 11 1234-5678, 1112345678
  const phoneRegex = /^(\+54\s?9?\s?)?(\d{2,4})[\s-]?(\d{4})[\s-]?(\d{4})$/;
  return phoneRegex.test(phone);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
