"use client";

import { useState, useEffect } from "react";
import {
  Newspaper,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Star,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { novedadService } from "@/services";
import { useNovedadOptions } from "@/hooks";
import type { Novedad, ListNovedadesParams } from "@/types";

export default function NovedadesListaPage() {
  const { categorias } = useNovedadOptions();

  // Estados de la lista
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  // Estados de filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [destacadaFilter, setDestacadaFilter] = useState<string>("");
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [sortBy, setSortBy] =
    useState<ListNovedadesParams["sortBy"]>("fechaPublicacion");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Estados de UI
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [novedadToDelete, setNovedadToDelete] = useState<Novedad | null>(null);

  useEffect(() => {
    cargarNovedades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, sortOrder, includeDeleted]);

  const cargarNovedades = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: ListNovedadesParams = {
        page,
        limit,
        sortBy,
        sortOrder,
        includeDeleted,
      };

      if (categoriaFilter) {
        params.categoria = categoriaFilter;
      }

      if (destacadaFilter !== "") {
        params.destacada = destacadaFilter === "true";
      }

      let result;
      if (searchQuery.trim()) {
        result = await novedadService.admin.search({
          ...params,
          q: searchQuery,
        });
      } else {
        result = await novedadService.admin.list(params);
      }

      setNovedades(result.items);
      setTotal(result.total);
      setTotalPages(result.pages);
    } catch (err) {
      console.error("Error cargando novedades:", err);
      setError("Error al cargar las novedades");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    cargarNovedades();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoriaFilter("");
    setDestacadaFilter("");
    setIncludeDeleted(false);
    setSortBy("fechaPublicacion");
    setSortOrder("desc");
    setPage(1);
  };

  const handleDelete = async (novedad: Novedad) => {
    setNovedadToDelete(novedad);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!novedadToDelete) return;

    try {
      setDeletingId(novedadToDelete._id);
      await novedadService.admin.delete(novedadToDelete._id);
      setShowDeleteConfirm(false);
      setNovedadToDelete(null);
      cargarNovedades();
    } catch (err) {
      console.error("Error eliminando novedad:", err);
      alert("Error al eliminar la novedad");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      setDeletingId(id);
      await novedadService.admin.restore(id);
      cargarNovedades();
    } catch (err) {
      console.error("Error restaurando novedad:", err);
      alert("Error al restaurar la novedad");
    } finally {
      setDeletingId(null);
    }
  };

  if (error && !loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={cargarNovedades}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-cyan-600" />
            Todas las Novedades
          </h1>
          <p className="text-gray-600 mt-1">{total} novedades encontradas</p>
        </div>

        <Link
          href="/admin/novedades/crear"
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2 w-fit"
        >
          <Plus className="h-4 w-4" />
          Nueva Novedad
        </Link>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
        {/* Búsqueda principal */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título, contenido, categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Buscar
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </button>
        </div>

        {/* Panel de filtros expandible */}
        {showFilters && (
          <div className="pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={categoriaFilter}
                onChange={(e) => setCategoriaFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Todas</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Destacadas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destacadas
              </label>
              <select
                value={destacadaFilter}
                onChange={(e) => setDestacadaFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Todas</option>
                <option value="true">Solo destacadas</option>
                <option value="false">No destacadas</option>
              </select>
            </div>

            {/* Ordenar por */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as ListNovedadesParams["sortBy"])
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="fechaPublicacion">Fecha de publicación</option>
                <option value="titulo">Título</option>
                <option value="categoria">Categoría</option>
                <option value="vistas">Vistas</option>
                <option value="createdAt">Fecha de creación</option>
                <option value="updatedAt">Última actualización</option>
              </select>
            </div>

            {/* Orden */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
              </select>
            </div>

            {/* Incluir eliminadas */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeDeleted"
                checked={includeDeleted}
                onChange={(e) => setIncludeDeleted(e.target.checked)}
                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <label htmlFor="includeDeleted" className="text-sm text-gray-700">
                Mostrar eliminadas
              </label>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 md:col-span-2 lg:col-span-3">
              <button
                onClick={handleSearch}
                className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Limpiar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de novedades */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          </div>
        ) : novedades.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No se encontraron novedades</p>
            <Link
              href="/admin/novedades/crear"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
              <Plus className="h-4 w-4" />
              Crear Novedad
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Novedad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vistas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {novedades.map((novedad) => (
                  <tr
                    key={novedad._id}
                    className={`hover:bg-gray-50 transition-colors ${
                      novedad.deleted ? "bg-red-50" : ""
                    }`}
                  >
                    {/* Novedad */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Imagen thumbnail */}
                        <div className="flex-shrink-0">
                          {novedad.imagenes && novedad.imagenes.length > 0 ? (
                            <Image
                              src={
                                novedad.imagenes[0].thumbnails?.small ||
                                novedad.imagenes[0].secure_url
                              }
                              alt={novedad.titulo}
                              width={48}
                              height={48}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                              <Newspaper className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Título y resumen */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {novedad.titulo}
                          </p>
                          {novedad.resumen && (
                            <p className="text-sm text-gray-500 truncate max-w-md">
                              {novedad.resumen}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {novedad.categoria ? (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {novedad.categoria}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Sin categoría
                        </span>
                      )}
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(novedad.fechaPublicacion).toLocaleDateString(
                          "es-AR"
                        )}
                      </div>
                    </td>

                    {/* Vistas */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Eye className="h-4 w-4" />
                        {novedad.vistas}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {novedad.destacada && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded w-fit">
                            <Star className="h-3 w-3" />
                            Destacada
                          </span>
                        )}
                        {novedad.deleted && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded w-fit">
                            <Trash2 className="h-3 w-3" />
                            Eliminada
                          </span>
                        )}
                        {!novedad.destacada && !novedad.deleted && (
                          <span className="text-sm text-gray-500">Activa</span>
                        )}
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {!novedad.deleted ? (
                          <>
                            <Link
                              href={`/admin/novedades/editar/${novedad._id}`}
                              className="text-cyan-600 hover:text-cyan-900 p-2 hover:bg-cyan-50 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(novedad)}
                              disabled={deletingId === novedad._id}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRestore(novedad._id)}
                            disabled={deletingId === novedad._id}
                            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                            title="Restaurar"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {(page - 1) * limit + 1} -{" "}
              {Math.min(page * limit, total)} de {total} novedades
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-sm text-gray-700">
                Página {page} de {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && novedadToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Eliminar novedad?
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Estás a punto de eliminar la novedad:
                </p>
                <p className="text-sm font-medium text-gray-900 mb-2">
                  &quot;{novedadToDelete.titulo}&quot;
                </p>
                <p className="text-sm text-gray-600">
                  Esta acción es reversible (soft delete). La novedad se
                  ocultará pero podrás restaurarla después.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setNovedadToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deletingId ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
