/**
 * Tipos y interfaces para el módulo de Novedades
 */

import type { MediaFile } from "../vehiculo/vehiculo.types";

/**
 * Enlace/Link externo asociado a una novedad
 */
export interface NovedadLink {
  titulo: string;
  url: string;
  descripcion?: string;
}

/**
 * Novedad completa
 */
export interface Novedad {
  _id: string;
  titulo: string;
  contenido: string;
  resumen?: string;
  categoria?: string;
  destacada: boolean;
  fechaPublicacion: Date | string;
  vistas: number;
  deleted: boolean;
  imagenes: MediaFile[];
  links?: NovedadLink[]; // ← NUEVO: Array de enlaces externos
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * DTO para crear una novedad
 */
export interface CreateNovedadDto {
  titulo: string;
  contenido: string;
  resumen?: string;
  categoria?: string;
  destacada?: boolean;
  fechaPublicacion?: Date | string;
  links?: NovedadLink[]; // ← NUEVO: Enlaces opcionales al crear
}

/**
 * DTO para actualizar una novedad (todos los campos opcionales)
 */
export interface UpdateNovedadDto {
  titulo?: string;
  contenido?: string;
  resumen?: string;
  categoria?: string;
  destacada?: boolean;
  fechaPublicacion?: Date | string;
  deleted?: boolean;
  links?: NovedadLink[]; // ← NUEVO: Enlaces opcionales al actualizar
}

/**
 * Respuesta paginada de novedades
 */
export interface NovedadesPaginatedResponse {
  items: Novedad[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * Opciones de filtros para novedades
 */
export interface NovedadesOptionsResponse {
  categorias: string[];
}

/**
 * Query params para listar novedades
 */
export interface ListNovedadesParams {
  page?: number;
  limit?: number;
  sortBy?:
    | "titulo"
    | "categoria"
    | "fechaPublicacion"
    | "vistas"
    | "createdAt"
    | "updatedAt";
  sortOrder?: "asc" | "desc";
  categoria?: string;
  destacada?: boolean;
  includeDeleted?: boolean; // Solo para admin
}

/**
 * Query params para buscar novedades
 */
export interface SearchNovedadesParams extends ListNovedadesParams {
  q?: string;
}

/**
 * Respuesta al crear una novedad con imágenes
 */
export interface CreateNovedadWithMediaResponse {
  success: boolean;
  message: string;
  data: Novedad;
}

/**
 * Respuesta al eliminar una novedad
 */
export interface DeleteNovedadResponse {
  message: string;
  novedad: Novedad;
}

/**
 * Respuesta al restaurar una novedad
 */
export interface RestoreNovedadResponse {
  message: string;
  novedad: Novedad;
}

/**
 * Respuesta al eliminar una imagen
 */
export interface DeleteImageResponse {
  message: string;
  novedad: Novedad;
}
