"use client";

import React, { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { Usados } from "@/types";
import { usadosService } from "@/services";
import { useFichaTecnicaPDF } from "@/hooks";
import { MediaGallery } from "@/components/media-gallery";
import { UsadoShareModal } from "@/components";
import { debugUsadoData, debugPDFRequest } from "@/lib/debug-usado";
import {
  ChevronLeft,
  Share2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Users,
  Truck,
  Download,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function VehiculoDetailPage() {
  const params = useParams();
  const [usado, setUsado] = useState<Usados | null>(null);
  const [loading, setLoading] = useState(true);
  const [usadosRelacionados, setUsadosRelacionados] = useState<Usados[]>([]);
  const [activeSection, setActiveSection] = useState<string>("general");
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Hook para manejar descarga de PDF
  const { downloading: downloadingPDF, openInNewTab } = useFichaTecnicaPDF({
    onSuccess: () => {
      console.log("PDF descargado exitosamente");
    },
    onError: (error) => {
      console.error("Error al descargar PDF:", error);
      alert(
        "Error al descargar la ficha técnica. Por favor, intente nuevamente."
      );
    },
  });

  // Detectar sección activa con Intersection Observer
  useEffect(() => {
    const sections = [
      "general",
      "motor",
      "capacidades",
      "equipamiento",
      "contacto",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-140px 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [loading]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 140; // Header + Nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Función para descargar/abrir la ficha técnica en PDF
  const descargarFichaTecnica = () => {
    if (!usado?._id) return;

    // Debug: Mostrar info del vehículo
    debugUsadoData(usado);
    debugPDFRequest(usado._id);

    // Abre el PDF en una nueva pestaña (opción más simple y recomendada)
    openInNewTab(usado._id);
  };

  useEffect(() => {
    const cargarUsado = async () => {
      if (!params.id || Array.isArray(params.id)) return;

      try {
        const data = await usadosService.getPublicUsadosById(params.id);
        setUsado(data);
      } catch (error) {
        console.error("Error cargando vehículo usado:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarUsado();
  }, [params.id]);

  useEffect(() => {
    const cargarRelacionados = async () => {
      if (!usado) return;

      try {
        const response = await usadosService.getPublicUsados();

        // Primero intenta filtrar por misma marca
        let relacionados = response.items.filter(
          (u: Usados) => u._id !== usado._id && u.marca === usado.marca
        );

        // Si no hay suficientes, toma cualquier otro usado
        if (relacionados.length < 3) {
          const idsYaIncluidos = new Set(
            relacionados.map((r: Usados) => r._id)
          );
          const otros = response.items.filter(
            (u: Usados) => u._id !== usado._id && !idsYaIncluidos.has(u._id)
          );
          relacionados = [...relacionados, ...otros].slice(0, 3);
        } else {
          relacionados = relacionados.slice(0, 3);
        }

        setUsadosRelacionados(relacionados);
      } catch (error) {
        console.error("Error cargando vehículos usados relacionados:", error);
      }
    };

    cargarRelacionados();
  }, [usado]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!usado) {
    notFound();
  }

  const anio = usado.anio || null;
  const vehicleTitle =
    usado.titulo ||
    `${usado.marca} ${usado.modelo}${usado.version ? ` ${usado.version}` : ""}`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[84vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden flex items-end">
        {/* Imagen de fondo */}
        {usado.imagenes && usado.imagenes.length > 0 && (
          <div className="absolute inset-0">
            <Image
              src={usado.imagenes[0].secure_url}
              alt={vehicleTitle}
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
          </div>
        )}

        {/* Botón volver */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
          <Link
            href="/usados"
            className="group flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 md:px-4 md:py-2 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-white font-medium text-sm md:text-base">
              Volver a Usados
            </span>
          </Link>
        </div>

        {/* Contenido Hero */}
        <div className="relative w-full container mx-auto px-4 pb-16 md:pb-20 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-end w-full">
            {/* Lado izquierdo - Texto */}
            <div className="text-white space-y-4 md:space-y-6 pb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight uppercase">
                {vehicleTitle}
              </h1>

              {usado.descripcion && (
                <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl line-clamp-3">
                  {usado.descripcion}
                </p>
              )}

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                <button
                  onClick={descargarFichaTecnica}
                  disabled={downloadingPDF}
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50 border-2 border-cyan-500 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Download className="w-5 h-5" />
                  FICHA TÉCNICA
                </button>
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-300 hover:scale-105 border-2 border-white/30 text-sm md:text-base"
                >
                  <Share2 className="w-5 h-5" />
                  COMPARTIR
                </button>
              </div>
            </div>

            {/* Lado derecho - Especificaciones rápidas (Cards apiladas) */}
            <div className="space-y-3 md:space-y-4 lg:pl-12">
              {anio && (
                <div className="bg-slate-900/40 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-white/10 hover:bg-slate-900/60 transition-all duration-300 flex items-center gap-5 group">
                  <div className="bg-orange-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg md:text-xl mb-0.5">
                      Año
                    </p>
                    <p className="text-slate-300 text-sm md:text-base">
                      {anio}
                    </p>
                  </div>
                </div>
              )}

              {usado.kilometraje !== undefined && (
                <div className="bg-slate-900/40 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-white/10 hover:bg-slate-900/60 transition-all duration-300 flex items-center gap-5 group">
                  <div className="bg-blue-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Gauge className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg md:text-xl mb-0.5">
                      Kilometraje
                    </p>
                    <p className="text-slate-300 text-sm md:text-base">
                      {usado.kilometraje.toLocaleString()} km
                    </p>
                  </div>
                </div>
              )}

              {usado.tipoCombustible && (
                <div className="bg-slate-900/40 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-white/10 hover:bg-slate-900/60 transition-all duration-300 flex items-center gap-5 group">
                  <div className="bg-green-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Fuel className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg md:text-xl mb-0.5">
                      Combustible
                    </p>
                    <p className="text-slate-300 text-sm md:text-base">
                      {usado.tipoCombustible}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs Sticky */}
      <div className="sticky top-[88px] md:top-24 z-30 bg-slate-900 shadow-xl border-b border-slate-800 backdrop-blur-sm">
        <div
          className="overflow-x-auto overflow-y-visible pb-1"
          style={{ scrollbarWidth: "thin" }}
        >
          <div
            className="flex items-center justify-start md:justify-center gap-2 md:gap-3 py-3 md:py-4 px-4 md:max-w-7xl md:mx-auto"
            style={{ minWidth: "max-content" }}
          >
            {[
              { id: "general", label: "GENERAL" },
              { id: "motor", label: "MOTOR" },
              { id: "capacidades", label: "CAPACIDADES" },
              { id: "equipamiento", label: "EQUIPAMIENTO" },
              { id: "contacto", label: "CONTACTO" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  activeSection === tab.id
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50"
                    : "bg-slate-800 text-slate-400 hover:bg-cyan-500 hover:text-white hover:shadow-lg hover:shadow-cyan-500/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sección GENERAL (Light) */}
      <section id="general" className="py-16 bg-white scroll-mt-[140px]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              INFORMACIÓN GENERAL
            </h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Galería de imágenes */}
            <div className="order-2 lg:order-1">
              <MediaGallery
                images={usado.imagenes || []}
                videos={usado.videos || []}
                vehicleTitle={vehicleTitle}
              />
            </div>

            {/* Datos */}
            <div className="order-1 lg:order-2 space-y-6">
              <h3 className="text-3xl font-black text-slate-900 mb-6">
                Detalles del <span className="text-cyan-500">Vehículo</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {usado.marca && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                      Marca
                    </p>
                    <p className="text-slate-900 text-2xl font-bold">
                      {usado.marca}
                    </p>
                  </div>
                )}
                {usado.modelo && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                      Modelo
                    </p>
                    <p className="text-slate-900 text-2xl font-bold">
                      {usado.modelo}
                    </p>
                  </div>
                )}
                {usado.version && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                      Versión
                    </p>
                    <p className="text-slate-900 text-xl font-bold">
                      {usado.version}
                    </p>
                  </div>
                )}
                {usado.transmision && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                      Transmisión
                    </p>
                    <p className="text-slate-900 text-2xl font-bold">
                      {usado.transmision}
                    </p>
                  </div>
                )}
                {usado.color && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                      Color
                    </p>
                    <p className="text-slate-900 text-2xl font-bold">
                      {usado.color}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección MOTOR (Dark) */}
      <section
        id="motor"
        className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 scroll-mt-[140px]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              MOTOR Y RENDIMIENTO
            </h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {usado.motor && (
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">Motor</h3>
                  <p className="text-slate-300 text-lg">{usado.motor}</p>
                </div>
              )}
              {usado.potencia && (
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    Potencia
                  </h3>
                  <p className="text-slate-300 text-lg">{usado.potencia}</p>
                </div>
              )}
              {usado.cilindrada && (
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    Cilindrada
                  </h3>
                  <p className="text-slate-300 text-lg">{usado.cilindrada}</p>
                </div>
              )}
              {usado.traccion && (
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    Tracción
                  </h3>
                  <p className="text-slate-300 text-lg">{usado.traccion}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sección CAPACIDADES (Light) */}
      <section id="capacidades" className="py-16 bg-white scroll-mt-[140px]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              CAPACIDADES
            </h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {usado.capacidadCarga && (
              <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-cyan-600" />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-2">
                  {usado.capacidadCarga}
                </div>
                <p className="text-slate-600 font-bold uppercase tracking-wider">
                  Carga
                </p>
              </div>
            )}
            {usado.cantidadPuertas && (
              <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-2 border-cyan-600 rounded-md"></div>
                </div>
                <div className="text-3xl font-black text-slate-900 mb-2">
                  {usado.cantidadPuertas}
                </div>
                <p className="text-slate-600 font-bold uppercase tracking-wider">
                  Puertas
                </p>
              </div>
            )}
            {usado.cantidadAsientos && (
              <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-cyan-600" />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-2">
                  {usado.cantidadAsientos}
                </div>
                <p className="text-slate-600 font-bold uppercase tracking-wider">
                  Asientos
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sección EQUIPAMIENTO (Dark) */}
      <section
        id="equipamiento"
        className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 scroll-mt-[140px]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              EQUIPAMIENTO
            </h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {usado.sistemaFrenado && (
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                <h3 className="text-white text-xl font-bold mb-2">
                  Sistema de Frenado
                </h3>
                <p className="text-slate-300 text-lg">{usado.sistemaFrenado}</p>
              </div>
            )}

            {usado.descripcion && (
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                <h3 className="text-white text-xl font-bold mb-4">
                  Descripción Adicional
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                  {usado.descripcion}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sección CONTACTO (Dark) */}
      <section id="contacto" className="py-16 bg-slate-950 scroll-mt-[140px]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700 shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¿Te interesa este vehículo?
              </h2>
              <p className="text-slate-300 text-lg">
                Contáctanos para más información o para coordinar una visita.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href={`https://wa.me/5493424216850?text=${encodeURIComponent(
                  `Hola! Me interesa consultar sobre el vehículo usado: ${vehicleTitle}`
                )}`}
                target="_blank"
                className="flex flex-col items-center justify-center p-6 bg-green-600/10 hover:bg-green-600/20 border border-green-600/30 rounded-2xl transition-all group"
              >
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-bold text-lg mb-1">
                  WhatsApp
                </span>
                <span className="text-green-400 text-sm">Respuesta rápida</span>
              </Link>

              <Link
                href={`mailto:info@guzmanmotors.com?subject=Consulta sobre ${vehicleTitle}`}
                className="flex flex-col items-center justify-center p-6 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 rounded-2xl transition-all group"
              >
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-bold text-lg mb-1">Email</span>
                <span className="text-red-400 text-sm">Envíanos un correo</span>
              </Link>

              <button
                onClick={() => setShareModalOpen(true)}
                className="flex flex-col items-center justify-center p-6 bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-600/30 rounded-2xl transition-all group"
              >
                <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-bold text-lg mb-1">
                  Compartir
                </span>
                <span className="text-cyan-400 text-sm">En redes sociales</span>
              </button>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-700 text-center">
              <div className="inline-flex items-center gap-2 text-slate-400">
                <MapPin className="w-5 h-5 text-cyan-500" />
                <span>Av. Principal 123, Centro, Ciudad</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usados Relacionados */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              También te puede <span className="text-cyan-500">Interesar</span>
            </h2>
          </div>

          {usadosRelacionados.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {usadosRelacionados.map((relacionado) => (
                <Link
                  key={relacionado._id}
                  href={`/usados/${relacionado._id}`}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
                >
                  <div className="relative h-56 bg-gray-200 overflow-hidden">
                    {relacionado.imagenes && relacionado.imagenes.length > 0 ? (
                      <Image
                        src={relacionado.imagenes[0].secure_url}
                        alt={relacionado.titulo || "Vehículo relacionado"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-sm">Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-500 transition-colors line-clamp-1">
                      {relacionado.titulo ||
                        `${relacionado.marca} ${relacionado.modelo}`}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2">
                      {relacionado.descripcion}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <UsadoShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        usado={usado}
      />
    </div>
  );
}
