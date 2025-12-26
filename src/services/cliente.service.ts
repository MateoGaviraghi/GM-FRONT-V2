import { apiClient } from "@/lib/axios";
import { Cliente } from "@/types/cliente";

// Tipo para la creación (sin campos generados automáticamente)
export interface CreateClienteRequest {
  nombreCompleto?: string;
  correoElectronico?: string;
  telefonoCelular?: string;
  telefonoFijo?: string;
  provincia?: string;
  localidad?: string;
  direccion?: string;
  tipoVehiculo?: string;
  marca?: string;
  modelo?: string;
  anioCompra?: number;
  fechaNacimiento?: string;
  tipoCliente?: string; // NUEVO
  observaciones?: string; // NUEVO
}

// Tipos para búsqueda avanzada
export interface ClienteSearchParams {
  q?: string; // Búsqueda de texto
  page?: number; // Página actual
  limit?: number; // Elementos por página
  sortBy?: keyof Cliente | "createdAt" | "updatedAt"; // Campo de ordenamiento
  sortOrder?: "asc" | "desc"; // Orden ascendente/descendente
  filters?: {
    provincia?: string;
    localidad?: string;
    tipoVehiculo?: string;
    marca?: string;
    modelo?: string;
    productoServicio?: string;
    nombreCompleto?: string;
    correoElectronico?: string;
    telefonoCelular?: string;
    tipoCliente?: string; // NUEVO
    observaciones?: string; // NUEVO
  };
  ranges?: {
    anioCompraMin?: number;
    anioCompraMax?: number;
    fechaNacimientoFrom?: string;
    fechaNacimientoTo?: string;
  };
}

// Respuesta de búsqueda con paginación
export interface ClienteSearchResponse {
  items: Cliente[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export class ClienteService {
  private static readonly BASE_PATH = "/clientes";

  /**
   * Crear un nuevo cliente
   * POST /api/clientes
   */
  static async create(clienteData: CreateClienteRequest): Promise<Cliente> {
    try {
      const response = await apiClient.post<Cliente>(
        this.BASE_PATH,
        clienteData
      );
      return response.data;
    } catch (error) {
      console.error("Error en ClienteService.create:", error);
      const apiError = error as ApiError;

      if (apiError.response?.status === 400) {
        throw new Error("Datos del cliente inválidos");
      }
      if (apiError.response?.status === 409) {
        throw new Error("Cliente ya existe");
      }
      throw new Error(
        apiError.response?.data?.message || "Error al crear cliente"
      );
    }
  }

  /**
   * Buscar clientes con filtros, paginación y ordenamiento
   * GET /api/clientes?page=1&limit=20&q=...&filters=...
   */
  static async search(
    params: ClienteSearchParams = {}
  ): Promise<ClienteSearchResponse> {
    try {
      // Construir query string
      const queryParams = new URLSearchParams();

      // Parámetros básicos
      if (params.q) queryParams.append("q", params.q);
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      // Filtros
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }

      // Rangos
      if (params.ranges) {
        Object.entries(params.ranges).forEach(([key, value]) => {
          if (value !== undefined) queryParams.append(key, value.toString());
        });
      }

      const url = `${this.BASE_PATH}?${queryParams.toString()}`;

      const response = await apiClient.get<ClienteSearchResponse>(url);
      return response.data;
    } catch (error) {
      console.error("Error en ClienteService.search:", error);
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.message || "Error al buscar clientes"
      );
    }
  }

