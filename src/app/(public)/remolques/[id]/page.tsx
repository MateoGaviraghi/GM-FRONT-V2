"use client";

import React, { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { Remolque } from "@/types";
import { remolqueService } from "@/services";
import { MediaGallery } from "@/components/media-gallery";
import { RemolqueShareModal } from "@/components/remolque-share-modal";
import {
  ChevronLeft,
  Share2,
  Download,
  Phone,
  Mail,
  MapPin,
  Settings,
  Truck,
  Ruler,
  Weight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RemolqueDetailPage() {
  const params = useParams();
  const [remolque, setRemolque] = useState<Remolque | null>(null);
  const [loading, setLoading] = useState(true);
  const [remolquesRelacionados, setRemolquesRelacionados] = useState<
    Remolque[]
  >([]);
  const [activeSection, setActiveSection] = useState<string>("general");
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Detectar sección activa con Intersection Observer
  useEffect(() => {
    const sections = [
      "general",
      "chasis",
      "dimensiones",
      "ejes",
      "carroceria",
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

  useEffect(() => {
    const cargarRemolque = async () => {
      if (!params.id || Array.isArray(params.id)) return;

      try {
        const data = await remolqueService.getPublicRemolqueById(params.id);
        setRemolque(data);
      } catch (error) {
        console.error("Error cargando remolque:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarRemolque();
  }, [params.id]);

  useEffect(() => {
    const cargarRelacionados = async () => {
      if (!remolque) return;

      try {
        const response = await remolqueService.getPublicRemolques();
        let relacionados = response.items.filter(
          (r: Remolque) =>
            r._id !== remolque._id &&
            r.tipoCarroceria === remolque.tipoCarroceria
        );

        if (relacionados.length < 3) {
          const otros = response.items.filter(
            (r: Remolque) => r._id !== remolque._id
          );
          relacionados = [...relacionados, ...otros].slice(0, 3);
        } else {
          relacionados = relacionados.slice(0, 3);
        }

        setRemolquesRelacionados(relacionados);
      } catch (error) {
        console.error("Error cargando remolques relacionados:", error);
      }
    };

    cargarRelacionados();
  }, [remolque]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!remolque) {
    notFound();
  }

  const anio = remolque.anio || null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[84vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden flex items-end">
        {/* Imagen de fondo */}
        {remolque.imagenes && remolque.imagenes.length > 0 && (
          <div className="absolute inset-0">
            <Image
              src={remolque.imagenes[0].secure_url}
              alt={remolque.titulo}
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
            href="/remolques"
            className="group flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 md:px-4 md:py-2 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-white font-medium text-sm md:text-base">
              Volver a Remolques
            </span>
          </Link>
        </div>

        {/* Contenido Hero */}
        <div className="relative w-full container mx-auto px-4 pb-16 md:pb-20 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-end w-full">
            {/* Lado izquierdo - Texto */}
            <div className="text-white space-y-4 md:space-y-6 pb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight uppercase">
                {remolque.titulo}
              </h1>

              {remolque.descripcion && (
                <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl">
                  {remolque.descripcion}
                </p>
              )}

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                <button
                  onClick={() =>
                    remolque._id &&
                    remolqueService.descargarFichaTecnica(remolque._id)
                  }
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50 border-2 border-cyan-500 text-sm md:text-base"
                >
                  <Download className="w-5 h-5" />
                  FICHA TÉCNICA
                </button>
              </div>
            </div>

            {/* Lado derecho - Especificaciones rápidas (Cards apiladas) */}
            <div className="space-y-3 md:space-y-4 lg:pl-12">
              {anio && (
                <div className="bg-slate-900/40 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-white/10 hover:bg-slate-900/60 transition-all duration-300 flex items-center gap-5 group">
                  <div className="bg-cyan-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <span className="text-cyan-400 font-bold text-lg">
                      {anio}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg md:text-xl mb-0.5">
                      Año
                    </p>
                    <p className="text-slate-300 text-sm md:text-base">
                      Modelo
                    </p>
                  </div>
                </div>
              )}
              {remolque.tipoCarroceria && (
                <div className="bg-slate-900/40 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-white/10 hover:bg-slate-900/60 transition-all duration-300 flex items-center gap-5 group">
                  <div className="bg-blue-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Truck className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg md:text-xl mb-0.5">
                      Carrocería
                    </p>
                    <p className="text-slate-300 text-sm md:text-base">
                      {remolque.tipoCarroceria}
                    </p>
                  </div>
                </div>
              )}
              {remolque.capacidadCarga && (
                <div className="bg-slate-900/40 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-white/10 hover:bg-slate-900/60 transition-all duration-300 flex items-center gap-5 group">
                  <div className="bg-green-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <Weight className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg md:text-xl mb-0.5">
                      Capacidad
                    </p>
                    <p className="text-slate-300 text-sm md:text-base">
                      {remolque.capacidadCarga}
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
              { id: "chasis", label: "CHASIS" },
              { id: "dimensiones", label: "DIMENSIONES" },
              { id: "ejes", label: "EJES Y SUSPENSIÓN" },
              { id: "carroceria", label: "CARROCERÍA" },
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
                images={remolque.imagenes || []}
                videos={remolque.videos || []}
                vehicleTitle={remolque.titulo}
              />
            </div>

            {/* Datos */}
            <div className="order-1 lg:order-2 space-y-6">
              <h3 className="text-3xl font-black text-slate-900 mb-6">
                Detalles del <span className="text-cyan-500">Remolque</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {remolque.marca && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                      Marca
                    </p>
                    <p className="text-slate-900 text-2xl font-bold">
                      {remolque.marca}
                    </p>
                  </div>
                )}
                {remolque.modelo && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                      Modelo
                    </p>
                    <p className="text-slate-900 text-2xl font-bold">
                      {remolque.modelo}
                    </p>
                  </div>
                )}
                {remolque.anio && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                      Año
                    </p>
                    <p className="text-slate-900 text-xl font-bold">
                      {remolque.anio}
                    </p>
                  </div>
                )}
                {remolque.condicion && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                      Condición
                    </p>
                    <p className="text-slate-900 text-2xl font-bold">
                      {remolque.condicion}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección CHASIS (Dark) */}
      <section
        id="chasis"
        className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 scroll-mt-[140px]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              CHASIS Y ESTRUCTURA
            </h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {remolque.chasis?.tipo && (
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    Tipo de Chasis
                  </h3>
                  <p className="text-slate-300 text-lg">
                    {remolque.chasis.tipo}
                  </p>
                </div>
              )}
              {remolque.chasis?.pisoChapaEspesor && (
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    Espesor Piso
                  </h3>
                  <p className="text-slate-300 text-lg">
                    {remolque.chasis.pisoChapaEspesor}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sección DIMENSIONES (Light) */}
      <section id="dimensiones" className="py-16 bg-white scroll-mt-[140px]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              DIMENSIONES
            </h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {remolque.dimensiones?.largoInterior && (
              <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ruler className="w-8 h-8 text-cyan-600" />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-2">
                  {remolque.dimensiones.largoInterior}
                </div>
                <p className="text-slate-600 font-bold uppercase tracking-wider">
                  Largo Interior
                </p>
              </div>
            )}
            {remolque.dimensiones?.anchoExterior && (
              <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ruler className="w-8 h-8 text-cyan-600 transform rotate-90" />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-2">
                  {remolque.dimensiones.anchoExterior}
                </div>
                <p className="text-slate-600 font-bold uppercase tracking-wider">
                  Ancho Exterior
                </p>
              </div>
            )}
            {remolque.dimensiones?.alturaBaranda && (
              <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ruler className="w-8 h-8 text-cyan-600" />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-2">
                  {remolque.dimensiones.alturaBaranda}
                </div>
                <p className="text-slate-600 font-bold uppercase tracking-wider">
                  Altura Baranda
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sección EJES (Dark) */}
      <section
        id="ejes"
        className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 scroll-mt-[140px]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              EJES Y SUSPENSIÓN
            </h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {remolque.ejesSuspension?.tipoEjes && (
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                <h3 className="text-white text-xl font-bold mb-2">
                  Tipo de Ejes
                </h3>
                <p className="text-slate-300 text-lg">
                  {remolque.ejesSuspension.tipoEjes}
                </p>
              </div>
            )}
            {remolque.ejesSuspension?.suspension && (
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                <h3 className="text-white text-xl font-bold mb-2">
                  Suspensión
                </h3>
                <p className="text-slate-300 text-lg">
                  {remolque.ejesSuspension.suspension}
                </p>
              </div>
            )}
            {remolque.ejesSuspension?.frenos && (
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                <h3 className="text-white text-xl font-bold mb-2">Frenos</h3>
                <p className="text-slate-300 text-lg">
                  {remolque.ejesSuspension.frenos}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sección CARROCERÍA (Light) */}
      <section id="carroceria" className="py-16 bg-white scroll-mt-[140px]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              CARROCERÍA
            </h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {remolque.carroceria?.tipo && (
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <h3 className="text-slate-900 text-xl font-bold mb-2">
                  Tipo de Carrocería
                </h3>
                <p className="text-slate-600 text-lg">
                  {remolque.carroceria.tipo}
                </p>
              </div>
            )}
            {remolque.carroceria?.material && (
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <h3 className="text-slate-900 text-xl font-bold mb-2">
                  Material
                </h3>
                <p className="text-slate-600 text-lg">
                  {remolque.carroceria.material}
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
                ¿Te interesa este remolque?
              </h2>
              <p className="text-slate-300 text-lg">
                Contáctanos para más información o para solicitar un
                presupuesto.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href={`https://wa.me/5493424216850?text=${encodeURIComponent(
                  `Hola! Me interesa consultar sobre el remolque: ${remolque.titulo}`
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
                href={`mailto:info@guzmanmotors.com?subject=Consulta sobre ${remolque.titulo}`}
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

      {/* Remolques Relacionados */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              También te puede <span className="text-cyan-500">Interesar</span>
            </h2>
          </div>

          {remolquesRelacionados.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {remolquesRelacionados.map((relacionado) => (
                <Link
                  key={relacionado._id}
                  href={`/remolques/${relacionado._id}`}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
                >
                  <div className="relative h-56 bg-gray-200 overflow-hidden">
                    {relacionado.imagenes && relacionado.imagenes.length > 0 ? (
                      <Image
                        src={relacionado.imagenes[0].secure_url}
                        alt={relacionado.titulo || "Remolque relacionado"}
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

      <RemolqueShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        remolqueName={remolque.titulo}
        remolqueUrl={`/remolques/${remolque._id}`}
        remolqueId={remolque._id}
      />
    </div>
  );
}
