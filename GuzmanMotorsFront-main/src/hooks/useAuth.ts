/**
 * Hook personalizado para manejar autenticación y roles
 * Fase 2 - Sistema de Roles (Mejorado con verificación de backend)
 *
 * Uso:
 * const { user, isAdmin, isAuthenticated, loading, logout } = useAuth();
 */

import { useState, useEffect } from "react";
import { UsuarioResponse } from "@/types";
import { UsuarioService } from "@/services";

interface UseAuthReturn {
  user: UsuarioResponse | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UsuarioResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        // Verificar primero localStorage
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          const userStr = localStorage.getItem("user");

          if (!token || !userStr) {
            setLoading(false);
            return;
          }

          // Verificar token con el backend
          const isValid = await UsuarioService.verifyToken();

          if (isValid) {
            // Token válido, cargar usuario actualizado
            const updatedUserStr = localStorage.getItem("user");
            if (updatedUserStr) {
              const userData = JSON.parse(updatedUserStr) as UsuarioResponse;
              setUser(userData);
            }
          } else {
            // Token inválido, limpiar datos
            setUser(null);
            UsuarioService.logout();
          }
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        setUser(null);
        UsuarioService.logout();
      } finally {
        setLoading(false);
      }
    };

    verifyAuthentication();
  }, []);

  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!user;

  const logout = () => {
    UsuarioService.logout();
    setUser(null);

    // Redirigir al login
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  };

  return {
    user,
    isAdmin,
    isAuthenticated,
    loading,
    logout,
  };
}

export default useAuth;
