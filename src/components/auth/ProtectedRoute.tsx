/**
 * Componente ProtectedRoute
 * Fase 3.1 - Sistema de Roles (Mejorado)
 *
 * Protege rutas que requieren autenticación.
 * Si el usuario no está autenticado, redirige a /admin/login INMEDIATAMENTE.
 *
 * Uso:
 * <ProtectedRoute>
 *   <ComponenteProtegido />
 * </ProtectedRoute>
 */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Validación una sola vez por sesión: tras el primer OK, las navegaciones
// siguientes renderizan de inmediato (el re-check corre en background).
let sessionValidated = false;

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Verificación inmediata en el cliente
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      // Si no hay token o usuario, redirigir INMEDIATAMENTE
      if (!token || !user) {
        console.warn("⚠️ Usuario no autenticado. Redirigiendo a /login...");
        window.location.href = "/admin/login";
        return;
      }

      // Verificar que el token no esté expirado
      try {
        const userData = JSON.parse(user);
        if (!userData || !userData.id) {
          console.warn(
            "⚠️ Datos de usuario inválidos. Redirigiendo a /login..."
          );
          localStorage.clear();
          window.location.href = "/admin/login";
          return;
        }
      } catch (error) {
        console.error("Error al parsear datos de usuario:", error);
        localStorage.clear();
        window.location.href = "/admin/login";
        return;
      }
    }

    // Si pasó todas las verificaciones y no está cargando, permitir renderizado
    if (!loading && isAuthenticated) {
      sessionValidated = true;
      setShouldRender(true);
    } else if (!loading && !isAuthenticated) {
      // Doble verificación: si useAuth dice que no está autenticado, redirigir
      console.warn("⚠️ Usuario no autenticado. Redirigiendo a /login...");
      window.location.href = "/admin/login";
    }
  }, [isAuthenticated, loading]);

  // Mostrar loading mientras verifica autenticación (solo la primera vez por
  // sesión: si ya se validó, se renderiza de inmediato sin spinner).
  if (!sessionValidated && (loading || !shouldRender)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Verificando autenticación...
          </p>
        </div>
      </div>
    );
  }

  // Usuario autenticado, renderizar children
  return <>{children}</>;
}

export default ProtectedRoute;