  /**
   * Obtener todos los clientes (versión simple)
   * GET /api/clientes
   */
  static async getAll(): Promise<Cliente[]> {
    try {
      const response = await this.search({ limit: 100 });
      return response.items;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.message || "Error al obtener clientes"
      );
    }
  }

  /**
   * Obtener cliente por ID
   * GET /api/clientes/:id
   */
  static async getById(id: string): Promise<Cliente> {
    try {
      const response = await apiClient.get<Cliente>(`${this.BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 404) {
        throw new Error("Cliente no encontrado");
      }
      throw new Error(
        apiError.response?.data?.message || "Error al obtener cliente"
      );
    }
  }

  /**
   * Actualizar un cliente
   * PATCH /api/clientes/:id
   */
  static async update(
    id: string,
    clienteData: Partial<CreateClienteRequest>
  ): Promise<Cliente> {
    try {
      const response = await apiClient.patch<Cliente>(
        `${this.BASE_PATH}/${id}`,
        clienteData
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 404) {
        throw new Error("Cliente no encontrado");
      }
      throw new Error(
        apiError.response?.data?.message || "Error al actualizar cliente"
      );
    }
  }

  /**
   * Eliminar un cliente
   * DELETE /api/clientes/:id
   */
  static async delete(
    id: string
  ): Promise<{ message: string; cliente?: Cliente }> {
    try {
      const response = await apiClient.delete<{
        message: string;
        cliente?: Cliente;
      }>(`${this.BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 404) {
        throw new Error("Cliente no encontrado");
      }
      if (apiError.response?.status === 400) {
        throw new Error("ID de cliente inválido");
      }
      throw new Error(
        apiError.response?.data?.message || "Error al eliminar cliente"
      );
    }
  }

  /**
   * Contar clientes con filtros
   * GET /api/clientes/count/all?q=...&filters=...
   */
  static async count(
    params: Omit<
      ClienteSearchParams,
      "page" | "limit" | "sortBy" | "sortOrder"
    > = {}
  ): Promise<number> {
    try {
      // Construir query string igual que en search() pero sin paginación
      const queryParams = new URLSearchParams();

      // Parámetros básicos
      if (params.q) queryParams.append("q", params.q);

      // Filtros
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }

      // Rangos
      if (params.ranges) {
        Object.entries(params.ranges).forEach(([key, value]) => {
          if (value !== undefined) queryParams.append(key, value.toString());
        });
      }

      const url = `${this.BASE_PATH}/count/all?${queryParams.toString()}`;

      const response = await apiClient.get<number>(url);
      return response.data;
    } catch (error) {
      console.error("Error en ClienteService.count:", error);
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.message || "Error al contar clientes"
      );
    }
  }

  /**
   * Obtener estadísticas de clientes
   * GET /api/clientes/stats?groupBy=provincia,tipoVehiculo&limit=10
   */
  static async stats(params: {
    groupBy: string[];
    q?: string;
    filters?: {
      provincia?: string;
      localidad?: string;
      tipoVehiculo?: string;
      marca?: string;
      modelo?: string;
      productoServicio?: string;
      nombreCompleto?: string;
      correoElectronico?: string;
      telefonoCelular?: string;
      tipoCliente?: string; // NUEVO
      observaciones?: string; // NUEVO
    };
    ranges?: {
      anioCompraMin?: number;
      anioCompraMax?: number;
      fechaNacimientoFrom?: string;
      fechaNacimientoTo?: string;
    };
    limit?: number;
  }): Promise<
    Array<{ group: Record<string, string | number | null>; count: number }>
  > {
    try {
      const queryParams = new URLSearchParams();

      // GroupBy (requerido)
      queryParams.append("groupBy", params.groupBy.join(","));

      // Parámetros opcionales
      if (params.q) queryParams.append("q", params.q);
      if (params.limit) queryParams.append("limit", params.limit.toString());

      // Filtros
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }

      // Rangos
      if (params.ranges) {
        Object.entries(params.ranges).forEach(([key, value]) => {
          if (value !== undefined) queryParams.append(key, value.toString());
        });
      }

      const url = `${this.BASE_PATH}/stats?${queryParams.toString()}`;

      const response = await apiClient.get<
        Array<{ group: Record<string, string | number | null>; count: number }>
      >(url);
      return response.data;
    } catch (error) {
      console.error("Error en ClienteService.stats:", error);
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.message || "Error al obtener estadísticas"
      );
    }
  }

  /**
   * Obtener sugerencias de autocompletado
   * GET /api/clientes/suggestions?field=provincia&query=cor&limit=10
   */
  static async suggestions(
    field: string,
    query: string,
    limit: number = 10
  ): Promise<string[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("field", field);
      queryParams.append("query", query);
      queryParams.append("limit", limit.toString());

      const url = `${this.BASE_PATH}/suggestions?${queryParams.toString()}`;

      const response = await apiClient.get<string[]>(url);
      return response.data;
    } catch (error) {
      console.error("Error en ClienteService.suggestions:", error);
      // No lanzar error para no interrumpir la escritura del usuario
      return [];
    }
  }

  /**
   * Exportar clientes a Excel
   * GET /api/clientes/export-excel
   */
  static async exportToExcel(
    params: Omit<
      ClienteSearchParams,
      "page" | "limit" | "sortBy" | "sortOrder"
    > = {}
  ): Promise<Blob> {
    try {
      // Construir query string igual que en search() pero sin paginación
      const queryParams = new URLSearchParams();

      // Parámetros básicos
      if (params.q) queryParams.append("q", params.q);

      // Filtros
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }

      // Rangos
      if (params.ranges) {
        Object.entries(params.ranges).forEach(([key, value]) => {
          if (value !== undefined) queryParams.append(key, value.toString());
        });
      }

      const url = `${this.BASE_PATH}/export-excel?${queryParams.toString()}`;

      const response = await apiClient({
        method: "GET",
        url: url,
        responseType: "blob",
        headers: {
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });

      // Verificar que recibimos un blob válido
      if (!(response.data instanceof Blob)) {
        throw new Error("Respuesta inválida del servidor");
      }

      return response.data;
    } catch (error) {
      console.error("Error en ClienteService.exportToExcel:", error);
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.message || "Error al exportar clientes a Excel"
      );
    }
  }

  /**
   * Búsqueda avanzada por observaciones
   * POST /api/clientes/search/observaciones
   */
  static async searchObservaciones(params: {
    keywords: string[];
    searchType: "exact" | "fuzzy" | "any";
    page?: number;
    limit?: number;
    sortBy?: keyof Cliente | "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
  }): Promise<{
    items: Cliente[];
    total: number;
    page: number;
    limit: number;
    pages: number;
    matchedKeywords: string[];
  }> {
    try {
      const response = await apiClient.post<{
        items: Cliente[];
        total: number;
        page: number;
        limit: number;
        pages: number;
        matchedKeywords: string[];
      }>(`${this.BASE_PATH}/search/observaciones`, params);

      return response.data;
    } catch (error) {
      console.error("Error en ClienteService.searchObservaciones:", error);
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.message ||
          "Error en búsqueda por observaciones"
      );
    }
  }

  /**
   * Obtener clientes que cumplen años hoy
   * GET /api/clientes/cumpleanos/hoy
   */
  static async getCumpleanosHoy(): Promise<Cliente[]> {
    try {
      const response = await apiClient.get<Cliente[]>(
        `${this.BASE_PATH}/cumpleanos/hoy`
      );
      return response.data;
    } catch (error) {
      console.error("Error en ClienteService.getCumpleanosHoy:", error);
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.message || "Error al obtener cumpleaños"
      );
    }
  }
}

export default ClienteService;
