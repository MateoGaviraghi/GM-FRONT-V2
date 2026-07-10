import type { Remolque } from "@/types";

export const REMOLQUE_WHATSAPP = "5493424216850";

/** Mensaje de consulta por WhatsApp (verbatim del listado original). */
export function remolqueWhatsAppHref(remolque: Remolque): string {
  const mensaje =
    `Hola! Me interesa consultar sobre el remolque:\n\n🚛 *${remolque.titulo}*\n\n` +
    `📋 *Detalles:*\n` +
    (remolque.condicion ? `• Condición: ${remolque.condicion}\n` : "") +
    (remolque.categoria ? `• Categoría: ${remolque.categoria}\n` : "") +
    (remolque.marca ? `• Marca: ${remolque.marca}\n` : "") +
    (remolque.modelo ? `• Modelo: ${remolque.modelo}\n` : "") +
    (remolque.capacidadCarga
      ? `• Capacidad: ${remolque.capacidadCarga}\n`
      : "") +
    (remolque.anio ? `• Año: ${remolque.anio}\n` : "") +
    (remolque.cantidadEjes ? `• Ejes: ${remolque.cantidadEjes}\n` : "") +
    `\n¿Podrían brindarme más información y disponibilidad? ¡Gracias!`;

  return `https://wa.me/${REMOLQUE_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}
