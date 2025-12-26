"use client";

import { useState, useEffect } from "react";
import {
  Newspaper,
  Trash2,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Search,
  Calendar,
  Eye,
  X,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { novedadService } from "@/services";
import type { Novedad } from "@/types";

export default function NovedadesEliminadasPage() {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNovedades, setFilteredNovedades] = useState<Novedad[]>([]);

  // Estados de operaciones
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [novedadToDelete, setNovedadToDelete] = useState<Novedad | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    cargarNovedadesEliminadas();
  }, []);

  useEffect(() => {
    // Filtrar novedades cuando cambia la búsqueda
    if (searchQuery.trim()) {
      const filtered = novedades.filter(
        (novedad) =>
          novedad.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          novedad.contenido.toLowerCase().includes(searchQuery.toLowerCase()) ||
          novedad.categoria?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNovedades(filtered);
    } else {
      setFilteredNovedades(novedades);
    }
  }, [searchQuery, novedades]);

  const cargarNovedadesEliminadas = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await novedadService.admin.list({
        includeDeleted: true,
        limit: 1000,
      });

      // Filtrar solo las eliminadas
      const eliminadas = result.items.filter((n) => n.deleted);
      setNovedades(eliminadas);
      setFilteredNovedades(eliminadas);
    } catch (err) {
      console.error("Error cargando novedades eliminadas:", err);
      setError("Error al cargar las novedades eliminadas");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (novedad: Novedad) => {
    if (!confirm(`¿Restaurar la novedad "${novedad.titulo}"?`)) {
      return;
    }

    try {
      setRestoringId(novedad._id);
      await novedadService.admin.restore(novedad._id);

      setSuccessMessage(`Novedad "${novedad.titulo}" restaurada exitosamente`);
      setTimeout(() => setSuccessMessage(""), 3000);

      // Recargar lista
      cargarNovedadesEliminadas();
    } catch (err) {
      console.error("Error restaurando novedad:", err);
      alert("Error al restaurar la novedad");
    } finally {
      setRestoringId(null);
    }
  };

  const handleHardDelete = (novedad: Novedad) => {
    setNovedadToDelete(novedad);
    setShowDeleteConfirm(true);
  };

  const confirmHardDelete = async () => {
    if (!novedadToDelete) return;

    try {
      setDeletingId(novedadToDelete._id);
      await novedadService.admin.hardDelete(novedadToDelete._id);

      setSuccessMessage(
        `Novedad "${novedadToDelete.titulo}" eliminada permanentemente`
      );
      setTimeout(() => setSuccessMessage(""), 3000);

      setShowDeleteConfirm(false);
      setNovedadToDelete(null);

      // Recargar lista
      cargarNovedadesEliminadas();
    } catch (err) {
      console.error("Error eliminando novedad permanentemente:", err);
      alert("Error al eliminar la novedad permanentemente");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando novedades eliminadas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={cargarNovedadesEliminadas}
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
          <Link
            href="/admin/novedades"
            className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al dashboard
          </Link>

          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Trash2 className="h-8 w-8 text-red-600" />
            Novedades Eliminadas
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredNovedades.length} novedades eliminadas
          </p>
        </div>
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-green-800 font-medium">{successMessage}</h4>
          </div>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-green-600 hover:text-green-800 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en novedades eliminadas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de novedades eliminadas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredNovedades.length === 0 ? (
          <div className="text-center py-12">
            <Trash2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">
              {searchQuery
                ? "No se encontraron novedades eliminadas"
                : "No hay novedades eliminadas"}
            </p>
            <p className="text-gray-400 text-sm">
              Las novedades eliminadas aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNovedades.map((novedad) => (
              <div
                key={novedad._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Imagen */}
                  <div className="flex-shrink-0">
                    {novedad.imagenes && novedad.imagenes.length > 0 ? (
                      <Image
                        src={
                          novedad.imagenes[0].thumbnails?.small ||
                          novedad.imagenes[0].secure_url
                        }
                        alt={novedad.titulo}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg opacity-60"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center opacity-60">
                        <Newspaper className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {novedad.titulo}
                    </h3>

                    {novedad.resumen && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {novedad.resumen}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {novedad.categoria && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {novedad.categoria}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(novedad.fechaPublicacion).toLocaleDateString(
                          "es-AR"
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {novedad.vistas} vistas
                      </span>
                      <span className="text-red-600 font-medium">
                        Eliminada el{" "}
                        {new Date(novedad.updatedAt).toLocaleDateString(
                          "es-AR"
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleRestore(novedad)}
                      disabled={restoringId === novedad._id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                    >
                      {restoringId === novedad._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Restaurando...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="h-4 w-4" />
                          Restaurar
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleHardDelete(novedad)}
                      disabled={deletingId === novedad._id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Eliminar Permanente
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación permanente */}
      {showDeleteConfirm && novedadToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Eliminar permanentemente?
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Esta acción es <strong>IRREVERSIBLE</strong>. Se eliminará:
                </p>
                <ul className="text-sm text-gray-600 mb-3 list-disc list-inside space-y-1">
                  <li>La novedad &quot;{novedadToDelete.titulo}&quot;</li>
                  <li>
                    Todas sus imágenes ({novedadToDelete.imagenes.length})
                  </li>
                  <li>Todos sus datos asociados</li>
                </ul>
                <p className="text-sm text-red-600 font-medium">
                  No podrás recuperar esta información después.
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
                onClick={confirmHardDelete}
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
                    <AlertTriangle className="h-4 w-4" />
                    Eliminar Permanentemente
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
