"use client";

import { useState } from "react";
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
  Zap,
  X,
} from "lucide-react";
import { FotonShareButton } from "@/components";

export default function FotonTunlandG7Page() {
  const [activeSection, setActiveSection] = useState("interior");
  const [activeInteriorImage, setActiveInteriorImage] = useState(0);
  const [activeExteriorImage, setActiveExteriorImage] = useState(0);
  const [activeTrenMotrizImage, setActiveTrenMotrizImage] = useState(0);
  const [activeSeguridadImage, setActiveSeguridadImage] = useState(0);
  const [activeDimensionesImage, setActiveDimensionesImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");

  // Imágenes del interior
  const interiorImages = [
    "/images/FOTON/TUNDLAND.G7/INTERIOR/INTERIOR-G7-1.jpg",
    "/images/FOTON/TUNDLAND.G7/INTERIOR/INTERIOR-G7-2.jpg",
    "/images/FOTON/TUNDLAND.G7/INTERIOR/INTERIOR-G7-3.jpg",
    "/images/FOTON/TUNDLAND.G7/INTERIOR/INTERIOR-G7-4.jpg",
    "/images/FOTON/TUNDLAND.G7/INTERIOR/INTERIOR-G7-5.jpg",
  ];

  // Imágenes del exterior
  const exteriorImages = [
    "/images/FOTON/TUNDLAND.G7/EXTERIOR/exteriorTunlandg7-1.jpg",
    "/images/FOTON/TUNDLAND.G7/EXTERIOR/exteriorTunlandg7-2.jpg",
    "/images/FOTON/TUNDLAND.G7/EXTERIOR/exteriorTunlandg7-3.jpg",
    "/images/FOTON/TUNDLAND.G7/EXTERIOR/exteriorTunlandg7-4.jpg",
    "/images/FOTON/TUNDLAND.G7/EXTERIOR/exteriorTunlandg7-5.jpg",
  ];

  // Imágenes del tren motriz
  const trenMotrizImages = [
    "/images/FOTON/TUNDLAND.G7/TRENMOTRIZ/TrenMotriz1.jpg",
    "/images/FOTON/TUNDLAND.G7/TRENMOTRIZ/TrenMotriz2.jpg",
    "/images/FOTON/TUNDLAND.G7/TRENMOTRIZ/TrenMotriz3.jpg",
    "/images/FOTON/TUNDLAND.G7/TRENMOTRIZ/TrenMotriz4.jpg",
    "/images/FOTON/TUNDLAND.G7/TRENMOTRIZ/TrenMotriz5.jpg",
  ];

  // Imágenes de seguridad
  const seguridadImages = [
    "/images/FOTON/TUNDLAND.G7/SEGURIDADYCONFORT/seguridadTunlandg7-1.jpg",
    "/images/FOTON/TUNDLAND.G7/SEGURIDADYCONFORT/seguridadTunlandg7-2.jpg",
    "/images/FOTON/TUNDLAND.G7/SEGURIDADYCONFORT/seguridadTunlandg7-3.jpg",
    "/images/FOTON/TUNDLAND.G7/SEGURIDADYCONFORT/seguridadTunlandg7-4.jpg",
    "/images/FOTON/TUNDLAND.G7/SEGURIDADYCONFORT/seguridadTunlandg7-5.jpg",
  ];

  // Imágenes de dimensiones
  const dimensionesImages = [
    "/images/FOTON/TUNDLAND.G7/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-G7-1.jpg",
    "/images/FOTON/TUNDLAND.G7/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-G7-2.jpg",
    "/images/FOTON/TUNDLAND.G7/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-G7-3.jpg",
    "/images/FOTON/TUNDLAND.G7/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-G7-4.jpg",
    "/images/FOTON/TUNDLAND.G7/DIMENSIONESYCAPACIDADES/DIMENSIONES-Y-CAPACIDADES-G7-5.jpg",
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
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage("");
    // Restaurar scroll del body
    document.body.style.overflow = "unset";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:h-[700px] lg:h-[800px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/FOTON/TUNDLAND.G7/HERO/heroTunlandG7.jpg"
            alt="FOTON TUNLAND G7"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
        </div>

        {/* Botón volver */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
          <Link
            href="/foton"
            className="group flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 md:px-4 md:py-2 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-white font-medium text-sm md:text-base">
              Volver
            </span>
          </Link>
        </div>

        {/* Contenido Hero */}
        <div className="relative h-full container mx-auto px-4 py-20 md:py-0 md:flex md:items-center">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center w-full">
            {/* Lado izquierdo - Texto */}
            <div className="text-white">
              {/* Logo TUNLAND G7 como título principal */}
              <div className="mb-4 md:mb-6">
                <Image
                  src="/images/FOTON/TUNDLAND.G7/LOGO/logoTunlandg7.png"
                  alt="TUNLAND G7 Logo"
                  width={400}
                  height={200}
                  className="object-contain w-full max-w-[250px] md:max-w-[350px] lg:max-w-[400px]"
                />
              </div>

              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-slate-200">
                Capacidad de carga útil
              </h1>

              <p className="text-sm md:text-base text-slate-300 mb-6 md:mb-8 leading-relaxed">
                Te presentamos la nueva Foton Tunland G7. Con la resistencia y
                durabilidad que solo Foton puede ofrecer, la Tunland G7 es la
                aliada perfecta para cualquier reto. Ya sea para trabajos
                pesados o para aventuras off-road, esta pick-up te llevará más
                allá.
              </p>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50 text-sm md:text-base"
                >
                  CONSULTAR
                </Link>

                <a
                  href="/images/FOTON/TUNDLAND.G7/PDF-MAS-INFO/FT-Foton-Tunland-G7-4x4-AT-Ultimate-1.pdf"
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
            <div className="space-y-3 md:space-y-4">
              {/* Tracción */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mountain className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base md:text-lg mb-1 md:mb-2">
                      Tracción
                    </h3>
                    <p className="text-slate-300 text-xs md:text-sm">4x4</p>
                  </div>
                </div>
              </div>

              {/* Motor */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base md:text-lg mb-1 md:mb-2">
                      Motor
                    </h3>
                    <p className="text-slate-300 text-xs md:text-sm">
                      Aucan 4F20TC - 2.0 litros - Diesel
                      <br />
                      Potencia 161 hp - Torque 390 Nm
                    </p>
                  </div>
                </div>
              </div>

              {/* Caja de cambios */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Gauge className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base md:text-lg mb-1 md:mb-2">
                      Caja de cambios
                    </h3>
                    <p className="text-slate-300 text-xs md:text-sm">
                      ZF AT 8 Velocidades
                    </p>
                  </div>
                </div>
              </div>

              {/* Seguridad */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base md:text-lg mb-1 md:mb-2">
                      Seguridad
                    </h3>
                    <p className="text-slate-300 text-xs md:text-sm">
                      6 airbags / Sensor ángulo ciego / FCW / AEB / Sensores y
                      cámaras de estacionamiento
                    </p>
                  </div>
                </div>
              </div>

              {/* Capacidad de carga */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base md:text-lg mb-1 md:mb-2">
                      Capacidad de carga
                    </h3>
                    <p className="text-slate-300 text-xs md:text-sm">
                      1.000 kg
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Imagen pequeña del vehículo (esquina inferior derecha) */}
        <div className="absolute bottom-8 right-8 hidden xl:block">
          <Image
            src="/images/FOTON/TUNDLAND.G7/LOGO/NuevoLogotundlandG7-Photoroom.png"
            alt="TUNLAND G7"
            width={250}
            height={150}
            className="object-contain opacity-80"
          />
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-0 md:top-[72px] z-40 bg-slate-900 shadow-xl border-b border-slate-800 backdrop-blur-sm">
        <div className="container mx-auto px-2 md:px-4">
          <div className="flex items-center justify-start md:justify-center gap-1 md:gap-2 py-2 md:py-4 overflow-x-auto scrollbar-hide">
            {[
              { id: "interior", label: "INTERIOR" },
              { id: "exterior", label: "EXTERIOR" },
              { id: "tren-motriz", label: "TREN MOTRIZ" },
              { id: "seguridad", label: "SEGURIDAD" },
              { id: "dimensiones", label: "DIMENSIONES" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-bold text-xs md:text-sm transition-all duration-300 whitespace-nowrap ${
                  activeSection === tab.id
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sección INTERIOR */}
      {activeSection === "interior" && (
        <section className="py-10 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                INTERIOR
              </h2>
              <div className="w-16 md:w-20 h-1 bg-cyan-500 mx-auto"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-7xl mx-auto">
              {/* Galería de imágenes */}
              <div className="space-y-3 md:space-y-4">
                {/* Imagen principal */}
                <div
                  className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                  onClick={() =>
                    openLightbox(interiorImages[activeInteriorImage])
                  }
                >
                  <Image
                    src={interiorImages[activeInteriorImage]}
                    alt="Interior TUNLAND G7"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
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

                  {/* Controles de navegación */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevInteriorImage();
                    }}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextInteriorImage();
                    }}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
                  </button>
                </div>

                {/* Miniaturas */}
                <div className="grid grid-cols-5 gap-2 md:gap-4">
                  {interiorImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveInteriorImage(idx)}
                      className={`relative aspect-video rounded-md md:rounded-lg overflow-hidden transition-all duration-300 ${
                        activeInteriorImage === idx
                          ? "ring-2 md:ring-4 ring-cyan-500 scale-105"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Interior ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Texto descriptivo */}
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 md:mb-6">
                  Confort y <span className="text-cyan-500">tecnología</span>
                </h3>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                  En su interior ofrece asientos de Eco cuero con regulación
                  eléctrica para el asiento del conductor, un tablero principal
                  con pantalla LCD de 7″ + pantalla secundaria táctil de
                  10&quot; integrado con sensores de estacionamiento y cámara
                  360°.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-slate-700 font-semibold">
                      Asientos de Eco cuero con regulación eléctrica
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-slate-700 font-semibold">
                      Pantalla LCD de 7″ + pantalla táctil de 10&quot;
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-slate-700 font-semibold">
                      Cámara 360° integrada
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sección EXTERIOR */}
      {activeSection === "exterior" && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                EXTERIOR
              </h2>
              <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              {/* Texto descriptivo */}
              <div className="order-2 lg:order-1">
                <h3 className="text-3xl font-black text-slate-900 mb-6">
                  Diseño <span className="text-cyan-500">robusto</span>
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  La FOTON TUNLAND G7 combina elegancia y robustez en diseño
                  exterior, con una parrilla delantera gris, faros halógenos y
                  llantas de aleación de 18&quot; con neumáticos 265/60R18.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-slate-700 font-semibold">
                      Parrilla delantera gris distintiva
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-slate-700 font-semibold">
                      Faros halógenos de alto rendimiento
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-slate-700 font-semibold">
                      Llantas de aleación 18&quot; - Neumáticos 265/60R18
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
                    alt="Exterior TUNLAND G7"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
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

                  {/* Controles de navegación */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevExteriorImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-6 h-6 text-slate-900" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextExteriorImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-slate-900" />
                  </button>
                </div>

                {/* Miniaturas */}
                <div className="grid grid-cols-5 gap-4">
                  {exteriorImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveExteriorImage(idx)}
                      className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-300 ${
                        activeExteriorImage === idx
                          ? "ring-4 ring-cyan-500 scale-105"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Exterior ${idx + 1}`}
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
      )}

      {/* Sección TREN MOTRIZ */}
      {activeSection === "tren-motriz" && (
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                TREN MOTRIZ
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
                    openLightbox(trenMotrizImages[activeTrenMotrizImage])
                  }
                >
                  <Image
                    src={trenMotrizImages[activeTrenMotrizImage]}
                    alt="Tren Motriz TUNLAND G7"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
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

                  {/* Controles de navegación */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevTrenMotrizImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-6 h-6 text-slate-900" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextTrenMotrizImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-slate-900" />
                  </button>
                </div>

                {/* Miniaturas */}
                <div className="grid grid-cols-5 gap-4">
                  {trenMotrizImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTrenMotrizImage(idx)}
                      className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-300 ${
                        activeTrenMotrizImage === idx
                          ? "ring-4 ring-cyan-500 scale-105"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Tren Motriz ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Texto descriptivo */}
              <div>
                <h3 className="text-3xl font-black mb-6">
                  Potencia y{" "}
                  <span className="text-cyan-400">confiabilidad</span>
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  La Foton Tunland G7 combina la fuerza de su motor Aucan
                  turbodiésel de 2 litros con 161 HP y 390 Nm de torque con la
                  excelente caja de transmision ZF AT de 8 marchas, brindándote
                  confiabilidad que necesitas. Con un comando sencillo se puede
                  seleccionar el modo de conducción y el tipo de tracción
                  necesaria para cada ocasión.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-cyan-400 font-bold text-2xl">161 HP</p>
                    <p className="text-slate-300 text-sm">Potencia máxima</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-cyan-400 font-bold text-2xl">390 Nm</p>
                    <p className="text-slate-300 text-sm">Torque</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-cyan-400 font-bold text-2xl">2.0 L</p>
                    <p className="text-slate-300 text-sm">Motor Diesel</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-cyan-400 font-bold text-2xl">8 AT</p>
                    <p className="text-slate-300 text-sm">Transmisión ZF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sección SEGURIDAD Y CONFORT */}
      {activeSection === "seguridad" && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                SEGURIDAD Y CONFORT
              </h2>
              <div className="w-20 h-1 bg-cyan-500 mx-auto"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              {/* Texto descriptivo */}
              <div className="order-2 lg:order-1">
                <h3 className="text-3xl font-black text-slate-900 mb-6">
                  Protección <span className="text-cyan-500">total</span>
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  En cuanto a la seguridad, la FOTON TUNLAND G7 cuenta con 6
                  airbags, sensor de ángulo ciego, FCW y AEB (frenado de
                  emergencia), frenos a discos ventilados en las 4 ruedas con
                  sistema de frenado ABS, EBD y ESC. Además, cuenta con sensores
                  de estacionamiento con cámara 360°.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <Shield className="w-8 h-8 text-cyan-500 mb-2" />
                    <p className="text-slate-900 font-bold">6 Airbags</p>
                    <p className="text-slate-600 text-sm">Protección total</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <Settings className="w-8 h-8 text-cyan-500 mb-2" />
                    <p className="text-slate-900 font-bold">FCW + AEB</p>
                    <p className="text-slate-600 text-sm">Frenado emergencia</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <Settings className="w-8 h-8 text-cyan-500 mb-2" />
                    <p className="text-slate-900 font-bold">Cámara 360°</p>
                    <p className="text-slate-600 text-sm">Visión completa</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <Settings className="w-8 h-8 text-cyan-500 mb-2" />
                    <p className="text-slate-900 font-bold">ABS + ESC</p>
                    <p className="text-slate-600 text-sm">Control total</p>
                  </div>
                </div>
              </div>

              {/* Galería de imágenes */}
              <div className="space-y-4 order-1 lg:order-2">
                {/* Imagen principal */}
                <div
                  className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                  onClick={() =>
                    openLightbox(seguridadImages[activeSeguridadImage])
                  }
                >
                  <Image
                    src={seguridadImages[activeSeguridadImage]}
                    alt="Seguridad TUNLAND G7"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
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

                  {/* Controles de navegación */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSeguridadImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-6 h-6 text-slate-900" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSeguridadImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-slate-900" />
                  </button>
                </div>

                {/* Miniaturas */}
                <div className="grid grid-cols-5 gap-4">
                  {seguridadImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSeguridadImage(idx)}
                      className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-300 ${
                        activeSeguridadImage === idx
                          ? "ring-4 ring-cyan-500 scale-105"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Seguridad ${idx + 1}`}
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
      )}

      {/* Sección DIMENSIONES Y CAPACIDADES */}
      {activeSection === "dimensiones" && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                DIMENSIONES Y CAPACIDADES
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
                    openLightbox(dimensionesImages[activeDimensionesImage])
                  }
                >
                  <Image
                    src={dimensionesImages[activeDimensionesImage]}
                    alt="Dimensiones TUNLAND G7"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
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

                  {/* Controles de navegación */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevDimensionesImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-6 h-6 text-slate-900" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextDimensionesImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-slate-900" />
                  </button>
                </div>

                {/* Miniaturas */}
                <div className="grid grid-cols-5 gap-4">
                  {dimensionesImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDimensionesImage(idx)}
                      className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-300 ${
                        activeDimensionesImage === idx
                          ? "ring-4 ring-cyan-500 scale-105"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Dimensiones ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Texto descriptivo */}
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-6">
                  Espacio y <span className="text-cyan-500">capacidad</span>
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  La Tunland G7 es ideal para transportar cargas ya que cuenta
                  con una dimension de 5.340 x 1.940 x 1.870 mm y una distancia
                  entre sus ejes de 3.110 mm, además de con una capacidad de
                  carga considerable de 1.000 kg.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <p className="text-cyan-500 font-bold text-2xl">5.340 mm</p>
                    <p className="text-slate-600 text-sm">Largo total</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <p className="text-cyan-500 font-bold text-2xl">1.940 mm</p>
                    <p className="text-slate-600 text-sm">Ancho total</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <p className="text-cyan-500 font-bold text-2xl">1.870 mm</p>
                    <p className="text-slate-600 text-sm">Alto total</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <p className="text-cyan-500 font-bold text-2xl">3.110 mm</p>
                    <p className="text-slate-600 text-sm">Distancia ejes</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl p-4 col-span-2 shadow-lg">
                    <p className="text-white font-bold text-3xl">1.000 kg</p>
                    <p className="text-cyan-50 text-sm">
                      Capacidad de carga útil
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            ¿Interesado en la FOTON TUNLAND G7?
          </h2>
          <p className="text-xl text-cyan-50 mb-8 max-w-2xl mx-auto">
            Contactanos para más información, cotizaciones y pruebas de manejo.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-white text-cyan-600 hover:bg-slate-100 font-bold px-10 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl"
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
        vehicleName="FOTON Tunland G7"
        vehicleUrl="/foton/tunland-g7"
        variant="floating"
      />
    </div>
  );
}
