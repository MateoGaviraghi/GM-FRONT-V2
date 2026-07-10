"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Truck,
  Plus,
  BarChart3,
  TrendingUp,
  Eye,
  DollarSign,
  Calendar,
  CheckCircle,
  X,
} from "lucide-react";
import { remolqueService } from "@/services";
import { Remolque } from "@/types";
import {
  AdminButton,
  Badge,
  type BadgeVariant,
  Breadcrumb,
  mapApiError,
  Skeleton,
} from "@/components/admin/kit";

function estadoBadgeVariant(estado?: string): BadgeVariant {
  if (estado === "Disponible") return "success";
  if (estado === "Reservado") return "warn";
  return "default";
}

interface EstadisticasRemolques {
  total: number;
  disponibles: number;
  reservados: number;
  vendidosEsteMes: number;
  nuevosEsteAño: number;
}

export default function RemolquesDashboard() {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  const [estadisticas, setEstadisticas] = useState<EstadisticasRemolques>({
    total: 0,
    disponibles: 0,
    reservados: 0,
    vendidosEsteMes: 0,
    nuevosEsteAño: 0,
  });

  const [remolquesRecientes, setRemolquesRecientes] = useState<Remolque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDatosIniciales();

    // Verificar si se creó un remolque exitosamente
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
        remolqueService.getAllRemolques({ estado: "Disponible", limit: 100 }),
        remolqueService.getAllRemolques({ estado: "Reservado", limit: 100 }),
        remolqueService.getAllRemolques({
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

      setRemolquesRecientes(recientes.items);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError(mapApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-9 w-64" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md space-y-4 rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <h2 className="text-[20px] font-semibold text-gray-900">
            No pudimos cargar el panel
          </h2>
          <p className="text-[17px] text-gray-500">{error}</p>
          <AdminButton variant="primary" onClick={cargarDatosIniciales}>
            Reintentar
          </AdminButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Remolques" }]} />

      {/* Mensaje de éxito */}
      {showSuccess ? (
        <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle className="size-5" strokeWidth={1.75} aria-hidden />
          </div>
          <div className="flex-1">
            <h4 className="text-[17px] font-semibold text-gray-900">
              ¡Remolque creado correctamente!
            </h4>
            <p className="text-[16px] text-gray-500">
              El nuevo remolque se agregó al inventario y ya está disponible en
              el sistema.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccess(false)}
            className="flex shrink-0 items-center gap-1 text-[16px] font-semibold text-gray-500 transition-colors duration-150 hover:text-gray-900"
          >
            <X className="size-4" strokeWidth={2} />
            Cerrar
          </button>
        </div>
      ) : null}

      {/* Header */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-gray-900">
            Gestión de remolques
          </h1>
          <p className="mt-1.5 text-[16px] text-gray-500">
            Administrá el inventario completo de remolques
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <AdminButton variant="secondary" icon={Eye} href="/admin/remolques/lista">
            Ver todos
          </AdminButton>
          <AdminButton variant="primary" icon={Plus} href="/admin/remolques/crear">
            Nuevo remolque
          </AdminButton>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-gray-500">Total remolques</p>
              <p className="text-[28px] font-semibold tracking-tight text-gray-900">{estadisticas.total}</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Truck className="size-5" strokeWidth={1.75} aria-hidden />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[16px]">
            <TrendingUp className="size-4 text-emerald-600" strokeWidth={2} aria-hidden />
            <span className="font-semibold text-emerald-700">En inventario</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-gray-500">Disponibles</p>
              <p className="text-[28px] font-semibold tracking-tight text-gray-900">
                {estadisticas.disponibles}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <BarChart3 className="size-5" strokeWidth={1.75} aria-hidden />
            </div>
          </div>
          <div className="mt-4 text-[16px] text-gray-500">
            {estadisticas.total > 0
              ? `${Math.round((estadisticas.disponibles / estadisticas.total) * 100)}% del total`
              : "Sin datos"}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-gray-500">Reservados</p>
              <p className="text-[28px] font-semibold tracking-tight text-gray-900">
                {estadisticas.reservados}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Calendar className="size-5" strokeWidth={1.75} aria-hidden />
            </div>
          </div>
          <div className="mt-4 text-[16px] text-gray-500">
            {estadisticas.total > 0
              ? `${Math.round((estadisticas.reservados / estadisticas.total) * 100)}% del total`
              : "Sin datos"}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-gray-500">Nuevos este año</p>
              <p className="text-[28px] font-semibold tracking-tight text-gray-900">
                {estadisticas.nuevosEsteAño}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <DollarSign className="size-5" strokeWidth={1.75} aria-hidden />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[16px]">
            <TrendingUp className="size-4 text-indigo-600" strokeWidth={2} aria-hidden />
            <span className="font-semibold text-indigo-600">En catálogo</span>
          </div>
        </div>
      </div>

      {/* Acciones rápidas y remolques recientes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-1">
          <h3 className="mb-4 text-[16.5px] font-semibold text-gray-900">Acciones rápidas</h3>

          <div className="space-y-3">
            <AdminButton
              variant="secondary"
              icon={Plus}
              href="/admin/remolques/crear"
              className="w-full justify-start"
            >
              Agregar remolque
            </AdminButton>
            <AdminButton
              variant="secondary"
              icon={Eye}
              href="/admin/remolques/lista"
              className="w-full justify-start"
            >
              Ver inventario completo
            </AdminButton>
          </div>
        </div>

        {/* Remolques recientes */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[16.5px] font-semibold text-gray-900">Remolques recientes</h3>
              <AdminButton variant="secondary" href="/admin/remolques/lista" className="h-10 px-3 text-[16px]">
                Ver todos
              </AdminButton>
            </div>

            {remolquesRecientes.length === 0 ? (
              <div className="py-8 text-center">
                <Truck className="mx-auto mb-3 size-12 text-gray-300" strokeWidth={1.5} aria-hidden />
                <p className="text-[16px] text-gray-500">No hay remolques registrados</p>
                <div className="mt-3 inline-block">
                  <AdminButton variant="secondary" icon={Plus} href="/admin/remolques/crear">
                    Agregar el primero
                  </AdminButton>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {remolquesRecientes.map((remolque) => (
                  <div
                    key={remolque._id}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 p-3 transition-colors duration-150 hover:bg-gray-50/70"
                  >
                    <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                      {remolque.imagenes && remolque.imagenes.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            remolque.imagenes[0].thumbnails?.small ||
                            remolque.imagenes[0].secure_url
                          }
                          alt={remolque.titulo || "Remolque"}
                          className="size-full object-cover"
                        />
                      ) : (
                        <Truck className="size-6 text-gray-400" strokeWidth={1.75} aria-hidden />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-[16px] font-semibold text-gray-900">
                        {remolque.titulo}
                      </h4>
                      <p className="text-[16px] text-gray-500">
                        {remolque.categoria || "Sin categoría"} •{" "}
                        {remolque.marca || "Sin marca"}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {remolque.condicion ? (
                          <Badge variant={remolque.condicion === "0KM" ? "petrol" : "default"}>
                            {remolque.condicion}
                          </Badge>
                        ) : null}
                        {remolque.estado ? (
                          <Badge variant={estadoBadgeVariant(remolque.estado)}>
                            {remolque.estado}
                          </Badge>
                        ) : null}
                        {remolque.createdAt ? (
                          <span className="text-[16px] text-gray-400">
                            {new Date(remolque.createdAt).toLocaleDateString("es-AR")}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <AdminButton
                      variant="secondary"
                      href={`/admin/remolques/editar/${remolque._id}`}
                      className="h-10 px-3 text-[16px]"
                    >
                      Editar
                    </AdminButton>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resumen por estado */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-[16.5px] font-semibold text-gray-900">Resumen por estado</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-[28px] font-semibold tracking-tight text-gray-900">
              {estadisticas.disponibles}
            </div>
            <div className="text-[16px] font-semibold text-gray-900">Disponibles</div>
            <div className="mt-1 text-[16px] text-gray-500">Listos para venta</div>
          </div>

          <div className="rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-[28px] font-semibold tracking-tight text-gray-900">
              {estadisticas.reservados}
            </div>
            <div className="text-[16px] font-semibold text-gray-900">Reservados</div>
            <div className="mt-1 text-[16px] text-gray-500">En proceso de venta</div>
          </div>

          <div className="rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-[28px] font-semibold tracking-tight text-gray-900">
              {estadisticas.total}
            </div>
            <div className="text-[16px] font-semibold text-gray-900">Total</div>
            <div className="mt-1 text-[16px] text-gray-500">En inventario activo</div>
          </div>
        </div>
      </div>
    </div>
  );
}
