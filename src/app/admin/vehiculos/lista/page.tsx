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
} from "lucide-react";
import Link from "next/link";
import { vehiculoService } from "@/services";
import {
  Vehiculo0km,
  VehiculoFilters,
  EstadoVehiculo,
} from "@/types";

export default function ListaVehiculosAvanzada() {
  const [vehiculos, setVehiculos] = useState<Vehiculo0km[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVehiculos, setTotalVehiculos] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Vista y filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoVehiculo | "Todos">(
    "Todos"
  );
  const [filtroMarca, setFiltroMarca] = useState("Todas");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarVehiculos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaActual, filtroEstado, filtroMarca]);

  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      setError(null);

      const filtros: VehiculoFilters = {
        page: paginaActual,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      if (filtroEstado !== "Todos") {
        filtros.estado = filtroEstado;
      }

      if (filtroMarca !== "Todas") {
        filtros.marca = filtroMarca;
      }

      const response = await vehiculoService.getAllVehiculos(filtros);

      setVehiculos(response.items);
      setTotalVehiculos(response.total);
      setTotalPaginas(response.pages);
    } catch (err) {
      console.error("Error cargando vehículos:", err);
      setError("Error al cargar los vehículos");
    } finally {
      setLoading(false);
    }
  };

  const handleBusqueda = async () => {
    if (!busqueda.trim()) {
      cargarVehiculos();
      return;
    }

    try {
      setLoading(true);

      const searchDto = {
        q: busqueda,
        filters: {
          ...(filtroEstado !== "Todos" && { estado: filtroEstado }),
          ...(filtroMarca !== "Todas" && { marca: filtroMarca }),
        },
        page: 1,
        limit: 20,
      };

      const response = await vehiculoService.searchAllVehiculos(searchDto);

      setVehiculos(response.items);
      setTotalVehiculos(response.total);
      setTotalPaginas(response.pages);
      setPaginaActual(1);
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setError("Error al buscar vehículos");
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroEstado("Todos");
    setFiltroMarca("Todas");
    setPaginaActual(1);
    cargarVehiculos();
  };

  const getEstadoBadge = (estado: EstadoVehiculo) => {
    const colors = {
      Disponible: "bg-green-100 text-green-800 border-green-200",
      Reservado: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Vendido: "bg-red-100 text-red-800 border-red-200",
    };

    return colors[estado] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading && vehiculos.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-cyan-600 mx-auto mb-2" />
            <p className="text-gray-600">Cargando vehículos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Lista de Vehículos
          </h1>
          <p className="text-gray-600 mt-1">
            {totalVehiculos} vehículo{totalVehiculos !== 1 ? "s" : ""} en total
          </p>
        </div>

        <Link
          href="/admin/vehiculos/crear"
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2 w-fit"
        >
          <Plus className="h-4 w-4" />
          Nuevo Vehículo
        </Link>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por marca, modelo, título..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleBusqueda()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
            <button
              onClick={handleBusqueda}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Buscar
            </button>
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </button>
          </div>

          {/* Filtros expandidos */}
          {mostrarFiltros && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={filtroEstado}
                  onChange={(e) =>
                    setFiltroEstado(e.target.value as EstadoVehiculo | "Todos")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="Disponible">Disponible</option>
                  <option value="Reservado">Reservado</option>
                  <option value="Vendido">Vendido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca
                </label>
                <select
                  value={filtroMarca}
                  onChange={(e) => setFiltroMarca(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="Todas">Todas las marcas</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Volkswagen">Volkswagen</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={limpiarFiltros}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-700">{error}</span>
          <button
            onClick={cargarVehiculos}
            className="ml-auto text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Lista de Vehículos */}
      {vehiculos.length === 0 && !loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No hay vehículos
          </h3>
          <p className="text-gray-600 mb-4">
            {busqueda || filtroEstado !== "Todos" || filtroMarca !== "Todas"
              ? "No se encontraron vehículos con los filtros aplicados"
              : "Aún no hay vehículos registrados en el sistema"}
          </p>
          <div className="flex gap-3 justify-center">
            {(busqueda ||
              filtroEstado !== "Todos" ||
              filtroMarca !== "Todas") && (
              <button
                onClick={limpiarFiltros}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Limpiar Filtros
              </button>
            )}
            <Link
              href="/admin/vehiculos/crear"
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Agregar Vehículo
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehiculos.map((vehiculo) => (
                  <tr key={vehiculo._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mr-4">
                          <Car className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vehiculo.titulo ||
                              `${vehiculo.marca} ${vehiculo.modelo}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehiculo.marca} • {vehiculo.tipos}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getEstadoBadge(
                          vehiculo.estado
                        )}`}
                      >
                        {vehiculo.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>
                          {vehiculo.tipoCombustible} • {vehiculo.transmisiones}
                        </div>
                        {vehiculo.anio && (
                          <div className="text-gray-500">
                            {new Date(vehiculo.anio).getFullYear()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehiculo.createdAt &&
                        new Date(vehiculo.createdAt).toLocaleDateString(
                          "es-AR"
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2 justify-end">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/admin/vehiculos/editar/${vehiculo._id}`}
                          className="text-cyan-600 hover:text-cyan-700 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                  disabled={paginaActual === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() =>
                    setPaginaActual(Math.min(totalPaginas, paginaActual + 1))
                  }
                  disabled={paginaActual === totalPaginas}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{" "}
                    <span className="font-medium">
                      {(paginaActual - 1) * 20 + 1}
                    </span>{" "}
                    a{" "}
                    <span className="font-medium">
                      {Math.min(paginaActual * 20, totalVehiculos)}
                    </span>{" "}
                    de <span className="font-medium">{totalVehiculos}</span>{" "}
                    vehículos
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() =>
                        setPaginaActual(Math.max(1, paginaActual - 1))
                      }
                      disabled={paginaActual === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      {paginaActual} de {totalPaginas}
                    </span>
                    <button
                      onClick={() =>
                        setPaginaActual(
                          Math.min(totalPaginas, paginaActual + 1)
                        )
                      }
                      disabled={paginaActual === totalPaginas}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading overlay */}
      {loading && vehiculos.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <RefreshCw className="h-5 w-5 animate-spin text-cyan-600" />
            <span className="text-gray-700">Actualizando...</span>
          </div>
        </div>
      )}
    </div>
  );
}
