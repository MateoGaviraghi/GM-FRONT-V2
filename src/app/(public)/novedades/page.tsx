"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Newspaper,
  Search,
  Filter,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  Tag,
  X,
  Star,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { novedadService } from "@/services";
import { useNovedadOptions } from "@/hooks";
import type { Novedad } from "@/types";

export default function NovedadesPublicPage() {
  const { categorias } = useNovedadOptions();

  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(9);

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [destacadaFilter, setDestacadaFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const cargarNovedades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = {
        page,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      // Solo agregar filtros si tienen valor
      if (categoriaFilter) {
        params.categoria = categoriaFilter;
      }

      if (destacadaFilter !== "") {
        params.destacada = destacadaFilter;
      }

      let result;
      if (searchQuery.trim()) {
        result = await novedadService.public.search({
          ...params,
          q: searchQuery,
        });
      } else {
        result = await novedadService.public.list(params);
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
  }, [page, limit, categoriaFilter, destacadaFilter, searchQuery]);

  useEffect(() => {
    cargarNovedades();
  }, [cargarNovedades]);

  const handleSearch = () => {
    setPage(1);
    cargarNovedades();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoriaFilter("");
    setDestacadaFilter("");
    setPage(1);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (categoriaFilter ? 1 : 0) +
    (destacadaFilter ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/novedades/hero-nuevo-novedades.webp"
            alt="Novedades Guzman Motors"
            fill
            className="object-cover"
            quality={100}
            priority
          />
          {/* Overlay para mejorar la legibilidad del texto */}
          <div className="absolute inset-0 bg-slate-900/70"></div>
        </div>

        {/* Efectos de fondo animados */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center pt-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-200 font-medium">ACTUALIDAD</span>
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
            NOVEDADES
          </h1>

          <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-10">
            Mantente informado sobre las últimas noticias, lanzamientos y
            actualizaciones
          </p>

          {/* Barra de búsqueda */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Buscar novedades..."
                className="w-full pl-14 pr-32 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Botón de filtros */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl text-white hover:bg-slate-700/50 transition-all"
            >
              <Filter className="h-5 w-5" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-cyan-500 text-white text-xs font-bold rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Panel de filtros expandible */}
      {showFilters && (
        <div className="bg-slate-900 border-b border-slate-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Categoría */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Categoría
                </label>
                <select
                  value={categoriaFilter}
                  onChange={(e) => {
                    setCategoriaFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destacadas */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Mostrar
                </label>
                <select
                  value={destacadaFilter}
                  onChange={(e) => {
                    setDestacadaFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Todas</option>
                  <option value="true">Solo destacadas</option>
                  <option value="false">No destacadas</option>
                </select>
              </div>

              {/* Botón limpiar */}
              {activeFiltersCount > 0 && (
                <div className="flex items-end">
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Limpiar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filtros activos */}
      {activeFiltersCount > 0 && (
        <div className="bg-slate-100 border-b border-slate-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-600 font-medium">
                Filtros activos:
              </span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                  <Search className="h-3 w-3" />
                  {searchQuery}
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setPage(1);
                    }}
                    className="hover:text-cyan-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {categoriaFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <Tag className="h-3 w-3" />
                  {categoriaFilter}
                  <button
                    onClick={() => {
                      setCategoriaFilter("");
                      setPage(1);
                    }}
                    className="hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {destacadaFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <Star className="h-3 w-3" />
                  {destacadaFilter === "true" ? "Destacadas" : "No destacadas"}
                  <button
                    onClick={() => {
                      setDestacadaFilter("");
                      setPage(1);
                    }}
                    className="hover:text-yellow-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">
                Cargando novedades...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
              <Newspaper className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Error al cargar
              </h3>
              <p className="text-slate-600">{error}</p>
            </div>
          </div>
        )}

        {/* Sin resultados */}
        {!loading && !error && novedades.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="bg-white rounded-2xl shadow-lg p-12 border border-slate-200">
              <Newspaper className="h-20 w-20 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                No se encontraron novedades
              </h3>
              <p className="text-slate-600 mb-6">
                Intenta ajustar los filtros o realizar otra búsqueda
              </p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-all"
                >
                  <X className="h-4 w-4" />
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        )}

        {/* Grid de novedades */}
        {!loading && !error && novedades.length > 0 && (
          <>
            {/* Resultados info */}
            <div className="mb-8">
              <p className="text-slate-600">
                Mostrando{" "}
                <span className="font-semibold text-slate-900">
                  {novedades.length}
                </span>{" "}
                de <span className="font-semibold text-slate-900">{total}</span>{" "}
                novedades
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {novedades.map((novedad) => (
                <Link
                  key={novedad._id}
                  href={`/novedades/${novedad._id}`}
                  className="group"
                >
                  <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-cyan-400 h-full flex flex-col hover:-translate-y-2">
                    {/* Imagen con mejor calidad */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                      {novedad.imagenes &&
                      novedad.imagenes.length > 0 &&
                      novedad.imagenes[0].thumbnails?.large ? (
                        <Image
                          src={novedad.imagenes[0].thumbnails.large}
                          alt={novedad.titulo}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          quality={100}
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                          <Newspaper className="h-20 w-20 text-slate-400" />
                        </div>
                      )}

                      {/* Overlay mejorado */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Badges con mejor diseño */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {novedad.destacada && (
                          <span className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-xl flex items-center gap-1.5 backdrop-blur-sm">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            Destacada
                          </span>
                        )}
                      </div>

                      {/* Indicador de "Leer más" en hover */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <span className="px-4 py-2 bg-white text-cyan-600 font-bold text-sm rounded-full shadow-2xl inline-flex items-center gap-2">
                          Leer más
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Contenido con mejor diseño */}
                    <div className="p-6 flex-1 flex flex-col bg-white">
                      {/* Categoría con mejor estilo */}
                      {novedad.categoria && (
                        <span className="inline-flex w-fit items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 text-xs font-bold rounded-full mb-4 shadow-sm">
                          <Tag className="h-3.5 w-3.5" />
                          {novedad.categoria}
                        </span>
                      )}

                      {/* Título con mejor tipografía */}
                      <h3 className="text-xl font-extrabold text-slate-900 mb-3 line-clamp-2 group-hover:text-cyan-600 transition-colors leading-tight">
                        {novedad.titulo}
                      </h3>

                      {/* Resumen con mejor legibilidad */}
                      {novedad.resumen && (
                        <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                          {novedad.resumen}
                        </p>
                      )}

                      {/* Meta info mejorada */}
                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-200">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {formatDate(novedad.fechaPublicacion)}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Eye className="h-3.5 w-3.5 text-slate-400" />
                          {novedad.vistas}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`p-2 rounded-lg transition-all ${
                    page === 1
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-white text-slate-700 hover:bg-cyan-500 hover:text-white border border-slate-300"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Números de página */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (page <= 3) {
                    pageNumber = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        page === pageNumber
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`p-2 rounded-lg transition-all ${
                    page === totalPages
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-white text-slate-700 hover:bg-cyan-500 hover:text-white border border-slate-300"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
