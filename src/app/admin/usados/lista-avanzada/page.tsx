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
  X,
  Image as ImageIcon,
  Play,
} from "lucide-react";
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
  SelectField,
  TextInput,
  useToast,
} from "@/components/admin/kit";

export default function ListaUsadosAvanzada() {
  const { showToast } = useToast();

  const [usados, setUsados] = useState<Usados[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsados, setTotalUsados] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Filtros avanzados
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
      setError(mapApiError(err));
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
  };

  const handleConfirmDelete = async () => {
    if (!usadoToDelete) return;

    try {
      await usadosService.deleteUsados(usadoToDelete);
      setUsadoToDelete(null);
      showToast({
        message: "El vehículo usado se eliminó correctamente.",
        variant: "success",
      });
      cargarUsados();
    } catch (err) {
      console.error("Error eliminando usados:", err);
      showToast({
        title: "No se pudo eliminar el vehículo usado",
        message: mapApiError(err),
        variant: "danger",
      });
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
  ].filter(Boolean) as string[];

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
                src={usado.imagenes[0].thumbnails?.small || usado.imagenes[0].secure_url}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <CarFront className="size-5 text-gray-400" strokeWidth={1.75} aria-hidden />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900">
              {usado.titulo || `${usado.marca} ${usado.modelo}`}
            </p>
            <p className="truncate text-gray-500">
              {usado.marca} • {usado.tipoVehiculo || "Sin tipo"}
            </p>
          </div>
        </div>
      ),
    },
    { key: "anio", header: "Año", render: (usado) => usado.anio || "N/A" },
    {
      key: "kilometraje",
      header: "Kilometraje",
      render: (usado) => formatKilometraje(usado.kilometraje),
    },
    {
      key: "transmision",
      header: "Transmisión",
      render: (usado) => usado.transmision || <span className="text-gray-400">—</span>,
    },
    {
      key: "tipoCombustible",
      header: "Combustible",
      render: (usado) => usado.tipoCombustible || <span className="text-gray-400">—</span>,
    },
    {
      key: "medios",
      header: "Medios",
      render: (usado) => (
        <div className="flex items-center gap-3">
          {usado.imagenes && usado.imagenes.length > 0 ? (
            <span className="flex items-center gap-1">
              <ImageIcon className="size-4 text-gray-400" strokeWidth={2} aria-hidden />
              {usado.imagenes.length}
            </span>
          ) : null}
          {usado.videos && usado.videos.length > 0 ? (
            <span className="flex items-center gap-1">
              <Play className="size-4 text-gray-400" strokeWidth={2} aria-hidden />
              {usado.videos.length}
            </span>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Usados", href: "/admin/usados" }, { label: "Lista avanzada" }]} />

      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-gray-900">
            Gestión completa de vehículos usados
          </h1>
          <p className="mt-1.5 text-[16px] text-gray-500">
            {totalUsados} vehículo{totalUsados !== 1 ? "s" : ""} usado
            {totalUsados !== 1 ? "s" : ""} encontrado
            {totalUsados !== 1 ? "s" : ""}
            {filtrosActivos.length > 0 && " con filtros aplicados"}
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
                  placeholder="Buscar por marca, modelo, tipo, características..."
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
                <span className="text-[15.5px] font-semibold text-gray-800">Filtros activos:</span>
                {filtrosActivos.map((filtro, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[13px] font-medium text-indigo-600"
                  >
                    {filtro}
                  </span>
                ))}
                <AdminButton variant="secondary" icon={X} onClick={limpiarFiltros} className="h-10 px-4 text-[15px]">
                  Limpiar todo
                </AdminButton>
              </div>
            ) : null}

            {mostrarFiltros ? (
              <div className="space-y-4 border-t border-gray-100 pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Field label="Tipo de vehículo" htmlFor="filtro-tipo">
                    <SelectField
                      id="filtro-tipo"
                      value={filtroTipo}
                      onChange={(e) => setFiltroTipo(e.target.value)}
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
                    </SelectField>
                  </Field>

                  <Field label="Marca" htmlFor="filtro-marca">
                    <TextInput
                      id="filtro-marca"
                      value={filtroMarca === "Todas" ? "" : filtroMarca}
                      onChange={(e) => setFiltroMarca(e.target.value || "Todas")}
                      placeholder="Ej: Toyota, Ford..."
                    />
                  </Field>

                  <Field label="Modelo" htmlFor="filtro-modelo">
                    <TextInput
                      id="filtro-modelo"
                      value={filtroModelo}
                      onChange={(e) => setFiltroModelo(e.target.value)}
                      placeholder="Ej: Hilux, Ranger..."
                    />
                  </Field>

                  <Field label="Combustible" htmlFor="filtro-combustible">
                    <SelectField
                      id="filtro-combustible"
                      value={filtroCombustible}
                      onChange={(e) => setFiltroCombustible(e.target.value)}
                    >
                      <option value="Todos">Todos</option>
                      <option value="Nafta">Nafta</option>
                      <option value="Diesel">Diesel</option>
                      <option value="GNC">GNC</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Eléctrico">Eléctrico</option>
                    </SelectField>
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Field label="Transmisión" htmlFor="filtro-transmision">
                    <SelectField
                      id="filtro-transmision"
                      value={filtroTransmision}
                      onChange={(e) => setFiltroTransmision(e.target.value)}
                    >
                      <option value="Todas">Todas</option>
                      <option value="Manual">Manual</option>
                      <option value="Automática">Automática</option>
                      <option value="Semi-automática">Semi-automática</option>
                    </SelectField>
                  </Field>

                  <Field label="Año desde" htmlFor="anio-desde">
                    <TextInput
                      id="anio-desde"
                      type="number"
                      placeholder="Ej: 2015"
                      value={anioDesde}
                      onChange={(e) => setAnioDesde(e.target.value)}
                      min="1990"
                      max={new Date().getFullYear() + 1}
                    />
                  </Field>

                  <Field label="Año hasta" htmlFor="anio-hasta">
                    <TextInput
                      id="anio-hasta"
                      type="number"
                      placeholder="Ej: 2024"
                      value={anioHasta}
                      onChange={(e) => setAnioHasta(e.target.value)}
                      min="1990"
                      max={new Date().getFullYear() + 1}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Kilometraje mínimo" htmlFor="km-min">
                    <TextInput
                      id="km-min"
                      type="number"
                      placeholder="Ej: 0"
                      value={kilometrajeMin}
                      onChange={(e) => setKilometrajeMin(e.target.value)}
                      min="0"
                    />
                  </Field>

                  <Field label="Kilometraje máximo" htmlFor="km-max">
                    <TextInput
                      id="km-max"
                      type="number"
                      placeholder="Ej: 200000"
                      value={kilometrajeMax}
                      onChange={(e) => setKilometrajeMax(e.target.value)}
                      min="0"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 md:grid-cols-2">
                  <Field label="Ordenar por" htmlFor="ordenar-por">
                    <SelectField
                      id="ordenar-por"
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
                    >
                      <option value="createdAt">Fecha de creación</option>
                      <option value="marca">Marca</option>
                      <option value="modelo">Modelo</option>
                      <option value="anio">Año</option>
                      <option value="kilometraje">Kilometraje</option>
                      <option value="precio">Precio</option>
                    </SelectField>
                  </Field>

                  <Field label="Dirección" htmlFor="orden-direccion">
                    <SelectField
                      id="orden-direccion"
                      value={ordenDirection}
                      onChange={(e) => setOrdenDirection(e.target.value as "asc" | "desc")}
                    >
                      <option value="desc">Descendente (Z-A / Mayor-Menor)</option>
                      <option value="asc">Ascendente (A-Z / Menor-Mayor)</option>
                    </SelectField>
                  </Field>
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
              onClick={() => handleDeleteClick(usado._id!)}
              ariaLabel={`Eliminar ${usado.titulo || usado.modelo}`}
            >
              Eliminar
            </AdminButton>
          </>
        )}
      />

      <ConfirmDialog
        open={usadoToDelete !== null}
        onClose={() => setUsadoToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar vehículo usado"
        message="¿Eliminar este vehículo usado? Esta acción no se puede deshacer. Se eliminarán también todas sus imágenes y videos asociados."
        confirmLabel="Eliminar"
        danger
      />
    </div>
  );
}
