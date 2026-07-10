/**
 * Fetch server-side de la data pública del home (ISR).
 * Refleja los endpoints de los services del cliente:
 *   remolqueService.getPublicRemolques / usadosService.getPublicUsados /
 *   novedadService.public.list
 * Devuelve null ante cualquier falla — las secciones hacen fallback
 * a fetch en cliente, así que el home nunca se rompe por el backend.
 */
import type { Remolque, Usados, Novedad } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

async function fetchItems<T>(path: string): Promise<T[] | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { items?: T[] };
    return Array.isArray(data?.items) ? data.items : null;
  } catch {
    return null;
  }
}

export function getHomeRemolques(): Promise<Remolque[] | null> {
  return fetchItems<Remolque>("/remolques/public?limit=6");
}

export function getHomeUsados(): Promise<Usados[] | null> {
  return fetchItems<Usados>("/usados/public?limit=6");
}

export function getHomeNovedades(): Promise<Novedad[] | null> {
  return fetchItems<Novedad>(
    "/novedades/public?page=1&limit=6&sortBy=createdAt&sortOrder=desc"
  );
}
