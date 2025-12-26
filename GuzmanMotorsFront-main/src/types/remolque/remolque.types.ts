// 🚛 Tipos para Remolques - Guzmán Motors
// Actualizado según nuevos cambios del backend

import { MediaFile } from "../vehiculo/vehiculo.types";

export type EstadoRemolque = "Disponible" | "Reservado" | "Vendido";
export type CondicionRemolque = "0KM" | "USADO";
export type CategoriaRemolque =
  | "ACOPLADO"
  | "SEMIREMOLQUE"
  | "BITREN"
  | "CARROCERIA";

// Subdocumentos para especificaciones técnicas
export interface ChasisRemolque {
  tipo?: string;
  material?: string;
  pisoChapaEspesor?: string;
  ejesTubularesDiametro?: string;
  paragolpe?: string;
  engancheEmergencia?: string;
  otros?: string;
}

export interface DimensionesRemolque {
  largoInterior?: number;
  anchoExterior?: number;
  alturaBaranda?: number;
  alturaFrente?: number;
  alturaContrafrente?: number;
  alturaPisoAlPiso?: number;
}

export interface EjesSuspensionRemolque {
  tipoEjes?: string;
  llantas?: string;
  suspension?: string;
  frenos?: string;
}

export interface CarroceriaRemolque {
  tipo?: string;
  material?: string;
  pintura?: string;
  tratamiento?: string;
}

export interface Remolque {
  _id?: string;

  // === CAMPOS OBLIGATORIOS ===
  titulo: string;
  condicion: CondicionRemolque;

  // === CAMPOS OPCIONALES PRINCIPALES ===
  categoria?: CategoriaRemolque;
  marca?: string;
  modelo?: string;
  anio?: Date | string;
  tipoCarroceria?: string;
  cantidadEjes?: number;
  capacidadCarga?: string;
  tara?: number;
  pbtc?: string;
  kilometraje?: number;
  estado?: EstadoRemolque;
  garantia?: string;
  descripcion?: string;

  // === ESPECIFICACIONES TÉCNICAS (Objetos anidados) ===
  chasis?: ChasisRemolque;
  dimensiones?: DimensionesRemolque;
  ejesSuspension?: EjesSuspensionRemolque;
  carroceria?: CarroceriaRemolque;

  // === EQUIPAMIENTO ===
  equipamientoSerie?: string[];
  equipamientoOpcional?: string[];

  // === MULTIMEDIA ===
  imagenes?: MediaFile[];
  videos?: MediaFile[];
  fotoSinFondo1?: MediaFile;
  fotoSinFondo2?: MediaFile;

  createdAt?: Date;
  updatedAt?: Date;
}

// Constantes para categorías y condiciones
export const CONDICIONES_REMOLQUE = ["0KM", "USADO"] as const;

export const CATEGORIAS_REMOLQUE = [
  "ACOPLADO",
  "SEMIREMOLQUE",
  "BITREN",
  "CARROCERIA",
] as const;

export const TIPOS_CARROCERIA = [
  "Baranda Volcable",
  "Batea",
  "Paquetera",
  "Tolva",
  "Jaula",
  "Tanque",
  "Furgón",
  "Plataforma",
  "Porta Contenedores",
] as const;

// Interface para respuesta de búsqueda
export interface RemolqueSearchResponse {
  remolques: Remolque[];
  total: number;
  page: number;
  totalPages: number;
}

// Interface para parámetros de búsqueda (según API)
export interface RemolqueSearchParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  // Filtros de búsqueda
  q?: string;
  busqueda?: string;
  condicion?: CondicionRemolque;
  categoria?: CategoriaRemolque;
  marca?: string;
  modelo?: string;
  tipoCarroceria?: string;
  cantidadEjes?: number;
  estado?: EstadoRemolque;

  // Rangos
  kilometrajeMin?: number;
  kilometrajeMax?: number;
  anioFrom?: string;
  anioTo?: string;
  taraMin?: number;
  taraMax?: number;
}

// DTOs para crear remolque (según API)
export interface CreateRemolqueDto {
  // OBLIGATORIOS
  titulo: string;
  condicion: CondicionRemolque;

  // OPCIONALES
  categoria?: CategoriaRemolque;
  marca?: string;
  modelo?: string;
  anio?: Date | string;
  tipoCarroceria?: string;
  cantidadEjes?: number;
  capacidadCarga?: string;
  tara?: number;
  pbtc?: string;
  kilometraje?: number;
  estado?: EstadoRemolque;
  garantia?: string;
  descripcion?: string;

  // Especificaciones técnicas
  chasis?: ChasisRemolque;
  dimensiones?: DimensionesRemolque;
  ejesSuspension?: EjesSuspensionRemolque;
  carroceria?: CarroceriaRemolque;

  // Equipamiento
  equipamientoSerie?: string[];
  equipamientoOpcional?: string[];
}

export interface UpdateRemolqueDto {
  titulo?: string;
  condicion?: CondicionRemolque;
  categoria?: CategoriaRemolque;
  marca?: string;
  modelo?: string;
  anio?: Date | string;
  tipoCarroceria?: string;
  cantidadEjes?: number;
  capacidadCarga?: string;
  tara?: number;
  pbtc?: string;
  kilometraje?: number;
  estado?: EstadoRemolque;
  garantia?: string;
  descripcion?: string;

  chasis?: ChasisRemolque;
  dimensiones?: DimensionesRemolque;
  ejesSuspension?: EjesSuspensionRemolque;
  carroceria?: CarroceriaRemolque;

  equipamientoSerie?: string[];
  equipamientoOpcional?: string[];
}

// Utilidades para el frontend
export interface RemolqueFormData extends CreateRemolqueDto {
  imagenes?: File[];
  videos?: File[];
  fotoSinFondo1?: File;
  fotoSinFondo2?: File;
}
