// 🚗 Servicio de API para Vehículos Usados - Guzmán Motors

import { apiClient } from "@/lib/axios";
import {
  Usados,
  UsadosSearchParams,
  CreateUsadosDto,
  UpdateUsadosDto,
  UsadosFormData,
  UsadosSearchDto,
  CreateUsadosResponse,
  UpdateUsadosResponse,
  DeleteUsadosResponse,
} from "@/types";

// Tipos para las opciones dinámicas
export interface UsadosOptions {
  marcas: string[];
  modelos: Record<string, string[]>;
  versiones: string[];
  tiposVehiculo: string[]; // Ahora acepta cualquier string
  combustibles: string[];
  transmisiones: string[];
  tracciones: string[];
}

// Respuesta de listado con paginación
export interface UsadosResponse {
  items: Usados[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ========================================
// FIX MISMATCH BACKEND↔FRONT (Sprint A5 · §7.1 del plan)
// ========================================
// El backend (Mongo) guarda variantes/transmisiones/tracciones/potenciaMaxima,
// pero el front tipa version/transmision/traccion/potencia. Se normaliza EN
// LOS BORDES de este service para no tocar el resto de la app.

/**
 * LECTURA: completa los campos que el front espera con su equivalente del
 * backend cuando el propio campo del front viene vacío. Conserva el resto
 * de las propiedades tal cual llegan.
 */
function normalizeUsado<T extends Usados>(raw: T): T {
  if (!raw || typeof raw !== "object") return raw;
  const anyRaw = raw as unknown as Record<string, unknown>;
  return {
    ...raw,
    version: anyRaw.version ?? anyRaw.variantes,
    transmision: anyRaw.transmision ?? anyRaw.transmisiones,
    traccion: anyRaw.traccion ?? anyRaw.tracciones,
    potencia: anyRaw.potencia ?? anyRaw.potenciaMaxima,
  };
}

function normalizeUsadosResponse(response: UsadosResponse): UsadosResponse {
  if (!response || !Array.isArray(response.items)) return response;
  return { ...response, items: response.items.map((item) => normalizeUsado(item)) };
}

/**
 * ESCRITURA: create-usado-with-media.dto.ts (backend) es estricto —
 * ValidationPipe global usa whitelist+forbidNonWhitelisted, así que cualquier
 * propiedad fuera de esta lista exacta hace fallar el request entero:
 * titulo, tipos, variantes, marca, modelo, kilometraje, tipoCombustible,
 * motor, anio, transmisiones, tracciones, potenciaMaxima, capacidadCarga,
 * sistemaFrenado, ejes, estado, descripcion.
 * El front (crear/editar) arma el FormData con nombres propios
 * (version/transmision/traccion/potencia) y con campos que ese DTO no
 * contempla (tipoVehiculo, color, cantidadPuertas, cantidadAsientos,
 * cilindrada, equipamiento). Se renombran los primeros y se descartan los
 * segundos ANTES de pegarle a la API. Los campos de archivos y los de
 * borrado de media del endpoint de update (imagenesAEliminar, etc. — sí
 * aceptados por UpdateUsadoDto) se dejan pasar sin tocar.
 */
const WRITE_FIELD_RENAME: Record<string, string> = {
  version: "variantes",
  transmision: "transmisiones",
  traccion: "tracciones",
  potencia: "potenciaMaxima",
};

const WRITE_FIELDS_ALLOWED = new Set([
  // create-usado-with-media.dto.ts, EXACTO (grep del DTO del backend)
  "titulo",
  "tipos",
  "variantes",
  "marca",
  "modelo",
  "kilometraje",
  "tipoCombustible",
  "motor",
  "anio",
  "transmisiones",
  "tracciones",
  "potenciaMaxima",
  "capacidadCarga",
  "sistemaFrenado",
  "ejes",
  "estado",
  "descripcion",
  // archivos (Multer, fuera de la validación del DTO de texto)
  "imagenes",
  "videos",
  "fotoSinFondo1",
  "fotoSinFondo2",
  // solo update-with-media: UpdateUsadoDto sí acepta estos campos de borrado
  "imagenesAEliminar",
  "videosAEliminar",
  "eliminarFotoSinFondo1",
  "eliminarFotoSinFondo2",
]);

function normalizeUsadoFormDataForWrite(input: FormData): FormData {
  const output = new FormData();
  input.forEach((value, key) => {
    const outKey = WRITE_FIELD_RENAME[key] ?? key;
    if (!WRITE_FIELDS_ALLOWED.has(outKey)) return;
    output.append(outKey, value as string | Blob);
  });
  return output;
}

class UsadosService {
  private readonly baseURL = "/usados";

  // ========================================
  // ENDPOINTS PÚBLICOS (Sin autenticación)
  // ========================================

  /**
   * Listar vehículos usados disponibles para el público
   * Solo muestra usados con estado "Disponible"
   */
  async getPublicUsados(params?: UsadosSearchParams): Promise<UsadosResponse> {
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
    return normalizeUsadosResponse(response.data);
  }

  /**
   * Obtener un usado específico por ID (público)
   */
  async getPublicUsadosById(id: string): Promise<Usados> {
    const response = await apiClient.get(`${this.baseURL}/public/${id}`);
    return normalizeUsado(response.data);
  }

  /**
   * Búsqueda pública de usados
   */
  async searchPublicUsados(
    params: UsadosSearchParams
  ): Promise<UsadosResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `${this.baseURL}/public/search?${queryParams.toString()}`
    );
    return normalizeUsadosResponse(response.data);
  }

