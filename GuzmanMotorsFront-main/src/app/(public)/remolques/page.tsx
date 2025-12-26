"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { remolqueService } from "@/services";
import { Remolque, CondicionRemolque } from "@/types";
import {
  Truck,
  Settings,
  Search,
  Eye,
  MessageCircle,
  Calendar,
  X,
  ChevronDown,
  Shield,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Componente de ícono WhatsApp
const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function RemolquesPage() {
  // Estados principales
  const [remolques, setRemolques] = useState<Remolque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroCondicion, setFiltroCondicion] = useState<
    CondicionRemolque | "Todas"
  >("Todas");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroMarca, setFiltroMarca] = useState("Todas");
  const [filtroAño, setFiltroAño] = useState("Todos");
  const [filtroMaterial, setFiltroMaterial] = useState("Todos");

  // Estado de dropdown abierto
  const [dropdownAbierto, setDropdownAbierto] = useState<string | null>(null);

  // Estado para modal de filtros móvil
  const [filtrosMovilAbierto, setFiltrosMovilAbierto] = useState(false);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Función para generar enlace de WhatsApp
  const generarEnlaceWhatsApp = (remolque: Remolque) => {
    const numeroWhatsApp = "5493424216850";
    const mensaje =
      `Hola! Me interesa consultar sobre el remolque:\n\n🚛 *${remolque.titulo}*\n\n` +
      `📋 *Detalles:*\n` +
      (remolque.condicion ? `• Condición: ${remolque.condicion}\n` : "") +
      (remolque.categoria ? `• Categoría: ${remolque.categoria}\n` : "") +
      (remolque.marca ? `• Marca: ${remolque.marca}\n` : "") +
      (remolque.modelo ? `• Modelo: ${remolque.modelo}\n` : "") +
      (remolque.capacidadCarga
        ? `• Capacidad: ${remolque.capacidadCarga}\n`
        : "") +
      (remolque.anio
        ? `• Año: ${new Date(remolque.anio).getFullYear()}\n`
        : "") +
      (remolque.cantidadEjes ? `• Ejes: ${remolque.cantidadEjes}\n` : "") +
      `\n¿Podrían brindarme más información y disponibilidad? ¡Gracias!`;

    return `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
      mensaje
    )}`;
  };

  // Cargar remolques
  const loadRemolques = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Construir parámetros de búsqueda
      const searchParams: Record<string, string | number> = {
        page: currentPage,
        limit: 12,
      };

      // Agregar filtros si están activos
      if (busqueda) searchParams.q = busqueda;
      if (filtroCondicion !== "Todas") searchParams.condicion = filtroCondicion;
      if (filtroCategoria !== "Todas") searchParams.categoria = filtroCategoria;
      if (filtroMarca !== "Todas") searchParams.marca = filtroMarca;
      if (filtroAño !== "Todos") searchParams.anio = filtroAño;
      if (filtroMaterial !== "Todos") searchParams.material = filtroMaterial;

      const response = await remolqueService.searchPublicRemolquesAdvanced(
        searchParams
      );

      setRemolques(response?.remolques || []);
      setTotalPages(response?.totalPages || 1);
      setTotalItems(response?.total || 0);
    } catch (err) {
      console.error("Error cargando remolques:", err);
      setError("Error al cargar los remolques. Por favor, inténtalo de nuevo.");
      setRemolques([]);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    busqueda,
    filtroCondicion,
    filtroCategoria,
    filtroMarca,
    filtroAño,
    filtroMaterial,
  ]);

  useEffect(() => {
    loadRemolques();
  }, [loadRemolques]);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownAbierto) {
        setDropdownAbierto(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownAbierto]);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    busqueda,
    filtroCondicion,
    filtroCategoria,
    filtroMarca,
    filtroAño,
    filtroMaterial,
  ]);

  // Obtener categorías únicas
  const categoriasUnicas = useMemo(() => {
    const categorias = remolques.map((r) => r.categoria).filter(Boolean);
    return [...new Set(categorias)].sort();
  }, [remolques]);

  // Obtener marcas únicas
  const marcasUnicas = useMemo(() => {
    const marcas = remolques.map((r) => r.marca).filter(Boolean);
    return [...new Set(marcas)].sort();
  }, [remolques]);

  // Obtener años únicos
  const añosUnicos = useMemo(() => {
    const años = remolques
      .map((r) => {
        if (r.anio) {
          return new Date(r.anio).getFullYear().toString();
        }
        return null;
      })
      .filter(Boolean);
    return [...new Set(años)].sort().reverse();
  }, [remolques]);

  // Filtrar remolques
  const remolquesFiltrados = useMemo(() => {
    return remolques.filter((remolque) => {
      const coincideBusqueda =
        !busqueda ||
        remolque.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        remolque.marca?.toLowerCase().includes(busqueda.toLowerCase()) ||
        remolque.modelo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        remolque.categoria?.toLowerCase().includes(busqueda.toLowerCase()) ||
        remolque.descripcion?.toLowerCase().includes(busqueda.toLowerCase());

      const coincideCondicion =
        filtroCondicion === "Todas" || remolque.condicion === filtroCondicion;
      const coincideCategoria =
        filtroCategoria === "Todas" || remolque.categoria === filtroCategoria;
      const coincideMarca =
        filtroMarca === "Todas" || remolque.marca === filtroMarca;

      let coincideAño = true;
      if (filtroAño !== "Todos" && remolque.anio) {
        const añoRemolque = new Date(remolque.anio).getFullYear().toString();
        coincideAño = añoRemolque === filtroAño;
      }

      return (
        coincideBusqueda &&
        coincideCondicion &&
        coincideCategoria &&
        coincideMarca &&
        coincideAño
      );
    });
  }, [
    remolques,
    busqueda,
    filtroCondicion,
    filtroCategoria,
    filtroMarca,
    filtroAño,
  ]);

  // Limpiar filtros
  const limpiarTodosFiltros = () => {
    setBusqueda("");
    setFiltroCondicion("Todas");
    setFiltroCategoria("Todas");
    setFiltroMarca("Todas");
    setFiltroAño("Todos");
    setFiltroMaterial("Todos");
  };

  // Obtener filtros activos
  const getFiltrosActivos = () => {
    const filtros = [];
    if (filtroCondicion !== "Todas")
      filtros.push({
        tipo: "Condición",
        valor: filtroCondicion,
        color: "bg-cyan-500",
      });
    if (filtroCategoria !== "Todas")
      filtros.push({
        tipo: "Categoría",
        valor: filtroCategoria,
        color: "bg-blue-500",
      });
    if (filtroMarca !== "Todas")
      filtros.push({
        tipo: "Marca",
        valor: filtroMarca,
        color: "bg-green-500",
      });
    if (filtroAño !== "Todos")
      filtros.push({ tipo: "Año", valor: filtroAño, color: "bg-purple-500" });
    if (filtroMaterial !== "Todos")
      filtros.push({
        tipo: "Material",
        valor: filtroMaterial,
        color: "bg-orange-500",
      });
    return filtros;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section Premium */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/remolques/alcortaRemolque.webp"
            alt="Remolques Guzman Motors"
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
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Truck className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-200 font-medium">
              Fabricación Nacional
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
            REMOLQUES
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white font-bold max-w-4xl mx-auto leading-tight mb-4">
            Soluciones Profesionales de Carga
          </p>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-10">
            Robustez, durabilidad y diseño adaptado a cada necesidad de
            transporte
          </p>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {remolques.length}+
              </div>
              <div className="text-sm text-slate-300">
                Remolques Disponibles
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                Nuevos
              </div>
              <div className="text-sm text-slate-300">y Usados</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-green-400 mb-2">2025</div>
              <div className="text-sm text-slate-300">Modelos Disponibles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-teal-400 mb-2">1-2</div>
              <div className="text-sm text-slate-300">Años Garantía</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Frase Descriptiva */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Soluciones de Transporte{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text">
                de Alta Calidad
              </span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Contamos con una amplia variedad de remolques diseñados para
              satisfacer las necesidades más exigentes del transporte de carga.
              Desde acoplados hasta semiremolques, ofrecemos productos
              fabricados con materiales de primera calidad y tecnología de
              vanguardia, garantizando durabilidad, seguridad y rendimiento
              óptimo en cada operación.
            </p>
          </div>
        </div>
      </section>

      {/* Layout con Sidebar */}
      <section className="bg-slate-50">
        <div className="w-full px-4 py-8">
          {/* Botón para abrir filtros en móvil */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setFiltrosMovilAbierto(true)}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
            >
              <Settings className="w-5 h-5" />
              Filtros y Búsqueda
            </button>
          </div>

          <div className="flex gap-6">
            {/* Sidebar de Filtros */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white rounded-sm shadow-sm border-2 border-transparent hover:border-cyan-400 transition-all duration-300 sticky top-4 overflow-hidden">
                {/* Header del Sidebar */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-cyan-400" />
                    Filtros
                  </h2>
                </div>

                <div className="p-4 space-y-11 max-h-[calc(100vh-3rem)] overflow-y-auto">
                  {/* Búsqueda */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Búsqueda
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-500" />
                      <input
                        type="text"
                        placeholder="Buscar remolques..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 text-sm border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 hover:border-cyan-300 transition-all"
                      />
                      {busqueda && (
                        <button
                          onClick={() => setBusqueda("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filtros en columna */}
                  <div className="space-y-11">
                    {/* Categoría */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
                        <Truck className="w-4 h-4 text-cyan-500" />
                        Categoría
                      </label>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownAbierto(
                              dropdownAbierto === "categoria"
                                ? null
                                : "categoria"
                            );
                          }}
                          className="w-full px-4 py-2.5 text-sm font-medium border-2 border-slate-200 rounded-lg bg-white cursor-pointer hover:border-cyan-400 hover:shadow-md transition-all text-left flex items-center justify-between"
                        >
                          <span className="truncate">
                            {filtroCategoria === "Todas"
                              ? "Todas las Categorías"
                              : filtroCategoria}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ml-2 ${
                              dropdownAbierto === "categoria"
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                        {dropdownAbierto === "categoria" && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-2xl overflow-hidden"
                          >
                            <div className="max-h-64 overflow-y-auto">
                              <button
                                onClick={() => {
                                  setFiltroCategoria("Todas");
                                  setDropdownAbierto(null);
                                }}
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-cyan-50 transition-colors ${
                                  filtroCategoria === "Todas"
                                    ? "bg-cyan-500 text-white font-semibold"
                                    : "text-slate-700"
                                }`}
                              >
                                Todas las Categorías
                              </button>
                              {categoriasUnicas.map((categoria) => (
                                <button
                                  key={categoria}
                                  onClick={() => {
                                    if (categoria)
                                      setFiltroCategoria(categoria);
                                    setDropdownAbierto(null);
                                  }}
                                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-cyan-50 transition-colors ${
                                    filtroCategoria === categoria
                                      ? "bg-cyan-500 text-white font-semibold"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {categoria}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Marca */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <Settings className="w-4 h-4 text-green-500" />
                        Marca
                      </label>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownAbierto(
                              dropdownAbierto === "marca" ? null : "marca"
                            );
                          }}
                          className="w-full px-4 py-2.5 text-sm font-medium border-2 border-slate-200 rounded-lg bg-white cursor-pointer hover:border-green-400 hover:shadow-md transition-all text-left flex items-center justify-between"
                        >
                          <span className="truncate">
                            {filtroMarca === "Todas"
                              ? "Todas las Marcas"
                              : filtroMarca}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ml-2 ${
                              dropdownAbierto === "marca" ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {dropdownAbierto === "marca" && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-2xl overflow-hidden"
                          >
                            <div className="max-h-64 overflow-y-auto">
                              <button
                                onClick={() => {
                                  setFiltroMarca("Todas");
                                  setDropdownAbierto(null);
                                }}
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 transition-colors ${
                                  filtroMarca === "Todas"
                                    ? "bg-green-500 text-white font-semibold"
                                    : "text-slate-700"
                                }`}
                              >
                                Todas las Marcas
                              </button>
                              {marcasUnicas.map((marca) => (
                                <button
                                  key={marca}
                                  onClick={() => {
                                    if (marca) setFiltroMarca(marca);
                                    setDropdownAbierto(null);
                                  }}
                                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 transition-colors ${
                                    filtroMarca === marca
                                      ? "bg-green-500 text-white font-semibold"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {marca}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Año */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        Año
                      </label>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownAbierto(
                              dropdownAbierto === "año" ? null : "año"
                            );
                          }}
                          className="w-full px-4 py-2.5 text-sm font-medium border-2 border-slate-200 rounded-lg bg-white cursor-pointer hover:border-purple-400 hover:shadow-md transition-all text-left flex items-center justify-between"
                        >
                          <span className="truncate">
                            {filtroAño === "Todos"
                              ? "Todos los Años"
                              : filtroAño}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ml-2 ${
                              dropdownAbierto === "año" ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {dropdownAbierto === "año" && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-2xl overflow-hidden"
                          >
                            <div className="max-h-64 overflow-y-auto">
                              <button
                                onClick={() => {
                                  setFiltroAño("Todos");
                                  setDropdownAbierto(null);
                                }}
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-purple-50 transition-colors ${
                                  filtroAño === "Todos"
                                    ? "bg-purple-500 text-white font-semibold"
                                    : "text-slate-700"
                                }`}
                              >
                                Todos los Años
                              </button>
                              {añosUnicos
                                .filter((año) => año !== null)
                                .map((año) => (
                                  <button
                                    key={año}
                                    onClick={() => {
                                      if (año) setFiltroAño(año);
                                      setDropdownAbierto(null);
                                    }}
                                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-purple-50 transition-colors ${
                                      filtroAño === año
                                        ? "bg-purple-500 text-white font-semibold"
                                        : "text-slate-700"
                                    }`}
                                  >
                                    {año}
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botón Limpiar Filtros */}
                  {(filtroCategoria !== "Todas" ||
                    filtroMarca !== "Todas" ||
                    filtroAño !== "Todos" ||
                    filtroMaterial !== "Todos" ||
                    busqueda) && (
                    <button
                      onClick={limpiarTodosFiltros}
                      className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 hover:shadow-md"
                    >
                      <X className="w-4 h-4" />
                      Limpiar Filtros
                    </button>
                  )}
                </div>
              </div>
            </aside>

            {/* Área de Contenido Principal */}
            <div className="flex-1 min-w-0">
              {/* Chips de Filtros Activos */}
              {getFiltrosActivos().length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm font-semibold text-slate-600">
                    Filtros activos:
                  </span>
                  {getFiltrosActivos().map((filtro, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (filtro.tipo === "Categoría")
                          setFiltroCategoria("Todas");
                        if (filtro.tipo === "Marca") setFiltroMarca("Todas");
                        if (filtro.tipo === "Año") setFiltroAño("Todos");
                        if (filtro.tipo === "Material")
                          setFiltroMaterial("Todos");
                      }}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 ${filtro.color} text-white rounded-lg text-sm font-medium hover:opacity-90 hover:shadow-md transition-all`}
                    >
                      <span>{filtro.valor}</span>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
                    >
                      <div className="h-64 bg-slate-200"></div>
                      <div className="p-6 space-y-4">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                  <div className="text-red-600 text-lg font-semibold mb-2">
                    {error}
                  </div>
                  <button
                    onClick={loadRemolques}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {/* Grid de Remolques */}
              {!loading && !error && (
                <>
                  {remolquesFiltrados.length === 0 ? (
                    <div className="bg-gradient-to-br from-cyan-50 via-white to-cyan-50 rounded-2xl shadow-lg border border-cyan-100 p-12 text-center">
                      <div className="max-w-2xl mx-auto">
                        {/* Icono principal */}
                        <div className="bg-cyan-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Truck className="w-12 h-12 text-cyan-600" />
                        </div>

                        {/* Título principal */}
                        <h3 className="text-3xl font-bold text-slate-800 mb-3">
                          ¿No encontraste el remolque que buscas?
                        </h3>

                        {/* Subtítulo */}
                        <p className="text-lg text-slate-600 mb-6">
                          ¡No te preocupes! Estamos aquí para ayudarte
                        </p>

                        {/* Mensaje personalizado */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
                          <p className="text-slate-700 mb-4 leading-relaxed">
                            En{" "}
                            <span className="font-semibold text-cyan-600">
                              Guzmán Motors
                            </span>{" "}
                            nuestro inventario se actualiza constantemente.
                            Contáctanos y te ayudaremos a encontrar las mejores
                            opciones disponibles según tus necesidades.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-4 h-4 text-cyan-600" />
                              <span>Asesoramiento personalizado</span>
                            </div>
                            <div className="hidden sm:block text-slate-300">
                              •
                            </div>
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-cyan-600" />
                              <span>Sin compromiso</span>
                            </div>
                            <div className="hidden sm:block text-slate-300">
                              •
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-cyan-600" />
                              <span>Garantía de calidad</span>
                            </div>
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                          <a
                            href="https://wa.me/5493424216850?text=Hola! No encontré el remolque que busco en la web. ¿Podrían ayudarme a ver opciones disponibles?"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            <MessageCircle className="w-5 h-5" />
                            Contáctanos por WhatsApp
                          </a>

                          <button
                            onClick={limpiarTodosFiltros}
                            className="flex items-center justify-center gap-2 bg-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-cyan-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            <X className="w-5 h-5" />
                            Limpiar Filtros
                          </button>
                        </div>

                        {/* Información adicional */}
                        <p className="text-sm text-slate-500">
                          También puedes llamarnos al{" "}
                          <span className="font-semibold text-cyan-600">
                            +54 9 342 421 6850
                          </span>{" "}
                          o visitarnos en nuestro local
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {remolquesFiltrados.map((remolque) => {
                        return (
                          <div
                            key={remolque._id}
                            className="bg-slate-900 rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col group relative border-2 border-transparent hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/50"
                          >
                            {/* Contenedor de imagen sin badge */}
                            <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                              {/* Imagen del remolque */}
                              {remolque.fotoSinFondo1?.secure_url ? (
                                <Image
                                  src={remolque.fotoSinFondo1.secure_url}
                                  alt={
                                    remolque.titulo ||
                                    `${remolque.marca} ${remolque.modelo}`
                                  }
                                  width={320}
                                  height={240}
                                  className="h-40 sm:h-44 md:h-52 w-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
                                  quality={95}
                                />
                              ) : (
                                <Truck className="h-40 sm:h-44 md:h-52 w-auto text-slate-600 opacity-50" />
                              )}
                            </div>

                            {/* Información del remolque */}
                            <div className="bg-slate-900 flex-1 px-4 sm:px-5 py-4 sm:py-5 flex flex-col">
                              <div className="mb-3 sm:mb-4">
                                <p className="text-xs sm:text-sm text-cyan-400 font-bold uppercase tracking-wider">
                                  {remolque.marca || "MARCA"}
                                </p>
                                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white leading-tight mt-1">
                                  {remolque.titulo}
                                </h3>
                              </div>

                              {/* Especificaciones */}
                              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-cyan-300 mb-4 sm:mb-5">
                                {remolque.anio && (
                                  <span className="font-semibold">
                                    Año:{" "}
                                    <span className="font-bold text-white">
                                      {new Date(remolque.anio).getFullYear()}
                                    </span>
                                  </span>
                                )}
                                {remolque.cantidadEjes && (
                                  <span className="font-semibold">
                                    Ejes:{" "}
                                    <span className="font-bold text-white">
                                      {remolque.cantidadEjes}
                                    </span>
                                  </span>
                                )}
                                {remolque.capacidadCarga && (
                                  <span className="font-semibold">
                                    Cap.:{" "}
                                    <span className="font-bold text-white">
                                      {remolque.capacidadCarga}
                                    </span>
                                  </span>
                                )}
                                {remolque.tipoCarroceria && (
                                  <span className="font-semibold">
                                    Tipo:{" "}
                                    <span className="font-bold text-white">
                                      {remolque.tipoCarroceria}
                                    </span>
                                  </span>
                                )}
                              </div>

                              {/* Botones de acción mejorados para responsive */}
                              <div className="grid grid-cols-2 gap-2 mt-auto">
                                <a
                                  href={generarEnlaceWhatsApp(remolque)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-1.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
                                >
                                  <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
                                  <span className="text-[11px] sm:text-xs">
                                    Contáctanos
                                  </span>
                                </a>
                                <Link
                                  href={`/remolques/${remolque._id}`}
                                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-1.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
                                >
                                  <Eye className="w-4 h-4 flex-shrink-0" />
                                  <span className="text-[11px] sm:text-xs">
                                    Ver más
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Filtros para Móvil */}
      {filtrosMovilAbierto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden">
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-slide-in-left">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                Filtros
              </h2>
              <button
                onClick={() => setFiltrosMovilAbierto(false)}
                className="text-white hover:text-cyan-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Búsqueda */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Búsqueda
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-500" />
                  <input
                    type="text"
                    placeholder="Buscar remolques..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 hover:border-cyan-300 transition-all"
                  />
                  {busqueda && (
                    <button
                      onClick={() => setBusqueda("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categoría */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Truck className="w-4 h-4 text-cyan-500" />
                  Categoría
                </label>
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-medium border-2 border-slate-200 rounded-lg bg-white cursor-pointer hover:border-cyan-400 transition-all"
                >
                  <option value="Todas">Todas las Categorías</option>
                  {categoriasUnicas.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>

              {/* Marca */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Settings className="w-4 h-4 text-green-500" />
                  Marca
                </label>
                <select
                  value={filtroMarca}
                  onChange={(e) => setFiltroMarca(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-medium border-2 border-slate-200 rounded-lg bg-white cursor-pointer hover:border-green-400 transition-all"
                >
                  <option value="Todas">Todas las Marcas</option>
                  {marcasUnicas.map((marca) => (
                    <option key={marca} value={marca}>
                      {marca}
                    </option>
                  ))}
                </select>
              </div>

              {/* Año */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  Año
                </label>
                <select
                  value={filtroAño}
                  onChange={(e) => setFiltroAño(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-medium border-2 border-slate-200 rounded-lg bg-white cursor-pointer hover:border-purple-400 transition-all"
                >
                  <option value="Todos">Todos los Años</option>
                  {añosUnicos
                    .filter((año) => año !== null)
                    .map((año) => (
                      <option key={año} value={año}>
                        {año}
                      </option>
                    ))}
                </select>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
                {(filtroCategoria !== "Todas" ||
                  filtroMarca !== "Todas" ||
                  filtroAño !== "Todos" ||
                  filtroMaterial !== "Todos" ||
                  busqueda) && (
                  <button
                    onClick={() => {
                      limpiarTodosFiltros();
                      setFiltrosMovilAbierto(false);
                    }}
                    className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Limpiar Filtros
                  </button>
                )}
                <button
                  onClick={() => setFiltrosMovilAbierto(false)}
                  className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm rounded-lg transition-all"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paginación */}
      {!loading && !error && totalPages > 1 && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === index + 1
                      ? "bg-cyan-500 text-white"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>

            <div className="text-center mt-4 text-sm text-slate-600">
              Página {currentPage} de {totalPages} • Total: {totalItems}{" "}
              remolques
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
