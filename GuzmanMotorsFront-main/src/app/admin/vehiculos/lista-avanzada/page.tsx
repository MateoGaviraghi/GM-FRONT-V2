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
  List,
  Calendar,
  MoreVertical,
  Image as ImageIcon,
  Play,
  Fuel,
  Gauge,
  Award,
  ChevronDown,
  X,
} from "lucide-react";
import Link from "next/link";
import { vehiculoService } from "@/services";
import {
  Vehiculo0km,
  VehiculoFilters,
  EstadoVehiculo,
  MARCAS,
  VEHICULO_TIPOS,
  COMBUSTIBLES,
  TRANSMISIONES,
} from "@/types";

// Componente VehicleCard para vista de cards
const VehicleCard = ({ vehiculo }: { vehiculo: Vehiculo0km }) => {
  const getEstadoBadge = (estado: EstadoVehiculo) => {
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
        {vehiculo.imagenes && vehiculo.imagenes.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={
              vehiculo.imagenes[0].thumbnails?.medium ||
              vehiculo.imagenes[0].secure_url
            }
            alt={vehiculo.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="h-16 w-16 text-gray-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getEstadoBadge(
              vehiculo.estado
            )}`}
          >
            {vehiculo.estado}
          </span>
          {vehiculo.imagenes && vehiculo.imagenes.length > 0 && (
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              {vehiculo.imagenes.length}
            </span>
          )}
          {vehiculo.videos && vehiculo.videos.length > 0 && (
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
              <Play className="h-3 w-3" />
              {vehiculo.videos.length}
            </span>
          )}
        </div>

        {/* Acciones */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-cyan-600 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-cyan-600 transition-colors">
              {vehiculo.titulo || `${vehiculo.marca} ${vehiculo.modelo}`}
            </h3>
            <p className="text-sm text-gray-600">
              {vehiculo.marca} • {vehiculo.tipos}
            </p>
          </div>
        </div>

        {/* Detalles técnicos */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          {vehiculo.tipoCombustible && (
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{vehiculo.tipoCombustible}</span>
            </div>
          )}
          {vehiculo.transmisiones && (
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 truncate">
                {vehiculo.transmisiones}
              </span>
            </div>
          )}
          {vehiculo.anio && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {new Date(vehiculo.anio).getFullYear()}
              </span>
            </div>
          )}
          {vehiculo.variantes && (
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 truncate">
                {vehiculo.variantes}
              </span>
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
            href={`/admin/vehiculos/editar/${vehiculo._id}`}
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

export default function ListaVehiculosAvanzada() {
  const [vehiculos, setVehiculos] = useState<Vehiculo0km[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVehiculos, setTotalVehiculos] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Vista y filtros avanzados
  const [vistaCards, setVistaCards] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoVehiculo | "Todos">(
    "Todos"
  );
  const [filtroMarca, setFiltroMarca] = useState("Todas");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroCombustible, setFiltroCombustible] = useState("Todos");
  const [filtroTransmision, setFiltroTransmision] = useState("Todas");
  const [filtroAño, setFiltroAño] = useState("Todos");
  const [ordenarPor, setOrdenarPor] = useState<
    "createdAt" | "marca" | "modelo" | "anio"
  >("createdAt");
  const [ordenDirection, setOrdenDirection] = useState<"asc" | "desc">("desc");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarVehiculos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginaActual,
    filtroEstado,
    filtroMarca,
    filtroTipo,
    filtroCombustible,
    filtroTransmision,
    filtroAño,
    ordenarPor,
    ordenDirection,
    vistaCards,
  ]);

  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      setError(null);

      const filtros: VehiculoFilters = {
        page: paginaActual,
        limit: vistaCards ? 12 : 20,
        sortBy: ordenarPor,
        sortOrder: ordenDirection,
      };

      if (filtroEstado !== "Todos") filtros.estado = filtroEstado;
      if (filtroMarca !== "Todas") filtros.marca = filtroMarca;
      if (filtroTipo !== "Todos") filtros.tipos = filtroTipo;
      if (filtroCombustible !== "Todos")
        filtros.tipoCombustible = filtroCombustible;
      if (filtroTransmision !== "Todas")
        filtros.transmisiones = filtroTransmision;

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
          ...(filtroTipo !== "Todos" && { tipos: filtroTipo }),
          ...(filtroCombustible !== "Todos" && {
            tipoCombustible: filtroCombustible,
          }),
          ...(filtroTransmision !== "Todas" && {
            transmisiones: filtroTransmision,
          }),
        },
        page: 1,
        limit: vistaCards ? 12 : 20,
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
    setFiltroTipo("Todos");
    setFiltroCombustible("Todos");
    setFiltroTransmision("Todas");
    setFiltroAño("Todos");
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

  const filtrosActivos = [
    filtroEstado !== "Todos" && `Estado: ${filtroEstado}`,
    filtroMarca !== "Todas" && `Marca: ${filtroMarca}`,
    filtroTipo !== "Todos" && `Tipo: ${filtroTipo}`,
    filtroCombustible !== "Todos" && `Combustible: ${filtroCombustible}`,
    filtroTransmision !== "Todas" && `Transmisión: ${filtroTransmision}`,
    filtroAño !== "Todos" && `Año: ${filtroAño}`,
    busqueda && `Búsqueda: "${busqueda}"`,
  ].filter(Boolean);

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
      {/* Header Mejorado */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión Completa de Vehículos
          </h1>
          <p className="text-gray-600 mt-1">
            {totalVehiculos} vehículo{totalVehiculos !== 1 ? "s" : ""}{" "}
            encontrado{totalVehiculos !== 1 ? "s" : ""}
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
            href="/admin/vehiculos/crear"
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Vehículo
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
                placeholder="Buscar por marca, modelo, título, características técnicas..."
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
              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del Vehículo
                </label>
                <select
                  value={filtroEstado}
                  onChange={(e) =>
                    setFiltroEstado(e.target.value as EstadoVehiculo | "Todos")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="Disponible">✅ Disponible</option>
                  <option value="Reservado">⏳ Reservado</option>
                  <option value="Vendido">❌ Vendido</option>
                </select>
              </div>

              {/* Marca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <select
                  value={filtroMarca}
                  onChange={(e) => setFiltroMarca(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                >
                  <option value="Todas">Todas las marcas</option>
                  {MARCAS.map((marca) => (
                    <option key={marca} value={marca}>
                      {marca}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo de Vehículo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Vehículo
                </label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                >
                  <option value="Todos">Todos los tipos</option>
                  {VEHICULO_TIPOS.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Combustible */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Combustible
                </label>
                <select
                  value={filtroCombustible}
                  onChange={(e) => setFiltroCombustible(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                >
                  <option value="Todos">Todos los combustibles</option>
                  {COMBUSTIBLES.map((combustible) => (
                    <option key={combustible} value={combustible}>
                      {combustible}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transmisión */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmisión
                </label>
                <select
                  value={filtroTransmision}
                  onChange={(e) => setFiltroTransmision(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                >
                  <option value="Todas">Todas las transmisiones</option>
                  {TRANSMISIONES.map((transmision) => (
                    <option key={transmision} value={transmision}>
                      {transmision}
                    </option>
                  ))}
                </select>
              </div>

              {/* Año */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año del Modelo
                </label>
                <select
                  value={filtroAño}
                  onChange={(e) => setFiltroAño(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                >
                  <option value="Todos">Todos los años</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>

              {/* Ordenar por */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  value={`${ordenarPor}-${ordenDirection}`}
                  onChange={(e) => {
                    const [campo, direccion] = e.target.value.split("-");
                    setOrdenarPor(
                      campo as "createdAt" | "marca" | "modelo" | "anio"
                    );
                    setOrdenDirection(direccion as "asc" | "desc");
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                >
                  <option value="createdAt-desc">
                    📅 Más reciente primero
                  </option>
                  <option value="createdAt-asc">📅 Más antiguo primero</option>
                  <option value="marca-asc">🔤 Marca A-Z</option>
                  <option value="marca-desc">🔤 Marca Z-A</option>
                  <option value="modelo-asc">🚗 Modelo A-Z</option>
                  <option value="modelo-desc">🚗 Modelo Z-A</option>
                  <option value="anio-desc">📆 Año descendente</option>
                  <option value="anio-asc">📆 Año ascendente</option>
                </select>
              </div>

              {/* Botón limpiar */}
              <div className="flex items-end">
                <button
                  onClick={limpiarFiltros}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  🗑️ Limpiar Filtros
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
          <span className="text-red-700 flex-1">{error}</span>
          <button
            onClick={cargarVehiculos}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Contenido principal */}
      {vehiculos.length === 0 && !loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Car className="h-20 w-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-medium text-gray-800 mb-3">
            No se encontraron vehículos
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {filtrosActivos.length > 0
              ? "No hay vehículos que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda."
              : "Aún no hay vehículos registrados en el sistema. ¡Agrega el primer vehículo para comenzar!"}
          </p>
          <div className="flex gap-3 justify-center">
            {filtrosActivos.length > 0 && (
              <button
                onClick={limpiarFiltros}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Limpiar Filtros
              </button>
            )}
            <Link
              href="/admin/vehiculos/crear"
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
            >
              + Agregar Primer Vehículo
            </Link>
          </div>
        </div>
      ) : vistaCards ? (
        /* Vista de Cards Mejorada */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehiculos.map((vehiculo) => (
            <VehicleCard key={vehiculo._id} vehiculo={vehiculo} />
          ))}
        </div>
      ) : (
        /* Vista de Lista/Tabla Mejorada */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalles Técnicos
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Media
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehiculos.map((vehiculo) => (
                  <tr
                    key={vehiculo._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-14 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                          {vehiculo.imagenes && vehiculo.imagenes.length > 0 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={
                                vehiculo.imagenes[0].thumbnails?.small ||
                                vehiculo.imagenes[0].secure_url
                              }
                              alt=""
                              className="h-14 w-20 object-cover"
                            />
                          ) : (
                            <Car className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {vehiculo.titulo ||
                              `${vehiculo.marca} ${vehiculo.modelo}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehiculo.marca} • {vehiculo.tipos}
                          </div>
                          {vehiculo.variantes && (
                            <div className="text-xs text-gray-400 mt-1">
                              {vehiculo.variantes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getEstadoBadge(
                          vehiculo.estado
                        )}`}
                      >
                        {vehiculo.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Fuel className="h-3 w-3 text-gray-400" />
                          <span>{vehiculo.tipoCombustible}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-3 w-3 text-gray-400" />
                          <span className="text-xs">
                            {vehiculo.transmisiones}
                          </span>
                        </div>
                        {vehiculo.anio && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-xs">
                              {new Date(vehiculo.anio).getFullYear()}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        {vehiculo.imagenes && vehiculo.imagenes.length > 0 && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <ImageIcon className="h-4 w-4" />
                            <span className="font-medium">
                              {vehiculo.imagenes.length}
                            </span>
                          </div>
                        )}
                        {vehiculo.videos && vehiculo.videos.length > 0 && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Play className="h-4 w-4" />
                            <span className="font-medium">
                              {vehiculo.videos.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehiculo.createdAt && (
                        <div>
                          <div>
                            {new Date(vehiculo.createdAt).toLocaleDateString(
                              "es-AR"
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(vehiculo.createdAt).toLocaleTimeString(
                              "es-AR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2 justify-end">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/admin/vehiculos/editar/${vehiculo._id}`}
                          className="p-2 text-cyan-600 hover:text-cyan-700 transition-colors rounded-lg hover:bg-cyan-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button className="p-2 text-red-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
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

      {/* Paginación Mejorada */}
      {totalPaginas > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Mostrando{" "}
              <span className="font-semibold text-gray-900">
                {(paginaActual - 1) * (vistaCards ? 12 : 20) + 1}
              </span>{" "}
              a{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(
                  paginaActual * (vistaCards ? 12 : 20),
                  totalVehiculos
                )}
              </span>{" "}
              de{" "}
              <span className="font-semibold text-gray-900">
                {totalVehiculos}
              </span>{" "}
              vehículos
            </div>

            <nav className="flex items-center gap-2">
              <button
                onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                disabled={paginaActual === 1}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>

              <div className="flex items-center gap-2">
                <span className="px-4 py-2 text-sm bg-cyan-100 text-cyan-800 rounded-lg font-medium">
                  {paginaActual}
                </span>
                <span className="text-gray-400">de</span>
                <span className="text-gray-600 font-medium">
                  {totalPaginas}
                </span>
              </div>

              <button
                onClick={() =>
                  setPaginaActual(Math.min(totalPaginas, paginaActual + 1))
                }
                disabled={paginaActual === totalPaginas}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && vehiculos.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 flex items-center gap-4 max-w-sm mx-4">
            <RefreshCw className="h-6 w-6 animate-spin text-cyan-600" />
            <div>
              <p className="text-gray-900 font-medium">
                Actualizando vehículos...
              </p>
              <p className="text-gray-500 text-sm">Aplicando filtros</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
