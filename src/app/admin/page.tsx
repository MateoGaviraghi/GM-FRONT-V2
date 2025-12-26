"use client";

import React from "react";
import { User, Shield, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks";

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

  // El loading ya lo maneja ProtectedRoute en el layout
  // Solo verificamos que user exista
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenido, {user.nombre}
          </h1>
          <p className="text-gray-600">
            Panel de administración - Guzman Motors
          </p>
        </div>

        {/* Información del Usuario */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-cyan-100 rounded-lg">
              <User className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Información del Usuario
              </h2>
              <p className="text-gray-600 text-sm">
                Datos de tu cuenta en el sistema
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Nombre
              </label>
              <p className="text-gray-800 font-medium">{user.nombre}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Email
              </label>
              <p className="text-gray-800">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Rol
              </label>
              <div className="flex items-center gap-2">
                <Shield
                  className={`w-5 h-5 ${
                    user.role === "admin" ? "text-green-600" : "text-blue-600"
                  }`}
                />
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === "admin"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.role === "admin" ? "Administrador" : "Usuario"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de bienvenida según rol */}
        {isAdmin ? (
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl shadow-sm border border-cyan-200 p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-cyan-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Panel de Administrador
                </h3>
                <p className="text-gray-600">
                  Tienes acceso completo a todas las funcionalidades del
                  sistema. Utiliza el menú lateral para navegar entre las
                  diferentes secciones: Clientes, Vehículos 0km, Remolques y
                  Usados.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl shadow-sm border border-orange-200 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Acceso Limitado
                </h3>
                <p className="text-gray-600 mb-3">
                  Tu cuenta tiene permisos de usuario. Solo puedes acceder a
                  funciones de consulta y visualización de información.
                </p>
                <p className="text-sm text-orange-700 font-medium">
                  ℹ️ Para solicitar permisos de administrador, contacta al
                  administrador del sistema.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Información de funcionalidades disponibles según rol */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Funcionalidades Disponibles
          </h3>

          <div className="space-y-3">
            {isAdmin ? (
              <>
                <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-lg">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    Gestión completa de clientes (crear, editar, eliminar)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-lg">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    Gestión de vehículos 0km, remolques y usados
                  </span>
                </div>
                <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-lg">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    Subida y gestión de imágenes (Cloudinary)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-lg">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    Acceso a estadísticas y reportes completos
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 text-blue-700 bg-blue-50 p-3 rounded-lg">
                  <User className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    Visualización de información de clientes
                  </span>
                </div>
                <div className="flex items-center gap-3 text-blue-700 bg-blue-50 p-3 rounded-lg">
                  <User className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    Consulta de catálogos de vehículos
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 bg-gray-50 p-3 rounded-lg opacity-60">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium line-through">
                    Edición y eliminación de registros (requiere admin)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 bg-gray-50 p-3 rounded-lg opacity-60">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium line-through">
                    Gestión de imágenes (requiere admin)
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
