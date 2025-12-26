/**
 * Servicio de API para el módulo de Novedades
 * Incluye endpoints públicos y administrativos
 */

import { apiClient } from "@/lib/axios";
import type {
  Novedad,
  CreateNovedadDto,
  UpdateNovedadDto,
  NovedadesPaginatedResponse,
  NovedadesOptionsResponse,
  ListNovedadesParams,
  SearchNovedadesParams,
  CreateNovedadWithMediaResponse,
  DeleteNovedadResponse,
  RestoreNovedadResponse,
  DeleteImageResponse,
} from "@/types/novedad";

/**
 * ============================================
 * ENDPOINTS PÚBLICOS (Sin autenticación)
 * ============================================
 */

export const novedadPublicService = {
  /**
   * Listar todas las novedades (públicas, no eliminadas)
   */
  list: async (
    params?: ListNovedadesParams
  ): Promise<NovedadesPaginatedResponse> => {
    const { data } = await apiClient.get("/novedades/public", { params });
    return data;
  },

  /**
   * Buscar novedades por texto
   */
  search: async (
    params: SearchNovedadesParams
  ): Promise<NovedadesPaginatedResponse> => {
    const { data } = await apiClient.get("/novedades/public/search", {
      params,
    });
    return data;
  },

  /**
   * Obtener una novedad por ID (incrementa contador de vistas)
   */
  getById: async (id: string): Promise<Novedad> => {
    const { data } = await apiClient.get(`/novedades/public/${id}`);
    return data;
  },

  /**
   * Obtener opciones de filtros (categorías) - Cacheado 30 min
   */
  getOptions: async (): Promise<NovedadesOptionsResponse> => {
    const { data } = await apiClient.get("/novedades/public/options");
    return data;
  },

  /**
   * Obtener sugerencias de autocompletado
   */
  getSuggestions: async (
    field: "titulo" | "categoria",
    query: string,
    limit?: number
  ): Promise<string[]> => {
    const { data } = await apiClient.get("/novedades/public/suggestions", {
      params: { field, query, limit },
    });
    return data;
  },

  /**
   * Obtener novedades destacadas
   */
  getFeatured: async (limit?: number): Promise<Novedad[]> => {
    const { data } = await apiClient.get("/novedades/public/featured", {
      params: { limit },
    });
    return data;
  },

  /**
   * Obtener novedades recientes
   */
  getRecent: async (limit?: number): Promise<Novedad[]> => {
    const { data } = await apiClient.get("/novedades/public/recent", {
      params: { limit },
    });
    return data;
  },

  /**
   * Obtener novedades por categoría
   */
  getByCategoria: async (
    categoria: string,
    page?: number,
    limit?: number
  ): Promise<NovedadesPaginatedResponse> => {
    const { data } = await apiClient.get(
      `/novedades/public/categoria/${encodeURIComponent(categoria)}`,
      {
        params: { page, limit },
      }
    );
    return data;
  },
};

/**
 * ============================================
 * ENDPOINTS ADMINISTRATIVOS (Requieren JWT)
 * ============================================
 */

