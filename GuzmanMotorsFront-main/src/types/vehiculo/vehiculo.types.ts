// 🚗 Tipos para Vehículos 0km - Guzmán Motors
// Basado en la documentación del API

export interface MediaFile {
  public_id: string; // ID único de Cloudinary
  secure_url: string; // URL HTTPS del archivo
  width: number;
  height: number;
  format: string; // jpg, png, mp4, etc.
  bytes: number; // Tamaño en bytes

  // Solo para imágenes:
  thumbnails?: {
    small: string; // 300x200px
    medium: string; // 600x400px
    large: string; // 1200x800px
  };

  // Solo para videos:
  duration?: number; // Duración en segundos
  thumbnail?: string; // Imagen preview del video
}

export type EstadoVehiculo = "Disponible" | "Reservado" | "Vendido";

export interface Vehiculo0km {
  _id?: string;
  titulo?: string;
  tipos?: string; // SUV, Sedán, Pick-up, etc.
  variantes?: string; // XEI, GLS, etc.
  marca?: string; // Toyota, Ford, etc.
  modelo?: string; // Corolla, Focus, etc.
  kilometraje?: number;
  tipoCombustible?: string; // Nafta, Diesel, Híbrido
  motor?: string;
  anio?: Date;
  transmisiones?: string; // Manual, Automático, CVT
  tracciones?: string; // 4x2, 4x4, AWD
  potenciaMaxima?: string; // "150 CV @ 6000 RPM"
  capacidadCarga?: string; // "1200 kg"
  sistemaFrenado?: string; // "ABS + ESP"
  ejes?: string; // "Eje rígido trasero"
  estado: EstadoVehiculo;
  descripcion?: string;
  imagenes: MediaFile[]; // Array de imágenes en Cloudinary
  videos: MediaFile[]; // Array de videos en Cloudinary
  createdAt?: Date;
  updatedAt?: Date;
}

// DTOs para crear vehículo
export interface CreateVehiculoDto {
  titulo?: string;
  tipos?: string;
  variantes?: string;
  marca?: string;
  modelo?: string;
  kilometraje?: number;
  tipoCombustible?: string;
  motor?: string;
  anio?: Date;
  transmisiones?: string;
  tracciones?: string;
  potenciaMaxima?: string;
  capacidadCarga?: string;
  sistemaFrenado?: string;
  ejes?: string;
  estado: EstadoVehiculo;
  descripcion?: string;
}

export interface UpdateVehiculoDto {
  titulo?: string;
  tipos?: string;
  variantes?: string;
  marca?: string;
  modelo?: string;
  kilometraje?: number;
  tipoCombustible?: string;
  motor?: string;
  anio?: Date;
  transmisiones?: string;
  tracciones?: string;
  potenciaMaxima?: string;
  capacidadCarga?: string;
  sistemaFrenado?: string;
  ejes?: string;
  descripcion?: string;
}

export interface UpdateEstadoDto {
  estado: EstadoVehiculo;
}

// Filtros y búsqueda
export interface VehiculoFilters {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "marca" | "modelo" | "kilometraje" | "anio";
  sortOrder?: "asc" | "desc";
  marca?: string;
  modelo?: string;
  tipos?: string;
  tipoCombustible?: string;
  transmisiones?: string;
  tracciones?: string;
  kilometrajeMin?: number;
  kilometrajeMax?: number;
  anioFrom?: string; // formato: YYYY-MM-DD
  anioTo?: string; // formato: YYYY-MM-DD
  estado?: EstadoVehiculo;
}

export interface VehiculoSearchDto {
  q?: string; // Búsqueda de texto general
  filters?: Partial<VehiculoFilters>;
  ranges?: {
    kilometrajeMin?: number;
    kilometrajeMax?: number;
    anioFrom?: string;
    anioTo?: string;
  };
  page?: number;
  limit?: number;
}

// Respuestas del API
export interface VehiculosResponse {
  items: Vehiculo0km[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Respuesta de búsqueda avanzada con paginación
export interface VehiculoSearchResponse {
  vehiculos: Vehiculo0km[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Filtros de búsqueda para la API pública
export interface VehiculoSearchFilters {
  q?: string; // Búsqueda de texto general
  marca?: string;
  modelo?: string;
  tipos?: string;
  tipoCombustible?: string;
  transmisiones?: string;
  tracciones?: string;
  kilometrajeMin?: number;
  kilometrajeMax?: number;
  anioFrom?: string; // formato: YYYY-MM-DD
  anioTo?: string; // formato: YYYY-MM-DD
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "marca" | "modelo" | "kilometraje" | "anio";
  sortOrder?: "asc" | "desc";
}

export interface SuggestionsResponse {
  suggestions: string[];
}

// Para autocompletado
export type SuggestionField =
  | "marca"
  | "modelo"
  | "tipos"
  | "tipoCombustible"
  | "transmisiones"
  | "tracciones";

// Utilidades para el frontend
export interface VehiculoFormData extends CreateVehiculoDto {
  imagenes?: File[];
  videos?: File[];
}

export interface VehiculoCardProps {
  vehiculo: Vehiculo0km;
  showAdminActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onChangeStatus?: (id: string, estado: EstadoVehiculo) => void;
}

// Constantes útiles
export const VEHICULO_TIPOS = [
  "SUV Compacta",
  "SUV Mediana",
  "SUV Grande",
  "Sedán Compacto",
  "Sedán Mediano",
  "Sedán Grande",
  "Pick-up",
  "Hatchback",
  "Coupé",
  "Convertible",
  "Station Wagon",
  "Van",
  "Minivan",
  "Crossover",
] as const;

export const COMBUSTIBLES = [
  "Nafta",
  "Diesel",
  "Híbrido",
  "Eléctrico",
  "GNC",
  "Híbrido Enchufable",
] as const;

export const TRANSMISIONES = [
  "Manual 5 velocidades",
  "Manual 6 velocidades",
  "Automática 4 velocidades",
  "Automática 6 velocidades",
  "Automática 8 velocidades",
  "CVT",
  "Automática 9 velocidades",
  "Automática 10 velocidades",
] as const;

export const TRACCIONES = ["4x2", "4x4", "AWD", "FWD", "RWD"] as const;

export const MARCAS = [
  "Toyota",
  "Ford",
  "Chevrolet",
  "Volkswagen",
  "Honda",
  "Nissan",
  "Hyundai",
  "Kia",
  "Mazda",
  "Mitsubishi",
  "Suzuki",
  "Subaru",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volvo",
  "Peugeot",
  "Renault",
  "Citroën",
  "Fiat",
  "Jeep",
  "Land Rover",
  "Porsche",
  "Lexus",
  "Infiniti",
  "Acura",
] as const;

export type VehiculoTipo = (typeof VEHICULO_TIPOS)[number];
export type Combustible = (typeof COMBUSTIBLES)[number];
export type Transmision = (typeof TRANSMISIONES)[number];
export type Traccion = (typeof TRACCIONES)[number];
export type MarcaVehiculo = (typeof MARCAS)[number];
