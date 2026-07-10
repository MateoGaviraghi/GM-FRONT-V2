"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/admin/kit";
import { BarChart3, Users, MapPin, Car, Building, AlertCircle } from "lucide-react";
import { ClienteService } from "@/services";

interface StatsData {
  group: Record<string, string | number | null>;
  count: number;
}

function RankingList({
  title,
  icon: Icon,
  items,
  fieldKey,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  items: StatsData[];
  fieldKey: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-[16.5px] font-semibold text-gray-900">
        <Icon className="size-5 text-gray-400" strokeWidth={1.75} />
        {title}
      </div>
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[13px] font-semibold text-gray-600">
                  {index + 1}
                </span>
                <span className="text-[16px] font-medium text-gray-900">
                  {item.group[fieldKey] || "Sin especificar"}
                </span>
              </div>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[13px] font-medium text-gray-600">
                {item.count}
              </span>
            </div>
          ))
        ) : (
          <p className="py-4 text-center text-[16px] text-gray-500">No hay datos disponibles</p>
        )}
      </div>
    </div>
  );
}

export function EstadisticasClientes() {
  const [totalClientes, setTotalClientes] = useState<number>(0);
  const [provincias, setProvincias] = useState<StatsData[]>([]);
  const [tiposVehiculo, setTiposVehiculo] = useState<StatsData[]>([]);
  const [marcas, setMarcas] = useState<StatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar todas las estadísticas en paralelo
        const [totalCount, statsProvincias, statsTiposVehiculo, statsMarcas] =
          await Promise.all([
            ClienteService.count(),
            ClienteService.stats({ groupBy: ["provincia"], limit: 5 }),
            ClienteService.stats({ groupBy: ["tipoVehiculo"], limit: 5 }),
            ClienteService.stats({ groupBy: ["marca"], limit: 5 }),
          ]);

        setTotalClientes(totalCount);
        setProvincias(statsProvincias);
        setTiposVehiculo(statsTiposVehiculo);
        setMarcas(statsMarcas);
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
        setError(
          err instanceof Error ? err.message : "Error al cargar estadísticas"
        );
      } finally {
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <p className="text-center text-[16px] text-gray-500">Cargando estadísticas…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" strokeWidth={2} aria-hidden />
        <p className="text-[16px] font-medium text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[14px] text-gray-500">Total clientes</p>
              <p className="mt-1 text-[28px] font-semibold tracking-tight text-gray-900">
                {totalClientes.toLocaleString()}
              </p>
            </div>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[14px] text-gray-500">Top provincia</p>
              <p className="mt-1 text-[20px] font-semibold tracking-tight text-gray-900">
                {provincias[0]?.group.provincia || "Sin datos"}
              </p>
              <p className="text-[15px] text-gray-500">{provincias[0]?.count || 0} clientes</p>
            </div>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <MapPin className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[14px] text-gray-500">Top vehículo</p>
              <p className="mt-1 text-[20px] font-semibold tracking-tight text-gray-900">
                {tiposVehiculo[0]?.group.tipoVehiculo || "Sin datos"}
              </p>
              <p className="text-[15px] text-gray-500">{tiposVehiculo[0]?.count || 0} clientes</p>
            </div>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Car className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[14px] text-gray-500">Top marca</p>
              <p className="mt-1 text-[20px] font-semibold tracking-tight text-gray-900">
                {marcas[0]?.group.marca || "Sin datos"}
              </p>
              <p className="text-[15px] text-gray-500">{marcas[0]?.count || 0} clientes</p>
            </div>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <Building className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
          </div>
        </div>
      </div>

      {/* Rankings detallados */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <RankingList title="Top provincias" icon={MapPin} items={provincias} fieldKey="provincia" />
        <RankingList title="Tipos de vehículo" icon={Car} items={tiposVehiculo} fieldKey="tipoVehiculo" />
        <RankingList title="Top marcas" icon={Building} items={marcas} fieldKey="marca" />
      </div>

      {/* Resumen de estadísticas */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <BarChart3 className="size-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <h3 className="text-[16.5px] font-semibold text-gray-900">Resumen de estadísticas</h3>
            <p className="text-[16px] text-gray-500">
              Datos actualizados en tiempo real desde la base de datos. Total de {totalClientes} clientes
              registrados distribuidos en {provincias.length} provincias diferentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EstadisticasClientes;
