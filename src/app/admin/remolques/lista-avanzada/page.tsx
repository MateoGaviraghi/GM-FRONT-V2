"use client";

import { useState, useEffect } from "react";
import { Truck, Search, Filter, Plus, Edit, Trash2, Eye, X } from "lucide-react";
import { remolqueService } from "@/services";
import {
  Remolque,
  EstadoRemolque,
  RemolqueSearchParams,
  CondicionRemolque,
  CategoriaRemolque,
  CATEGORIAS_REMOLQUE,
} from "@/types";
import {
  AdminButton,
  Badge,
  type BadgeVariant,
  Breadcrumb,
  ConfirmDialog,
  DataTable,
  type DataTableColumn,
  type DataTableSort,
  Field,
  mapApiError,
  SelectField,
  TextInput,
  useToast,
} from "@/components/admin/kit";

function estadoBadgeVariant(estado?: EstadoRemolque): BadgeVariant {
  if (estado === "Disponible") return "success";
  if (estado === "Reservado") return "warn";
  if (estado === "Vendido") return "danger";
  return "default";
}

export default function ListaRemolquesAvanzada() {
  const { showToast } = useToast();

  const [remolques, setRemolques] = useState<Remolque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRemolques, setTotalRemolques] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Filtros avanzados
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoRemolque | "Todos">(
    "Todos",
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

  const [remolqueAEliminar, setRemolqueAEliminar] = useState<string | null>(
    null,
  );

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
  ]);

  // Búsqueda server-side con debounce 300ms mientras se tipea.
  useEffect(() => {
    const handle = setTimeout(() => {
      if (busqueda.trim()) {
        handleBusqueda();
      } else {
        cargarRemolques();
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  const cargarRemolques = async () => {
    try {
      setLoading(true);
      setError(null);

      const filtros: RemolqueSearchParams = {
        page: paginaActual,
        limit: 20,
        sortBy: ordenarPor,
        sortOrder: ordenDirection,
      };

      if (filtroEstado !== "Todos") filtros.estado = filtroEstado as EstadoRemolque;
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
      setError(mapApiError(err));
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
        limit: 20,
      };

      const response = await remolqueService.searchAllRemolques(searchDto);

      setRemolques(response.items);
      setTotalRemolques(response.total);
      setTotalPaginas(response.pages);
      setPaginaActual(1);
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setError(mapApiError(err));
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

  const handleEliminar = async (id: string) => {
    try {
      await remolqueService.deleteRemolque(id);
      setRemolqueAEliminar(null);
      showToast({
        message: "El remolque se eliminó correctamente.",
        variant: "success",
      });
      cargarRemolques();
    } catch (err) {
      console.error("Error eliminando remolque:", err);
      showToast({
        title: "No se pudo eliminar el remolque",
        message: mapApiError(err),
        variant: "danger",
      });
    }
  };

  const filtrosActivos = [
    filtroEstado !== "Todos" && `Estado: ${filtroEstado}`,
    filtroCondicion !== "Todas" && `Condición: ${filtroCondicion}`,
    filtroCategoria !== "Todas" && `Categoría: ${filtroCategoria}`,
    filtroMarca !== "Todas" && `Marca: ${filtroMarca}`,
    filtroMaterial !== "Todos" && `Material: ${filtroMaterial}`,
    busqueda && `Búsqueda: "${busqueda}"`,
  ].filter(Boolean);

  const sort: DataTableSort = { key: ordenarPor, dir: ordenDirection };

  const handleSortChange = (key: string) => {
    if (key === ordenarPor) {
      setOrdenDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrdenarPor(key as "createdAt" | "marca" | "tipos" | "anio");
      setOrdenDirection("desc");
    }
  };

  const columns: DataTableColumn<Remolque>[] = [
    {
      key: "marca",
      header: "Remolque",
      sortable: true,
      render: (remolque) => (
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
            {remolque.imagenes && remolque.imagenes.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={
                  remolque.imagenes[0].thumbnails?.small ||
                  remolque.imagenes[0].secure_url
                }
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <Truck className="size-5 text-gray-400" strokeWidth={1.75} aria-hidden />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900">
              {remolque.titulo || `${remolque.marca} ${remolque.modelo}`}
            </p>
            <p className="truncate text-gray-500">
              {remolque.marca || "Sin marca"} • {remolque.tipoCarroceria || "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "tipos",
      header: "Categoría",
      sortable: true,
      render: (remolque) => remolque.categoria || <span className="text-gray-400">—</span>,
    },
    {
      key: "estado",
      header: "Estado",
      render: (remolque) =>
        remolque.estado ? (
          <Badge variant={estadoBadgeVariant(remolque.estado)}>{remolque.estado}</Badge>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      key: "detalles",
      header: "Detalles",
      render: (remolque) => (
        <div className="space-y-0.5 text-[16px] text-gray-500">
          {remolque.capacidadCarga ? <div>Capacidad: {remolque.capacidadCarga}</div> : null}
          {remolque.carroceria?.material ? (
            <div>Material: {remolque.carroceria.material}</div>
          ) : null}
          {remolque.cantidadEjes ? <div>{remolque.cantidadEjes} ejes</div> : null}
        </div>
      ),
    },
    {
      key: "anio",
      header: "Año",
      sortable: true,
      render: (remolque) => remolque.anio ?? <span className="text-gray-400">—</span>,
    },
    {
      key: "createdAt",
      header: "Fecha",
      sortable: true,
      render: (remolque) =>
        remolque.createdAt
          ? new Date(remolque.createdAt).toLocaleDateString("es-AR")
          : "—",
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Remolques", href: "/admin/remolques" },
          { label: "Gestión avanzada" },
        ]}
      />

      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-gray-900">
            Gestión completa de remolques
          </h1>
          <p className="mt-1.5 text-[16px] text-gray-500">
            {totalRemolques} remolque{totalRemolques !== 1 ? "s" : ""} encontrado
            {totalRemolques !== 1 ? "s" : ""}
            {filtrosActivos.length > 0 ? " con filtros aplicados" : ""}
          </p>
        </div>
        <AdminButton variant="primary" icon={Plus} href="/admin/remolques/crear">
          Nuevo remolque
        </AdminButton>
      </div>

      {error ? (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-100 bg-red-50 px-4 py-4">
          <p className="text-[16px] font-medium text-red-600">{error}</p>
          <AdminButton variant="secondary" onClick={cargarRemolques}>
            Reintentar
          </AdminButton>
        </div>
      ) : null}

      <DataTable<Remolque>
        columns={columns}
        rows={remolques}
        rowKey={(row) => row._id ?? row.titulo}
        loading={loading}
        emptyText="No se encontraron remolques con estos filtros"
        sort={sort}
        onSortChange={handleSortChange}
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
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleBusqueda()}
                  placeholder="Buscar por marca, modelo, categoría, características..."
                  className="pl-11"
                />
              </div>
              <AdminButton variant="primary" icon={Search} onClick={handleBusqueda}>
                Buscar
              </AdminButton>
              <AdminButton
                variant="secondary"
                icon={Filter}
                onClick={() => setMostrarFiltros((v) => !v)}
              >
                Filtros
              </AdminButton>
            </div>

            {filtrosActivos.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                <span className="text-[16px] font-semibold text-gray-900">
                  Filtros activos:
                </span>
                {filtrosActivos.map((filtro, index) => (
                  <Badge key={index} variant="petrol">
                    {filtro}
                  </Badge>
                ))}
                <AdminButton variant="secondary" icon={X} onClick={limpiarFiltros}>
                  Limpiar todo
                </AdminButton>
              </div>
            ) : null}

            {mostrarFiltros ? (
              <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 md:grid-cols-2 lg:grid-cols-4">
                <Field label="Condición" htmlFor="filtro-condicion-av">
                  <SelectField
                    id="filtro-condicion-av"
                    value={filtroCondicion}
                    onChange={(e) =>
                      setFiltroCondicion(
                        e.target.value as CondicionRemolque | "Todas",
                      )
                    }
                  >
                    <option value="Todas">Todas las condiciones</option>
                    <option value="0KM">0KM</option>
                    <option value="USADO">Usado</option>
                  </SelectField>
                </Field>

                <Field label="Estado del remolque" htmlFor="filtro-estado-av">
                  <SelectField
                    id="filtro-estado-av"
                    value={filtroEstado}
                    onChange={(e) =>
                      setFiltroEstado(e.target.value as EstadoRemolque | "Todos")
                    }
                  >
                    <option value="Todos">Todos los estados</option>
                    <option value="Disponible">Disponible</option>
                    <option value="Reservado">Reservado</option>
                    <option value="Vendido">Vendido</option>
                  </SelectField>
                </Field>

                <Field label="Categoría" htmlFor="filtro-categoria-av">
                  <SelectField
                    id="filtro-categoria-av"
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                  >
                    <option value="Todas">Todas las categorías</option>
                    {CATEGORIAS_REMOLQUE.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </SelectField>
                </Field>

                <Field label="Marca" htmlFor="filtro-marca-av">
                  <TextInput
                    id="filtro-marca-av"
                    value={filtroMarca === "Todas" ? "" : filtroMarca}
                    onChange={(e) => setFiltroMarca(e.target.value || "Todas")}
                    placeholder="Filtrar por marca..."
                  />
                </Field>

                <Field label="Material" htmlFor="filtro-material-av">
                  <SelectField
                    id="filtro-material-av"
                    value={filtroMaterial}
                    onChange={(e) => setFiltroMaterial(e.target.value)}
                  >
                    <option value="Todos">Todos los materiales</option>
                    <option value="Acero">Acero</option>
                    <option value="Aluminio">Aluminio</option>
                    <option value="Mixto">Mixto</option>
                  </SelectField>
                </Field>
              </div>
            ) : null}
          </div>
        }
        pagination={{
          page: paginaActual,
          totalPages: totalPaginas,
          total: totalRemolques,
          onPage: setPaginaActual,
        }}
        actions={(remolque) => (
          <>
            <AdminButton
              variant="secondary"
              icon={Eye}
              className="h-10 px-4 text-[15px]"
              onClick={() => window.open(`/remolques/${remolque._id}`, "_blank")}
              ariaLabel={`Ver ${remolque.titulo} en el sitio público`}
            >
              Ver
            </AdminButton>
            <AdminButton
              variant="secondary"
              icon={Edit}
              href={`/admin/remolques/editar/${remolque._id}`}
              className="h-10 px-4 text-[15px]"
            >
              Editar
            </AdminButton>
            <AdminButton
              variant="danger"
              icon={Trash2}
              className="h-10 border border-red-100 bg-red-50 px-4 text-[15px] text-red-600 hover:bg-red-100"
              onClick={() => setRemolqueAEliminar(remolque._id ?? null)}
              ariaLabel={`Eliminar ${remolque.titulo}`}
            >
              Eliminar
            </AdminButton>
          </>
        )}
      />

      <ConfirmDialog
        open={remolqueAEliminar !== null}
        onClose={() => setRemolqueAEliminar(null)}
        onConfirm={() => remolqueAEliminar && handleEliminar(remolqueAEliminar)}
        title="Eliminar remolque"
        message="¿Eliminar este remolque? Esta acción no se puede deshacer. Se eliminarán todas las imágenes y videos asociados."
        confirmLabel="Eliminar"
        danger
      />
    </div>
  );
}
