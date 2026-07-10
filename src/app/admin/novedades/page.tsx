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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { novedadService } from "@/services";
import { Novedad } from "@/types";
import { AdminButton, Badge } from "@/components/admin/kit";

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
        <Loader2 className="size-6 animate-spin text-gray-400" strokeWidth={2} aria-hidden />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-[16px] text-gray-500 mb-4">{error}</p>
          <AdminButton variant="primary" onClick={cargarDatosIniciales}>
            Reintentar
          </AdminButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mensaje de éxito */}
      {showSuccess && (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle className="size-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="flex-1">
            <h4 className="text-[16px] font-medium text-gray-900">{successMessage}</h4>
            <p className="text-[16px] text-gray-500 mt-1">
              Los cambios se han guardado correctamente en el sistema.
            </p>
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="text-gray-400 hover:text-gray-900 transition-colors duration-150 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-gray-900">
              Gestión de Novedades
            </h1>
            <p className="mt-1.5 text-[16px] text-gray-500">
              Administra noticias, eventos y actualizaciones de Guzman Motors
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <AdminButton variant="secondary" icon={Eye} href="/admin/novedades/lista">
              Ver Todas
            </AdminButton>
            {estadisticas.eliminadas > 0 && (
              <AdminButton
                variant="danger"
                icon={Trash2}
                href="/admin/novedades/eliminadas"
                className="border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
              >
                Eliminadas ({estadisticas.eliminadas})
              </AdminButton>
            )}
            <AdminButton variant="primary" icon={Plus} href="/admin/novedades/crear">
              Nueva Novedad
            </AdminButton>
          </div>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total de Novedades */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-gray-500">
                Total Novedades
              </p>
              <p className="mt-3 text-[28px] font-semibold leading-none tracking-tight text-gray-900">
                {estadisticas.total}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <Newspaper className="size-5" strokeWidth={1.75} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[15px]">
            <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
            <span className="text-emerald-600 font-medium">Activas</span>
          </div>
        </div>

        {/* Destacadas */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-gray-500">Destacadas</p>
              <p className="mt-3 text-[28px] font-semibold leading-none tracking-tight text-gray-900">
                {estadisticas.destacadas}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Star className="size-5" strokeWidth={1.75} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[15px]">
            <span className="text-gray-500">En portada</span>
          </div>
        </div>

        {/* Publicadas este mes */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-gray-500">Este Mes</p>
              <p className="mt-3 text-[28px] font-semibold leading-none tracking-tight text-gray-900">
                {estadisticas.publicadasEsteMes}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Calendar className="size-5" strokeWidth={1.75} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[15px]">
            <span className="text-gray-500">Publicadas</span>
          </div>
        </div>

        {/* Total de Vistas */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-gray-500">Vistas</p>
              <p className="mt-3 text-[28px] font-semibold leading-none tracking-tight text-gray-900">
                {estadisticas.vistasTotal.toLocaleString()}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Eye className="size-5" strokeWidth={1.75} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[15px]">
            <span className="text-gray-500">Acumuladas</span>
          </div>
        </div>

        {/* Eliminadas */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-gray-500">Eliminadas</p>
              <p className="mt-3 text-[28px] font-semibold leading-none tracking-tight text-gray-900">
                {estadisticas.eliminadas}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <Trash2 className="size-5" strokeWidth={1.75} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[15px]">
            <span className="text-gray-500">Ocultas</span>
          </div>
        </div>
      </div>

      {/* Novedades Recientes */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16.5px] font-semibold text-gray-900">
            Novedades Recientes
          </h2>
          <Link
            href="/admin/novedades/lista"
            className="text-[14.5px] font-medium text-gray-500 transition-colors duration-150 hover:text-gray-900"
          >
            Ver todas →
          </Link>
        </div>

        {novedadesRecientes.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[16px] text-gray-500 mb-4">
              No hay novedades publicadas aún
            </p>
            <AdminButton variant="primary" icon={Plus} href="/admin/novedades/crear">
              Crear Primera Novedad
            </AdminButton>
          </div>
        ) : (
          <div className="space-y-4">
            {novedadesRecientes.map((novedad) => (
              <div
                key={novedad._id}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white transition-colors duration-150 hover:bg-gray-50/70"
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
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-50 flex items-center justify-center">
                      <Newspaper className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Link
                        href={`/admin/novedades/editar/${novedad._id}`}
                        className="text-lg font-semibold text-gray-900 transition-colors duration-150 hover:text-gray-600 line-clamp-1"
                      >
                        {novedad.titulo}
                      </Link>
                      {novedad.resumen && (
                        <p className="text-[16px] text-gray-500 mt-1 line-clamp-2">
                          {novedad.resumen}
                        </p>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex gap-2 flex-shrink-0">
                      {novedad.destacada && (
                        <Badge variant="petrol">Destacada</Badge>
                      )}
                      {novedad.deleted && (
                        <Badge variant="danger">Eliminada</Badge>
                      )}
                    </div>
                  </div>

                  {/* Metadatos */}
                  <div className="flex items-center gap-4 mt-2 text-[16px] text-gray-500">
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
