"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { usadosService } from "@/services";
import { Usados } from "@/types";
import {
  CarFront,
  Settings,
  Search,
  Heart,
  Eye,
  MessageCircle,
  Calendar,
  X,
  ChevronDown,
  Filter,
  Fuel,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Componente para imagen con carga optimizada
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ImagenUsado = ({
  usado,
  className = "",
  priority = false,
}: {
  usado: Usados;
  className?: string;
  priority?: boolean;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {usado.imagenes && usado.imagenes.length > 0 ? (
        <>
          {/* Skeleton loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <CarFront className="w-12 h-12 text-slate-400 animate-pulse" />
              </div>
            </div>
          )}

          <Image
            src={usado.imagenes[0].secure_url}
            alt={usado.titulo || `${usado.marca} ${usado.modelo}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            quality={95}
            priority={priority}
            onLoad={() => setImageLoaded(true)}
          />
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
          <CarFront className="w-16 h-16 text-slate-400" />
        </div>
      )}
    </div>
  );
};

export default function UsadosPage() {
  // Estados principales
  const [usados, setUsados] = useState<Usados[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroMarca, setFiltroMarca] = useState("Todas");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroAño, setFiltroAño] = useState("Todos");
  const [filtroCombustible, setFiltroCombustible] = useState("Todos");

  // Estado de dropdown abierto
  const [dropdownAbierto, setDropdownAbierto] = useState<string | null>(null);

  // Estado para modal de filtros móvil
  const [filtrosMovilAbierto, setFiltrosMovilAbierto] = useState(false);

  // Estados de paginación
  const [currentPage] = useState(1);

  // Función para generar enlace de WhatsApp
  const generarEnlaceWhatsApp = (usado: Usados) => {
    const numeroWhatsApp = "5493424216850";
    const mensaje =
      `Hola! Me interesa consultar sobre el vehículo usado 0km:\n\n🚗 *${
        usado.titulo ||
        `${usado.marca} ${usado.modelo}${
          usado.version ? ` ${usado.version}` : ""
        }`
      }*\n\n` +
      `📋 *Detalles:*\n` +
      `• Marca: ${usado.marca}\n` +
      `• Modelo: ${usado.modelo}\n` +
      (usado.version ? `• Versión: ${usado.version}\n` : "") +
      (usado.anio ? `• Año: ${new Date(usado.anio).getFullYear()}\n` : "") +
      (usado.tipoCombustible
        ? `• Combustible: ${usado.tipoCombustible}\n`
        : "") +
      (usado.transmision ? `• Transmisión: ${usado.transmision}\n` : "") +
      `\n¿Podrían brindarme más información y disponibilidad? ¡Gracias!`;

    return `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
      mensaje
    )}`;
  };

  // Cargar usados
  const loadUsados = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await usadosService.getPublicUsados({
        page: currentPage,
        limit: 12,
      });

      setUsados(response?.items || []);
    } catch (err) {
      console.error("Error cargando usados:", err);
      setError(
        "Error al cargar los vehículos usados. Por favor, inténtalo de nuevo."
      );
      setUsados([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadUsados();
  }, [loadUsados]);

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

  // Obtener marcas únicas
  const marcasUnicas = useMemo(() => {
    const marcas = usados.map((v) => v.marca).filter(Boolean);
    return [...new Set(marcas)].sort();
  }, [usados]);

  // Obtener tipos únicos
  const tiposUnicos = useMemo(() => {
    const tipos = usados.map((v) => v.tipoVehiculo).filter(Boolean);
    return [...new Set(tipos)].sort();
  }, [usados]);

  // Obtener años únicos
  const añosUnicos = useMemo(() => {
    const años = usados
      .map((v) => {
        if (v.anio) {
          return new Date(v.anio).getFullYear().toString();
        }
        return null;
      })
      .filter(Boolean);
    return [...new Set(años)].sort().reverse();
  }, [usados]);

  // Obtener combustibles únicos
  const combustiblesUnicos = useMemo(() => {
    const combustibles = usados.map((v) => v.tipoCombustible).filter(Boolean);
    return [...new Set(combustibles)].sort();
  }, [usados]);

  // Filtrar vehículo usados
  const usadosFiltrados = useMemo(() => {
    return usados.filter((usado) => {
      const coincideBusqueda =
        !busqueda ||
        usado.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        usado.marca?.toLowerCase().includes(busqueda.toLowerCase()) ||
        usado.modelo?.toLowerCase().includes(busqueda.toLowerCase());

      const coincideMarca =
        filtroMarca === "Todas" || usado.marca === filtroMarca;
      const coincideTipo =
        filtroTipo === "Todos" || usado.tipoVehiculo === filtroTipo;
      const coincideCombustible =
        filtroCombustible === "Todos" ||
        usado.tipoCombustible === filtroCombustible;

      let coincideAño = true;
      if (filtroAño !== "Todos" && usado.anio) {
        const añoVehiculo = new Date(usado.anio).getFullYear().toString();
        coincideAño = añoVehiculo === filtroAño;
      }

      return (
        coincideBusqueda &&
        coincideMarca &&
        coincideTipo &&
        coincideAño &&
        coincideCombustible
      );
    });
  }, [usados, busqueda, filtroMarca, filtroTipo, filtroAño, filtroCombustible]);

  // Limpiar filtros
  const limpiarTodosFiltros = () => {
    setBusqueda("");
    setFiltroMarca("Todas");
    setFiltroTipo("Todos");
    setFiltroAño("Todos");
    setFiltroCombustible("Todos");
  };

  // Obtener filtros activos
  const getFiltrosActivos = () => {
    const filtros = [];
    if (filtroMarca !== "Todas")
      filtros.push({
        tipo: "Marca",
        valor: filtroMarca,
        color: "bg-green-500",
      });
    if (filtroTipo !== "Todos")
      filtros.push({ tipo: "Tipo", valor: filtroTipo, color: "bg-cyan-500" });
    if (filtroAño !== "Todos")
      filtros.push({ tipo: "Año", valor: filtroAño, color: "bg-purple-500" });
    if (filtroCombustible !== "Todos")
      filtros.push({
        tipo: "Combustible",
        valor: filtroCombustible,
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
            src="/images/usados/FotonUsado.webp"
            alt="Vehículos Usados Guzman Motors"
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
            <CarFront className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-200 font-medium">
              Revisados y Certificados
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
            VEHÍCULOS USADOS
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white font-bold max-w-4xl mx-auto leading-tight mb-4">
            Oportunidades Únicas en Vehículos de Calidad
          </p>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-10">
            Revisados, certificados y listos para rodar
          </p>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {usados.length}+
              </div>
              <div className="text-sm text-slate-300">
                Vehículos Disponibles
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                Usados
              </div>
              <div className="text-sm text-slate-300">0 KM Seleccionados</div>
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
              Vehículos Usados{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text">
                de Alta Calidad
              </span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Contamos con una amplia variedad de vehículos usados 0 KM
              cuidadosamente seleccionados y revisados. Cada unidad pasa por
              rigurosos controles de calidad para garantizar tu tranquilidad y
              seguridad en cada viaje. Ofrecemos financiación a medida y
              asesoramiento personalizado para que encuentres el vehículo
              perfecto para vos.
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
                        placeholder="Buscar vehículos..."
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
                    {/* Tipo */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
                        <CarFront className="w-4 h-4 text-cyan-500" />
                        Tipo
                      </label>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownAbierto(
                              dropdownAbierto === "tipo" ? null : "tipo"
                            );
                          }}
                          className="w-full px-4 py-2.5 text-sm font-medium border-2 border-slate-200 rounded-lg bg-white cursor-pointer hover:border-cyan-400 hover:shadow-md transition-all text-left flex items-center justify-between"
                        >
                          <span className="truncate">
                            {filtroTipo === "Todos"
                              ? "Todos los Tipos"
                              : filtroTipo}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ml-2 ${
                              dropdownAbierto === "tipo" ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {dropdownAbierto === "tipo" && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-2xl overflow-hidden"
                          >
                            <div className="max-h-64 overflow-y-auto">
                              <button
                                onClick={() => {
                                  setFiltroTipo("Todos");
                                  setDropdownAbierto(null);
                                }}
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-cyan-50 transition-colors ${
                                  filtroTipo === "Todos"
                                    ? "bg-cyan-500 text-white font-semibold"
                                    : "text-slate-700"
                                }`}
                              >
                                Todos los Tipos
                              </button>
                              {tiposUnicos.map((tipo) => (
                                <button
                                  key={tipo}
                                  onClick={() => {
                                    if (tipo) setFiltroTipo(tipo);
                                    setDropdownAbierto(null);
                                  }}
                                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-cyan-50 transition-colors ${
                                    filtroTipo === tipo
                                      ? "bg-cyan-500 text-white font-semibold"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {tipo}
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

                    {/* Combustible */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <Fuel className="w-4 h-4 text-orange-500" />
                        Combustible
                      </label>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownAbierto(
                              dropdownAbierto === "combustible"
                                ? null
                                : "combustible"
                            );
                          }}
                          className="w-full px-4 py-2.5 text-sm font-medium border-2 border-slate-200 rounded-lg bg-white cursor-pointer hover:border-orange-400 hover:shadow-md transition-all text-left flex items-center justify-between"
                        >
                          <span className="truncate">
                            {filtroCombustible === "Todos"
                              ? "Todos los Combustibles"
                              : filtroCombustible}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ml-2 ${
                              dropdownAbierto === "combustible"
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                        {dropdownAbierto === "combustible" && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-2xl overflow-hidden"
                          >
                            <div className="max-h-64 overflow-y-auto">
                              <button
                                onClick={() => {
                                  setFiltroCombustible("Todos");
                                  setDropdownAbierto(null);
                                }}
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-orange-50 transition-colors ${
                                  filtroCombustible === "Todos"
                                    ? "bg-orange-500 text-white font-semibold"
                                    : "text-slate-700"
                                }`}
                              >
                                Todos los Combustibles
                              </button>
                              {combustiblesUnicos.map((combustible) => (
                                <button
                                  key={combustible}
                                  onClick={() => {
                                    if (combustible)
                                      setFiltroCombustible(combustible);
                                    setDropdownAbierto(null);
                                  }}
                                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-orange-50 transition-colors ${
                                    filtroCombustible === combustible
                                      ? "bg-orange-500 text-white font-semibold"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {combustible}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botón Limpiar Filtros */}
                  {(filtroTipo !== "Todos" ||
                    filtroMarca !== "Todas" ||
                    filtroAño !== "Todos" ||
                    filtroCombustible !== "Todos" ||
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
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filtros Aplicados ({getFiltrosActivos().length})
                    </h3>
                    <button
                      onClick={limpiarTodosFiltros}
                      className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
                    >
                      Limpiar todos
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getFiltrosActivos().map((filtro, index) => (
                      <div
                        key={index}
                        className={`inline-flex items-center gap-2 px-3 py-2 ${filtro.color} text-white rounded-full text-sm font-medium shadow-sm`}
                      >
                        <span>
                          {filtro.tipo}: {filtro.valor}
                        </span>
                        <button
                          onClick={() => {
                            if (filtro.tipo === "Marca")
                              setFiltroMarca("Todas");
                            if (filtro.tipo === "Tipo") setFiltroTipo("Todos");
                            if (filtro.tipo === "Año") setFiltroAño("Todos");
                            if (filtro.tipo === "Combustible")
                              setFiltroCombustible("Todos");
                          }}
                          className="w-4 h-4 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
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
                    onClick={loadUsados}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {/* Grid de Usados */}
              {!loading && !error && (
                <>
                  {usadosFiltrados.length === 0 ? (
                    <div className="bg-gradient-to-br from-cyan-50 via-white to-cyan-50 rounded-2xl shadow-lg border border-cyan-100 p-12 text-center">
                      <div className="max-w-2xl mx-auto">
                        {/* Icono principal */}
                        <div className="bg-cyan-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CarFront className="w-12 h-12 text-cyan-600" />
                        </div>

                        {/* Título principal */}
                        <h3 className="text-3xl font-bold text-slate-800 mb-3">
                          ¿No encontraste el vehículo que buscas?
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
                            href="https://wa.me/5493424216850?text=Hola! No encontré el vehículo usado que busco en la web. ¿Podrían ayudarme a ver opciones disponibles?"
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
                        <div className="border-t border-cyan-100 pt-6">
                          <p className="text-slate-600 text-sm">
                            También puedes explorar todas nuestras categorías o
                            modificar tus filtros de búsqueda
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                      {usadosFiltrados.map((usado) => {
                        return (
                          <div
                            key={usado._id}
                            className="bg-slate-900 rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col group relative border-2 border-transparent hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/50"
                          >
                            {/* Contenedor de imagen sin badge */}
                            <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                              {/* Imagen del usado */}
                              {usado.fotoSinFondo1?.secure_url ? (
                                <Image
                                  src={usado.fotoSinFondo1.secure_url}
                                  alt={
                                    usado.titulo ||
                                    `${usado.marca} ${usado.modelo}`
                                  }
                                  width={400}
                                  height={300}
                                  className="h-44 sm:h-52 md:h-60 w-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
                                  quality={95}
                                />
                              ) : (
                                <CarFront className="h-44 sm:h-52 md:h-60 w-auto text-slate-600 opacity-50" />
                              )}
                            </div>

                            {/* Información del usado */}
                            <div className="bg-slate-900 flex-1 px-4 sm:px-5 py-4 sm:py-5 flex flex-col">
                              <div className="mb-3 sm:mb-4">
                                <p className="text-xs sm:text-sm text-cyan-400 font-bold uppercase tracking-wider">
                                  {usado.marca || "MARCA"}
                                </p>
                                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white leading-tight mt-1">
                                  {usado.titulo ||
                                    `${usado.marca} ${usado.modelo}${
                                      usado.version ? ` ${usado.version}` : ""
                                    }`}
                                </h3>
                              </div>

                              {/* Especificaciones */}
                              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-cyan-300 mb-4 sm:mb-5">
                                {usado.anio && (
                                  <span className="font-semibold">
                                    Año:{" "}
                                    <span className="font-bold text-white">
                                      {new Date(usado.anio).getFullYear()}
                                    </span>
                                  </span>
                                )}
                                {usado.tipoCombustible && (
                                  <span className="font-semibold">
                                    Comb.:{" "}
                                    <span className="font-bold text-white">
                                      {usado.tipoCombustible}
                                    </span>
                                  </span>
                                )}
                                {usado.transmision && (
                                  <span className="font-semibold">
                                    Trans.:{" "}
                                    <span className="font-bold text-white">
                                      {usado.transmision}
                                    </span>
                                  </span>
                                )}
                                {usado.kilometraje && (
                                  <span className="font-semibold">
                                    Km:{" "}
                                    <span className="font-bold text-white">
                                      {usado.kilometraje}
                                    </span>
                                  </span>
                                )}
                              </div>

                              {/* Botones de acción mejorados para responsive */}
                              <div className="grid grid-cols-2 gap-2 mt-auto">
                                <a
                                  href={generarEnlaceWhatsApp(usado)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-1.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
                                >
                                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                                  <span className="text-[11px] sm:text-xs">
                                    Contáctanos
                                  </span>
                                </a>
                                <Link
                                  href={`/usados/${usado._id}`}
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
                    placeholder="Buscar vehículos usados..."
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

              {/* Tipo */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <CarFront className="w-4 h-4 text-cyan-500" />
                  Tipo
                </label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-medium border-2 border-slate-200 rounded-lg bg-white cursor-pointer hover:border-cyan-400 transition-all"
                >
                  <option value="Todos">Todos los Tipos</option>
                  {tiposUnicos.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
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

              {/* Combustible */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Fuel className="w-4 h-4 text-orange-500" />
                  Combustible
                </label>
                <select
                  value={filtroCombustible}
                  onChange={(e) => setFiltroCombustible(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-medium border-2 border-slate-200 rounded-lg bg-white cursor-pointer hover:border-orange-400 transition-all"
                >
                  <option value="Todos">Todos los Combustibles</option>
                  {combustiblesUnicos.map((combustible) => (
                    <option key={combustible} value={combustible}>
                      {combustible}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
                {(filtroTipo !== "Todos" ||
                  filtroMarca !== "Todas" ||
                  filtroAño !== "Todos" ||
                  filtroCombustible !== "Todos" ||
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
    </div>
  );
}
