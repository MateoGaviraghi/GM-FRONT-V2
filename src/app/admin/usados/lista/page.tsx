"use client";

import { useState, useEffect } from "react";
import { Car, Search, Filter, Plus, Edit, Trash2, Eye, X } from "lucide-react";
import { usadosService } from "@/services";
import { Usados, UsadosSearchParams } from "@/types";
import {
  AdminButton,
  Breadcrumb,
  ConfirmDialog,
  DataTable,
  type DataTableColumn,
  Field,
  mapApiError,
  TextInput,
  useToast,
} from "@/components/admin/kit";

export default function ListaUsados() {
  const { showToast } = useToast();

  const [usados, setUsados] = useState<Usados[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsados, setTotalUsados] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroMarca, setFiltroMarca] = useState("Todas");
  const [filtroModelo, setFiltroModelo] = useState("Todos");
  const [filtroAnioMin, setFiltroAnioMin] = useState("");
  const [filtroAnioMax, setFiltroAnioMax] = useState("");
  const [filtroKmMin, setFiltroKmMin] = useState("");
  const [filtroKmMax, setFiltroKmMax] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Modal de confirmación
  const [usadosAEliminar, setUsadosAEliminar] = useState<string | null>(null);

  useEffect(() => {
    cargarUsados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaActual, filtroTipo, filtroMarca, filtroModelo]);

  // Búsqueda server-side con debounce 300ms mientras se tipea.
  useEffect(() => {
    const handle = setTimeout(() => {
      if (busqueda.trim()) {
        handleBusqueda();
      } else {
        cargarUsados();
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  const cargarUsados = async () => {
    try {
      setLoading(true);
      setError(null);

      const filtros: UsadosSearchParams = {
        page: paginaActual,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      if (filtroTipo !== "Todos") {
        filtros.tipoVehiculo = filtroTipo;
      }

      if (filtroMarca !== "Todas") {
        filtros.marca = filtroMarca;
      }

      if (filtroModelo !== "Todos") {
        filtros.modelo = filtroModelo;
      }

      if (filtroAnioMin) {
        filtros.anioFrom = `${filtroAnioMin}-01-01`;
      }

      if (filtroAnioMax) {
        filtros.anioTo = `${filtroAnioMax}-12-31`;
      }

      if (filtroKmMin) {
        filtros.kilometrajeMin = parseInt(filtroKmMin);
      }

      if (filtroKmMax) {
        filtros.kilometrajeMax = parseInt(filtroKmMax);
      }

      const response = await usadosService.searchAllUsados(filtros);

      setUsados(response.items);
      setTotalUsados(response.total);
      setTotalPaginas(response.pages);
    } catch (err) {
      console.error("Error cargando usados:", err);
      setError(mapApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBusqueda = async () => {
    if (!busqueda.trim()) {
      cargarUsados();
      return;
    }

    try {
      setLoading(true);

      const searchDto: UsadosSearchParams = {
        q: busqueda,
        ...(filtroTipo !== "Todos" && { tipoVehiculo: filtroTipo }),
        ...(filtroMarca !== "Todas" && { marca: filtroMarca }),
        ...(filtroModelo !== "Todos" && { modelo: filtroModelo }),
        ...(filtroAnioMin && { anioFrom: `${filtroAnioMin}-01-01` }),
        ...(filtroAnioMax && { anioTo: `${filtroAnioMax}-12-31` }),
        ...(filtroKmMin && { kilometrajeMin: parseInt(filtroKmMin) }),
        ...(filtroKmMax && { kilometrajeMax: parseInt(filtroKmMax) }),
        page: 1,
        limit: 20,
      };

      const response = await usadosService.searchAllUsados(searchDto);

      setUsados(response.items);
      setTotalUsados(response.total);
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
    setFiltroTipo("Todos");
    setFiltroMarca("Todas");
    setFiltroModelo("Todos");
    setFiltroAnioMin("");
    setFiltroAnioMax("");
    setFiltroKmMin("");
    setFiltroKmMax("");
    setPaginaActual(1);
    cargarUsados();
  };

  const handleEliminar = async (id: string) => {
    try {
      await usadosService.deleteUsados(id);
      setUsadosAEliminar(null);
      showToast({
        message: "El vehículo usado se eliminó correctamente.",
        variant: "success",
      });
      cargarUsados();
    } catch (err) {
      console.error("Error eliminando vehículo usado:", err);
      showToast({
        title: "No se pudo eliminar el vehículo usado",
        message: mapApiError(err),
        variant: "danger",
      });
    }
  };

  const formatearAnio = (anio?: number | Date | string) => {
    if (!anio) return "N/A";
    if (typeof anio === "number") return anio;
    return new Date(anio).getFullYear();
  };

  const formatearKilometraje = (km?: number) => {
    if (!km) return "N/A";
    return `${km.toLocaleString()} km`;
  };

  const columns: DataTableColumn<Usados>[] = [
    {
      key: "titulo",
      header: "Vehículo",
      render: (usado) => (
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
            {usado.imagenes && usado.imagenes.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={
                  usado.imagenes[0].thumbnails?.small ||
                  usado.imagenes[0].secure_url
                }
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <Car className="size-5 text-gray-400" strokeWidth={1.75} aria-hidden />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900">
              {usado.titulo || `${usado.marca} ${usado.modelo}`}
            </p>
            <p className="truncate text-gray-500">
              {usado.marca}
              {usado.modelo ? ` • ${usado.modelo}` : ""}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "anio",
      header: "Año",
      render: (usado) => formatearAnio(usado.anio),
    },
    {
      key: "kilometraje",
      header: "Kilometraje",
      render: (usado) => formatearKilometraje(usado.kilometraje),
    },
    {
      key: "tipoVehiculo",
      header: "Tipo",
      render: (usado) => usado.tipoVehiculo || <span className="text-gray-400">—</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Usados", href: "/admin/usados" }, { label: "Lista" }]} />

      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-gray-900">Vehículos usados</h1>
          <p className="mt-1.5 text-[16px] text-gray-500">
            {totalUsados} vehículo{totalUsados !== 1 ? "s" : ""} usado
            {totalUsados !== 1 ? "s" : ""} registrado
            {totalUsados !== 1 ? "s" : ""}
          </p>
        </div>
        <AdminButton variant="primary" icon={Plus} href="/admin/usados/crear">
          Nuevo vehículo usado
        </AdminButton>
      </div>

      {error ? (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-[15.5px] font-medium text-red-700">{error}</p>
          <AdminButton variant="secondary" onClick={cargarUsados}>
            Reintentar
          </AdminButton>
        </div>
      ) : null}

      <DataTable<Usados>
        columns={columns}
        rows={usados}
        rowKey={(row) => row._id ?? `${row.marca}-${row.modelo}`}
        loading={loading}
        emptyText="No se encontraron vehículos usados con estos filtros"
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
                  placeholder="Buscar por marca, modelo, tipo..."
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

            {mostrarFiltros ? (
              <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 md:grid-cols-2 lg:grid-cols-4">
                <Field label="Tipo" htmlFor="filtro-tipo">
                  <TextInput
                    id="filtro-tipo"
                    value={filtroTipo === "Todos" ? "" : filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value || "Todos")}
                    placeholder="SUV, Sedán, Pick-up..."
                  />
                </Field>

                <Field label="Marca" htmlFor="filtro-marca">
                  <TextInput
                    id="filtro-marca"
                    value={filtroMarca === "Todas" ? "" : filtroMarca}
                    onChange={(e) => setFiltroMarca(e.target.value || "Todas")}
                    placeholder="Toyota, Ford, Chevrolet..."
                  />
                </Field>

                <Field label="Modelo" htmlFor="filtro-modelo">
                  <TextInput
                    id="filtro-modelo"
                    value={filtroModelo === "Todos" ? "" : filtroModelo}
                    onChange={(e) => setFiltroModelo(e.target.value || "Todos")}
                    placeholder="Hilux, Ranger, S10..."
                  />
                </Field>

                <Field label="Año desde" htmlFor="filtro-anio-min">
                  <TextInput
                    id="filtro-anio-min"
                    type="number"
                    value={filtroAnioMin}
                    onChange={(e) => setFiltroAnioMin(e.target.value)}
                    placeholder="2015"
                    min="1990"
                  />
                </Field>

                <Field label="Año hasta" htmlFor="filtro-anio-max">
                  <TextInput
                    id="filtro-anio-max"
                    type="number"
                    value={filtroAnioMax}
                    onChange={(e) => setFiltroAnioMax(e.target.value)}
                    placeholder={new Date().getFullYear().toString()}
                    min="1990"
                  />
                </Field>

                <Field label="Km desde" htmlFor="filtro-km-min">
                  <TextInput
                    id="filtro-km-min"
                    type="number"
                    value={filtroKmMin}
                    onChange={(e) => setFiltroKmMin(e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </Field>

                <Field label="Km hasta" htmlFor="filtro-km-max">
                  <TextInput
                    id="filtro-km-max"
                    type="number"
                    value={filtroKmMax}
                    onChange={(e) => setFiltroKmMax(e.target.value)}
                    placeholder="200000"
                    min="0"
                  />
                </Field>

                <div className="md:col-span-2 lg:col-span-4 flex flex-wrap justify-end gap-3">
                  <AdminButton variant="secondary" onClick={cargarUsados}>
                    Aplicar filtros
                  </AdminButton>
                  <AdminButton variant="secondary" icon={X} onClick={limpiarFiltros}>
                    Limpiar filtros
                  </AdminButton>
                </div>
              </div>
            ) : null}
          </div>
        }
        pagination={{
          page: paginaActual,
          totalPages: totalPaginas,
          total: totalUsados,
          onPage: setPaginaActual,
        }}
        actions={(usado) => (
          <>
            <AdminButton
              variant="secondary"
              icon={Eye}
              className="h-10 px-4 text-[15px]"
              onClick={() => window.open(`/usados/${usado._id}`, "_blank")}
              ariaLabel={`Ver ${usado.titulo || usado.modelo} en el sitio público`}
            >
              Ver
            </AdminButton>
            <AdminButton
              variant="secondary"
              icon={Edit}
              href={`/admin/usados/editar/${usado._id}`}
              className="h-10 px-4 text-[15px]"
            >
              Editar
            </AdminButton>
            <AdminButton
              variant="danger"
              icon={Trash2}
              className="h-10 rounded-lg border border-red-100 bg-red-50 px-4 text-[15px] font-semibold text-red-600 hover:bg-red-100"
              onClick={() => setUsadosAEliminar(usado._id ?? null)}
              ariaLabel={`Eliminar ${usado.titulo || usado.modelo}`}
            >
              Eliminar
            </AdminButton>
          </>
        )}
      />

      <ConfirmDialog
        open={usadosAEliminar !== null}
        onClose={() => setUsadosAEliminar(null)}
        onConfirm={() => usadosAEliminar && handleEliminar(usadosAEliminar)}
        title="Eliminar vehículo usado"
        message="¿Eliminar este vehículo usado? Esta acción no se puede deshacer. Se eliminarán todas las imágenes y videos asociados."
        confirmLabel="Eliminar"
        danger
      />
    </div>
  );
}