  /**
   * Obtener opciones públicas para dropdowns (sin autenticación)
   */
  async getPublicOptions(): Promise<UsadosOptions> {
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
  async getAdminOptions(): Promise<UsadosOptions> {
    const response = await apiClient.get(`${this.baseURL}/options`);
    return response.data;
  }

  /**
   * Listar todos los usados (incluye reservados)
   * Requiere autenticación de administrador
   */
  async getAllUsados(params?: UsadosSearchParams): Promise<UsadosResponse> {
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
    return normalizeUsadosResponse(response.data);
  }

  /**
   * Búsqueda completa para administradores
   */
  async searchAllUsados(searchDto: UsadosSearchDto): Promise<UsadosResponse> {
    const response = await apiClient.post(`${this.baseURL}/search`, searchDto);
    return normalizeUsadosResponse(response.data);
  }

  /**
   * Obtener un usado por ID (admin - incluye reservados)
   */
  async getUsadosById(id: string): Promise<Usados> {
    const response = await apiClient.get(`${this.baseURL}/${id}`);
    return normalizeUsado(response.data);
  }

  /**
   * Crear nuevo usado CON imágenes y videos
   * Usa FormData para subir archivos multimedia
   * Máximo: 10 imágenes + 5 videos
   */
  async createUsadosWithMedia(
    formData: FormData
  ): Promise<CreateUsadosResponse> {
    const response = await apiClient.post(
      `${this.baseURL}/create-with-media`,
      normalizeUsadoFormDataForWrite(formData),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return { ...response.data, data: normalizeUsado(response.data?.data) };
  }

  /**
   * Crear nuevo usado SIN archivos multimedia
   */
  async createUsados(dto: CreateUsadosDto): Promise<Usados> {
    const response = await apiClient.post(this.baseURL, dto);
    return response.data;
  }

  /**
   * Actualizar usado existente (sin multimedia)
   */
  async updateUsados(
    id: string,
    dto: UpdateUsadosDto
  ): Promise<UpdateUsadosResponse> {
    const response = await apiClient.patch(`${this.baseURL}/${id}`, dto);
    return response.data;
  }

  /**
   * Actualizar usado CON imágenes y videos
   * Permite agregar/eliminar archivos multimedia
   */
  async updateUsadosWithMedia(
    id: string,
    formData: FormData
  ): Promise<UpdateUsadosResponse> {
    const response = await apiClient.patch(
      `${this.baseURL}/${id}/update-with-media`,
      normalizeUsadoFormDataForWrite(formData),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return { ...response.data, usado: normalizeUsado(response.data?.usado) };
  }

  /**
   * Eliminar usado
   * Elimina el registro y todos sus archivos multimedia de Cloudinary
   */
  async deleteUsados(id: string): Promise<DeleteUsadosResponse> {
    const response = await apiClient.delete(`${this.baseURL}/${id}`);
    return response.data;
  }

  // ========================================
  // HELPERS Y UTILIDADES
  // ========================================

  /**
   * Construir FormData desde UsadosFormData
   * Útil para preparar datos antes de crear/actualizar
   *
   * El resultado ya sale normalizado a los nombres que acepta el backend
   * (version→variantes, transmision→transmisiones, traccion→tracciones,
   * potencia→potenciaMaxima) y sin los campos que create-usado-with-media.dto.ts
   * rechaza (tipoVehiculo, color, cantidadPuertas, cantidadAsientos, cilindrada,
   * equipamiento) — ver normalizeUsadoFormDataForWrite.
   */
  buildFormData(
    data: Partial<UsadosFormData>,
    imageFiles?: File[],
    videoFiles?: File[],
    fotoSinFondo1?: File,
    fotoSinFondo2?: File
  ): FormData {
    const formData = new FormData();

    // Agregar campos de texto (solo si tienen valor)
    Object.entries(data).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        key !== "imageFiles" &&
        key !== "videoFiles" &&
        key !== "fotoSinFondo1" &&
        key !== "fotoSinFondo2" &&
        key !== "equipamiento"
      ) {
        formData.append(key, value.toString());
      }
    });

    // Agregar equipamiento como JSON si existe
    if (data.equipamiento && data.equipamiento.length > 0) {
      formData.append("equipamiento", JSON.stringify(data.equipamiento));
    }

    // Agregar imágenes (máximo 10)
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.slice(0, 10).forEach((file) => {
        formData.append("imagenes", file);
      });
    }

