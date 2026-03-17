"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  CarFront,
  Plus,
  BarChart3,
  TrendingUp,
  Eye,
  AlertCircle,
  DollarSign,
  Calendar,
  CheckCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { usadosService } from "@/services";
import { Usados } from "@/types";

interface EstadisticasUsados {
  total: number;
  disponibles: number;
  reservados: number;
  vendidosEsteMes: number;
  nuevosEsteAño: number;
}

export default function UsadosDashboard() {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  const [estadisticas, setEstadisticas] = useState<EstadisticasUsados>({
    total: 0,
    disponibles: 0,
    reservados: 0,
    vendidosEsteMes: 0,
    nuevosEsteAño: 0,
  });

  const [usadosRecientes, setUsadosRecientes] = useState<Usados[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDatosIniciales();

    // Verificar si se creó un vehículo exitosamente
    if (searchParams.get("created") === "true") {
      setShowSuccess(true);
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);

      // Cargar estadísticas básicas
      const [disponibles, reservados, recientes] = await Promise.all([
        usadosService.searchAllUsados({
          filters: { estado: "Disponible" },
          limit: 100,
        }),
        usadosService.searchAllUsados({
          filters: { estado: "Reservado" },
          limit: 100,
        }),
        usadosService.searchAllUsados({
          sortBy: "createdAt",
          sortOrder: "desc",
          limit: 5,
        }),
      ]);

      setEstadisticas({
        total: disponibles.total + reservados.total,
        disponibles: disponibles.total,
        reservados: reservados.total,
        vendidosEsteMes: 0, // TODO: Implementar cuando esté disponible en el API
        nuevosEsteAño: disponibles.total + reservados.total, // Aproximación
      });

      setUsadosRecientes(recientes.items);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={cargarDatosIniciales}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Mensaje de éxito */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-green-800 font-medium">
              ¡Vehículo usado creado exitosamente!
            </h4>
            <p className="text-green-700 text-sm mt-1">
              El nuevo vehículo usado ha sido agregado al inventario y ya está
              disponible en el sistema.
            </p>
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="text-green-600 hover:text-green-800 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <CarFront className="h-8 w-8 text-cyan-600" />
            Gestión de Vehículos Usados
          </h1>
          <p className="text-gray-600 mt-1">
            Administra el inventario completo de vehículos usados
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin/usados/crear"
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Vehículo Usado
          </Link>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Usados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usados</p>
              <p className="text-2xl font-bold text-gray-800">
                {estadisticas.total}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CarFront className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">En inventario</span>
          </div>
        </div>

        {/* Disponibles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">
                {estadisticas.disponibles}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">
              {estadisticas.total > 0
                ? `${Math.round(
                    (estadisticas.disponibles / estadisticas.total) * 100
                  )}% del total`
                : "Sin datos"}
            </span>
          </div>
        </div>

        {/* Reservados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reservados</p>
              <p className="text-2xl font-bold text-yellow-600">
                {estadisticas.reservados}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">
              {estadisticas.total > 0
                ? `${Math.round(
                    (estadisticas.reservados / estadisticas.total) * 100
                  )}% del total`
                : "Sin datos"}
            </span>
          </div>
        </div>

        {/* Nuevos Este Año */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nuevos 2025</p>
              <p className="text-2xl font-bold text-cyan-600">
                {estadisticas.nuevosEsteAño}
              </p>
            </div>
            <div className="h-12 w-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-cyan-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-cyan-500 mr-1" />
            <span className="text-cyan-600 font-medium">En catálogo</span>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas y Usados Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Acciones Rápidas */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Acciones Rápidas
            </h3>

            <div className="space-y-3">
              <Link
                href="/admin/usados/crear"
                className="w-full flex items-center gap-3 p-3 bg-cyan-50 border border-cyan-200 rounded-lg hover:bg-cyan-100 transition-colors group"
              >
                <div className="h-10 w-10 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-200">
                  <Plus className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <p className="font-medium text-cyan-800">Agregar Vehículo</p>
                  <p className="text-sm text-cyan-600">
                    Nuevo usado al catálogo
                  </p>
                </div>
              </Link>

              <Link
                href="/admin/usados/lista"
                className="w-full flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-800">Ver Inventario</p>
                  <p className="text-sm text-blue-600">
                    Lista completa de usados
                  </p>
                </div>
              </Link>

              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors group">
                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200">
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Ver Reportes</p>
                  <p className="text-sm text-gray-600">Análisis de ventas</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Usados Recientes */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Vehículos Usados Recientes
              </h3>
              <Link
                href="/admin/usados/lista"
                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
              >
                Ver todos →
              </Link>
            </div>

            {usadosRecientes.length === 0 ? (
              <div className="text-center py-8">
                <CarFront className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  No hay vehículos usados registrados
                </p>
                <Link
                  href="/admin/usados/crear"
                  className="text-cyan-600 hover:text-cyan-700 text-sm font-medium mt-2 inline-block"
                >
                  Agregar el primero
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {usadosRecientes.map((usado) => (
                  <div
                    key={usado._id}
                    className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Imagen */}
                    <div className="h-16 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {usado.imagenes && usado.imagenes.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            usado.imagenes[0].thumbnails?.small ||
                            usado.imagenes[0].secure_url
                          }
                          alt={usado.titulo || "Usado"}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <CarFront className="h-8 w-8 text-gray-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate">
                        {usado.titulo || `${usado.marca} ${usado.modelo}`}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {usado.marca} • {usado.tipoVehiculo || "N/A"} •{" "}
                        {usado.anio || "N/A"}
                      </p>
                    </div>

                    {/* Badge de estado */}
                    <div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          usado.estado === "Disponible"
                            ? "bg-green-100 text-green-800"
                            : usado.estado === "Reservado"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {usado.estado}
                      </span>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/usados/editar/${usado._id}`}
                        className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resumen por Estado */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Resumen por Estado
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Disponibles */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {estadisticas.disponibles}
              </p>
              <p className="text-sm text-green-700 mt-1 font-medium">
                Disponibles
              </p>
              <p className="text-xs text-green-600 mt-1">Listos para venta</p>
            </div>
          </div>

          {/* Reservados */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {estadisticas.reservados}
              </p>
              <p className="text-sm text-yellow-700 mt-1 font-medium">
                Reservados
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                En proceso de venta
              </p>
            </div>
          </div>

          {/* Total */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {estadisticas.total}
              </p>
              <p className="text-sm text-blue-700 mt-1 font-medium">Total</p>
              <p className="text-xs text-blue-600 mt-1">En inventario activo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
