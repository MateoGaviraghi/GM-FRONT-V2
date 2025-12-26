/**
 * Tipos relacionados con el modelo Usuario
 * Basado en el schema del backend
 */

// Enum para los roles de usuario
export type UserRole = "user" | "admin";

// Interface principal del Usuario
export interface Usuario {
  _id?: string;
  email: string;
  passwordHash: string;
  nombre?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para crear un nuevo usuario (sin campos autogenerados)
export interface CreateUsuarioRequest {
  email: string;
  password: string; // Se envía la contraseña sin hash
  nombre?: string;
  role?: UserRole;
}

// Interface para actualizar un usuario
export interface UpdateUsuarioRequest {
  email?: string;
  nombre?: string;
  role?: UserRole;
}

// Interface para la respuesta del usuario (sin password)
export interface UsuarioResponse {
  id: string; // Tu backend devuelve 'id' como string
  email: string;
  nombre?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para login
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface para la respuesta de autenticación
export interface AuthResponse {
  user: UsuarioResponse;
  token: string;
}

// Interface para cambio de contraseña
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
