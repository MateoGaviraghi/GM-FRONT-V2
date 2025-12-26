"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  ChevronLeft,
  ChevronRight,
  Truck,
  Settings,
  Gauge,
  Shield,
  Mountain,
  Leaf,
  X,
} from "lucide-react";
import { FotonShareButton } from "@/components";

export default function FotonTunlandV9Page() {
  // Versiones disponibles con sus PDFs
  const versiones = [
    {
      id: "4x4-at-ultimate",
      nombre: "4x4 AT Ultimate",
      pdf: "/images/FOTON/TUNDLAND.V9/pdf+info/FT-Foton-Tunland-V9-4x4-AT-Ultimate-1.pdf",
    },
  ];

  const [activeInteriorImage, setActiveInteriorImage] = useState(0);
  const [activeExteriorImage, setActiveExteriorImage] = useState(0);
  const [activeTrenMotrizImage, setActiveTrenMotrizImage] = useState(0);
  const [activeSeguridadImage, setActiveSeguridadImage] = useState(0);
  const [activeDimensionesImage, setActiveDimensionesImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");
  const [activeSection, setActiveSection] = useState("interior");

  // Detectar sección activa con Intersection Observer
  useEffect(() => {
    const sections = [
      "interior",
      "exterior",
      "tren-motriz",
      "seguridad",
      "dimensiones",
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
  }, []);

  // Función para scroll suave a secciones
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 140; // Header (72px) + Barra navegación (~60px) + margen
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Imágenes del interior
  const interiorImages = [
    "/images/FOTON/TUNDLAND.V9/INTERIOR/InteriorTundlandV9-1.jpg",
    "/images/FOTON/TUNDLAND.V9/INTERIOR/InteriorTundlandV9-2.jpg",
    "/images/FOTON/TUNDLAND.V9/INTERIOR/InteriorTundlandV9-3.jpg",
    "/images/FOTON/TUNDLAND.V9/INTERIOR/InteriorTundlandV9-4.jpg",
    "/images/FOTON/TUNDLAND.V9/INTERIOR/InteriorTundlandV9-5.jpg",
  ];

  // Imágenes del exterior
  const exteriorImages = [
    "/images/FOTON/TUNDLAND.V9/EXTERIOR/ExteriorTundlandV9-1.jpg",
    "/images/FOTON/TUNDLAND.V9/EXTERIOR/ExteriorTundlandV9-2.jpg",
    "/images/FOTON/TUNDLAND.V9/EXTERIOR/ExteriorTundlandV9-3.jpg",
    "/images/FOTON/TUNDLAND.V9/EXTERIOR/ExteriorTundlandV9-4.jpg",
    "/images/FOTON/TUNDLAND.V9/EXTERIOR/ExteriorTundlandV9-5.jpg",
  ];

  // Imágenes del tren motriz
  const trenMotrizImages = [
    "/images/FOTON/TUNDLAND.V9/TRENMOTRIZ/TREN-MOTRIZ-V9-1.jpg",
    "/images/FOTON/TUNDLAND.V9/TRENMOTRIZ/TREN-MOTRIZ-V9-2.jpg",
    "/images/FOTON/TUNDLAND.V9/TRENMOTRIZ/TREN-MOTRIZ-V9-3.jpg",
    "/images/FOTON/TUNDLAND.V9/TRENMOTRIZ/TREN-MOTRIZ-V9-4.jpg",
    "/images/FOTON/TUNDLAND.V9/TRENMOTRIZ/TREN-MOTRIZ-V9-5.jpg",
  ];

  // Imágenes de seguridad
  const seguridadImages = [
    "/images/FOTON/TUNDLAND.V9/SEGURIDADYCONFORT/SeguridadTundlandV9-1.jpg",
    "/images/FOTON/TUNDLAND.V9/SEGURIDADYCONFORT/SeguridadTundlandV9-2.jpg",
    "/images/FOTON/TUNDLAND.V9/SEGURIDADYCONFORT/SeguridadTundlandV9-3.jpg",
    "/images/FOTON/TUNDLAND.V9/SEGURIDADYCONFORT/SeguridadTundlandV9-4.jpg",
    "/images/FOTON/TUNDLAND.V9/SEGURIDADYCONFORT/SeguridadTundlandV9-5.jpg",
  ];

  // Imágenes de dimensiones
  const dimensionesImages = [
    "/images/FOTON/TUNDLAND.V9/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-V9-1.jpg",
    "/images/FOTON/TUNDLAND.V9/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-V9-2.jpg",
    "/images/FOTON/TUNDLAND.V9/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-V9-3.jpg",
    "/images/FOTON/TUNDLAND.V9/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-V9-4.jpg",
    "/images/FOTON/TUNDLAND.V9/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-V9-5.jpg",
  ];

  const nextInteriorImage = () => {
    setActiveInteriorImage((prev) =>
      prev === interiorImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevInteriorImage = () => {
    setActiveInteriorImage((prev) =>
      prev === 0 ? interiorImages.length - 1 : prev - 1
    );
  };

  const nextExteriorImage = () => {
    setActiveExteriorImage((prev) =>
      prev === exteriorImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevExteriorImage = () => {
    setActiveExteriorImage((prev) =>
      prev === 0 ? exteriorImages.length - 1 : prev - 1
    );
  };

  const nextTrenMotrizImage = () => {
    setActiveTrenMotrizImage((prev) =>
      prev === trenMotrizImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevTrenMotrizImage = () => {
    setActiveTrenMotrizImage((prev) =>
      prev === 0 ? trenMotrizImages.length - 1 : prev - 1
    );
  };

  const nextSeguridadImage = () => {
    setActiveSeguridadImage((prev) =>
      prev === seguridadImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevSeguridadImage = () => {
    setActiveSeguridadImage((prev) =>
      prev === 0 ? seguridadImages.length - 1 : prev - 1
    );
  };

  const nextDimensionesImage = () => {
    setActiveDimensionesImage((prev) =>
      prev === dimensionesImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevDimensionesImage = () => {
    setActiveDimensionesImage((prev) =>
      prev === 0 ? dimensionesImages.length - 1 : prev - 1
    );
  };

  // Funciones para el lightbox
  const openLightbox = (imageSrc: string) => {
    setLightboxImage(imageSrc);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage("");
    document.body.style.overflow = "unset";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative min-h-screen md:min-h-[700px] lg:min-h-[800px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/FOTON/TUNDLAND.V9/HERO/foton-tunland-v9-Hero.jpg"
            alt="FOTON TUNLAND V9 Híbrida"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
        </div>

        {/* Botón volver */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
          <Link
            href="/foton/pick-ups"
            className="group flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 md:px-4 md:py-2 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-white font-medium text-sm md:text-base">
              Volver a Pick Ups
            </span>
          </Link>
        </div>

        {/* Contenido Hero */}
        <div className="relative h-full container mx-auto px-4 pt-28 pb-12 md:pt-32 md:pb-16 lg:py-0 lg:flex lg:items-center">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start md:items-center w-full">
            {/* Lado izquierdo - Texto */}
            <div className="text-white space-y-4 md:space-y-6">
              {/* Logo TUNLAND V9 como título principal */}
              <div className="mt-2">
                <Image
                  src="/images/FOTON/TUNDLAND.V9/LOGO/LogoNombreTunlandV9.png"
                  alt="TUNLAND V9 Logo"
                  width={400}
                  height={200}
                  className="object-contain w-full max-w-[200px] sm:max-w-[280px] md:max-w-[350px] lg:max-w-[400px]"
                  priority
                />
              </div>

              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-200">
                Capacidad de carga útil
              </h1>

              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl">
                La Nueva Foton Tunland V9 híbrida lleva el rendimiento y la
                eficiencia energética a un nuevo nivel. Con tecnología
                mild-hybrid, combina lo mejor de los motores eléctricos y de
                combustión, ofreciendo una mayor autonomía y reduciendo el
                consumo de combustible. Ideal para quienes buscan una pick-up
                potente, versátil y amigable con el medio ambiente.
              </p>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                <a
                  href="https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20la%20FOTON%20TUNLAND%20V9.%20Me%20gustaría%20recibir%20más%20información."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50 text-sm md:text-base"
                >
                  CONSULTAR
                </a>

                <a
                  href="/images/FOTON/TUNDLAND.V9/pdf+info/FT-Foton-Tunland-V9-4x4-AT-Ultimate-1.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 text-sm md:text-base"
                >
                  <Download className="w-5 h-5" />
                  FICHA TÉCNICA
                </a>
              </div>
            </div>

            {/* Lado derecho - Especificaciones rápidas */}
            <div className="space-y-2.5 md:space-y-3 lg:space-y-4">
              {/* Tracción */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mountain className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm md:text-base lg:text-lg mb-0.5 md:mb-1">
                      Tracción
                    </h3>
                    <p className="text-slate-300 text-xs md:text-sm">4x4</p>
                  </div>
                </div>
              </div>

              {/* Motor */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm md:text-base lg:text-lg mb-0.5 md:mb-1">
                      Motor Híbrido
                    </h3>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                      Diesel Mild-hybrid Aucan 2.0L + 48V
                      <br />
                      Potencia 175 hp - Torque 451 Nm
                    </p>
                  </div>
                </div>
              </div>

              {/* Caja de cambios */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Gauge className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm md:text-base lg:text-lg mb-0.5 md:mb-1">
                      Caja de cambios
                    </h3>
                    <p className="text-slate-300 text-xs md:text-sm">
                      ZF AT 8 marchas
                    </p>
                  </div>
                </div>
              </div>

              {/* Seguridad */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm md:text-base lg:text-lg mb-0.5 md:mb-1">
                      Seguridad
                    </h3>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                      6 airbags / Sensor ángulo ciego / LDW / LCC / FCW / AEB /
                      ABS / EBD / ESC
                    </p>
                  </div>
                </div>
              </div>

              {/* Capacidad de carga */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm md:text-base lg:text-lg mb-0.5 md:mb-1">
                      Capacidad de carga
                    </h3>
                    <p className="text-slate-300 text-xs md:text-sm">720 kg</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Imagen pequeña del vehículo (esquina inferior derecha) */}
        <div className="absolute bottom-8 right-8 hidden xl:block">
          <Image
            src="/images/FOTON/TUNDLAND.V9/LOGO/LogoCamionetaTundlandV9-Photoroom.png"
            alt="TUNLAND V9"
            width={250}
            height={150}
            className="object-contain opacity-80"
          />
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-[70px] md:top-[100px] z-30 bg-slate-900 shadow-xl border-b border-slate-800 backdrop-blur-sm">
        <div
          className="overflow-x-auto overflow-y-visible pb-1"
          style={{ scrollbarWidth: "thin" }}
        >
          <div
            className="flex items-center justify-start md:justify-center gap-2 md:gap-3 py-3 md:py-4 px-4 md:max-w-7xl md:mx-auto"
            style={{ minWidth: "max-content" }}
          >
            {[
              { id: "interior", label: "INTERIOR" },
              { id: "exterior", label: "EXTERIOR" },
              { id: "tren-motriz", label: "TREN MOTRIZ" },
              { id: "seguridad", label: "SEGURIDAD" },
              { id: "dimensiones", label: "DIMENSIONES" },
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

      {/* Sección INTERIOR */}
      <section id="interior" className="py-20 bg-white scroll-mt-[140px]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              INTERIOR
            </h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Galería de imágenes */}
            <div className="space-y-4">
              {/* Imagen principal */}
              <div
                className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={() =>
                  openLightbox(interiorImages[activeInteriorImage])
                }
              >
                <Image
                  src={interiorImages[activeInteriorImage]}
                  alt={`Interior TUNLAND V9 ${activeInteriorImage + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Indicador de clic para ampliar */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-slate-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Botones de navegación */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevInteriorImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextInteriorImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-6 h-6 text-slate-900" />
                </button>
              </div>

              {/* Miniaturas */}
              <div className="grid grid-cols-5 gap-2">
                {interiorImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveInteriorImage(index)}
                    className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-300 ${
                      activeInteriorImage === index
                        ? "ring-4 ring-cyan-500 scale-105"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Interior ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                Confort y <span className="text-cyan-500">tecnología</span>
              </h3>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                En su interior cuenta con confortables asientos en eco cuero con
                regulaciones eléctricas, tablero principal digital de
                14,6&quot;, display secundario táctil de 12,3&quot; con cámara
                de retroceso, carga inalámbrica para teléfono y conexión Apple
                Carplay/Android Auto.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-700 font-semibold">
                    Asientos en eco cuero con regulación eléctrica
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-700 font-semibold">
                    Tablero digital 14,6&quot; + Display táctil 12,3&quot;
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-700 font-semibold">
                    Carga inalámbrica y Apple Carplay/Android Auto
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección EXTERIOR */}
      <section
        id="exterior"
        className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 scroll-mt-[140px]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              EXTERIOR
            </h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Descripción */}
            <div className="order-2 lg:order-1">
              <h3 className="text-3xl font-bold text-white mb-6">
                Diseño <span className="text-cyan-400">imponente</span>
              </h3>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                La Pick Up Foton V9 ofrece un exterior imponente, con una
                parrilla moderna, faros LED y llantas de aleación de 18&quot;
                con neumáticos 265/70R18. Todo lo necesario para un estilo
                agresivo y de lujo.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-slate-300 font-semibold">
                    Parrilla moderna con faros LED
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-slate-300 font-semibold">
                    Llantas de aleación 18&quot;
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-slate-300 font-semibold">
                    Neumáticos 265/70R18
                  </span>
                </div>
              </div>
            </div>

            {/* Galería de imágenes */}
            <div className="space-y-4 order-1 lg:order-2">
              {/* Imagen principal */}
              <div
                className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={() =>
                  openLightbox(exteriorImages[activeExteriorImage])
                }
              >
                <Image
                  src={exteriorImages[activeExteriorImage]}
                  alt={`Exterior TUNLAND V9 ${activeExteriorImage + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Indicador de clic para ampliar */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-slate-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Botones de navegación */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevExteriorImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextExteriorImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-6 h-6 text-slate-900" />
                </button>
              </div>

              {/* Miniaturas */}
              <div className="grid grid-cols-5 gap-2">
                {exteriorImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveExteriorImage(index)}
                    className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-300 ${
                      activeExteriorImage === index
                        ? "ring-4 ring-cyan-500 scale-105"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Exterior ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección TREN MOTRIZ */}
      <section id="tren-motriz" className="py-20 bg-white scroll-mt-[140px]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              TREN MOTRIZ
            </h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto mb-16">
            {/* Galería de imágenes */}
            <div className="space-y-4">
              {/* Imagen principal */}
              <div
                className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={() =>
                  openLightbox(trenMotrizImages[activeTrenMotrizImage])
                }
              >
                <Image
                  src={trenMotrizImages[activeTrenMotrizImage]}
                  alt={`Tren Motriz TUNLAND V9 ${activeTrenMotrizImage + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Indicador de clic para ampliar */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-slate-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Botones de navegación */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevTrenMotrizImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextTrenMotrizImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-6 h-6 text-slate-900" />
                </button>
              </div>

              {/* Miniaturas */}
              <div className="grid grid-cols-5 gap-2">
                {trenMotrizImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTrenMotrizImage(index)}
                    className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-300 ${
                      activeTrenMotrizImage === index
                        ? "ring-4 ring-green-500 scale-105"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Tren Motriz ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                Tecnología <span className="text-cyan-500">Mild-Hybrid</span>
              </h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                La Foton Tunland V9 Híbrida marca un nuevo camino en la
                innovación con su potente motor Diesel Aucan 2.0 litros
                combinado con un sistema hibrido de 48 V que alcanza una
                potencia de 175 hp. Equipada con una caja de cambios ZF AT de 8
                marchas y una selectora que permite variar el modo de conducción
                y la tracción, la V9 está preparada para encarar todos los
                desafíos.
              </p>
            </div>
          </div>

          {/* Especificaciones técnicas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-cyan-500/50 transition-all duration-300">
              <div className="text-4xl font-black text-cyan-500 mb-2">175</div>
              <div className="text-sm text-slate-600">Potencia (HP)</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-cyan-500/50 transition-all duration-300">
              <div className="text-4xl font-black text-cyan-500 mb-2">451</div>
              <div className="text-sm text-slate-600">Torque (Nm)</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-cyan-500/50 transition-all duration-300">
              <div className="text-4xl font-black text-cyan-500 mb-2">2.0</div>
              <div className="text-sm text-slate-600">Cilindrada (litros)</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-cyan-500/50 transition-all duration-300">
              <div className="text-4xl font-black text-cyan-500 mb-2">8 AT</div>
              <div className="text-sm text-slate-600">Transmisión ZF</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección SEGURIDAD Y CONFORT */}
      <section
        id="seguridad"
        className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 scroll-mt-[140px]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              SEGURIDAD Y CONFORT
            </h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto mb-16">
            {/* Galería de imágenes */}
            <div className="space-y-4">
              {/* Imagen principal */}
              <div
                className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={() =>
                  openLightbox(seguridadImages[activeSeguridadImage])
                }
              >
                <Image
                  src={seguridadImages[activeSeguridadImage]}
                  alt={`Seguridad TUNLAND V9 ${activeSeguridadImage + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Indicador de clic para ampliar */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-slate-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Botones de navegación */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSeguridadImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSeguridadImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-6 h-6 text-slate-900" />
                </button>
              </div>

              {/* Miniaturas */}
              <div className="grid grid-cols-5 gap-2">
                {seguridadImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSeguridadImage(index)}
                    className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-300 ${
                      activeSeguridadImage === index
                        ? "ring-4 ring-cyan-500 scale-105"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Seguridad ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Máxima <span className="text-cyan-400">protección</span>
              </h3>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                La Tunland V9 ofrece máxima seguridad con sus 6 airbags, frenos
                a discos con ABS, EBD y ESC, sensor de ángulo ciego, FCW y AEB
                (frenado de emergencia). También te permite máxima visibilidad
                con cámara 360° y sensores de retroceso.
              </p>
            </div>
          </div>

          {/* Características de seguridad */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 text-center">
                6 Airbags
              </h4>
              <p className="text-slate-300 text-center text-sm">
                Protección completa para conductor y pasajeros
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 text-center">
                FCW + AEB
              </h4>
              <p className="text-slate-300 text-center text-sm">
                Frenado de emergencia automático
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 text-center">
                Cámara 360°
              </h4>
              <p className="text-slate-300 text-center text-sm">
                Visibilidad total de tu entorno
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2 text-center">
                ABS + ESC
              </h4>
              <p className="text-slate-300 text-center text-sm">
                Control total en cualquier situación
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección DIMENSIONES Y CAPACIDADES */}
      <section id="dimensiones" className="py-20 bg-white scroll-mt-[140px]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              DIMENSIONES Y CAPACIDADES
            </h2>
            <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto mb-12">
            {/* Descripción */}
            <div className="order-2 lg:order-1">
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                Espacio y <span className="text-cyan-500">capacidad</span>
              </h3>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                En cuanto a sus dimensiones, la Foton Tunland V9 Hibrida cuenta
                con un tamaño de 5.617 x 2.030 x 1.905 mm, con una distancia
                entre ejes de 3.355 mm y una capacidad de carga de 720 kg.
              </p>
            </div>

            {/* Galería de imágenes */}
            <div className="space-y-4 order-1 lg:order-2">
              {/* Imagen principal */}
              <div
                className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={() =>
                  openLightbox(dimensionesImages[activeDimensionesImage])
                }
              >
                <Image
                  src={dimensionesImages[activeDimensionesImage]}
                  alt={`Dimensiones TUNLAND V9 ${activeDimensionesImage + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Indicador de clic para ampliar */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-slate-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Botones de navegación */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevDimensionesImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-900" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextDimensionesImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-6 h-6 text-slate-900" />
                </button>
              </div>

              {/* Miniaturas */}
              <div className="grid grid-cols-5 gap-2">
                {dimensionesImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveDimensionesImage(index)}
                    className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-300 ${
                      activeDimensionesImage === index
                        ? "ring-4 ring-cyan-500 scale-105"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Dimensiones ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Especificaciones */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-black text-cyan-500 mb-2">
                5.617
              </div>
              <div className="text-sm text-slate-600 font-semibold">
                Largo (mm)
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-black text-cyan-500 mb-2">
                2.030
              </div>
              <div className="text-sm text-slate-600 font-semibold">
                Ancho (mm)
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-black text-cyan-500 mb-2">
                1.905
              </div>
              <div className="text-sm text-slate-600 font-semibold">
                Alto (mm)
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-black text-cyan-500 mb-2">
                3.355
              </div>
              <div className="text-sm text-slate-600 font-semibold">
                Distancia entre ejes (mm)
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 col-span-2 md:col-span-1">
              <div className="text-3xl font-black text-white mb-2">720</div>
              <div className="text-sm text-white font-semibold">
                Capacidad de carga (kg)
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl font-black text-cyan-500 mb-2">
                18&quot;
              </div>
              <div className="text-sm text-slate-600 font-semibold">
                Llantas de aleación
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            ¿Listo para experimentar la nueva era híbrida?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-slate-100">
            Contactanos hoy y descubrí todo lo que la Tunland V9 puede hacer por
            vos.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-white text-cyan-600 hover:bg-slate-100 font-bold px-10 py-5 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl text-lg"
          >
            CONTACTAR AHORA
          </Link>
        </div>
      </section>

      {/* Modal Lightbox para imágenes */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Botón cerrar */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-[10000]"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Imagen en tamaño completo */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImage}
              alt="Imagen ampliada"
              fill
              className="object-contain"
              sizes="100vw"
              quality={100}
            />
          </div>
        </div>
      )}

      {/* Botón de compartir flotante */}
      <FotonShareButton
        vehicleName="FOTON TUNLAND V9"
        vehicleUrl="/foton/pick-ups/tunland-v9"
        versions={versiones}
        variant="floating"
      />
    </div>
  );
}
