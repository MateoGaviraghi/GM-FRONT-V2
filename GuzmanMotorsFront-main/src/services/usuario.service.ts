import { apiClient } from "@/lib/axios";
import {
  CreateUsuarioRequest,
  UsuarioResponse,
  UpdateUsuarioRequest,
  LoginRequest,
  AuthResponse,
  ChangePasswordRequest,
} from "@/types";

// Tipo para errores de la API
interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

/**
 * Servicio para manejar operaciones relacionadas con usuarios
 */
export class UsuarioService {
  private static readonly BASE_PATH = "/usuarios";

  /**
   * Crear un nuevo usuario (registro público)
   * POST /usuarios
   */
  static async create(
    userData: CreateUsuarioRequest
  ): Promise<UsuarioResponse> {
    try {
      const response = await apiClient.post<UsuarioResponse>(
        this.BASE_PATH,
        userData
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 409) {
        throw new Error("Email ya registrado");
      }
      if (apiError.response?.status === 400) {
        throw new Error("Email y password son requeridos");
      }
      throw new Error(
        apiError.response?.data?.message || "Error al crear usuario"
      );
    }
  }

  /**
   * Obtener todos los usuarios (requiere autenticación)
   * GET /usuarios
   */
  static async getAll(): Promise<UsuarioResponse[]> {
    try {
      const response = await apiClient.get<UsuarioResponse[]>(this.BASE_PATH);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.message || "Error al obtener usuarios"
      );
    }
  }

  /**
   * Obtener un usuario por ID
   * GET /usuarios/:id
   */
  static async getById(id: string): Promise<UsuarioResponse> {
    try {
      const response = await apiClient.get<UsuarioResponse>(
        `${this.BASE_PATH}/${id}`
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 404) {
        throw new Error("Usuario no encontrado");
      }
      throw new Error(
        apiError.response?.data?.message || "Error al obtener usuario"
      );
    }
  }

  /**
   * Actualizar un usuario
   * PATCH /usuarios/:id
   */
  static async update(
    id: string,
    userData: UpdateUsuarioRequest
  ): Promise<UsuarioResponse> {
    try {
      const response = await apiClient.patch<UsuarioResponse>(
        `${this.BASE_PATH}/${id}`,
        userData
      );
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 404) {
        throw new Error("Usuario no encontrado");
      }
      if (apiError.response?.status === 409) {
        throw new Error("Email ya está en uso");
      }
      throw new Error(
        apiError.response?.data?.message || "Error al actualizar usuario"
      );
    }
  }

  /**
   * Eliminar un usuario
   * DELETE /usuarios/:id
   */
  static async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.BASE_PATH}/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 404) {
        throw new Error("Usuario no encontrado");
      }
      throw new Error(
        apiError.response?.data?.message || "Error al eliminar usuario"
      );
    }
  }

  /**
   * Login de usuario
   * POST /usuarios/login
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        `${this.BASE_PATH}/login`,
        credentials
      );

      // Guardar token, usuario, rol y userId en localStorage (Fase 2 - Sistema de Roles)
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // NUEVO: Guardar rol y userId para validaciones de permisos
        localStorage.setItem("userRole", response.data.user.role);
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("userEmail", response.data.user.email);
      }

      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 401) {
        throw new Error("Credenciales inválidas");
      }
      if (apiError.response?.status === 429) {
        throw new Error(
          "Demasiados intentos. Por favor espera un minuto antes de intentar nuevamente."
        );
      }
      throw new Error(
        apiError.response?.data?.message || "Error al iniciar sesión"
      );
    }
  }

  /**
   * Logout del usuario
   */
  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
    }
  }

  /**
   * Obtener usuario actual desde localStorage
   */
  static getCurrentUser(): UsuarioResponse | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  static isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token");
    }
    return false;
  }

  /**
   * Verificar token con el backend
   * Intenta obtener la lista de usuarios para verificar que el token sea válido
   */
  static async verifyToken(): Promise<boolean> {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        return false;
      }

      // Intentar hacer una petición autenticada para verificar el token
      // Usamos el endpoint de listar usuarios ya que requiere autenticación
      await apiClient.get(`${this.BASE_PATH}`);

      // Si la petición es exitosa, el token es válido
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error al verificar token:", apiError);

      // Si el token es inválido o expiró, limpiar localStorage
      if (
        apiError.response?.status === 401 ||
        apiError.response?.status === 403
      ) {
        this.logout();
      }

      return false;
    }
  }

  /**
   * Cambiar contraseña del usuario actual
   * POST /usuarios/change-password
   */
  static async changePassword(
    passwordData: ChangePasswordRequest
  ): Promise<void> {
    try {
      await apiClient.post(`${this.BASE_PATH}/change-password`, passwordData);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 400) {
        throw new Error("Contraseña actual incorrecta");
      }
      throw new Error(
        apiError.response?.data?.message || "Error al cambiar contraseña"
      );
    }
  }
}

export default UsuarioService;
