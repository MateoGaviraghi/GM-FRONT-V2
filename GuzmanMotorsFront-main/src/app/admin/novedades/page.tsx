"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Newspaper,
  Plus,
  TrendingUp,
  Eye,
  AlertCircle,
  Calendar,
  CheckCircle,
  X,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { novedadService } from "@/services";
import { Novedad } from "@/types";

interface EstadisticasNovedades {
  total: number;
  destacadas: number;
  publicadasEsteMes: number;
  vistasTotal: number;
  eliminadas: number;
}

export default function NovedadesDashboard() {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [estadisticas, setEstadisticas] = useState<EstadisticasNovedades>({
    total: 0,
    destacadas: 0,
    publicadasEsteMes: 0,
    vistasTotal: 0,
    eliminadas: 0,
  });

  const [novedadesRecientes, setNovedadesRecientes] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDatosIniciales();

    // Verificar mensajes de éxito
    const created = searchParams.get("created");
    const updated = searchParams.get("updated");
    const deleted = searchParams.get("deleted");
    const restored = searchParams.get("restored");

    if (created === "true") {
      setSuccessMessage("¡Novedad creada exitosamente!");
      setShowSuccess(true);
    } else if (updated === "true") {
      setSuccessMessage("¡Novedad actualizada exitosamente!");
      setShowSuccess(true);
    } else if (deleted === "true") {
      setSuccessMessage("¡Novedad eliminada correctamente!");
      setShowSuccess(true);
    } else if (restored === "true") {
      setSuccessMessage("¡Novedad restaurada exitosamente!");
      setShowSuccess(true);
    }

    if (showSuccess) {
      setTimeout(() => setShowSuccess(false), 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);

      // Cargar todas las novedades (incluyendo eliminadas para estadísticas)
      const [todasNovedades, destacadas, recientes] = await Promise.all([
        novedadService.admin.list({ limit: 1000, includeDeleted: true }),
        novedadService.admin.getFeatured(100),
        novedadService.admin.getRecent(5),
      ]);

      // Calcular estadísticas
      const activas = todasNovedades.items.filter((n) => !n.deleted);
      const eliminadas = todasNovedades.items.filter((n) => n.deleted);
      const vistasTotal = activas.reduce((sum, n) => sum + n.vistas, 0);

      // Novedades del mes actual
      const mesActual = new Date().getMonth();
      const añoActual = new Date().getFullYear();
      const publicadasEsteMes = activas.filter((n) => {
        const fecha = new Date(n.fechaPublicacion);
        return (
          fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual
        );
      }).length;

      setEstadisticas({
        total: activas.length,
        destacadas: destacadas.filter((n) => !n.deleted).length,
        publicadasEsteMes,
        vistasTotal,
        eliminadas: eliminadas.length,
      });

      setNovedadesRecientes(recientes);
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
            <h4 className="text-green-800 font-medium">{successMessage}</h4>
            <p className="text-green-700 text-sm mt-1">
              Los cambios se han guardado correctamente en el sistema.
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
            <Newspaper className="h-8 w-8 text-cyan-600" />
            Gestión de Novedades
          </h1>
          <p className="text-gray-600 mt-1">
            Administra noticias, eventos y actualizaciones de Guzman Motors
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin/novedades/lista"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Ver Todas
          </Link>
          {estadisticas.eliminadas > 0 && (
            <Link
              href="/admin/novedades/eliminadas"
              className="px-4 py-2 bg-red-50 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Eliminadas ({estadisticas.eliminadas})
            </Link>
          )}
          <Link
            href="/admin/novedades/crear"
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Novedad
          </Link>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total de Novedades */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Novedades
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {estadisticas.total}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Newspaper className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">Activas</span>
          </div>
        </div>

        {/* Destacadas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Destacadas</p>
              <p className="text-2xl font-bold text-yellow-600">
                {estadisticas.destacadas}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">En portada</span>
          </div>
        </div>

        {/* Publicadas este mes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Este Mes</p>
              <p className="text-2xl font-bold text-purple-600">
                {estadisticas.publicadasEsteMes}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">Publicadas</span>
          </div>
        </div>

        {/* Total de Vistas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vistas</p>
              <p className="text-2xl font-bold text-indigo-600">
                {estadisticas.vistasTotal.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">Acumuladas</span>
          </div>
        </div>

        {/* Eliminadas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Eliminadas</p>
              <p className="text-2xl font-bold text-red-600">
                {estadisticas.eliminadas}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">Ocultas</span>
          </div>
        </div>
      </div>

      {/* Novedades Recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Novedades Recientes
          </h2>
          <Link
            href="/admin/novedades/lista"
            className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
          >
            Ver todas →
          </Link>
        </div>

        {novedadesRecientes.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              No hay novedades publicadas aún
            </p>
            <Link
              href="/admin/novedades/crear"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
              <Plus className="h-4 w-4" />
              Crear Primera Novedad
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {novedadesRecientes.map((novedad) => (
              <div
                key={novedad._id}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-cyan-300 hover:shadow-sm transition-all"
              >
                {/* Imagen */}
                <div className="flex-shrink-0">
                  {novedad.imagenes && novedad.imagenes.length > 0 ? (
                    <Image
                      src={
                        novedad.imagenes[0].thumbnails?.small ||
                        novedad.imagenes[0].secure_url
                      }
                      alt={novedad.titulo}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Newspaper className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Link
                        href={`/admin/novedades/editar/${novedad._id}`}
                        className="text-lg font-semibold text-gray-800 hover:text-cyan-600 line-clamp-1"
                      >
                        {novedad.titulo}
                      </Link>
                      {novedad.resumen && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {novedad.resumen}
                        </p>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex gap-2 flex-shrink-0">
                      {novedad.destacada && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                          <Star className="h-3 w-3" />
                          Destacada
                        </span>
                      )}
                      {novedad.deleted && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                          <Trash2 className="h-3 w-3" />
                          Eliminada
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadatos */}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    {novedad.categoria && (
                      <span className="flex items-center gap-1">
                        <span className="font-medium">{novedad.categoria}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(novedad.fechaPublicacion).toLocaleDateString(
                        "es-AR"
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {novedad.vistas} vistas
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
