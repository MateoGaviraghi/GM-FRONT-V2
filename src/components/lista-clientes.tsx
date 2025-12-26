"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Phone,
  MapPin,
  Car,
  Calendar,
  SortAsc,
  SortDesc,
  Plus,
  X,
} from "lucide-react";
import {
  ClienteService,
  ClienteSearchParams,
  ClienteSearchResponse,
} from "@/services";
import Link from "next/link";
import { useFileDownload } from "@/hooks/useFileDownload";
import { Edit, Trash2, Loader2, Download } from "lucide-react";
import { Cliente } from "@/types/cliente";

// Opciones de campos para filtrar
const CAMPO_OPTIONS = [
  { value: "nombreCompleto", label: "Nombre Completo" },
  { value: "correoElectronico", label: "Email" },
  { value: "telefonoCelular", label: "Teléfono Celular" },
  { value: "telefonoFijo", label: "Teléfono Fijo" },
  { value: "provincia", label: "Provincia" },
  { value: "localidad", label: "Localidad" },
  { value: "direccion", label: "Dirección" },
  { value: "tipoVehiculo", label: "Tipo de Vehículo" },
  { value: "marca", label: "Marca" },
  { value: "modelo", label: "Modelo" },
  { value: "anioCompra", label: "Año de Compra" },
  { value: "fechaNacimiento", label: "Fecha de Nacimiento" },
  { value: "tipoCliente", label: "Tipo de Cliente" }, // NUEVO
  { value: "observaciones", label: "Observaciones" }, // NUEVO
];

// Tipo para un filtro individual
interface FiltroIndividual {
  id: string;
  campo: string;
  valor: string;
}

// Tipo para los filtros con índice de cadena
interface FiltrosMap {
  [key: string]: string;
}

// Función para normalizar texto (eliminar acentos y convertir a minúsculas)
const normalizarTexto = (texto: string): string => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

