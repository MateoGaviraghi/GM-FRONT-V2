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
  RefreshCw,
  Grid3X3,
  List,
  ChevronDown,
  X,
  Image as ImageIcon,
  Play,
} from "lucide-react";
import Link from "next/link";
import { remolqueService } from "@/services";
import {
  Remolque,
  EstadoRemolque,
  RemolqueSearchParams,
  CondicionRemolque,
  CategoriaRemolque,
  CATEGORIAS_REMOLQUE,
} from "@/types";

// Componente RemolqueCard para vista de cards
const RemolqueCard = ({ remolque }: { remolque: Remolque }) => {
  const getEstadoBadge = (estado: EstadoRemolque) => {
    const colors = {
      Disponible: "bg-green-100 text-green-800 border-green-200",
      Reservado: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Vendido: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[estado] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group overflow-hidden">
      {/* Imagen */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        {remolque.imagenes && remolque.imagenes.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={
              remolque.imagenes[0].thumbnails?.medium ||
              remolque.imagenes[0].secure_url
            }
            alt={remolque.titulo || "Remolque"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Truck className="h-16 w-16 text-gray-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="flex gap-2">
            {remolque.estado && (
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getEstadoBadge(
                  remolque.estado
                )}`}
              >
                {remolque.estado}
              </span>
            )}
            {remolque.condicion && (
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                  remolque.condicion === "0KM"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-orange-50 text-orange-700 border-orange-200"
                }`}
              >
                {remolque.condicion}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {remolque.imagenes && remolque.imagenes.length > 0 && (
              <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                {remolque.imagenes.length}
              </span>
            )}
            {remolque.videos && remolque.videos.length > 0 && (
              <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <Play className="h-3 w-3" />
                {remolque.videos.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-cyan-600 transition-colors">
              {remolque.titulo}
            </h3>
            <p className="text-sm text-gray-600">
              {remolque.categoria && `${remolque.categoria}`}
              {remolque.marca && ` • ${remolque.marca}`}
            </p>
          </div>
        </div>

        {/* Detalles técnicos */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          {remolque.tipoCarroceria && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">📦</span>
              <span className="text-gray-600">{remolque.tipoCarroceria}</span>
            </div>
          )}
          {remolque.cantidadEjes && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">⚙️</span>
              <span className="text-gray-600">
                {remolque.cantidadEjes} ejes
              </span>
            </div>
          )}
          {remolque.capacidadCarga && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">📦</span>
              <span className="text-gray-600 truncate">
                {remolque.capacidadCarga}
              </span>
            </div>
          )}
          {remolque.anio && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">📅</span>
              <span className="text-gray-600">{remolque.anio}</span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
            <Eye className="h-4 w-4" />
            Ver
          </button>
          <Link
            href={`/admin/remolques/editar/${remolque._id}`}
            className="flex-1 px-3 py-2 text-sm bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors flex items-center justify-center gap-1"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Link>
          <button className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ListaRemolquesAvanzada() {
  const [remolques, setRemolques] = useState<Remolque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRemolques, setTotalRemolques] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Vista y filtros avanzados
  const [vistaCards, setVistaCards] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoRemolque | "Todos">(
    "Todos"
  );
  const [filtroCondicion, setFiltroCondicion] = useState<
    CondicionRemolque | "Todas"
  >("Todas");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroMarca, setFiltroMarca] = useState("Todas");
  const [filtroMaterial, setFiltroMaterial] = useState("Todos");
  const [ordenarPor, setOrdenarPor] = useState<
    "createdAt" | "marca" | "tipos" | "anio"
  >("createdAt");
  const [ordenDirection, setOrdenDirection] = useState<"asc" | "desc">("desc");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarRemolques();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginaActual,
    filtroEstado,
    filtroCondicion,
    filtroCategoria,
    filtroMarca,
    filtroMaterial,
    ordenarPor,
    ordenDirection,
    vistaCards,
  ]);

  const cargarRemolques = async () => {
    try {
      setLoading(true);
      setError(null);

      const filtros: RemolqueSearchParams = {
        page: paginaActual,
        limit: vistaCards ? 12 : 20,
        sortBy: ordenarPor,
        sortOrder: ordenDirection,
      };

      if (filtroEstado !== "Todos")
        filtros.estado = filtroEstado as EstadoRemolque;
      if (filtroCondicion !== "Todas")
        filtros.condicion = filtroCondicion as CondicionRemolque;
      if (filtroCategoria !== "Todas")
        filtros.categoria = filtroCategoria as CategoriaRemolque;
      if (filtroMarca !== "Todas") filtros.marca = filtroMarca;

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

      const searchDto = {
        q: busqueda,
        filters: {
          ...(filtroEstado !== "Todos" && { estado: filtroEstado }),
          ...(filtroCondicion !== "Todas" && { condicion: filtroCondicion }),
          ...(filtroCategoria !== "Todas" && { categoria: filtroCategoria }),
          ...(filtroMarca !== "Todas" && { marca: filtroMarca }),
        },
        page: 1,
        limit: vistaCards ? 12 : 20,
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
    setFiltroMaterial("Todos");
    setPaginaActual(1);
    cargarRemolques();
  };

  const getEstadoBadge = (estado: EstadoRemolque) => {
    const colors = {
      Disponible: "bg-green-100 text-green-800 border-green-200",
      Reservado: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Vendido: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[estado] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const filtrosActivos = [
    filtroEstado !== "Todos" && `Estado: ${filtroEstado}`,
    filtroCondicion !== "Todas" && `Condición: ${filtroCondicion}`,
    filtroCategoria !== "Todas" && `Categoría: ${filtroCategoria}`,
    filtroMarca !== "Todas" && `Marca: ${filtroMarca}`,
    filtroMaterial !== "Todos" && `Material: ${filtroMaterial}`,
    busqueda && `Búsqueda: "${busqueda}"`,
  ].filter(Boolean);

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
      {/* Header Mejorado */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión Completa de Remolques
          </h1>
          <p className="text-gray-600 mt-1">
            {totalRemolques} remolque{totalRemolques !== 1 ? "s" : ""}{" "}
            encontrado{totalRemolques !== 1 ? "s" : ""}
            {filtrosActivos.length > 0 && " con filtros aplicados"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle de vista mejorado */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setVistaCards(true)}
              className={`p-2 rounded-md transition-colors ${
                vistaCards
                  ? "bg-white shadow-sm text-cyan-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Vista de cards"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setVistaCards(false)}
              className={`p-2 rounded-md transition-colors ${
                !vistaCards
                  ? "bg-white shadow-sm text-cyan-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Vista de lista"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Link
            href="/admin/remolques/crear"
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Remolque
          </Link>
        </div>
      </div>

      {/* Panel de Filtros Avanzados */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Barra de búsqueda principal */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por marca, modelo, categoría, características..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleBusqueda()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
              />
            </div>
            <button
              onClick={handleBusqueda}
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
            >
              Buscar
            </button>
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium ${
                mostrarFiltros
                  ? "bg-cyan-100 text-cyan-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Filter className="h-4 w-4" />
              Filtros
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  mostrarFiltros ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Chips de filtros activos */}
          {filtrosActivos.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700 mr-2">
                Filtros activos:
              </span>
              {filtrosActivos.map((filtro, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-800 text-sm rounded-full font-medium"
                >
                  {filtro}
                </span>
              ))}
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full hover:bg-red-200 transition-colors font-medium"
              >
                <X className="h-3 w-3" />
                Limpiar todo
              </button>
            </div>
          )}

          {/* Filtros avanzados expandibles */}
          {mostrarFiltros && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              {/* Condición */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                >
                  <option value="Todas">Todas las condiciones</option>
                  <option value="0KM">0KM</option>
                  <option value="USADO">Usado</option>
                </select>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del Remolque
                </label>
                <select
                  value={filtroEstado}
                  onChange={(e) =>
                    setFiltroEstado(e.target.value as EstadoRemolque | "Todos")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="Disponible">✅ Disponible</option>
                  <option value="Reservado">⏳ Reservado</option>
                  <option value="Vendido">❌ Vendido</option>
                </select>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                >
                  <option value="Todas">Todas las categorías</option>
                  {CATEGORIAS_REMOLQUE.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Marca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <input
                  type="text"
                  placeholder="Filtrar por marca..."
                  value={filtroMarca}
                  onChange={(e) => setFiltroMarca(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                />
              </div>

              {/* Material */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material
                </label>
                <select
                  value={filtroMaterial}
                  onChange={(e) => setFiltroMaterial(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                >
                  <option value="Todos">Todos los materiales</option>
                  <option value="Acero">Acero</option>
                  <option value="Aluminio">Aluminio</option>
                  <option value="Mixto">Mixto</option>
                </select>
              </div>

              {/* Ordenar por */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar Por
                </label>
                <select
                  value={ordenarPor}
                  onChange={(e) =>
                    setOrdenarPor(
                      e.target.value as "createdAt" | "marca" | "tipos" | "anio"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                >
                  <option value="createdAt">Fecha de creación</option>
                  <option value="marca">Marca</option>
                  <option value="tipos">Categoría</option>
                  <option value="anio">Año</option>
                </select>
              </div>

              {/* Dirección de orden */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <select
                  value={ordenDirection}
                  onChange={(e) =>
                    setOrdenDirection(e.target.value as "asc" | "desc")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                >
                  <option value="desc">Descendente</option>
                  <option value="asc">Ascendente</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!loading && remolques.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No se encontraron remolques
          </h3>
          <p className="text-gray-600 mb-4">
            {filtrosActivos.length > 0
              ? "Intenta modificar los filtros de búsqueda"
              : "Comienza agregando tu primer remolque"}
          </p>
          {filtrosActivos.length > 0 ? (
            <button
              onClick={limpiarFiltros}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
              Limpiar Filtros
            </button>
          ) : (
            <Link
              href="/admin/remolques/crear"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
              <Plus className="h-4 w-4" />
              Crear Remolque
            </Link>
          )}
        </div>
      ) : vistaCards ? (
        /* Vista de Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {remolques.map((remolque) => (
            <RemolqueCard key={remolque._id} remolque={remolque} />
          ))}
        </div>
      ) : (
        /* Vista de Tabla */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remolque
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalles
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {remolques.map((remolque) => (
                  <tr
                    key={remolque._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                          {remolque.imagenes && remolque.imagenes.length > 0 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={
                                remolque.imagenes[0].thumbnails?.small ||
                                remolque.imagenes[0].secure_url
                              }
                              alt={remolque.titulo || ""}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Truck className="h-6 w-6 text-gray-400 m-auto" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {remolque.titulo ||
                              `${remolque.marca} ${remolque.modelo}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {remolque.marca} • {remolque.tipoCarroceria}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {remolque.estado && (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getEstadoBadge(
                            remolque.estado
                          )}`}
                        >
                          {remolque.estado}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        {remolque.capacidadCarga && (
                          <div>Capacidad: {remolque.capacidadCarga}</div>
                        )}
                        {remolque.carroceria?.material && (
                          <div>Material: {remolque.carroceria.material}</div>
                        )}
                        {remolque.cantidadEjes && (
                          <div>{remolque.cantidadEjes} ejes</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {remolque.createdAt
                        ? new Date(remolque.createdAt).toLocaleDateString(
                            "es-AR"
                          )
                        : "-"}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/admin/remolques/editar/${remolque._id}`}
                          className="p-2 text-cyan-600 hover:text-cyan-800 hover:bg-cyan-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
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

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            Mostrando {(paginaActual - 1) * (vistaCards ? 12 : 20) + 1} -{" "}
            {Math.min(paginaActual * (vistaCards ? 12 : 20), totalRemolques)} de{" "}
            {totalRemolques} remolques
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Anterior
            </button>

            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPaginaActual(pageNum)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    paginaActual === pageNum
                      ? "bg-cyan-600 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
              }
              disabled={paginaActual === totalPaginas}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