export const novedadAdminService = {
  /**
   * Listar todas las novedades (puede incluir eliminadas)
   */
  list: async (
    params?: ListNovedadesParams
  ): Promise<NovedadesPaginatedResponse> => {
    const { data } = await apiClient.get("/novedades", { params });
    return data;
  },

  /**
   * Buscar novedades (puede incluir eliminadas)
   */
  search: async (
    params: SearchNovedadesParams
  ): Promise<NovedadesPaginatedResponse> => {
    const { data } = await apiClient.get("/novedades/search", { params });
    return data;
  },

  /**
   * Obtener opciones de filtros
   */
  getOptions: async (): Promise<NovedadesOptionsResponse> => {
    const { data } = await apiClient.get("/novedades/options");
    return data;
  },

  /**
   * Obtener sugerencias de autocompletado
   */
  getSuggestions: async (
    field: "titulo" | "categoria",
    query: string,
    limit?: number
  ): Promise<string[]> => {
    const { data } = await apiClient.get(`/novedades/suggestions/${field}`, {
      params: { q: query, limit },
    });
    return data;
  },

  /**
   * Obtener novedades destacadas
   */
  getFeatured: async (limit?: number): Promise<Novedad[]> => {
    const { data } = await apiClient.get("/novedades/featured", {
      params: { limit },
    });
    return data;
  },

  /**
   * Obtener novedades recientes
   */
  getRecent: async (limit?: number): Promise<Novedad[]> => {
    const { data } = await apiClient.get("/novedades/recent", {
      params: { limit },
    });
    return data;
  },

  /**
   * Obtener novedades por categoría
   */
  getByCategoria: async (
    categoria: string,
    page?: number,
    limit?: number
  ): Promise<NovedadesPaginatedResponse> => {
    const { data } = await apiClient.get(
      `/novedades/categoria/${encodeURIComponent(categoria)}`,
      {
        params: { page, limit },
      }
    );
    return data;
  },

  /**
   * Crear una novedad sin imágenes
   */
  create: async (novedad: CreateNovedadDto): Promise<Novedad> => {
    // Transformar datos antes de enviar
    const payload = {
      ...novedad,
      destacada: novedad.destacada !== undefined ? novedad.destacada : false,
      fechaPublicacion: novedad.fechaPublicacion
        ? novedad.fechaPublicacion instanceof Date
          ? novedad.fechaPublicacion.getTime()
          : new Date(novedad.fechaPublicacion).getTime()
        : undefined,
    };

    const { data } = await apiClient.post("/novedades", payload);
    return data;
  },

  /**
   * Crear una novedad con imágenes
   */
  createWithMedia: async (
    novedad: CreateNovedadDto,
    images: File[]
  ): Promise<CreateNovedadWithMediaResponse> => {
    const formData = new FormData();

    // Agregar campos de la novedad
    formData.append("titulo", novedad.titulo);
    formData.append("contenido", novedad.contenido);

    if (novedad.resumen) {
      formData.append("resumen", novedad.resumen);
    }

    if (novedad.categoria) {
      formData.append("categoria", novedad.categoria);
    }

    // Destacada: enviar como string true/false (igual que otros módulos)
    if (novedad.destacada !== undefined) {
      formData.append("destacada", novedad.destacada.toString());
    }

    // Fecha: enviar como ISO string (igual que Vehículos y Usados)
    if (novedad.fechaPublicacion) {
      const fecha =
        novedad.fechaPublicacion instanceof Date
          ? novedad.fechaPublicacion.toISOString()
          : new Date(novedad.fechaPublicacion).toISOString();
      formData.append("fechaPublicacion", fecha);
    }

    // Agregar links si existen
    if (novedad.links && novedad.links.length > 0) {
      formData.append("links", JSON.stringify(novedad.links));
    }

    // Agregar imágenes
    images.forEach((image) => {
      formData.append("imagenes", image);
    });

    try {
      const { data } = await apiClient.post(
        "/novedades/create-with-media",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (error) {
      console.error("❌ Error al crear novedad con media");
      throw error;
    }
  },

  /**
   * Actualizar una novedad (puede agregar nuevas imágenes)
   */
  update: async (
    id: string,
    updates: UpdateNovedadDto,
    newImages?: File[]
  ): Promise<Novedad> => {
    const formData = new FormData();

    // Agregar solo los campos que se actualizan
    if (updates.titulo !== undefined) {
      formData.append("titulo", updates.titulo);
    }

    if (updates.contenido !== undefined) {
      formData.append("contenido", updates.contenido);
    }

    if (updates.resumen !== undefined) {
      formData.append("resumen", updates.resumen);
    }

    if (updates.categoria !== undefined) {
      formData.append("categoria", updates.categoria);
    }

    if (updates.destacada !== undefined) {
      formData.append("destacada", updates.destacada.toString());
    }

    if (updates.fechaPublicacion !== undefined) {
      const fecha =
        updates.fechaPublicacion instanceof Date
          ? updates.fechaPublicacion.toISOString()
          : updates.fechaPublicacion;
      formData.append("fechaPublicacion", fecha);
    }

    if (updates.deleted !== undefined) {
      formData.append("deleted", updates.deleted.toString());
    }

    // Agregar links si existen (y no están vacíos)
    if (updates.links !== undefined && updates.links.length > 0) {
      const linksJson = JSON.stringify(updates.links);
      console.log("🔗 Links siendo enviados:", linksJson);
      console.log("📦 Objeto links original:", updates.links);
      formData.append("links", linksJson);
    } else {
      console.log("⚠️ No se envían links (vacío o undefined)");
    }

    // Agregar nuevas imágenes si existen
    if (newImages && newImages.length > 0) {
      newImages.forEach((image) => {
        formData.append("imagenes", image);
      });
    }

    try {
      const { data } = await apiClient.patch(`/novedades/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error: unknown) {
      throw error;
    }
  },

  /**
   * Eliminar novedad (soft delete)
   */
  delete: async (id: string): Promise<DeleteNovedadResponse> => {
    const { data } = await apiClient.delete(`/novedades/${id}`);
    return data;
  },

  /**
   * Restaurar novedad eliminada
   */
  restore: async (id: string): Promise<RestoreNovedadResponse> => {
    const { data } = await apiClient.post(`/novedades/${id}/restore`);
    return data;
  },

  /**
   * Eliminar novedad permanentemente (hard delete)
   */
  hardDelete: async (id: string): Promise<DeleteNovedadResponse> => {
    const { data } = await apiClient.delete(`/novedades/${id}/hard`);
    return data;
  },

  /**
   * Eliminar una imagen específica de una novedad
   */
  deleteImage: async (
    id: string,
    publicId: string
  ): Promise<DeleteImageResponse> => {
    const encodedPublicId = encodeURIComponent(publicId);
    const { data } = await apiClient.delete(
      `/novedades/${id}/images/${encodedPublicId}`
    );
    return data;
  },
};

/**
 * Exportación unificada del servicio
 */
export const novedadService = {
  public: novedadPublicService,
  admin: novedadAdminService,
};
