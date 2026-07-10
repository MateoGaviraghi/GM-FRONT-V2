import type { Usados } from "@/types";

export const USADOS_WHATSAPP = "5493424216850";

/** Mensaje de consulta por WhatsApp (verbatim del listado original). */
export function usadoWhatsAppHref(usado: Usados): string {
  const titulo =
    usado.titulo ||
    `${usado.marca} ${usado.modelo}${usado.version ? ` ${usado.version}` : ""}`;

  const mensaje =
    `Hola! Me interesa consultar sobre el vehículo usado 0km:\n\n🚗 *${titulo}*\n\n` +
    `📋 *Detalles:*\n` +
    `• Marca: ${usado.marca}\n` +
    `• Modelo: ${usado.modelo}\n` +
    (usado.version ? `• Versión: ${usado.version}\n` : "") +
    (usado.anio ? `• Año: ${usado.anio}\n` : "") +
    (usado.tipoCombustible
      ? `• Combustible: ${usado.tipoCombustible}\n`
      : "") +
    (usado.transmision ? `• Transmisión: ${usado.transmision}\n` : "") +
    `\n¿Podrían brindarme más información y disponibilidad? ¡Gracias!`;

  return `https://wa.me/${USADOS_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}