    // Agregar videos (máximo 5)
    if (videoFiles && videoFiles.length > 0) {
      videoFiles.slice(0, 5).forEach((file) => {
        formData.append("videos", file);
      });
    }

    // Agregar fotos sin fondo para PDFs
    if (fotoSinFondo1) {
      formData.append("fotoSinFondo1", fotoSinFondo1);
    }

    if (fotoSinFondo2) {
      formData.append("fotoSinFondo2", fotoSinFondo2);
    }

    return normalizeUsadoFormDataForWrite(formData);
  }

  /**
   * Validar límites de archivos
   */
  validateFiles(imageFiles: File[], videoFiles: File[]): string | null {
    if (imageFiles.length > 10) {
      return "Máximo 10 imágenes permitidas";
    }
    if (videoFiles.length > 5) {
      return "Máximo 5 videos permitidos";
    }
    return null;
  }

  /**
   * Obtener URL de imagen optimizada según tamaño
   */
  getOptimizedImageUrl(
    mediaFile: {
      thumbnails?: { small: string; medium: string; large: string };
      url: string;
    },
    size: "small" | "medium" | "large" = "medium"
  ): string {
    return mediaFile.thumbnails?.[size] || mediaFile.url;
  }

  /**
   * Descargar ficha técnica en PDF
   * Endpoint público que genera PDF con la información del vehículo
   */
  async downloadFichaTecnicaPDF(id: string): Promise<Blob> {
    const response = await apiClient.get(
      `${this.baseURL}/public/${id}/ficha-tecnica`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  }

  /**
   * Helper para descargar PDF directamente
   */
  async downloadAndSavePDF(id: string, titulo: string): Promise<void> {
    try {
      const blob = await this.downloadFichaTecnicaPDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${titulo.replace(/\s+/g, "_")}_ficha_tecnica.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      throw error;
    }
  }
}

// Exportar instancia única del servicio
export const usadosService = new UsadosService();
