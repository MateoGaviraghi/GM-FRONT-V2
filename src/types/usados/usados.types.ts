// 🚗 Tipos TypeScript para el módulo de Vehículos Usados

// Importar MediaFile desde vehiculo (ya definido)
import type { MediaFile } from "../vehiculo/vehiculo.types";

// ========================================
// INTERFACES PRINCIPALES
// ========================================

/**
 * Tipo de vehículo - Ahora acepta cualquier string
 */
export type TipoVehiculo = string;

/**
 * Interface principal del modelo Usados
 */
export interface Usados {
  _id?: string;

  // Campos obligatorios
  marca: string;
  modelo: string;
  anio: number;
  kilometraje: number;

  // Campos opcionales - Información básica
  titulo?: string;
  version?: string; // XLT, SRV, Limited, etc.
  tipoVehiculo?: TipoVehiculo; // Cualquier texto: AUTO, CAMIONETA, PICKUP, FURGON, etc.
  estado?: "Disponible" | "Reservado" | "Vendido"; // Estado del vehículo usado

  // Campos opcionales - Especificaciones técnicas
  tipoCombustible?: string; // Diesel, Nafta, GNC, Híbrido, Eléctrico
  motor?: string;
  transmision?: string; // Manual, Automática, CVT
  traccion?: string; // 4x2, 4x4, AWD, FWD, RWD
  potencia?: string;
  cilindrada?: string;
  capacidadCarga?: string;
  sistemaFrenado?: string;

  // Campos opcionales - Equipamiento
  color?: string;
  cantidadPuertas?: number;
  cantidadAsientos?: number;
  equipamiento?: string[]; // Array de características: ["ABS", "Airbags", etc.]

  // Descripción
  descripcion?: string;

  // Multimedia (Cloudinary)
  imagenes: MediaFile[];
  videos: MediaFile[];
  fotoSinFondo1?: MediaFile; // Para PDFs
  fotoSinFondo2?: MediaFile; // Para PDFs

  // Metadatos
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// ========================================
// DTOs PARA FORMULARIOS
// ========================================

/**
 * DTO para crear un vehículo usado
 * (usado en formularios y requests)
 */
export interface CreateUsadosDto {
  // Obligatorios
  marca: string;
  modelo: string;
  anio: number;
  kilometraje: number;

  // Opcionales
  titulo?: string;
  version?: string;
  tipoVehiculo?: TipoVehiculo;
  tipoCombustible?: string;
  motor?: string;
  transmision?: string;
  traccion?: string;
  potencia?: string;
  cilindrada?: string;
  capacidadCarga?: string;
  sistemaFrenado?: string;
  color?: string;
  cantidadPuertas?: number;
  cantidadAsientos?: number;
  equipamiento?: string[];
  descripcion?: string;
}

/**
 * DTO para actualizar un vehículo usado
 * Todos los campos son opcionales
 */
export interface UpdateUsadosDto {
  titulo?: string;
  marca?: string;
  modelo?: string;
  anio?: number;
  kilometraje?: number;
  version?: string;
  tipoVehiculo?: TipoVehiculo;
  tipoCombustible?: string;
  motor?: string;
  transmision?: string;
  traccion?: string;
  potencia?: string;
  cilindrada?: string;
  capacidadCarga?: string;
  sistemaFrenado?: string;
  color?: string;
  cantidadPuertas?: number;
  cantidadAsientos?: number;
  equipamiento?: string[];
  descripcion?: string;
}

/**
 * Interface para el FormData del formulario
 * (incluye campos para archivos)
 */
export interface UsadosFormData {
  // Campos de texto obligatorios
  marca: string;
  modelo: string;
  anio: string;
  kilometraje: string;

  // Campos de texto opcionales
  titulo: string;
  version: string;
  tipoVehiculo: string;
  tipoCombustible: string;
  motor: string;
  transmision: string;
  traccion: string;
  potencia: string;
  cilindrada: string;
  capacidadCarga: string;
  sistemaFrenado: string;
  color: string;
  cantidadPuertas: string;
  cantidadAsientos: string;
  descripcion: string;

  // Archivos (para preview en frontend)
  imageFiles?: File[];
  videoFiles?: File[];
  fotoSinFondo1?: File;
  fotoSinFondo2?: File;
  equipamiento?: string[];
}

// ========================================
// PARÁMETROS DE BÚSQUEDA Y FILTROS
// ========================================

/**
 * Parámetros para búsqueda y filtrado de usados
 */
export interface UsadosSearchParams {
  // Paginación
  page?: number;
  limit?: number;

  // Ordenamiento
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  // Filtros simples
  marca?: string;
  modelo?: string;
  version?: string;
  tipoVehiculo?: TipoVehiculo;
  tipoCombustible?: string;
  transmision?: string;
  traccion?: string;

  // Rangos
  kilometrajeMin?: number;
  kilometrajeMax?: number;
  anioFrom?: string;
  anioTo?: string;

  // Búsqueda general
  q?: string;
}

/**
 * Respuesta de búsqueda de usados con paginación
 */
export interface UsadosSearchResponse {
  items: Usados[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * DTO para búsqueda administrativa
 */
export interface UsadosSearchDto {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: {
    marca?: string;
    modelo?: string;
    version?: string;
    tipoVehiculo?: TipoVehiculo;
    tipoCombustible?: string;
    transmision?: string;
    traccion?: string;
    [key: string]: string | TipoVehiculo | undefined;
  };
  ranges?: {
    kilometrajeMin?: number;
    kilometrajeMax?: number;
    anioFrom?: string;
    anioTo?: string;
  };
}

// ========================================
// RESPUESTAS DEL API
// ========================================

/**
 * Respuesta estándar del API
 */
export interface UsadosApiResponse<T = Usados> {
  success?: boolean;
  message?: string;
  data?: T;
  usado?: T;
}

/**
 * Respuesta de creación con multimedia
 */
export interface CreateUsadosResponse {
  success: boolean;
  message: string;
  data: Usados;
}

/**
 * Respuesta de actualización
 */
export interface UpdateUsadosResponse {
  message: string;
  usado: Usados;
}

/**
 * Respuesta de eliminación
 */
export interface DeleteUsadosResponse {
  message: string;
  usado: Usados;
}
