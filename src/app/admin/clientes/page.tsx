"use client";

import React from "react";
import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { EstadisticasClientes, CumpleanosHoy } from "@/components";

export default function ClientesDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dashboard de Clientes
          </h1>
          <p className="text-gray-600">
            Vista general y estadísticas de clientes
          </p>
        </div>

        {/* Estadísticas de Clientes */}
        <EstadisticasClientes />

        {/* Widget de Cumpleaños */}
        <CumpleanosHoy />

        {/* Acciones de Gestión de Clientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Gestión de Clientes
          </h2>
          <p className="text-gray-600 mb-6">
            Registrar y administrar clientes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/clientes/lista">
              <div className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Ver Clientes</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Lista completa de clientes registrados
                </p>
                <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                  Ver lista
                </div>
              </div>
            </Link>

            <Link href="/admin/clientes/crear">
              <div className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer group">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Plus className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Crear Cliente</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Registrar nuevo cliente al sistema
                </p>
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  Crear ahora
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
