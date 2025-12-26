/**
 * Componente AdminRoute
 * Fase 3.2 - Sistema de Roles
 *
 * Protege rutas que requieren rol de administrador.
 * 1. Primero verifica autenticación (hereda de ProtectedRoute)
 * 2. Luego verifica que el usuario sea admin
 * 3. Si no es admin, muestra error 403
 *
 * Uso:
 * <AdminRoute>
 *   <ComponenteSoloParaAdmins />
 * </AdminRoute>
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { ProtectedRoute } from "./ProtectedRoute";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isAdmin, isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [showForbidden, setShowForbidden] = useState(false);

  useEffect(() => {
    // Solo verificar permisos cuando ya no esté cargando y esté autenticado
    if (!loading && isAuthenticated && !isAdmin) {
      console.error("❌ Acceso denegado: Se requiere rol de administrador");
      setShowForbidden(true);

      // Redirigir después de 3 segundos
      const timer = setTimeout(() => {
        router.push("/cliente");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAdmin, isAuthenticated, loading, router]);

  // ProtectedRoute maneja la autenticación y el loading
  return (
    <ProtectedRoute>
      {showForbidden ? (
        // Pantalla de error 403
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              403 - Acceso Denegado
            </h1>
            <p className="text-gray-600 mb-2">
              No tienes permisos para acceder a este recurso.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Usuario: <span className="font-semibold">{user?.email}</span>
              <br />
              Rol actual:{" "}
              <span className="font-semibold capitalize">{user?.role}</span>
              <br />
              Rol requerido:{" "}
              <span className="font-semibold">Administrador</span>
            </p>
            <div className="text-sm text-gray-500">
              Redirigiendo en 3 segundos...
            </div>
          </div>
        </div>
      ) : (
        // Usuario es admin, renderizar children
        <>{children}</>
      )}
    </ProtectedRoute>
  );
}

export default AdminRoute;
