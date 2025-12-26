"use client";

import { useState, useEffect } from "react";
import {
  Truck,
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
  Package,
  Weight,
} from "lucide-react";
import Link from "next/link";
import { remolqueService } from "@/services";
import {
  Remolque,
  RemolqueSearchParams,
  EstadoRemolque,
  CondicionRemolque,
  CategoriaRemolque,
  CATEGORIAS_REMOLQUE,
} from "@/types";
import Image from "next/image";

export default function ListaRemolques() {
  const [remolques, setRemolques] = useState<Remolque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRemolques, setTotalRemolques] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Vista y filtros
  const [vistaCards, setVistaCards] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoRemolque | "Todos">(
    "Todos"
  );
  const [filtroCondicion, setFiltroCondicion] = useState<
    CondicionRemolque | "Todas"
  >("Todas");
  const [filtroCategoria, setFiltroCategoria] = useState<
    CategoriaRemolque | "Todas"
  >("Todas");
  const [filtroMarca, setFiltroMarca] = useState("Todas");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Modal de confirmación
  const [remolqueAEliminar, setRemolqueAEliminar] = useState<string | null>(
    null
  );

  useEffect(() => {
    cargarRemolques();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginaActual,
    filtroEstado,
    filtroCondicion,
    filtroCategoria,
    filtroMarca,
  ]);

  const cargarRemolques = async () => {
    try {
      setLoading(true);
      setError(null);

      const filtros: RemolqueSearchParams = {
        page: paginaActual,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      if (filtroEstado !== "Todos") {
        filtros.estado = filtroEstado;
      }

      if (filtroCondicion !== "Todas") {
        filtros.condicion = filtroCondicion;
      }

      if (filtroCategoria !== "Todas") {
        filtros.categoria = filtroCategoria;
      }

      if (filtroMarca !== "Todas") {
        filtros.marca = filtroMarca;
      }

      const response = await remolqueService.getAllRemolques(filtros);

      setRemolques(response.items);
      setTotalRemolques(response.total);
      setTotalPaginas(response.pages);
    } catch (err) {
      console.error("Error cargando remolques:", err);
      setError("Error al cargar los remolques");
    } finally {
      setLoading(false);
    }
  };

  const handleBusqueda = async () => {
    if (!busqueda.trim()) {
      cargarRemolques();
      return;
    }

    try {
      setLoading(true);

      const searchDto: RemolqueSearchParams = {
        q: busqueda,
        ...(filtroEstado !== "Todos" && { estado: filtroEstado }),
        ...(filtroCondicion !== "Todas" && { condicion: filtroCondicion }),
        ...(filtroCategoria !== "Todas" && { categoria: filtroCategoria }),
        ...(filtroMarca !== "Todas" && { marca: filtroMarca }),
        page: 1,
        limit: 20,
      };

      const response = await remolqueService.searchAllRemolques(searchDto);

      setRemolques(response.items);
      setTotalRemolques(response.total);
      setTotalPaginas(response.pages);
      setPaginaActual(1);
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setError("Error al buscar remolques");
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroEstado("Todos");
    setFiltroCondicion("Todas");
    setFiltroCategoria("Todas");
    setFiltroMarca("Todas");
    setPaginaActual(1);
    cargarRemolques();
  };

  const handleEliminar = async (id: string) => {
    try {
      await remolqueService.deleteRemolque(id);
      setRemolqueAEliminar(null);
      cargarRemolques();
    } catch (err) {
      console.error("Error eliminando remolque:", err);
      alert("Error al eliminar el remolque");
    }
  };

  const getEstadoBadge = (estado: EstadoRemolque) => {
    const colors = {
      Disponible: "bg-green-100 text-green-800 border-green-200",
      Reservado: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Vendido: "bg-red-100 text-red-800 border-red-200",
    };

    return colors[estado] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading && remolques.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-cyan-600 mx-auto mb-2" />
            <p className="text-gray-600">Cargando remolques...</p>
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
            Lista de Remolques
          </h1>
          <p className="text-gray-600 mt-1">
            {totalRemolques} remolque{totalRemolques !== 1 ? "s" : ""} en total
          </p>
        </div>

        <Link
          href="/admin/remolques/crear"
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2 w-fit"
        >
          <Plus className="h-4 w-4" />
          Nuevo Remolque
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
                placeholder="Buscar por marca, modelo, categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleBusqueda()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleBusqueda}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Buscar
            </button>

            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </button>

            <button
              onClick={() => setVistaCards(!vistaCards)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {vistaCards ? (
                <ListIcon className="h-4 w-4" />
              ) : (
                <Grid3X3 className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Panel de Filtros */}
          {mostrarFiltros && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condición
                </label>
                <select
                  value={filtroCondicion}
                  onChange={(e) =>
                    setFiltroCondicion(
                      e.target.value as CondicionRemolque | "Todas"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="Todas">Todas las condiciones</option>
                  <option value="0KM">0KM</option>
                  <option value="USADO">Usado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={filtroEstado}
                  onChange={(e) =>
                    setFiltroEstado(e.target.value as EstadoRemolque | "Todos")
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={filtroCategoria}
                  onChange={(e) =>
                    setFiltroCategoria(
                      e.target.value as CategoriaRemolque | "Todas"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="Todas">Todas las categorías</option>
                  {CATEGORIAS_REMOLQUE.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <input
                  type="text"
                  value={filtroMarca}
                  onChange={(e) => setFiltroMarca(e.target.value)}
                  placeholder="Todas las marcas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                <button
                  onClick={limpiarFiltros}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
          <button
            onClick={cargarRemolques}
            className="text-red-600 hover:text-red-700"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Lista de Remolques */}
      {vistaCards ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remolques.map((remolque) => (
            <div
              key={remolque._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Imagen */}
              <div className="relative h-48 bg-gray-100">
                {remolque.imagenes && remolque.imagenes.length > 0 ? (
                  <Image
                    src={remolque.imagenes[0].secure_url}
                    alt={remolque.titulo || "Remolque"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Truck className="h-16 w-16 text-gray-400" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {remolque.estado && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoBadge(
                        remolque.estado
                      )}`}
                    >
                      {remolque.estado}
                    </span>
                  )}
                  {remolque.condicion && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        remolque.condicion === "0KM"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-orange-50 text-orange-700 border-orange-200"
                      }`}
                    >
                      {remolque.condicion}
                    </span>
                  )}
                </div>
              </div>

              {/* Contenido */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {remolque.titulo}
                    </h3>
                    {remolque.categoria && (
                      <p className="text-sm text-gray-600">
                        {remolque.categoria}
                        {remolque.marca && ` • ${remolque.marca}`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Detalles */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  {remolque.tipoCarroceria && (
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span>{remolque.tipoCarroceria}</span>
                    </div>
                  )}
                  {remolque.cantidadEjes && (
                    <div className="flex items-center gap-2">
                      <Weight className="h-4 w-4 text-gray-400" />
                      <span>{remolque.cantidadEjes} ejes</span>
                    </div>
                  )}
                  {remolque.anio && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(remolque.anio).getFullYear()}</span>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <Link
                    href={`/remolques/${remolque._id}`}
                    target="_blank"
                    className="flex-1 py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    Ver
                  </Link>
                  <Link
                    href={`/admin/remolques/editar/${remolque._id}`}
                    className="flex-1 py-2 px-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Link>
                  <button
                    onClick={() => setRemolqueAEliminar(remolque._id!)}
                    className="py-2 px-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remolque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condición
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {remolques.map((remolque) => (
                <tr key={remolque._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        {remolque.imagenes && remolque.imagenes.length > 0 ? (
                          <Image
                            src={remolque.imagenes[0].secure_url}
                            alt="Remolque"
                            width={40}
                            height={40}
                            className="object-cover rounded"
                          />
                        ) : (
                          <Truck className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {remolque.titulo}
                        </p>
                        {remolque.marca && (
                          <p className="text-sm text-gray-500">
                            {remolque.marca}
                            {remolque.modelo && ` • ${remolque.modelo}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {remolque.condicion && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          remolque.condicion === "0KM"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-orange-50 text-orange-700 border-orange-200"
                        }`}
                      >
                        {remolque.condicion}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {remolque.categoria || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {remolque.estado && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoBadge(
                          remolque.estado
                        )}`}
                      >
                        {remolque.estado}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/remolques/${remolque._id}`}
                        target="_blank"
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/remolques/editar/${remolque._id}`}
                        className="p-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setRemolqueAEliminar(remolque._id!)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
      )}

      {/* Mensaje sin resultados */}
      {!loading && remolques.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron remolques
          </h3>
          <p className="text-gray-600 mb-4">
            Intenta ajustar los filtros o crea un nuevo remolque
          </p>
          <Link
            href="/admin/remolques/crear"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Crear Remolque
          </Link>
        </div>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <span className="px-4 py-2 text-gray-700">
            Página {paginaActual} de {totalPaginas}
          </span>

          <button
            onClick={() =>
              setPaginaActual((p) => Math.min(totalPaginas, p + 1))
            }
            disabled={paginaActual === totalPaginas}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal de confirmación */}
      {remolqueAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Eliminar remolque?
            </h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. Se eliminarán todas las imágenes
              y videos asociados.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRemolqueAEliminar(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleEliminar(remolqueAEliminar)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
