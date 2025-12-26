"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, MapPin, Car, Building } from "lucide-react";
import { ClienteService } from "@/services";

interface StatsData {
  group: Record<string, string | number | null>;
  count: number;
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
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando estadísticas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Clientes */}
        <Card className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-medium">
                  Total Clientes
                </p>
                <p className="text-3xl font-bold">
                  {totalClientes.toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-cyan-200" />
            </div>
          </CardContent>
        </Card>

        {/* Top Provincia */}
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  Top Provincia
                </p>
                <p className="text-xl font-bold">
                  {provincias[0]?.group.provincia || "Sin datos"}
                </p>
                <p className="text-green-200 text-sm">
                  {provincias[0]?.count || 0} clientes
                </p>
              </div>
              <MapPin className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        {/* Top Vehículo */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  Top Vehículo
                </p>
                <p className="text-xl font-bold">
                  {tiposVehiculo[0]?.group.tipoVehiculo || "Sin datos"}
                </p>
                <p className="text-purple-200 text-sm">
                  {tiposVehiculo[0]?.count || 0} clientes
                </p>
              </div>
              <Car className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        {/* Top Marca */}
        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Top Marca</p>
                <p className="text-xl font-bold">
                  {marcas[0]?.group.marca || "Sin datos"}
                </p>
                <p className="text-orange-200 text-sm">
                  {marcas[0]?.count || 0} clientes
                </p>
              </div>
              <Building className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rankings detallados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Provincias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <MapPin className="w-5 h-5" />
              Top Provincias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {provincias.length > 0 ? (
                provincias.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-slate-700">
                        {item.group.provincia || "Sin especificar"}
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {item.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4">
                  No hay datos disponibles
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Tipos de Vehículo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Car className="w-5 h-5" />
              Tipos de Vehículo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tiposVehiculo.length > 0 ? (
                tiposVehiculo.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-slate-700">
                        {item.group.tipoVehiculo || "Sin especificar"}
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {item.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4">
                  No hay datos disponibles
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Marcas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Building className="w-5 h-5" />
              Top Marcas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marcas.length > 0 ? (
                marcas.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-slate-700">
                        {item.group.marca || "Sin especificar"}
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      {item.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-4">
                  No hay datos disponibles
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de estadísticas */}
      <Card className="bg-slate-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-slate-600" />
            <div>
              <h3 className="font-medium text-slate-900">
                Resumen de Estadísticas
              </h3>
              <p className="text-sm text-slate-600">
                Datos actualizados en tiempo real desde la base de datos. Total
                de {totalClientes} clientes registrados distribuidos en{" "}
                {provincias.length} provincias diferentes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EstadisticasClientes;
