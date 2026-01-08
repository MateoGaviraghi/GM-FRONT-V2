"use client";

import { useState, useEffect } from "react";
import {
  CarFront,
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
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usadosService } from "@/services";
import { Usados, UsadosSearchParams } from "@/types";

// Componente UsadosCard para vista de cards
const UsadosCard = ({
  usados,
  onDelete,
}: {
  usados: Usados;
  onDelete: (id: string) => void;
}) => {
  const formatKilometraje = (km?: number) => {
    if (!km) return "No especificado";
    return new Intl.NumberFormat("es-AR").format(km) + " km";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group overflow-hidden">
      {/* Imagen */}
      <div className="relative h-48 bg-gradient-to-br from-cyan-50 to-cyan-100">
        {usados.imagenes && usados.imagenes.length > 0 ? (
          <Image
            src={
              usados.imagenes[0].thumbnails?.medium ||
              usados.imagenes[0].secure_url
            }
            alt={usados.titulo || "Vehículo usado"}
            width={400}
            height={192}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CarFront className="h-16 w-16 text-cyan-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {usados.imagenes && usados.imagenes.length > 0 && (
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              {usados.imagenes.length}
            </span>
          )}
          {usados.videos && usados.videos.length > 0 && (
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
              <Play className="h-3 w-3" />
              {usados.videos.length}
            </span>
          )}
        </div>

        {/* Precio destacado */}
        {usados.descripcion && (
          <div className="absolute bottom-3 left-3">
            <div className="bg-cyan-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg">
              {usados.marca} {usados.modelo}
            </div>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-cyan-600 transition-colors line-clamp-1">
              {usados.titulo || `${usados.marca} ${usados.modelo}`}
            </h3>
            <p className="text-sm text-gray-600">
              {usados.marca} {usados.modelo} • {usados.anio || "N/A"}
            </p>
          </div>
        </div>

        {/* Detalles técnicos */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">🚗</span>
            <span className="text-gray-600 truncate">
              {usados.tipoVehiculo || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📏</span>
            <span className="text-gray-600">
              {formatKilometraje(usados.kilometraje)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">⚙️</span>
            <span className="text-gray-600 truncate">
              {usados.transmision || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">⛽</span>
            <span className="text-gray-600 truncate">
              {usados.tipoCombustible || "N/A"}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <Link
            href={`/usados/${usados._id}`}
            target="_blank"
            className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="h-4 w-4" />
            Ver
          </Link>
          <Link
            href={`/admin/usados/editar/${usados._id}`}
            className="flex-1 px-3 py-2 text-sm bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors flex items-center justify-center gap-1"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Link>
          <button
            onClick={() => onDelete(usados._id!)}
            className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ListaUsadosAvanzada() {
  const [usados, setUsados] = useState<Usados[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsados, setTotalUsados] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Vista y filtros avanzados
  const [vistaCards, setVistaCards] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroMarca, setFiltroMarca] = useState("Todas");
  const [filtroModelo, setFiltroModelo] = useState("");
  const [filtroCombustible, setFiltroCombustible] = useState("Todos");
  const [filtroTransmision, setFiltroTransmision] = useState("Todas");
  const [anioDesde, setAnioDesde] = useState("");
  const [anioHasta, setAnioHasta] = useState("");
  const [kilometrajeMin, setKilometrajeMin] = useState("");
  const [kilometrajeMax, setKilometrajeMax] = useState("");
  const [ordenarPor, setOrdenarPor] = useState<
    "createdAt" | "marca" | "modelo" | "anio" | "kilometraje" | "precio"
  >("createdAt");
  const [ordenDirection, setOrdenDirection] = useState<"asc" | "desc">("desc");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usadoToDelete, setUsadoToDelete] = useState<string | null>(null);

  useEffect(() => {
    cargarUsados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    paginaActual,
    filtroTipo,
    filtroMarca,
    filtroModelo,
    filtroCombustible,
    filtroTransmision,
    anioDesde,
    anioHasta,
    kilometrajeMin,
    kilometrajeMax,
    ordenarPor,
    ordenDirection,
  ]);

  const cargarUsados = async () => {
    try {
      setLoading(true);
      setError(null);

      const filtros: UsadosSearchParams = {
        page: paginaActual,
        limit: vistaCards ? 12 : 20,
        sortBy: ordenarPor,
        sortOrder: ordenDirection,
      };

      if (filtroTipo !== "Todos") filtros.tipoVehiculo = filtroTipo;
      if (filtroMarca !== "Todas") filtros.marca = filtroMarca;
      if (filtroModelo) filtros.modelo = filtroModelo;
      if (anioDesde) {
        filtros.anioFrom = new Date(parseInt(anioDesde), 0, 1)
          .toISOString()
          .split("T")[0];
      }
      if (anioHasta) {
        filtros.anioTo = new Date(parseInt(anioHasta), 11, 31)
          .toISOString()
          .split("T")[0];
      }
      if (kilometrajeMin) filtros.kilometrajeMin = parseInt(kilometrajeMin);
      if (kilometrajeMax) filtros.kilometrajeMax = parseInt(kilometrajeMax);
      if (busqueda.trim()) filtros.q = busqueda.trim();

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

  const handleBusqueda = () => {
    setPaginaActual(1);
    cargarUsados();
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroTipo("Todos");
    setFiltroMarca("Todas");
    setFiltroModelo("");
    setFiltroCombustible("Todos");
    setFiltroTransmision("Todas");
    setAnioDesde("");
    setAnioHasta("");
    setKilometrajeMin("");
    setKilometrajeMax("");
    setPaginaActual(1);
  };

  const handleDeleteClick = (id: string) => {
    setUsadoToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!usadoToDelete) return;

    try {
      await usadosService.deleteUsados(usadoToDelete);
      setShowDeleteModal(false);
      setUsadoToDelete(null);
      cargarUsados();
    } catch (err) {
      console.error("Error eliminando usados:", err);
      alert("Error al eliminar el vehículo usado");
    }
  };

  const formatKilometraje = (km?: number) => {
    if (!km) return "No especificado";
    return new Intl.NumberFormat("es-AR").format(km) + " km";
  };

  const filtrosActivos = [
    filtroTipo !== "Todos" && `Tipo: ${filtroTipo}`,
    filtroMarca !== "Todas" && `Marca: ${filtroMarca}`,
    filtroModelo && `Modelo: ${filtroModelo}`,
    filtroCombustible !== "Todos" && `Combustible: ${filtroCombustible}`,
    filtroTransmision !== "Todas" && `Transmisión: ${filtroTransmision}`,
    anioDesde && `Año desde: ${anioDesde}`,
    anioHasta && `Año hasta: ${anioHasta}`,
    kilometrajeMin && `Km mín: ${kilometrajeMin}`,
    kilometrajeMax && `Km máx: ${kilometrajeMax}`,
    busqueda && `Búsqueda: "${busqueda}"`,
  ].filter(Boolean);

  if (loading && usados.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-cyan-600 mx-auto mb-2" />
            <p className="text-gray-600">Cargando vehículos usados...</p>
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
            Gestión Completa de Vehículos Usados
          </h1>
          <p className="text-gray-600 mt-1">
            {totalUsados} vehículo{totalUsados !== 1 ? "s" : ""} usado
            {totalUsados !== 1 ? "s" : ""} encontrado
            {totalUsados !== 1 ? "s" : ""}
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
            href="/admin/usados/crear"
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Vehículo Usado
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
                placeholder="Buscar por marca, modelo, tipo, características..."
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
            <div className="flex flex-wrap gap-2 p-3 bg-cyan-50 rounded-lg">
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
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* Primera fila de filtros */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tipo */}
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
                    <option value="Sedán">Sedán</option>
                    <option value="SUV">SUV</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Coupé">Coupé</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Camioneta">Camioneta</option>
                    <option value="Deportivo">Deportivo</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                {/* Marca */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Toyota, Ford..."
                    value={filtroMarca}
                    onChange={(e) => setFiltroMarca(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                  />
                </div>

                {/* Modelo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Hilux, Ranger..."
                    value={filtroModelo}
                    onChange={(e) => setFiltroModelo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                  />
                </div>
              </div>

              {/* Segunda fila de filtros */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Combustible */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Combustible
                  </label>
                  <select
                    value={filtroCombustible}
                    onChange={(e) => setFiltroCombustible(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Nafta">Nafta</option>
                    <option value="Diesel">Diesel</option>
                    <option value="GNC">GNC</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Eléctrico">Eléctrico</option>
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
                    <option value="Todas">Todas</option>
                    <option value="Manual">Manual</option>
                    <option value="Automática">Automática</option>
                    <option value="Semi-automática">Semi-automática</option>
                  </select>
                </div>

                {/* Año Desde */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año Desde
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 2015"
                    value={anioDesde}
                    onChange={(e) => setAnioDesde(e.target.value)}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                  />
                </div>

                {/* Año Hasta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año Hasta
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 2024"
                    value={anioHasta}
                    onChange={(e) => setAnioHasta(e.target.value)}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                  />
                </div>
              </div>

              {/* Tercera fila - Kilometraje */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kilometraje Mínimo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kilometraje Mínimo
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 0"
                    value={kilometrajeMin}
                    onChange={(e) => setKilometrajeMin(e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                  />
                </div>

                {/* Kilometraje Máximo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kilometraje Máximo
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 200000"
                    value={kilometrajeMax}
                    onChange={(e) => setKilometrajeMax(e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                  />
                </div>
              </div>

              {/* Ordenamiento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordenar por
                  </label>
                  <select
                    value={ordenarPor}
                    onChange={(e) =>
                      setOrdenarPor(
                        e.target.value as
                          | "createdAt"
                          | "marca"
                          | "modelo"
                          | "anio"
                          | "kilometraje"
                          | "precio"
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                  >
                    <option value="createdAt">Fecha de creación</option>
                    <option value="marca">Marca</option>
                    <option value="modelo">Modelo</option>
                    <option value="anio">Año</option>
                    <option value="kilometraje">Kilometraje</option>
                    <option value="precio">Precio</option>
                  </select>
                </div>

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
                    <option value="desc">
                      Descendente (Z-A / Mayor-Menor)
                    </option>
                    <option value="asc">Ascendente (A-Z / Menor-Mayor)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <div className="flex-shrink-0">
            <X className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <button
            onClick={cargarUsados}
            className="flex-shrink-0 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Vista de Cards */}
      {vistaCards && (
        <div>
          {usados.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <CarFront className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron vehículos usados
              </h3>
              <p className="text-gray-600 mb-6">
                {filtrosActivos.length > 0
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Comienza agregando tu primer vehículo usado"}
              </p>
              <Link
                href="/admin/usados/crear"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Agregar Vehículo Usado
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {usados.map((usado) => (
                <UsadosCard
                  key={usado._id}
                  usados={usado}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vista de Tabla */}
      {!vistaCards && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {usados.length === 0 ? (
            <div className="text-center py-12">
              <CarFront className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron vehículos usados
              </h3>
              <p className="text-gray-600 mb-6">
                {filtrosActivos.length > 0
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Comienza agregando tu primer vehículo usado"}
              </p>
              <Link
                href="/admin/usados/crear"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Agregar Vehículo Usado
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehículo
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transmisión
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Combustible
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medios
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usados.map((usado) => (
                    <tr
                      key={usado._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 relative">
                            {usado.imagenes && usado.imagenes.length > 0 ? (
                              <Image
                                src={
                                  usado.imagenes[0].thumbnails?.small ||
                                  usado.imagenes[0].secure_url
                                }
                                alt={usado.titulo || "Vehículo"}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center">
                                <CarFront className="h-6 w-6 text-cyan-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {usado.titulo || `${usado.marca} ${usado.modelo}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              {usado.marca} • {usado.tipoVehiculo}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {usado.anio || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatKilometraje(usado.kilometraje)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {usado.tipoVehiculo || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {usado.transmision || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {usado.tipoCombustible || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                          {usado.imagenes && usado.imagenes.length > 0 && (
                            <span className="flex items-center gap-1">
                              <ImageIcon className="h-4 w-4 text-gray-400" />
                              {usado.imagenes.length}
                            </span>
                          )}
                          {usado.videos && usado.videos.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Play className="h-4 w-4 text-gray-400" />
                              {usado.videos.length}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/usados/${usado._id}`}
                            target="_blank"
                            className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                            title="Ver en sitio público"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/usados/editar/${usado._id}`}
                            className="text-cyan-600 hover:text-cyan-900 p-1 rounded hover:bg-cyan-100"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(usado._id!)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
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
          )}
        </div>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              Mostrando{" "}
              <span className="font-medium">
                {(paginaActual - 1) * (vistaCards ? 12 : 20) + 1}
              </span>{" "}
              a{" "}
              <span className="font-medium">
                {Math.min(paginaActual * (vistaCards ? 12 : 20), totalUsados)}
              </span>{" "}
              de <span className="font-medium">{totalUsados}</span> resultados
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
              disabled={paginaActual === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                let pageNum;
                if (totalPaginas <= 5) {
                  pageNum = i + 1;
                } else if (paginaActual <= 3) {
                  pageNum = i + 1;
                } else if (paginaActual >= totalPaginas - 2) {
                  pageNum = totalPaginas - 4 + i;
                } else {
                  pageNum = paginaActual - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => setPaginaActual(pageNum)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      paginaActual === pageNum
                        ? "bg-cyan-600 text-white"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setPaginaActual(Math.min(totalPaginas, paginaActual + 1))
              }
              disabled={paginaActual === totalPaginas}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar eliminación
                </h3>
                <p className="text-sm text-gray-600">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar este vehículo usado? Se
              eliminarán también todas sus imágenes y videos asociados.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUsadoToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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
