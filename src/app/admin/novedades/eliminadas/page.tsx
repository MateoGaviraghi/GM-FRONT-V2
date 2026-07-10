"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Newspaper, RotateCcw, Search, Trash2 } from "lucide-react";
import { novedadService } from "@/services";
import type { Novedad } from "@/types";
import {
  AdminButton,
  Badge,
  Breadcrumb,
  ConfirmDialog,
  DataTable,
  type DataTableColumn,
  mapApiError,
  TextInput,
  useToast,
} from "@/components/admin/kit";

export default function NovedadesEliminadasPage() {
  const { showToast } = useToast();

  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNovedades, setFilteredNovedades] = useState<Novedad[]>([]);

  // Estados de operaciones
  const [busyId, setBusyId] = useState<string | null>(null);
  const [novedadToRestore, setNovedadToRestore] = useState<Novedad | null>(null);
  const [novedadToHardDelete, setNovedadToHardDelete] = useState<Novedad | null>(null);

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
      setError(mapApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const confirmRestore = async () => {
    if (!novedadToRestore) return;

    try {
      setBusyId(novedadToRestore._id);
      await novedadService.admin.restore(novedadToRestore._id);

      showToast({
        message: `La novedad "${novedadToRestore.titulo}" volvió a la lista principal.`,
        variant: "success",
      });

      setNovedadToRestore(null);
      cargarNovedadesEliminadas();
    } catch (err) {
      console.error("Error restaurando novedad:", err);
      showToast({
        title: "No se pudo restaurar la novedad",
        message: mapApiError(err),
        variant: "danger",
      });
    } finally {
      setBusyId(null);
    }
  };

  const confirmHardDelete = async () => {
    if (!novedadToHardDelete) return;

    try {
      setBusyId(novedadToHardDelete._id);
      await novedadService.admin.hardDelete(novedadToHardDelete._id);

      showToast({
        message: `La novedad "${novedadToHardDelete.titulo}" se eliminó permanentemente.`,
        variant: "success",
      });

      setNovedadToHardDelete(null);
      cargarNovedadesEliminadas();
    } catch (err) {
      console.error("Error eliminando novedad permanentemente:", err);
      showToast({
        title: "No se pudo eliminar la novedad",
        message: mapApiError(err),
        variant: "danger",
      });
    } finally {
      setBusyId(null);
    }
  };

  const columns: DataTableColumn<Novedad>[] = [
    {
      key: "titulo",
      header: "Novedad",
      render: (novedad) => (
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50 opacity-70">
            {novedad.imagenes && novedad.imagenes.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={novedad.imagenes[0].thumbnails?.small || novedad.imagenes[0].secure_url}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <Newspaper className="size-5 text-gray-300" strokeWidth={1.75} aria-hidden />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900">{novedad.titulo}</p>
            {novedad.resumen ? (
              <p className="truncate text-gray-500">{novedad.resumen}</p>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      key: "categoria",
      header: "Categoría",
      render: (novedad) =>
        novedad.categoria ? (
          <Badge variant="default">{novedad.categoria}</Badge>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      key: "vistas",
      header: "Vistas",
      render: (novedad) => novedad.vistas,
    },
    {
      key: "eliminada",
      header: "Eliminada el",
      render: (novedad) => new Date(novedad.updatedAt).toLocaleDateString("es-AR"),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Novedades", href: "/admin/novedades" },
          { label: "Papelera" },
        ]}
      />

      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-gray-900">
          Papelera de novedades
        </h1>
        <p className="mt-1.5 text-[16px] text-gray-500">
          {filteredNovedades.length} novedad{filteredNovedades.length !== 1 ? "es" : ""}{" "}
          eliminada{filteredNovedades.length !== 1 ? "s" : ""}
        </p>
      </div>

      {error ? (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-100 bg-red-50 px-4 py-4">
          <p className="text-[16px] font-medium text-red-600">{error}</p>
          <AdminButton variant="secondary" onClick={cargarNovedadesEliminadas}>
            Reintentar
          </AdminButton>
        </div>
      ) : null}

      <DataTable<Novedad>
        columns={columns}
        rows={filteredNovedades}
        rowKey={(row) => row._id}
        loading={loading}
        emptyText={
          searchQuery
            ? "No se encontraron novedades eliminadas con esa búsqueda"
            : "No hay novedades eliminadas. Las que elimines aparecerán acá."
        }
        toolbar={
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400"
              strokeWidth={2}
              aria-hidden
            />
            <TextInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en novedades eliminadas..."
              className="pl-11"
            />
          </div>
        }
        actions={(novedad) => (
          <>
            <AdminButton
              variant="secondary"
              icon={RotateCcw}
              className="h-10 px-4 text-[15px]"
              disabled={busyId === novedad._id}
              onClick={() => setNovedadToRestore(novedad)}
              ariaLabel={`Restaurar ${novedad.titulo}`}
            >
              Restaurar
            </AdminButton>
            <AdminButton
              variant="danger"
              icon={Trash2}
              className="h-10 px-4 text-[15px]"
              disabled={busyId === novedad._id}
              onClick={() => setNovedadToHardDelete(novedad)}
              ariaLabel={`Eliminar permanentemente ${novedad.titulo}`}
            >
              Eliminar permanente
            </AdminButton>
          </>
        )}
      />

      <ConfirmDialog
        open={novedadToRestore !== null}
        onClose={() => setNovedadToRestore(null)}
        onConfirm={confirmRestore}
        title="Restaurar novedad"
        message="¿Restaurar esta novedad? Volverá a la lista principal."
        confirmLabel="Restaurar"
      />

      <ConfirmDialog
        open={novedadToHardDelete !== null}
        onClose={() => setNovedadToHardDelete(null)}
        onConfirm={confirmHardDelete}
        title="Eliminar permanentemente"
        message={
          novedadToHardDelete
            ? `¿Eliminar "${novedadToHardDelete.titulo}" para siempre? Esta acción no se puede deshacer. Se borrarán la novedad, sus ${novedadToHardDelete.imagenes.length} imágenes y todos sus datos asociados.`
            : ""
        }
        confirmLabel="Eliminar para siempre"
        danger
      />

      <div className="flex items-start gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" strokeWidth={2} aria-hidden />
        <p className="text-[16px] text-gray-500">
          &quot;Restaurar&quot; devuelve la novedad a la lista principal. &quot;Eliminar permanente&quot; la borra
          para siempre, incluidas sus imágenes: no hay forma de recuperarla después.
        </p>
      </div>
    </div>
  );
}
