// 🚗 Servicio de Vehículos 0km - Guzmán Motors
// Maneja toda la comunicación con el API de vehículos

import { apiClient } from "@/lib/axios";
import {
  Vehiculo0km,
  VehiculosResponse,
  VehiculoSearchResponse,
  VehiculoSearchFilters,
  CreateVehiculoDto,
  UpdateVehiculoDto,
  VehiculoFilters,
  VehiculoSearchDto,
  SuggestionField,
  VehiculoFormData,
  EstadoVehiculo,
} from "@/types";

// Tipos para las opciones dinámicas
export interface VehiculoOptions {
  marcas: string[];
  modelos: Record<string, string[]>;
  tipos: string[];
  combustibles: string[];
  transmisiones: string[];
  tracciones: string[];
  estados: string[];
}

class VehiculoService {
  private readonly baseURL = "/vehiculos0km";

  // ========================================
  // ENDPOINTS PÚBLICOS (Sin autenticación)
  // ========================================

  /**
   * Listar vehículos disponibles para el público
   * Solo muestra vehículos con estado "Disponible"
   */
  async getPublicVehiculos(
    filters?: VehiculoFilters
  ): Promise<VehiculosResponse> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(
      `${this.baseURL}/public?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Búsqueda pública avanzada
   * Búsqueda inteligente con filtros combinados
   */
  async searchPublicVehiculos(
    query: string,
    filters?: VehiculoFilters
  ): Promise<VehiculosResponse> {
    const params = new URLSearchParams();

    if (query) params.append("q", query);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(
      `${this.baseURL}/public/search?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Obtener sugerencias para autocompletado
   */
  async getSuggestions(
    field: SuggestionField,
    query: string,
    limit: number = 5
  ): Promise<string[]> {
    const params = new URLSearchParams({
      field,
      query,
      limit: limit.toString(),
    });

    const response = await apiClient.get(
      `${this.baseURL}/public/suggestions?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Ver detalle público de un vehículo
   */
  async getPublicVehiculoById(id: string): Promise<Vehiculo0km> {
    const response = await apiClient.get(`${this.baseURL}/public/${id}`);
    return response.data;
  }

  /**
   * Obtener opciones públicas para dropdowns (sin autenticación)
   * Incluye marcas, modelos, tipos, etc. de vehículos disponibles
   */
  async getPublicOptions(): Promise<VehiculoOptions> {
    const response = await apiClient.get(`${this.baseURL}/public/options`);
    return response.data;
  }

  /**
   * Búsqueda pública avanzada con filtros y texto
   * Solo vehículos disponibles, con búsqueda insensible a acentos
   */
  async searchPublicVehiculosAdvanced(
    searchParams: VehiculoSearchFilters
  ): Promise<VehiculoSearchResponse> {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `${this.baseURL}/public/search?${params.toString()}`
    );

    // Mapear la respuesta del backend al formato esperado por el frontend
    const backendResponse = response.data;

    // Intentar diferentes estructuras de respuesta del backend
    let vehiculos: Vehiculo0km[] = [];
    let pagination = {
      page: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    if (backendResponse.items) {
      // Estructura: { items: [], page: 1, total: 10, pages: 1 }
      vehiculos = backendResponse.items;
      pagination = {
        page: backendResponse.page || 1,
        totalPages: backendResponse.pages || 1,
        totalItems: backendResponse.total || 0,
        hasNextPage: (backendResponse.page || 1) < (backendResponse.pages || 1),
        hasPreviousPage: (backendResponse.page || 1) > 1,
      };
    } else if (backendResponse.vehiculos) {
      // Estructura: { vehiculos: [], pagination: {} }
      vehiculos = backendResponse.vehiculos;
      pagination = {
        page: backendResponse.pagination?.page || 1,
        totalPages: backendResponse.pagination?.totalPages || 1,
        totalItems: backendResponse.pagination?.totalItems || 0,
        hasNextPage: backendResponse.pagination?.hasNextPage || false,
        hasPreviousPage: backendResponse.pagination?.hasPreviousPage || false,
      };
    } else if (Array.isArray(backendResponse)) {
      // Estructura: [vehiculo1, vehiculo2, ...]
      vehiculos = backendResponse;
      pagination = {
        page: 1,
        totalPages: 1,
        totalItems: backendResponse.length,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    } else {
      // Fallback: asumir que toda la respuesta son los vehículos
      vehiculos = Array.isArray(backendResponse) ? backendResponse : [];
      pagination = {
        page: 1,
        totalPages: 1,
        totalItems: Array.isArray(backendResponse) ? backendResponse.length : 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    return {
      vehiculos,
      pagination,
    };
  }

  // ========================================
  // ENDPOINTS ADMINISTRATIVOS (Con JWT)
  // ========================================

  /**
   * Obtener opciones administrativas para dropdowns (con JWT)
   * Incluye todos los datos, incluso de vehículos vendidos/reservados
   */
  async getAdminOptions(): Promise<VehiculoOptions> {
    const response = await apiClient.get(`${this.baseURL}/options`);
    return response.data;
  }

  /**
   * Listar todos los vehículos (incluye reservados)
   * Requiere autenticación de administrador
   */
  async getAllVehiculos(filters?: VehiculoFilters): Promise<VehiculosResponse> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(
      `${this.baseURL}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Búsqueda completa para administradores
   * Incluye vehículos reservados y vendidos
   */
  async searchAllVehiculos(
    searchDto: VehiculoSearchDto
  ): Promise<VehiculosResponse> {
    const response = await apiClient.post(`${this.baseURL}/search`, searchDto);
    return response.data;
  }

  /**
   * Obtener vehículo por ID (admin)
   */
  async getVehiculoById(id: string): Promise<Vehiculo0km> {
    const response = await apiClient.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  /**
   * Crear vehículo simple (sin archivos)
   */
  async createVehiculo(vehiculoData: CreateVehiculoDto): Promise<Vehiculo0km> {
    const response = await apiClient.post(this.baseURL, vehiculoData);
    return response.data;
  }

  /**
   * Crear vehículo con imágenes y videos
   * Maneja upload múltiple de archivos
   */
  async createVehiculoWithMedia(
    vehiculoData: VehiculoFormData
  ): Promise<Vehiculo0km> {
    const formData = new FormData();

    // Agregar datos del vehículo (excluyendo archivos)
    const { imagenes, videos, ...datosVehiculo } = vehiculoData;

    Object.entries(datosVehiculo).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Agregar imágenes (máximo 10)
    if (imagenes && imagenes.length > 0) {
      if (imagenes.length > 10) {
        throw new Error("Máximo 10 imágenes permitidas");
      }
      imagenes.forEach((imagen) => {
        formData.append("imagenes", imagen);
      });
    }

    // Agregar videos (máximo 5)
    if (videos && videos.length > 0) {
      if (videos.length > 5) {
        throw new Error("Máximo 5 videos permitidos");
      }
      videos.forEach((video) => {
        formData.append("videos", video);
      });
    }

    const response = await apiClient.post(
      `${this.baseURL}/create-with-media`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  /**
   * Actualizar vehículo
   */
  async updateVehiculo(
    id: string,
    updateData: UpdateVehiculoDto
  ): Promise<Vehiculo0km> {
    const response = await apiClient.patch(`${this.baseURL}/${id}`, updateData);
    return response.data;
  }

  /**
   * Cambiar estado del vehículo
   * IMPORTANTE: Al cambiar a "Vendido" se eliminan automáticamente las imágenes
   */
  async updateEstadoVehiculo(
    id: string,
    estado: EstadoVehiculo
  ): Promise<Vehiculo0km> {
    const response = await apiClient.patch(`${this.baseURL}/${id}/status`, {
      estado,
    });
    return response.data;
  }

  /**
   * Eliminar vehículo
   * Elimina también todos los archivos de Cloudinary
   */
  async deleteVehiculo(id: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${id}`);
  }

  // ========================================
  // UTILIDADES Y HELPERS
  // ========================================

  /**
   * Validar archivos antes de subir
   */
  validateFiles(
    imagenes?: File[],
    videos?: File[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar imágenes
    if (imagenes) {
      if (imagenes.length > 10) {
        errors.push("Máximo 10 imágenes permitidas");
      }

      imagenes.forEach((imagen, index) => {
        // Validar tamaño (20MB máximo)
        if (imagen.size > 20 * 1024 * 1024) {
          errors.push(`Imagen ${index + 1}: Máximo 20MB por imagen`);
        }

        // Validar formato
        const formatosValidos = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (!formatosValidos.includes(imagen.type)) {
          errors.push(
            `Imagen ${index + 1}: Formato no válido. Use JPG, PNG o WEBP`
          );
        }
      });
    }

    // Validar videos
    if (videos) {
      if (videos.length > 5) {
        errors.push("Máximo 5 videos permitidos");
      }

      videos.forEach((video, index) => {
        // Validar tamaño (50MB máximo)
        if (video.size > 50 * 1024 * 1024) {
          errors.push(`Video ${index + 1}: Máximo 50MB por video`);
        }

        // Validar formato
        const formatosValidos = ["video/mp4", "video/mov", "video/avi"];
        if (!formatosValidos.includes(video.type)) {
          errors.push(
            `Video ${index + 1}: Formato no válido. Use MP4, MOV o AVI`
          );
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generar URL optimizada de Cloudinary
   */
  getOptimizedImageUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: "auto" | number;
      format?: "auto" | "webp" | "jpg" | "png";
      crop?: "fill" | "fit" | "scale" | "crop";
    } = {}
  ): string {
    const {
      width,
      height,
      quality = "auto",
      format = "auto",
      crop = "fill",
    } = options;

    const transformations = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);

    const transformString = transformations.join(",");

    return `https://res.cloudinary.com/demdyjvk8/image/upload/${transformString}/v1/${publicId}`;
  }

  /**
   * Obtener URL del thumbnail de video
   */
  getVideoThumbnail(videoPublicId: string): string {
    return `https://res.cloudinary.com/demdyjvk8/video/upload/so_10p,f_jpg,q_auto/${videoPublicId}.jpg`;
  }

  /**
   * Formatear precio para mostrar
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  /**
   * Formatear fecha
   */
  formatDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Obtener color del badge según el estado
   */
  getEstadoBadgeColor(estado: EstadoVehiculo): {
    bg: string;
    text: string;
    border: string;
  } {
    switch (estado) {
      case "Disponible":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
        };
      case "Reservado":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
        };
      case "Vendido":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
        };
    }
  }
}

// Instancia singleton del servicio
export const vehiculoService = new VehiculoService();
export default vehiculoService;
