"use client";

import { useState, useEffect } from "react";
import {
  Car,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  RefreshCw,
  Grid3X3,
  List as ListIcon,
  Calendar,
  X,
  Gauge,
  Settings,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usadosService } from "@/services";
import { Usados, UsadosSearchParams } from "@/types";

export default function ListaUsados() {
  const [usados, setUsados] = useState<Usados[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsados, setTotalUsados] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Vista y filtros
  const [vistaCards, setVistaCards] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroMarca, setFiltroMarca] = useState("Todas");
  const [filtroModelo, setFiltroModelo] = useState("Todos");
  const [filtroAnioMin, setFiltroAnioMin] = useState("");
  const [filtroAnioMax, setFiltroAnioMax] = useState("");
  const [filtroKmMin, setFiltroKmMin] = useState("");
  const [filtroKmMax, setFiltroKmMax] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Modal de confirmación
  const [usadosAEliminar, setUsadosAEliminar] = useState<string | null>(null);

  useEffect(() => {
    cargarUsados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaActual, filtroTipo, filtroMarca, filtroModelo]);

  const cargarUsados = async () => {
    try {
      setLoading(true);
      setError(null);

      const filtros: UsadosSearchParams = {
        page: paginaActual,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      if (filtroTipo !== "Todos") {
        filtros.tipoVehiculo = filtroTipo;
      }

      if (filtroMarca !== "Todas") {
        filtros.marca = filtroMarca;
      }

      if (filtroModelo !== "Todos") {
        filtros.modelo = filtroModelo;
      }

      if (filtroAnioMin) {
        filtros.anioFrom = `${filtroAnioMin}-01-01`;
      }

      if (filtroAnioMax) {
        filtros.anioTo = `${filtroAnioMax}-12-31`;
      }

      if (filtroKmMin) {
        filtros.kilometrajeMin = parseInt(filtroKmMin);
      }

      if (filtroKmMax) {
        filtros.kilometrajeMax = parseInt(filtroKmMax);
      }

      const response = await usadosService.searchAllUsados(filtros);

      setUsados(response.items);
      setTotalUsados(response.total);
      setTotalPaginas(response.pages);
    } catch (err) {
      console.error("Error cargando usados:", err);
      setError("Error al cargar los vehículos usados");
    } finally {
      setLoading(false);
    }
  };

  const handleBusqueda = async () => {
    if (!busqueda.trim()) {
      cargarUsados();
      return;
    }

    try {
      setLoading(true);

      const searchDto: UsadosSearchParams = {
        q: busqueda,
        ...(filtroTipo !== "Todos" && { tipoVehiculo: filtroTipo }),
        ...(filtroMarca !== "Todas" && { marca: filtroMarca }),
        ...(filtroModelo !== "Todos" && { modelo: filtroModelo }),
        ...(filtroAnioMin && { anioFrom: `${filtroAnioMin}-01-01` }),
        ...(filtroAnioMax && { anioTo: `${filtroAnioMax}-12-31` }),
        ...(filtroKmMin && { kilometrajeMin: parseInt(filtroKmMin) }),
        ...(filtroKmMax && { kilometrajeMax: parseInt(filtroKmMax) }),
        page: 1,
        limit: 20,
      };

      const response = await usadosService.searchAllUsados(searchDto);

      setUsados(response.items);
      setTotalUsados(response.total);
      setTotalPaginas(response.pages);
      setPaginaActual(1);
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setError("Error al buscar vehículos usados");
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroTipo("Todos");
    setFiltroMarca("Todas");
    setFiltroModelo("Todos");
    setFiltroAnioMin("");
    setFiltroAnioMax("");
    setFiltroKmMin("");
    setFiltroKmMax("");
    setPaginaActual(1);
    cargarUsados();
  };

  const handleEliminar = async (id: string) => {
    try {
      await usadosService.deleteUsados(id);
      setUsadosAEliminar(null);
      cargarUsados();
    } catch (err) {
      console.error("Error eliminando vehículo usado:", err);
      alert("Error al eliminar el vehículo usado");
    }
  };

  const formatearAnio = (anio?: number | Date | string) => {
    if (!anio) return "N/A";
    // Si es número, devolverlo directamente
    if (typeof anio === "number") return anio;
    // Si es string o Date, usar getFullYear (compatibilidad)
    return new Date(anio).getFullYear();
  };

  const formatearKilometraje = (km?: number) => {
    if (!km) return "N/A";
    return `${km.toLocaleString()} km`;
  };

  if (loading && usados.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-cyan-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando vehículos usados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Car className="h-6 w-6 text-cyan-600" />
            Vehículos Usados
          </h1>
          <p className="text-gray-600 mt-1">
            {totalUsados} vehículo{totalUsados !== 1 ? "s" : ""} usado
            {totalUsados !== 1 ? "s" : ""} registrado
            {totalUsados !== 1 ? "s" : ""}
          </p>
        </div>

        <Link
          href="/admin/usados/crear"
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo Vehículo Usado
        </Link>
      </div>

      {/* Barra de búsqueda y controles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBusqueda()}
              placeholder="Buscar por marca, modelo, tipo..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBusqueda}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Buscar
            </button>

            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                mostrarFiltros
                  ? "bg-cyan-100 text-cyan-700 border border-cyan-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Filter className="h-4 w-4" />
              Filtros
            </button>

            <button
              onClick={() => setVistaCards(!vistaCards)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {vistaCards ? (
                <ListIcon className="h-4 w-4" />
              ) : (
                <Grid3X3 className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={cargarUsados}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Panel de Filtros */}
        {mostrarFiltros && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <input
                  type="text"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  placeholder="SUV, Sedán, Pick-up..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Marca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <input
                  type="text"
                  value={filtroMarca}
                  onChange={(e) => setFiltroMarca(e.target.value)}
                  placeholder="Toyota, Ford, Chevrolet..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo
                </label>
                <input
                  type="text"
                  value={filtroModelo}
                  onChange={(e) => setFiltroModelo(e.target.value)}
                  placeholder="Hilux, Ranger, S10..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Año Mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año desde
                </label>
                <input
                  type="number"
                  value={filtroAnioMin}
                  onChange={(e) => setFiltroAnioMin(e.target.value)}
                  placeholder="2015"
                  min="1990"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Año Máximo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año hasta
                </label>
                <input
                  type="number"
                  value={filtroAnioMax}
                  onChange={(e) => setFiltroAnioMax(e.target.value)}
                  placeholder={new Date().getFullYear().toString()}
                  min="1990"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Kilometraje Mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Km desde
                </label>
                <input
                  type="number"
                  value={filtroKmMin}
                  onChange={(e) => setFiltroKmMin(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Kilometraje Máximo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Km hasta
                </label>
                <input
                  type="number"
                  value={filtroKmMax}
                  onChange={(e) => setFiltroKmMax(e.target.value)}
                  placeholder="200000"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={cargarUsados}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={limpiarFiltros}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Limpiar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-800 font-medium">Error</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Vista Cards */}
      {vistaCards ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {usados.map((usado) => (
            <div
              key={usado._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Imagen */}
              <div className="relative h-48 bg-gray-100">
                {usado.imagenes && usado.imagenes.length > 0 ? (
                  <Image
                    src={usado.imagenes[0].secure_url}
                    alt={usado.titulo || `${usado.marca} ${usado.modelo}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="h-16 w-16 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">
                  {usado.titulo || `${usado.marca} ${usado.modelo}`}
                </h3>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Año: {formatearAnio(usado.anio)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-gray-400" />
                    <span>{formatearKilometraje(usado.kilometraje)}</span>
                  </div>
                  {usado.tipoVehiculo && (
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-400" />
                      <span>{usado.tipoVehiculo}</span>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/usados/${usado._id}`}
                    target="_blank"
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm flex items-center justify-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    Ver
                  </Link>
                  <Link
                    href={`/admin/usados/editar/${usado._id}`}
                    className="flex-1 px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-center text-sm flex items-center justify-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Link>
                  <button
                    onClick={() => setUsadosAEliminar(usado._id!)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Vista Tabla */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marca
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modelo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Año
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kilometraje
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usados.map((usado) => (
                  <tr key={usado._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {usado.imagenes && usado.imagenes.length > 0 ? (
                            <Image
                              src={usado.imagenes[0].secure_url}
                              alt={
                                usado.titulo || `${usado.marca} ${usado.modelo}`
                              }
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="h-8 w-8 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-1">
                            {usado.titulo || `${usado.marca} ${usado.modelo}`}
                          </p>
                          {usado.version && (
                            <p className="text-sm text-gray-500">
                              {usado.version}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {usado.marca}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {usado.modelo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatearAnio(usado.anio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatearKilometraje(usado.kilometraje)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {usado.tipoVehiculo || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/usados/${usado._id}`}
                          target="_blank"
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Ver público"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/usados/editar/${usado._id}`}
                          className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setUsadosAEliminar(usado._id!)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sin resultados */}
      {!loading && usados.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No se encontraron vehículos usados
          </h3>
          <p className="text-gray-600 mb-6">
            {busqueda
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza creando tu primer vehículo usado"}
          </p>
          {!busqueda && (
            <Link
              href="/admin/usados/crear"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Crear Vehículo Usado
            </Link>
          )}
        </div>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            Mostrando página {paginaActual} de {totalPaginas}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
              disabled={paginaActual === 1}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() =>
                setPaginaActual(Math.min(totalPaginas, paginaActual + 1))
              }
              disabled={paginaActual === totalPaginas}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {usadosAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Eliminar vehículo usado?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Esta acción no se puede deshacer. El vehículo usado y todos
                  sus archivos multimedia serán eliminados permanentemente.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEliminar(usadosAEliminar)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                  <button
                    onClick={() => setUsadosAEliminar(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
