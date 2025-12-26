// 🚛 Servicio de API para Remolques - Guzmán Motors

import { apiClient } from "@/lib/axios";
import {
  Remolque,
  RemolqueSearchResponse,
  RemolqueSearchParams,
  CreateRemolqueDto,
  UpdateRemolqueDto,
  RemolqueFormData,
  EstadoRemolque,
} from "@/types";

// Tipos para las opciones dinámicas
export interface RemolqueOptions {
  marcas: string[];
  modelos: Record<string, string[]>;
  condiciones: string[];
  categorias: string[];
  tiposCarroceria: string[];
  estados: string[];
}

// Respuesta de listado con paginación
export interface RemolquesResponse {
  items: Remolque[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

class RemolqueService {
  private readonly baseURL = "/remolques";

  // ========================================
  // ENDPOINTS PÚBLICOS (Sin autenticación)
  // ========================================

  /**
   * Listar remolques disponibles para el público
   * Solo muestra remolques con estado "Disponible"
   */
  async getPublicRemolques(
    params?: RemolqueSearchParams
  ): Promise<RemolquesResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(
      `${this.baseURL}/public?${queryParams.toString()}`
    );
    return response.data;
  }

  /**
   * Búsqueda pública avanzada
   */
  async searchPublicRemolques(
    query: string,
    params?: RemolqueSearchParams
  ): Promise<RemolquesResponse> {
    const queryParams = new URLSearchParams();

    if (query) queryParams.append("q", query);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(
      `${this.baseURL}/public/search?${queryParams.toString()}`
    );
    return response.data;
  }

  /**
   * Búsqueda pública avanzada con filtros
   */
  async searchPublicRemolquesAdvanced(
    searchParams: RemolqueSearchParams
  ): Promise<RemolqueSearchResponse> {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `${this.baseURL}/public/search?${params.toString()}`
    );

    const backendResponse = response.data;

    // Mapear la respuesta del backend al formato esperado por el frontend
    let remolques: Remolque[] = [];
    let pagination = {
      page: 1,
      totalPages: 1,
      totalItems: 0,
    };

    if (backendResponse.items) {
      remolques = backendResponse.items;
      pagination = {
        page: backendResponse.page || 1,
        totalPages: backendResponse.pages || 1,
        totalItems: backendResponse.total || 0,
      };
    } else if (Array.isArray(backendResponse)) {
      remolques = backendResponse;
      pagination = {
        page: 1,
        totalPages: 1,
        totalItems: backendResponse.length,
      };
    }

    return {
      remolques,
      total: pagination.totalItems,
      page: pagination.page,
      totalPages: pagination.totalPages,
    };
  }

  /**
   * Ver detalle público de un remolque
   */
  async getPublicRemolqueById(id: string): Promise<Remolque> {
    const response = await apiClient.get(`${this.baseURL}/public/${id}`);
    return response.data;
  }

  /**
   * Obtener opciones públicas para dropdowns (sin autenticación)
   */
  async getPublicOptions(): Promise<RemolqueOptions> {
    const response = await apiClient.get(`${this.baseURL}/public/options`);
    return response.data;
  }

  /**
   * Obtener sugerencias para autocompletado
   */
  async getSuggestions(
    field: string,
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

  // ========================================
  // ENDPOINTS ADMINISTRATIVOS (Con JWT)
  // ========================================

  /**
   * Obtener opciones administrativas para dropdowns (con JWT)
   */
  async getAdminOptions(): Promise<RemolqueOptions> {
    const response = await apiClient.get(`${this.baseURL}/options`);
    return response.data;
  }

  /**
   * Listar todos los remolques (incluye reservados)
   * Requiere autenticación de administrador
   */
  async getAllRemolques(
    params?: RemolqueSearchParams
  ): Promise<RemolquesResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(
      `${this.baseURL}?${queryParams.toString()}`
    );
    return response.data;
  }

  /**
   * Búsqueda completa para administradores
   */
  async searchAllRemolques(
    searchDto: RemolqueSearchParams
  ): Promise<RemolquesResponse> {
    const response = await apiClient.post(`${this.baseURL}/search`, searchDto);
    return response.data;
  }