export default function ListaClientes() {
  // Estados
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<ClienteSearchParams>({
    page: 1,
    limit: 10,
    sortBy: "nombreCompleto",
    sortOrder: "asc",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    current: 1,
  });

  // Estados para búsqueda y filtros múltiples
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState<FiltroIndividual[]>([]);

  // Estado para contador total
  const [totalClientes, setTotalClientes] = useState<number>(0);
  const [countLoading, setCountLoading] = useState(false);

  // Estados para eliminación
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState<{
    id: string;
    nombre: string;
  } | null>(null);

  // Estado para exportación
  const { downloadFile, downloading: exportLoading } = useFileDownload();
  const [, setExportError] = useState<string | null>(null);

  // Estados para modal de observaciones
  const [showObservacionesModal, setShowObservacionesModal] = useState(false);
  const [observacionesSeleccionadas, setObservacionesSeleccionadas] = useState<{
    cliente: string;
    texto: string;
  } | null>(null);

  // Estados para búsqueda avanzada por observaciones
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchKeywords, setSearchKeywords] = useState<string>("");
  const [searchType, setSearchType] = useState<"exact" | "fuzzy" | "any">(
    "any"
  );
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    items: Cliente[];
    total: number;
    matchedKeywords: string[];
  } | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Función para exportar a Excel
  const handleExportToExcel = async () => {
    try {
      setExportError(null);

      // Construir parámetros de exportación
      const exportParams: Omit<
        ClienteSearchParams,
        "page" | "limit" | "sortBy" | "sortOrder"
      > = {};

      // Solo agregar parámetros si tienen valores válidos
      if (searchParams.q && searchParams.q.trim()) {
        exportParams.q = searchParams.q;
      }

      // Solo agregar filtros si existen y tienen valores
      if (
        searchParams.filters &&
        Object.keys(searchParams.filters).length > 0
      ) {
        const hasValidFilters = Object.values(searchParams.filters).some(
          (v) => v && v.trim()
        );
        if (hasValidFilters) {
          exportParams.filters = searchParams.filters;
        }
      }

      // Solo agregar rangos si existen y tienen valores
      if (searchParams.ranges && Object.keys(searchParams.ranges).length > 0) {
        const hasValidRanges = Object.values(searchParams.ranges).some(
          (v) => v !== undefined
        );
        if (hasValidRanges) {
          exportParams.ranges = searchParams.ranges;
        }
      }

      const blob = await ClienteService.exportToExcel(exportParams);

      // Generar nombre del archivo con timestamp
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/[T:]/g, "-");
      const filename = `clientes-${timestamp}.xlsx`;

      downloadFile(blob, filename);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Error al exportar");
    }
  };

  // Cargar clientes
  const cargarClientes = async (params: ClienteSearchParams) => {
    try {
      setLoading(true);
      setError(null);

      const response: ClienteSearchResponse = await ClienteService.search(
        params
      );

      setClientes(response.items);
      setPagination({
        total: response.total,
        pages: response.pages,
        current: response.page,
      });
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      setError(err instanceof Error ? err.message : "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  // Cargar contador de clientes
  const cargarCount = async (params: ClienteSearchParams) => {
    try {
      setCountLoading(true);

      // Crear parámetros sin paginación para el count
      const countParams = {
        q: params.q,
        filters: params.filters,
        ranges: params.ranges,
      };

      const total = await ClienteService.count(countParams);
      setTotalClientes(total);
    } catch (err) {
      console.error("Error al cargar count:", err);
      // No mostramos error de count para no molestar al usuario
    } finally {
      setCountLoading(false);
    }
  };

  // Efecto para cargar datos
  useEffect(() => {
    cargarClientes(searchParams);
    cargarCount(searchParams);
  }, [searchParams]);

  // Agregar nuevo filtro
  const agregarFiltro = () => {
    const nuevoFiltro: FiltroIndividual = {
      id: Date.now().toString(),
      campo: "",
      valor: "",
    };
    setFiltros([...filtros, nuevoFiltro]);
  };

  // Eliminar filtro
  const eliminarFiltro = (id: string) => {
    setFiltros(filtros.filter((f) => f.id !== id));
  };

  // Actualizar filtro
  const actualizarFiltro = (id: string, campo: string, valor: string) => {
    setFiltros(filtros.map((f) => (f.id === id ? { ...f, campo, valor } : f)));
  };

  // Manejar búsqueda de texto
  const handleSearch = () => {
    const searchTextNormalizado = normalizarTexto(searchText);

    const newParams: ClienteSearchParams = {
      ...searchParams,
      q: searchTextNormalizado || undefined,
      page: 1,
    };

    // Agregar filtros múltiples (también normalizados)
    const filtrosActivos = filtros.filter((f) => f.campo && f.valor.trim());
    if (filtrosActivos.length > 0) {
      const filtrosMap: FiltrosMap = {};
      filtrosActivos.forEach((filtro) => {
        filtrosMap[filtro.campo] = normalizarTexto(filtro.valor);
      });
      newParams.filters = filtrosMap;
    }

    setSearchParams(newParams);
  };

  // Manejar aplicación de filtros múltiples
  const handleApplyFilters = () => {
    const filtrosActivos = filtros.filter((f) => f.campo && f.valor.trim());

    if (filtrosActivos.length === 0) {
      alert("Por favor agrega al menos un filtro con campo y valor");
      return;
    }

    const newParams: ClienteSearchParams = {
      ...searchParams,
      page: 1,
    };

    // Aplicar todos los filtros activos (normalizados)
    const filtrosMap: FiltrosMap = {};
    filtrosActivos.forEach((filtro) => {
      filtrosMap[filtro.campo] = normalizarTexto(filtro.valor);
    });
    newParams.filters = filtrosMap;

    setSearchParams(newParams);
  };

  // Manejar cambio de página
  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  };

  // Manejar ordenamiento
  const handleSort = (field: keyof Cliente | "createdAt" | "updatedAt") => {
    const newOrder =
      searchParams.sortBy === field && searchParams.sortOrder === "asc"
        ? "desc"
        : "asc";
    setSearchParams((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: newOrder,
      page: 1,
    }));
  };

  // Limpiar todo
  const limpiarTodo = () => {
    setSearchText("");
    setFiltros([]);
    setSearchParams({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  // Función para búsqueda por observaciones
  const handleSearchObservaciones = async () => {
    if (!searchKeywords.trim()) {
      alert("Por favor ingresa al menos una palabra clave");
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);

      // Convertir string de keywords en array
      const keywordsArray = searchKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const response = await ClienteService.searchObservaciones({
        keywords: keywordsArray,
        searchType: searchType,
        page: 1,
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      setSearchResults(response);
      setClientes(response.items);
      setPagination({
        total: response.total,
        pages: response.pages,
        current: response.page,
      });
      setIsSearchMode(true);
      setShowSearchModal(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error en búsqueda por observaciones"
      );
    } finally {
      setSearchLoading(false);
    }
  };

  // Función para volver a la búsqueda normal
  const volverABusquedaNormal = () => {
    setIsSearchMode(false);
    setSearchResults(null);
    setSearchKeywords("");
    cargarClientes(searchParams);
  };

  // Manejar eliminación de cliente
  const handleDelete = (clienteId: string, nombreCliente: string) => {
    setClienteAEliminar({ id: clienteId, nombre: nombreCliente });
    setShowDeleteConfirm(true);
  };

  // Confirmar eliminación
  const confirmarEliminacion = async () => {
    if (!clienteAEliminar) return;

    try {
      setDeleteLoading(clienteAEliminar.id);
      setError(null);

      const resultado = await ClienteService.delete(clienteAEliminar.id);

      // Mostrar mensaje de éxito
      alert(resultado.message);

      // Recargar la lista
      await cargarClientes(searchParams);
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al eliminar cliente");
      }
    } finally {
      setDeleteLoading(null);
      setShowDeleteConfirm(false);
      setClienteAEliminar(null);
    }
  };

  // Cancelar eliminación
  const cancelarEliminacion = () => {
    setShowDeleteConfirm(false);
    setClienteAEliminar(null);
  };

  // Formatear fecha
  const formatearFecha = (fecha?: string) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-ES");
  };

  // Obtener filtros activos para mostrar
  const filtrosActivos = filtros.filter((f) => f.campo && f.valor.trim());

  // Renderizar estado de carga
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando clientes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Renderizar error
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => cargarClientes(searchParams)}
              variant="outline"
            >
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-600" />
            Buscar Clientes
            <span className="text-sm font-normal text-slate-500">
              (sin acentos ni mayúsculas/minúsculas)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Búsqueda principal - Responsive */}
            <div className="space-y-3">
              {/* Barra de búsqueda */}
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por nombre, email, teléfono... (ej: jose, maría, PÉREZ)"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSearch}
                  className="bg-cyan-500 hover:bg-cyan-600 flex-shrink-0"
                >
                  <Search className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Buscar</span>
                </Button>
              </div>

              {/* Botones de acción - Responsive */}
              <div className="grid grid-cols-2 sm:flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full sm:w-auto"
                >
                  <Filter className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Filtros</span>
                  <span className="sm:hidden">Filtros</span>
                  {filtrosActivos.length > 0 && (
                    <span className="ml-1">({filtrosActivos.length})</span>
                  )}
                </Button>

                <Button
                  onClick={handleExportToExcel}
                  disabled={exportLoading}
                  className="bg-green-700 hover:bg-green-800 text-white w-full sm:w-auto"
                >
                  <Download className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {exportLoading ? "Exportando..." : "Excel"}
                  </span>
                  <span className="sm:hidden">Excel</span>
                </Button>

                <Button
                  onClick={() => setShowSearchModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto col-span-2 sm:col-span-1"
                >
                  <Search className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Observaciones</span>
                  <span className="sm:hidden">Observaciones</span>
                </Button>
              </div>
            </div>

            {/* Panel de filtros múltiples - Responsive container */}
            {showFilters && (
              <div className="mx-2 sm:mx-0 p-3 sm:p-4 bg-slate-50 rounded-lg space-y-4 overflow-hidden">
                {/* Lista de filtros */}
                {filtros.map((filtro, index) => (
                  <div
                    key={filtro.id}
                    className="grid grid-cols-1 gap-3 p-3 bg-white rounded border overflow-hidden"
                  >
                    {/* Campo y valor en móvil apilados */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-sm">Campo {index + 1}</Label>
                        <Select
                          value={filtro.campo}
                          onChange={(e) =>
                            actualizarFiltro(
                              filtro.id,
                              e.target.value,
                              filtro.valor
                            )
                          }
                          className="w-full"
                        >
                          <option value="">Seleccionar campo</option>
                          {CAMPO_OPTIONS.map((campo) => (
                            <option key={campo.value} value={campo.value}>
                              {campo.label}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div className="sm:col-span-2">
                        <Label className="text-sm">Valor a buscar</Label>
                        <Input
                          placeholder="Escribe el valor (sin acentos)..."
                          value={filtro.valor}
                          onChange={(e) =>
                            actualizarFiltro(
                              filtro.id,
                              filtro.campo,
                              e.target.value
                            )
                          }
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleApplyFilters()
                          }
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Botón eliminar */}
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarFiltro(filtro.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Botones de acción */}
                <div className="flex gap-2 justify-between">
                  <Button
                    variant="outline"
                    onClick={agregarFiltro}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Filtro
                  </Button>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleApplyFilters}
                      className="bg-blue-500 hover:bg-blue-600 flex-1 sm:flex-none"
                      disabled={filtros.length === 0}
                    >
                      Aplicar Filtros
                    </Button>
                    <Button
                      onClick={limpiarTodo}
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      Limpiar Todo
                    </Button>
                  </div>
                </div>

                {/* Mostrar filtros activos */}
                {filtrosActivos.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      Filtros activos ({filtrosActivos.length}):
                    </p>
                    <div className="space-y-1">
                      {filtrosActivos.map((filtro, index) => (
                        <p key={filtro.id} className="text-sm text-blue-700">
                          {index + 1}.{" "}
                          <strong>
                            {
                              CAMPO_OPTIONS.find(
                                (c) => c.value === filtro.campo
                              )?.label
                            }
                          </strong>{" "}
                          = &quot;{filtro.valor}&quot;
                          <span className="text-xs text-blue-500 ml-2">
                            (búsqueda: &quot;{normalizarTexto(filtro.valor)}
                            &quot;)
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mensaje cuando no hay filtros */}
                {filtros.length === 0 && (
                  <div className="text-center py-6 text-slate-500">
                    <Filter className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>No hay filtros agregados</p>
                    <p className="text-sm">
                      Haz clic en &quot;Agregar Filtro&quot; para comenzar
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Resultados */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              {isSearchMode
                ? "Resultados en Observaciones"
                : "Clientes Encontrados"}
              {isSearchMode && searchResults && (
                <span className="text-sm font-normal text-purple-600">
                  ({searchResults.total} resultados | Keywords:{" "}
                  {searchResults.matchedKeywords.join(", ")})
                </span>
              )}
              {!isSearchMode && countLoading ? (
                <span className="text-sm font-normal text-slate-500">
                  (cargando...)
                </span>
              ) : !isSearchMode ? (
                <span className="text-sm font-normal text-slate-500">
                  ({pagination.total} de {totalClientes} total)
                </span>
              ) : null}
            </CardTitle>
            <div className="text-sm text-slate-600">
              Página {pagination.current} de {pagination.pages}
              {isSearchMode && (
                <Button
                  onClick={volverABusquedaNormal}
                  size="sm"
                  variant="outline"
                  className="ml-4 text-purple-600 border-purple-600 hover:bg-purple-50"
                >
                  ← Volver a búsqueda normal
                </Button>
              )}
            </div>
            <div className="text-sm text-slate-600">
              Página {pagination.current} de {pagination.pages}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {clientes.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No se encontraron clientes
              </h3>
              <p className="text-slate-600">
                Intenta ajustar los filtros de búsqueda o crear un nuevo
                cliente.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Encabezados de tabla - Solo para desktop */}
              <div className="hidden md:grid md:grid-cols-6 gap-4 pb-2 border-b border-slate-200 font-medium text-slate-700">
                <button
                  onClick={() => handleSort("nombreCompleto")}
                  className="flex items-center gap-1 hover:text-cyan-600"
                >
                  Cliente
                  {searchParams.sortBy === "nombreCompleto" &&
                    (searchParams.sortOrder === "asc" ? (
                      <SortAsc className="w-4 h-4" />
                    ) : (
                      <SortDesc className="w-4 h-4" />
                    ))}
                </button>
                <button
                  onClick={() => handleSort("correoElectronico")}
                  className="flex items-center gap-1 hover:text-cyan-600"
                >
                  Contacto
                  {searchParams.sortBy === "correoElectronico" &&
                    (searchParams.sortOrder === "asc" ? (
                      <SortAsc className="w-4 h-4" />
                    ) : (
                      <SortDesc className="w-4 h-4" />
                    ))}
                </button>
                <button
                  onClick={() => handleSort("provincia")}
                  className="flex items-center gap-1 hover:text-cyan-600"
                >
                  Ubicación
                  {searchParams.sortBy === "provincia" &&
                    (searchParams.sortOrder === "asc" ? (
                      <SortAsc className="w-4 h-4" />
                    ) : (
                      <SortDesc className="w-4 h-4" />
                    ))}
                </button>
                <button
                  onClick={() => handleSort("tipoVehiculo")}
                  className="flex items-center gap-1 hover:text-cyan-600"
                >
                  Vehículo
                  {searchParams.sortBy === "tipoVehiculo" &&
                    (searchParams.sortOrder === "asc" ? (
                      <SortAsc className="w-4 h-4" />
                    ) : (
                      <SortDesc className="w-4 h-4" />
                    ))}
                </button>
                <button
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center gap-1 hover:text-cyan-600"
                >
                  Registro
                  {searchParams.sortBy === "createdAt" &&
                    (searchParams.sortOrder === "asc" ? (
                      <SortAsc className="w-4 h-4" />
                    ) : (
                      <SortDesc className="w-4 h-4" />
                    ))}
                </button>
                <div className="text-slate-700 font-medium">Acciones</div>
              </div>

              {/* Lista de clientes */}
              {clientes.map((cliente) => (
                <div
                  key={cliente._id}
                  className="bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Layout responsivo para todos los tamaños */}
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 p-3 md:p-4">
                    {/* Cliente */}
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">
                        {cliente.nombreCompleto || "Sin nombre"}
                      </p>
                      <p className="text-sm text-slate-600">
                        {formatearFecha(cliente.fechaNacimiento)}
                      </p>
                      {/* NUEVO - Tipo de cliente aquí abajo de la fecha */}
                      {cliente.tipoCliente && (
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            cliente.tipoCliente === "Comprador"
                              ? "bg-green-100 text-green-800"
                              : cliente.tipoCliente === "Vendedor"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {cliente.tipoCliente}
                        </span>
                      )}
                    </div>

                    {/* Contacto */}
                    <div className="space-y-1">
                      {cliente.correoElectronico && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span
                            className="text-slate-600 truncate"
                            title={cliente.correoElectronico}
                          >
                            {cliente.correoElectronico}
                          </span>
                        </div>
                      )}
                      {cliente.telefonoCelular && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span
                            className="text-slate-600 truncate"
                            title={cliente.telefonoCelular}
                          >
                            {cliente.telefonoCelular}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Ubicación */}
                    <div className="space-y-1">
                      {(cliente.provincia || cliente.localidad) && (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-600">
                            {[cliente.localidad, cliente.provincia]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                      {cliente.direccion && (
                        <p className="text-xs text-slate-500 truncate">
                          {cliente.direccion}
                        </p>
                      )}
                    </div>

                    {/* Vehículo */}
                    <div className="space-y-1">
                      {cliente.tipoVehiculo && (
                        <div className="flex items-center gap-1 text-sm">
                          <Car className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-600">
                            {cliente.tipoVehiculo}
                          </span>
                        </div>
                      )}
                      {(cliente.marca || cliente.modelo) && (
                        <p className="text-xs text-slate-500">
                          {[cliente.marca, cliente.modelo]
                            .filter(Boolean)
                            .join(" ")}
                          {cliente.anioCompra && ` (${cliente.anioCompra})`}
                        </p>
                      )}
                      {/* NUEVO - Observaciones con botón para modal */}
                      {cliente.observaciones && (
                        <button
                          onClick={() => {
                            setObservacionesSeleccionadas({
                              cliente: cliente.nombreCompleto || "Sin nombre",
                              texto: cliente.observaciones!,
                            });
                            setShowObservacionesModal(true);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline text-left"
                        >
                          📝{" "}
                          {cliente.observaciones.length > 30
                            ? `${cliente.observaciones.substring(
                                0,
                                30
                              )}... (ver completo)`
                            : cliente.observaciones}
                        </button>
                      )}
                    </div>

                    {/* Registro */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-600">
                          {formatearFecha(cliente.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2">
                      <Link href={`/admin/clientes/editar/${cliente._id}`}>
                        <Button
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2"
                          title="Editar cliente"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white p-2"
                        title="Eliminar cliente"
                        onClick={() =>
                          handleDelete(
                            cliente._id!,
                            cliente.nombreCompleto || "Sin nombre"
                          )
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación - Responsive */}
          {pagination.pages > 1 && (
            <div className="mt-6 pt-4 border-t border-slate-200 space-y-4">
              {/* Información de resultados */}
              <div className="text-sm text-slate-600 text-center">
                Mostrando {(pagination.current - 1) * searchParams.limit! + 1} -{" "}
                {Math.min(
                  pagination.current * searchParams.limit!,
                  pagination.total
                )}{" "}
                de {pagination.total} clientes
              </div>

              {/* Controles de paginación - Mobile first */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                {/* Botón Anterior */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={pagination.current === 1}
                  className="w-full sm:w-auto"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>

                {/* Números de página - Responsive */}
                <div className="flex gap-1 flex-wrap justify-center">
                  {(() => {
                    const maxVisiblePages = 5;
                    const totalPages = pagination.pages;
                    const currentPage = pagination.current;

                    let startPage = Math.max(
                      1,
                      currentPage - Math.floor(maxVisiblePages / 2)
                    );
                    const endPage = Math.min(
                      totalPages,
                      startPage + maxVisiblePages - 1
                    );

                    // Ajustar si no hay suficientes páginas al final
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    const pages = [];
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(i);
                    }

                    return pages.map((page) => (
                      <Button
                        key={page}
                        variant={
                          pagination.current === page ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`min-w-[40px] ${
                          pagination.current === page
                            ? "bg-cyan-500 hover:bg-cyan-600"
                            : ""
                        }`}
                      >
                        {page}
                      </Button>
                    ));
                  })()}
                </div>

                {/* Botón Siguiente */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={pagination.current === pagination.pages}
                  className="w-full sm:w-auto"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Modal de observaciones */}
      {showObservacionesModal && observacionesSeleccionadas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                Observaciones - {observacionesSeleccionadas.cliente}
              </h3>
              <button
                onClick={() => {
                  setShowObservacionesModal(false);
                  setObservacionesSeleccionadas(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border overflow-hidden">
              <div className="max-w-full overflow-x-auto">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed break-all">
                  {observacionesSeleccionadas.texto}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => {
                  setShowObservacionesModal(false);
                  setObservacionesSeleccionadas(null);
                }}
                variant="outline"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de búsqueda avanzada por observaciones */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                Buscar en Observaciones
              </h3>
              <button
                onClick={() => {
                  setShowSearchModal(false);
                  setSearchKeywords(""); // Limpiar al cerrar
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="keywords"
                  className="text-slate-700 font-medium"
                >
                  Palabras clave (separadas por comas)
                </Label>
                <Input
                  id="keywords"
                  value={searchKeywords}
                  onChange={(e) => setSearchKeywords(e.target.value)}
                  placeholder="motor, reparación, urgente"
                  className="mt-1"
                  onKeyDown={(e) => {
                    // Permitir buscar con Enter
                    if (e.key === "Enter" && !searchLoading) {
                      handleSearchObservaciones();
                    }
                  }}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Ejemplo: &apos;motor, reparación&apos; buscará ambas palabras
                </p>
              </div>
              <div>
                <Label className="text-slate-700 font-medium">
                  Tipo de búsqueda
                </Label>
                <select
                  value={searchType}
                  onChange={(e) =>
                    setSearchType(e.target.value as "exact" | "fuzzy" | "any")
                  }
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none"
                >
                  <option value="any">
                    Cualquier palabra (más resultados)
                  </option>
                  <option value="exact">
                    Todas las palabras (más específico)
                  </option>
                  <option value="fuzzy">
                    Búsqueda aproximada (con errores)
                  </option>
                </select>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Consejos:</strong>
                </p>
                <ul className="text-xs text-blue-700 mt-1 space-y-1">
                  <li>
                    • <strong>Cualquier:</strong> Encuentra clientes con al
                    menos una palabra
                  </li>
                  <li>
                    • <strong>Todas:</strong> Encuentra clientes que tengan
                    todas las palabras
                  </li>
                  <li>
                    • <strong>Aproximada:</strong> Encuentra palabras similares
                    (ej: &quot;motor&quot; → &quot;moto&quot;)
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => {
                  setShowSearchModal(false);
                  setSearchKeywords(""); // Limpiar al cancelar
                }}
                variant="outline"
                className="flex-1"
                disabled={searchLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSearchObservaciones}
                disabled={searchLoading || !searchKeywords.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              >
                {searchLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Opcional: Mostrar resultados de búsqueda de observaciones */}
      {isSearchMode && searchResults && (
        <Card className="mb-6">
          <CardHeader className="bg-purple-50">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Search className="w-5 h-5" />
                Resultados de Búsqueda en Observaciones
                <span className="text-sm font-normal">
                  ({searchResults.total} encontrados)
                </span>
              </CardTitle>
              <Button
                onClick={volverABusquedaNormal}
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-200 hover:bg-purple-100"
              >
                Volver a búsqueda normal
              </Button>
            </div>
            {searchResults.matchedKeywords &&
              searchResults.matchedKeywords.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  <span className="text-sm text-purple-600">
                    Palabras encontradas:
                  </span>
                  {searchResults.matchedKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
          </CardHeader>
        </Card>
      )}
      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && clienteAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Eliminar Cliente
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                ¿Estás seguro de que quieres eliminar a{" "}
                <span className="font-medium text-gray-900">
                  {clienteAEliminar.nombre}
                </span>
                ? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={cancelarEliminacion}
                  variant="outline"
                  className="flex-1"
                  disabled={deleteLoading === clienteAEliminar.id}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmarEliminacion}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  disabled={deleteLoading === clienteAEliminar.id}
                >
                  {deleteLoading === clienteAEliminar.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
