"use client";

import { useState, useEffect } from "react";
import { Edit, Eye, Filter, Newspaper, Plus, RotateCcw, Search, Trash2, X } from "lucide-react";
import { novedadService } from "@/services";
import { useNovedadOptions } from "@/hooks";
import type { Novedad, ListNovedadesParams } from "@/types";
import {
  AdminButton,
  Badge,
  type BadgeVariant,
  Breadcrumb,
  ConfirmDialog,
  DataTable,
  type DataTableColumn,
  Field,
  mapApiError,
  SelectField,
  SwitchField,
  TextInput,
  useToast,
} from "@/components/admin/kit";

export default function NovedadesListaPage() {
  const { categorias } = useNovedadOptions();
  const { showToast } = useToast();

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
  const [busyId, setBusyId] = useState<string | null>(null);
  const [novedadToDelete, setNovedadToDelete] = useState<Novedad | null>(null);

  useEffect(() => {
    cargarNovedades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, sortOrder, includeDeleted]);

  // Búsqueda server-side con debounce 300ms mientras se tipea.
  useEffect(() => {
    const handle = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

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
      setError(mapApiError(err));
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
    cargarNovedades();
  };

  const confirmDelete = async () => {
    if (!novedadToDelete) return;

    try {
      setBusyId(novedadToDelete._id);
      await novedadService.admin.delete(novedadToDelete._id);
      setNovedadToDelete(null);
      showToast({
        message: "La novedad se eliminó correctamente.",
        variant: "success",
      });
      cargarNovedades();
    } catch (err) {
      console.error("Error eliminando novedad:", err);
      showToast({
        title: "No se pudo eliminar la novedad",
        message: mapApiError(err),
        variant: "danger",
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      setBusyId(id);
      await novedadService.admin.restore(id);
      showToast({
        message: "La novedad se restauró correctamente.",
        variant: "success",
      });
      cargarNovedades();
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

  function estadoBadges(novedad: Novedad) {
    if (!novedad.destacada && !novedad.deleted) {
      return <span className="text-gray-400">Activa</span>;
    }
    return (
      <div className="flex flex-wrap gap-1.5">
        {novedad.destacada ? <Badge variant="petrol">Destacada</Badge> : null}
        {novedad.deleted ? <Badge variant="danger">Eliminada</Badge> : null}
      </div>
    );
  }

  const columns: DataTableColumn<Novedad>[] = [
    {
      key: "titulo",
      header: "Novedad",
      render: (novedad) => (
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
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
      key: "fechaPublicacion",
      header: "Fecha",
      render: (novedad) =>
        new Date(novedad.fechaPublicacion).toLocaleDateString("es-AR"),
    },
    {
      key: "vistas",
      header: "Vistas",
      render: (novedad) => novedad.vistas,
    },
    {
      key: "estado",
      header: "Estado",
      render: estadoBadges,
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Novedades", href: "/admin/novedades" }, { label: "Lista" }]} />

      <div>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-gray-900">
              Lista de novedades
            </h1>
            <p className="mt-1.5 text-[16px] text-gray-500">
              {total} novedad{total !== 1 ? "es" : ""} en total
            </p>
          </div>
          <AdminButton variant="primary" icon={Plus} href="/admin/novedades/crear">
            Nueva novedad
          </AdminButton>
        </div>
      </div>

      {error ? (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-100 bg-red-50 px-4 py-4">
          <p className="text-[16px] font-medium text-red-600">{error}</p>
          <AdminButton variant="secondary" onClick={cargarNovedades}>
            Reintentar
          </AdminButton>
        </div>
      ) : null}

      <DataTable<Novedad>
        columns={columns}
        rows={novedades}
        rowKey={(row) => row._id}
        loading={loading}
        emptyText="No se encontraron novedades con estos filtros"
        toolbar={
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400"
                  strokeWidth={2}
                  aria-hidden
                />
                <TextInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Buscar por título, contenido, categoría..."
                  className="pl-11"
                />
              </div>
              <AdminButton variant="primary" icon={Search} onClick={handleSearch}>
                Buscar
              </AdminButton>
              <AdminButton
                variant="secondary"
                icon={Filter}
                onClick={() => setShowFilters((v) => !v)}
              >
                Filtros
              </AdminButton>
            </div>

            {showFilters ? (
              <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 md:grid-cols-2 lg:grid-cols-4">
                <Field label="Categoría" htmlFor="filtro-categoria">
                  <SelectField
                    id="filtro-categoria"
                    value={categoriaFilter}
                    onChange={(e) => setCategoriaFilter(e.target.value)}
                  >
                    <option value="">Todas</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </SelectField>
                </Field>

                <Field label="Destacadas" htmlFor="filtro-destacada">
                  <SelectField
                    id="filtro-destacada"
                    value={destacadaFilter}
                    onChange={(e) => setDestacadaFilter(e.target.value)}
                  >
                    <option value="">Todas</option>
                    <option value="true">Solo destacadas</option>
                    <option value="false">No destacadas</option>
                  </SelectField>
                </Field>

                <Field label="Ordenar por" htmlFor="filtro-sortby">
                  <SelectField
                    id="filtro-sortby"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as ListNovedadesParams["sortBy"])
                    }
                  >
                    <option value="fechaPublicacion">Fecha de publicación</option>
                    <option value="titulo">Título</option>
                    <option value="categoria">Categoría</option>
                    <option value="vistas">Vistas</option>
                    <option value="createdAt">Fecha de creación</option>
                    <option value="updatedAt">Última actualización</option>
                  </SelectField>
                </Field>

                <Field label="Orden" htmlFor="filtro-sortorder">
                  <SelectField
                    id="filtro-sortorder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                  >
                    <option value="desc">Descendente</option>
                    <option value="asc">Ascendente</option>
                  </SelectField>
                </Field>

                <div className="flex items-center md:col-span-2 lg:col-span-2">
                  <SwitchField
                    checked={includeDeleted}
                    onChange={setIncludeDeleted}
                    label="Mostrar también las eliminadas"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-2 flex justify-end">
                  <AdminButton variant="secondary" icon={X} onClick={handleClearFilters}>
                    Limpiar filtros
                  </AdminButton>
                </div>
              </div>
            ) : null}
          </div>
        }
        pagination={{
          page,
          totalPages,
          total,
          onPage: setPage,
        }}
        actions={(novedad) => (
          <>
            <AdminButton
              variant="secondary"
              icon={Eye}
              className="h-10 px-4 text-[15px]"
              onClick={() => window.open(`/novedades/${novedad._id}`, "_blank")}
              ariaLabel={`Ver ${novedad.titulo} en el sitio público`}
            >
              Ver
            </AdminButton>
            {!novedad.deleted ? (
              <>
                <AdminButton
                  variant="secondary"
                  icon={Edit}
                  href={`/admin/novedades/editar/${novedad._id}`}
                  className="h-10 px-4 text-[15px]"
                >
                  Editar
                </AdminButton>
                <AdminButton
                  variant="danger"
                  icon={Trash2}
                  className="h-10 border border-red-100 bg-red-50 px-4 text-[15px] text-red-600 hover:bg-red-100"
                  disabled={busyId === novedad._id}
                  onClick={() => setNovedadToDelete(novedad)}
                  ariaLabel={`Eliminar ${novedad.titulo}`}
                >
                  Eliminar
                </AdminButton>
              </>
            ) : (
              <AdminButton
                variant="secondary"
                icon={RotateCcw}
                className="h-10 px-4 text-[15px]"
                disabled={busyId === novedad._id}
                onClick={() => handleRestore(novedad._id)}
                ariaLabel={`Restaurar ${novedad.titulo}`}
              >
                Restaurar
              </AdminButton>
            )}
          </>
        )}
      />

      <ConfirmDialog
        open={novedadToDelete !== null}
        onClose={() => setNovedadToDelete(null)}
        onConfirm={confirmDelete}
        title="Eliminar novedad"
        message={
          novedadToDelete
            ? `¿Eliminar la novedad "${novedadToDelete.titulo}"? Se ocultará del sitio, pero vas a poder restaurarla después desde la papelera.`
            : ""
        }
        confirmLabel="Eliminar"
        danger
      />
    </div>
  );
}
