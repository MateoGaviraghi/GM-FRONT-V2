"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  AdminButton,
  Badge,
  ConfirmDialog,
  DataTable,
  type DataTableColumn,
  Field,
  Modal,
  SelectField,
  TextInput,
  mapApiError,
  useToast,
} from "@/components/admin/kit";
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
  ArrowLeftCircle,
  Plus,
  X,
  FileText,
} from "lucide-react";
import {
  ClienteService,
  ClienteSearchParams,
  ClienteSearchResponse,
} from "@/services";
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

  const { showToast } = useToast();

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
      showToast({ variant: "success", message: "El archivo Excel se descargó correctamente." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al exportar";
      setExportError(message);
      showToast({ variant: "danger", message: mapApiError(err) });
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
      showToast({ variant: "danger", message: mapApiError(err) });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Búsqueda automática con debounce de 300ms mientras se tipea.
  // Único flujo: input → estado local (searchText/filtros) → debounce 300ms →
  // searchParams → UN useEffect que hace ambos fetch. Se saltea la corrida
  // inicial para no duplicar el fetch del montaje.
  const skipInitialDebounce = useRef(true);
  useEffect(() => {
    if (skipInitialDebounce.current) {
      skipInitialDebounce.current = false;
      return;
    }
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, filtros]);

  // Manejar aplicación de filtros múltiples
  const handleApplyFilters = () => {
    const filtrosActivos = filtros.filter((f) => f.campo && f.valor.trim());

    if (filtrosActivos.length === 0) {
      showToast({
        variant: "warn",
        message: "Agregá al menos un filtro con campo y valor antes de aplicar.",
      });
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
      showToast({ variant: "warn", message: "Ingresá al menos una palabra clave para buscar." });
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
      showToast({ variant: "danger", message: mapApiError(err) });
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
  const handleDelete = useCallback((clienteId: string, nombreCliente: string) => {
    setClienteAEliminar({ id: clienteId, nombre: nombreCliente });
    setShowDeleteConfirm(true);
  }, []);

  // Confirmar eliminación
  const confirmarEliminacion = async () => {
    if (!clienteAEliminar) return;

    try {
      setDeleteLoading(clienteAEliminar.id);
      setError(null);

      const resultado = await ClienteService.delete(clienteAEliminar.id);

      showToast({ variant: "success", message: resultado.message });

      // Recargar la lista
      await cargarClientes(searchParams);
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al eliminar cliente");
      }
      showToast({ variant: "danger", message: mapApiError(err) });
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
  const formatearFecha = useCallback((fecha?: string) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-ES");
  }, []);

  // Obtener filtros activos para mostrar
  const filtrosActivos = filtros.filter((f) => f.campo && f.valor.trim());

  const columns: DataTableColumn<Cliente>[] = useMemo(() => [
    {
      key: "nombreCompleto",
      header: "Cliente",
      sortable: true,
      render: (cliente) => (
        <div className="space-y-1.5">
          <p className="font-medium text-gray-900">
            {cliente.nombreCompleto || "Sin nombre"}
          </p>
          <p className="text-[15.5px] text-gray-500">
            {formatearFecha(cliente.fechaNacimiento)}
          </p>
          {cliente.tipoCliente && (
            <Badge
              variant={
                cliente.tipoCliente === "Comprador"
                  ? "success"
                  : cliente.tipoCliente === "Vendedor"
                  ? "petrol"
                  : "warn"
              }
            >
              {cliente.tipoCliente}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "correoElectronico",
      header: "Contacto",
      sortable: true,
      render: (cliente) => (
        <div className="space-y-1.5">
          {cliente.correoElectronico && (
            <div className="flex items-center gap-1.5 text-[15.5px]">
              <Mail className="size-4 shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
              <span className="truncate text-gray-700" title={cliente.correoElectronico}>
                {cliente.correoElectronico}
              </span>
            </div>
          )}
          {cliente.telefonoCelular && (
            <div className="flex items-center gap-1.5 text-[15.5px]">
              <Phone className="size-4 shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
              <span className="truncate text-gray-700" title={cliente.telefonoCelular}>
                {cliente.telefonoCelular}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "provincia",
      header: "Ubicación",
      sortable: true,
      render: (cliente) => (
        <div className="space-y-1.5">
          {(cliente.provincia || cliente.localidad) && (
            <div className="flex items-center gap-1.5 text-[15.5px]">
              <MapPin className="size-4 shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
              <span className="text-gray-700">
                {[cliente.localidad, cliente.provincia].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
          {cliente.direccion && (
            <p className="truncate text-[15.5px] text-gray-500">{cliente.direccion}</p>
          )}
        </div>
      ),
    },
    {
      key: "tipoVehiculo",
      header: "Vehículo",
      sortable: true,
      render: (cliente) => (
        <div className="space-y-1.5">
          {cliente.tipoVehiculo && (
            <div className="flex items-center gap-1.5 text-[15.5px]">
              <Car className="size-4 shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
              <span className="text-gray-700">{cliente.tipoVehiculo}</span>
            </div>
          )}
          {(cliente.marca || cliente.modelo) && (
            <p className="text-[15.5px] text-gray-500">
              {[cliente.marca, cliente.modelo].filter(Boolean).join(" ")}
              {cliente.anioCompra && ` (${cliente.anioCompra})`}
            </p>
          )}
          {cliente.observaciones && (
            <button
              type="button"
              onClick={() => {
                setObservacionesSeleccionadas({
                  cliente: cliente.nombreCompleto || "Sin nombre",
                  texto: cliente.observaciones!,
                });
                setShowObservacionesModal(true);
              }}
              className="flex items-center gap-1 text-left text-[15.5px] font-semibold text-indigo-600 underline-offset-2 hover:underline"
            >
              <FileText className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              {cliente.observaciones.length > 30
                ? `${cliente.observaciones.substring(0, 30)}… (ver completo)`
                : cliente.observaciones}
            </button>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Registro",
      sortable: true,
      render: (cliente) => (
        <div className="flex items-center gap-1.5 text-[15.5px]">
          <Calendar className="size-4 shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
          <span className="text-gray-700">{formatearFecha(cliente.createdAt)}</span>
        </div>
      ),
    },
  ], [formatearFecha]);

  const renderActions = useCallback(
    (cliente: Cliente) => (
      <>
        <AdminButton
          variant="secondary"
          icon={Edit}
          className="h-10 px-4 text-[15px]"
          href={`/admin/clientes/editar/${cliente._id}`}
        >
          Editar
        </AdminButton>
        <button
          type="button"
          disabled={deleteLoading === cliente._id}
          onClick={() => handleDelete(cliente._id!, cliente.nombreCompleto || "Sin nombre")}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 text-[15px] font-semibold text-red-600 transition-colors duration-150 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-900/10 disabled:pointer-events-none disabled:opacity-50"
        >
          <Trash2 className="size-4.5 shrink-0" strokeWidth={2} aria-hidden />
          <span>Eliminar</span>
        </button>
      </>
    ),
    [deleteLoading, handleDelete]
  );

  const toolbar = (
    <div className="space-y-4">
      {/* Búsqueda principal */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <TextInput
          placeholder="Buscar por nombre, email, teléfono... (ej: jose, maría, PÉREZ)"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <AdminButton variant="primary" icon={Search} onClick={handleSearch}>
          Buscar
        </AdminButton>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-2">
        <AdminButton
          variant="secondary"
          icon={Filter}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Ocultar filtros" : "Filtros"}
          {filtrosActivos.length > 0 ? ` (${filtrosActivos.length})` : ""}
        </AdminButton>

        <AdminButton
          variant="secondary"
          icon={Download}
          onClick={handleExportToExcel}
          disabled={exportLoading}
        >
          {exportLoading ? "Exportando…" : "Exportar a Excel"}
        </AdminButton>

        <AdminButton variant="secondary" icon={Search} onClick={() => setShowSearchModal(true)}>
          Buscar en observaciones
        </AdminButton>

        {isSearchMode && (
          <AdminButton variant="secondary" icon={ArrowLeftCircle} onClick={volverABusquedaNormal}>
            Volver a búsqueda normal
          </AdminButton>
        )}
      </div>

      {/* Panel de filtros múltiples */}
      {showFilters && (
        <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
          {filtros.map((filtro, index) => (
            <div key={filtro.id} className="space-y-3 rounded-xl border border-gray-100 bg-white p-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label={`Campo ${index + 1}`}>
                  <SelectField
                    value={filtro.campo}
                    onChange={(e) => actualizarFiltro(filtro.id, e.target.value, filtro.valor)}
                  >
                    <option value="">Seleccionar campo</option>
                    {CAMPO_OPTIONS.map((campo) => (
                      <option key={campo.value} value={campo.value}>
                        {campo.label}
                      </option>
                    ))}
                  </SelectField>
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Valor a buscar">
                    <TextInput
                      placeholder="Escribí el valor (sin acentos)…"
                      value={filtro.valor}
                      onChange={(e) => actualizarFiltro(filtro.id, filtro.campo, e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
                    />
                  </Field>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => eliminarFiltro(filtro.id)}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 text-[15px] font-semibold text-red-600 transition-colors duration-150 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-900/10"
                >
                  <X className="size-4.5 shrink-0" strokeWidth={2} aria-hidden />
                  <span>Eliminar filtro</span>
                </button>
              </div>
            </div>
          ))}

          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <AdminButton variant="secondary" icon={Plus} onClick={agregarFiltro}>
              Agregar filtro
            </AdminButton>

            <div className="flex flex-col gap-2 sm:flex-row">
              <AdminButton variant="primary" onClick={handleApplyFilters} disabled={filtros.length === 0}>
                Aplicar filtros
              </AdminButton>
              <AdminButton variant="secondary" onClick={limpiarTodo}>
                Limpiar todo
              </AdminButton>
            </div>
          </div>

          {filtrosActivos.length > 0 ? (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
              <p className="mb-2 text-[16px] font-semibold text-indigo-700">
                Filtros activos ({filtrosActivos.length}):
              </p>
              <div className="space-y-1">
                {filtrosActivos.map((filtro, index) => (
                  <p key={filtro.id} className="text-[16px] text-indigo-700">
                    {index + 1}.{" "}
                    <strong className="font-semibold">
                      {CAMPO_OPTIONS.find((c) => c.value === filtro.campo)?.label}
                    </strong>{" "}
                    = &quot;{filtro.valor}&quot;
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500">
              <Filter className="mx-auto mb-2 size-8 text-gray-300" strokeWidth={1.5} aria-hidden />
              <p className="text-[16px]">No hay filtros agregados</p>
              <p className="text-[16px]">Hacé clic en &quot;Agregar filtro&quot; para comenzar</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Toolbar de búsqueda y filtros */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">{toolbar}</div>

      {/* Encabezado de resultados */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[15px] text-gray-500">
          <Users className="size-5 text-gray-400" strokeWidth={2} aria-hidden />
          <span className="font-medium text-gray-900">
            {isSearchMode ? "Resultados en observaciones" : "Clientes encontrados"}
          </span>
          {isSearchMode && searchResults ? (
            <span>({searchResults.total} resultados)</span>
          ) : !isSearchMode && countLoading ? (
            <span>(cargando…)</span>
          ) : !isSearchMode ? (
            <span>
              ({pagination.total} de {totalClientes} total)
            </span>
          ) : null}
        </div>
        <span className="text-[15px] text-gray-500">
          Página <span className="font-medium text-gray-900">{pagination.current}</span> de{" "}
          <span className="font-medium text-gray-900">{pagination.pages || 1}</span>
        </span>
      </div>

      {isSearchMode && searchResults && searchResults.matchedKeywords.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
          <span className="text-[16px] text-indigo-700">Palabras encontradas:</span>
          {searchResults.matchedKeywords.map((keyword, index) => (
            <Badge key={index} variant="petrol">
              {keyword}
            </Badge>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
          <X className="mt-0.5 size-5 shrink-0 text-red-600" strokeWidth={2} aria-hidden />
          <div className="flex-1">
            <p className="text-[16px] font-medium text-red-600">{error}</p>
            <div className="mt-3">
              <AdminButton variant="secondary" onClick={() => cargarClientes(searchParams)}>
                Reintentar
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      <DataTable<Cliente>
        columns={columns}
        rows={clientes}
        rowKey={(c) => c._id!}
        loading={loading}
        emptyText="No se encontraron clientes. Probá ajustar los filtros de búsqueda o creá un nuevo cliente."
        sort={{
          key: (searchParams.sortBy as string) ?? "nombreCompleto",
          dir: searchParams.sortOrder ?? "asc",
        }}
        onSortChange={(key) => handleSort(key as keyof Cliente | "createdAt" | "updatedAt")}
        actions={renderActions}
      />

      {/* Paginación numerada */}
      {pagination.pages > 1 && (
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-center text-[15px] text-gray-500">
            Mostrando{" "}
            <span className="font-medium text-gray-900">
              {(pagination.current - 1) * searchParams.limit! + 1}
            </span>{" "}
            -{" "}
            <span className="font-medium text-gray-900">
              {Math.min(pagination.current * searchParams.limit!, pagination.total)}
            </span>{" "}
            de <span className="font-medium text-gray-900">{pagination.total}</span> clientes
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <AdminButton
              variant="secondary"
              icon={ChevronLeft}
              onClick={() => handlePageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
            >
              Anterior
            </AdminButton>

            <div className="flex flex-wrap justify-center gap-2">
              {(() => {
                const maxVisiblePages = 5;
                const totalPages = pagination.pages;
                const currentPage = pagination.current;

                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }

                const pages = [];
                for (let i = startPage; i <= endPage; i++) pages.push(i);

                return pages.map((page) => (
                  <AdminButton
                    key={page}
                    variant={pagination.current === page ? "primary" : "secondary"}
                    onClick={() => handlePageChange(page)}
                    className="min-w-12"
                  >
                    {String(page)}
                  </AdminButton>
                ));
              })()}
            </div>

            <AdminButton
              variant="secondary"
              icon={ChevronRight}
              onClick={() => handlePageChange(pagination.current + 1)}
              disabled={pagination.current === pagination.pages}
            >
              Siguiente
            </AdminButton>
          </div>
        </div>
      )}

      {/* Modal de observaciones completas */}
      <Modal
        open={showObservacionesModal && !!observacionesSeleccionadas}
        onClose={() => {
          setShowObservacionesModal(false);
          setObservacionesSeleccionadas(null);
        }}
        title={`Observaciones — ${observacionesSeleccionadas?.cliente ?? ""}`}
        footer={
          <AdminButton
            variant="secondary"
            onClick={() => {
              setShowObservacionesModal(false);
              setObservacionesSeleccionadas(null);
            }}
          >
            Cerrar
          </AdminButton>
        }
      >
        <div className="max-h-[50vh] overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="whitespace-pre-wrap break-words text-[16px] text-gray-900">
            {observacionesSeleccionadas?.texto}
          </p>
        </div>
      </Modal>

      {/* Modal de búsqueda avanzada por observaciones */}
      <Modal
        open={showSearchModal}
        onClose={() => {
          setShowSearchModal(false);
          setSearchKeywords("");
        }}
        title="Buscar en observaciones"
        footer={
          <>
            <AdminButton
              variant="secondary"
              disabled={searchLoading}
              onClick={() => {
                setShowSearchModal(false);
                setSearchKeywords("");
              }}
            >
              Cancelar
            </AdminButton>
            <AdminButton
              variant="primary"
              icon={searchLoading ? Loader2 : Search}
              disabled={searchLoading || !searchKeywords.trim()}
              onClick={handleSearchObservaciones}
            >
              {searchLoading ? "Buscando…" : "Buscar"}
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <Field
            label="Palabras clave (separadas por comas)"
            htmlFor="keywords"
            hint="Ejemplo: «motor, reparación» buscará ambas palabras."
          >
            <TextInput
              id="keywords"
              value={searchKeywords}
              onChange={(e) => setSearchKeywords(e.target.value)}
              placeholder="motor, reparación, urgente"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !searchLoading) handleSearchObservaciones();
              }}
            />
          </Field>

          <Field label="Tipo de búsqueda">
            <SelectField
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as "exact" | "fuzzy" | "any")}
            >
              <option value="any">Cualquier palabra (más resultados)</option>
              <option value="exact">Todas las palabras (más específico)</option>
              <option value="fuzzy">Búsqueda aproximada (con errores)</option>
            </SelectField>
          </Field>

          <div className="space-y-1.5 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <p className="text-[16px] font-semibold text-gray-900">Consejos:</p>
            <ul className="space-y-1 text-[16px] text-gray-600">
              <li>• Cualquier: encuentra clientes con al menos una palabra.</li>
              <li>• Todas: encuentra clientes que tengan todas las palabras.</li>
              <li>• Aproximada: encuentra palabras similares (ej: &quot;motor&quot; → &quot;moto&quot;).</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={showDeleteConfirm && !!clienteAEliminar}
        onClose={cancelarEliminacion}
        onConfirm={confirmarEliminacion}
        title="Eliminar cliente"
        message={`¿Eliminar a ${clienteAEliminar?.nombre ?? "este cliente"}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        danger
      />
    </div>
  );
}