  /**
   * Obtener remolque por ID (admin)
   */
  async getRemolqueById(id: string): Promise<Remolque> {
    const response = await apiClient.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  /**
   * Crear remolque simple (sin archivos)
   */
  async createRemolque(remolqueData: CreateRemolqueDto): Promise<Remolque> {
    const response = await apiClient.post(this.baseURL, remolqueData);
    return response.data;
  }

  /**
   * Crear remolque con imágenes y videos
   * Maneja upload múltiple de archivos
   */
  async createRemolqueWithMedia(
    remolqueData: RemolqueFormData
  ): Promise<Remolque> {
    const formData = new FormData();

    // Agregar datos del remolque (excluyendo archivos)
    const {
      imagenes,
      videos,
      fotoSinFondo1,
      fotoSinFondo2,
      chasis,
      dimensiones,
      ejesSuspension,
      carroceria,
      equipamientoSerie,
      equipamientoOpcional,
      ...datosRemolque
    } = remolqueData;

    // Campos simples
    Object.entries(datosRemolque).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Especificaciones técnicas (como JSON strings)
    if (
      chasis &&
      Object.keys(chasis).some((key) => chasis[key as keyof typeof chasis])
    ) {
      formData.append("chasis", JSON.stringify(chasis));
    }
    if (
      dimensiones &&
      Object.keys(dimensiones).some(
        (key) => dimensiones[key as keyof typeof dimensiones]
      )
    ) {
      formData.append("dimensiones", JSON.stringify(dimensiones));
    }
    if (
      ejesSuspension &&
      Object.keys(ejesSuspension).some(
        (key) => ejesSuspension[key as keyof typeof ejesSuspension]
      )
    ) {
      formData.append("ejesSuspension", JSON.stringify(ejesSuspension));
    }
    if (
      carroceria &&
      Object.keys(carroceria).some(
        (key) => carroceria[key as keyof typeof carroceria]
      )
    ) {
      formData.append("carroceria", JSON.stringify(carroceria));
    }

    // Equipamiento (como JSON arrays)
    if (equipamientoSerie && equipamientoSerie.length > 0) {
      formData.append("equipamientoSerie", JSON.stringify(equipamientoSerie));
    }
    if (equipamientoOpcional && equipamientoOpcional.length > 0) {
      formData.append(
        "equipamientoOpcional",
        JSON.stringify(equipamientoOpcional)
      );
    }

    // Agregar imágenes (máximo 10)
    if (imagenes && imagenes.length > 0) {
      if (imagenes.length > 10) {
        throw new Error("Máximo 10 imágenes permitidas");
      }
      imagenes.forEach((imagen: File) => {
        formData.append("imagenes", imagen);
      });
    }

    // Agregar videos (máximo 5)
    if (videos && videos.length > 0) {
      if (videos.length > 5) {
        throw new Error("Máximo 5 videos permitidos");
      }
      videos.forEach((video: File) => {
        formData.append("videos", video);
      });
    }

    // Agregar fotos sin fondo para PDF (opcionales)
    if (fotoSinFondo1) {
      formData.append("fotoSinFondo1", fotoSinFondo1);
    }
    if (fotoSinFondo2) {
      formData.append("fotoSinFondo2", fotoSinFondo2);
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
   * Actualizar remolque
   */
  async updateRemolque(
    id: string,
    updateData: UpdateRemolqueDto
  ): Promise<Remolque> {
    const response = await apiClient.patch(`${this.baseURL}/${id}`, updateData);
    return response.data;
  }

  /**
   * Cambiar estado del remolque
   * IMPORTANTE: Al cambiar a "Vendido" se eliminan automáticamente las imágenes
   */
  async updateEstadoRemolque(
    id: string,
    estado: EstadoRemolque
  ): Promise<Remolque> {
    const response = await apiClient.patch(`${this.baseURL}/${id}/status`, {
      estado,
    });
    return response.data;
  }

  /**
   * Eliminar remolque
   * Elimina también todos los archivos de Cloudinary
   */
  async deleteRemolque(id: string): Promise<void> {
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
   * Formatear precio para mostrar
   */
  formatPrice(price: string): string {
    // Si ya tiene formato, devolverlo tal cual
    if (price.startsWith("$")) return price;

    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
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
  getEstadoBadgeColor(estado: EstadoRemolque): {
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

  /**
   * Obtener color del badge según la condición
   */
  getCondicionBadgeColor(condicion: string): {
    bg: string;
    text: string;
    border: string;
  } {
    switch (condicion) {
      case "0KM":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
        };
      case "USADO":
        return {
          bg: "bg-orange-100",
          text: "text-orange-800",
          border: "border-orange-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
        };
    }
  }

  /**
   * Descargar ficha técnica en PDF
   */
  async descargarFichaTecnica(id: string): Promise<void> {
    window.open(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      }/remolques/public/${id}/ficha-tecnica`,
      "_blank"
    );
  }
}

// Instancia singleton del servicio
export const remolqueService = new RemolqueService();
export default remolqueService;
