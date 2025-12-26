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
  Users,
  X,
} from "lucide-react";
import { FotonShareButton } from "@/components";

export default function FotonAumanRPage() {
  const [activeSection, setActiveSection] = useState("interior");
  const [activeInteriorImage, setActiveInteriorImage] = useState(0);
  const [activeExteriorImage, setActiveExteriorImage] = useState(0);
  const [activeComponentesImage, setActiveComponentesImage] = useState(0);
  const [activeDimensionesImage, setActiveDimensionesImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");

  // Imágenes del interior
  const interiorImages = [
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/INTERIOR Y CONFORT/INTERIOR-Y-CONFORT-AUMAN R-1.jpg",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/INTERIOR Y CONFORT/INTERIOR-Y-CONFORT-AUMAN R-2.jpg",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/INTERIOR Y CONFORT/INTERIOR-Y-CONFORT-AUMAN R-3.jpg",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/INTERIOR Y CONFORT/INTERIOR-Y-CONFORT-AUMAN R-4.jpg",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/INTERIOR Y CONFORT/INTERIOR-Y-CONFORT-AUMAN R-5.jpg",
  ];

  // Imágenes del exterior (Seguridad)
  const exteriorImages = [
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/SEGURIDAD/SEGURIDAD-AUMAN R-1.jpg",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/SEGURIDAD/SEGURIDAD-AUMAN R-2.jpg",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/SEGURIDAD/SEGURIDAD-AUMAN R-3.jpg",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/SEGURIDAD/SEGURIDAD-AUMAN R-4.jpg",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/SEGURIDAD/SEGURIDAD-AUMAN R-5.jpg",
  ];

  // Imágenes de tren motriz
  const componentesImages = [
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/TREN MOTRIZ/TREN-MOTRIZ-AUMAN R-1.jpg",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/TREN MOTRIZ/TREN-MOTRIZ-AUMAN R-2.jpg",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/TREN MOTRIZ/TREN-MOTRIZ-AUMAN R-3.jpg",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/TREN MOTRIZ/TREN-MOTRIZ-AUMAN R-4.jpg",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/TREN MOTRIZ/TREN-MOTRIZ-AUMAN R-5.jpg",
  ];

  // Imágenes de dimensiones
  const dimensionesImages = [
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/DIMENSIONES Y CAPACIDADES DE CARGA/DIMENSIONES-Y-CAPACIDAD-DE-CARGA-AUMAN R-1.png",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/DIMENSIONES Y CAPACIDADES DE CARGA/DIMENSIONES-Y-CAPACIDAD-DE-CARGA-AUMAN R-2.png",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/DIMENSIONES Y CAPACIDADES DE CARGA/DIMENSIONES-Y-CAPACIDAD-DE-CARGA-AUMAN R-3.png",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/DIMENSIONES Y CAPACIDADES DE CARGA/DIMENSIONES-Y-CAPACIDAD-DE-CARGA-AUMAN R-4.png",
    "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/DIMENSIONES Y CAPACIDADES DE CARGA/DIMENSIONES-Y-CAPACIDAD-DE-CARGA-AUMAN R-5.jpg",
  ];

  // Versiones del AUMAN R
  const versiones = [
    {
      id: "r2443",
      nombre: "AUMAN R 2443",
      imagen:
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/VERSIONES/R2443/R2443.png",
      pdf: "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/VERSIONES/R2443/FT-Foton-Auman-R-2443-CP.pdf",
    },
    {
      id: "r2546",
      nombre: "AUMAN R 2546",
      imagen:
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/VERSIONES/R2546/R2546.png",
      pdf: "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/VERSIONES/R2546/FT-Foton-Auman-R-2546.pdf",
    },
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

  const nextComponentesImage = () => {
    setActiveComponentesImage((prev) =>
      prev === componentesImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevComponentesImage = () => {
    setActiveComponentesImage((prev) =>
      prev === 0 ? componentesImages.length - 1 : prev - 1
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-140px 0px -60% 0px",
      threshold: 0,
    };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    };
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    ["interior", "exterior", "componentes", "dimensiones", "versiones"].forEach(
      (id) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      }
    );
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative min-h-screen md:min-h-[700px] lg:min-h-[800px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/HERO/HERO-AUMAN R.png"
            alt="FOTON NUEVO AUMAN R"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
        </div>

        {/* Botón volver */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
          <Link
            href="/foton/pesados-ruta"
            className="group flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 md:px-4 md:py-2 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-white font-medium text-sm md:text-base">
              Volver a Pesados Ruta
            </span>
          </Link>
        </div>

        {/* Contenido Hero */}
        <div className="relative h-full container mx-auto px-4 pt-28 pb-12 md:pt-32 md:pb-16 lg:pt-24 lg:pb-20 flex items-center">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center w-full">
            {/* Lado izquierdo - Texto */}
            <div className="text-white space-y-4 md:space-y-6">
              {/* Logo AUMAN R como título principal */}
              <div>
                <Image
                  src="/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/LOGO/LOGO-AUMAN R-LETRA-Photoroom.png"
                  alt="AUMAN R Logo"
                  width={500}
                  height={250}
                  className="object-contain w-full max-w-[220px] sm:max-w-[300px] md:max-w-[450px] lg:max-w-[500px]"
                  priority
                />
              </div>

              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-200">
                Alto rendimiento para largas distancias
              </h1>

              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl">
                La nueva línea AUMAN R representa un avance excepcional,
                cumpliendo con los más altos estándares europeos y las más
                avanzadas tecnologías. Fruto de la alianza estratégica entre
                FOTON y Daimler, este camión de alto rendimiento destaca por su
                eficiencia en recorridos de larga distancia.
              </p>

              {/* Botón consultar */}
              <div className="pt-2">
                <a
                  href="https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20el%20FOTON%20NUEVO%20AUMAN%20R.%20Me%20gustaría%20recibir%20más%20información."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50 text-sm md:text-base"
                >
                  CONSULTAR
                </a>
              </div>
            </div>

            {/* Lado derecho - Especificaciones rápidas */}
            <div className="space-y-2.5 md:space-y-3 lg:space-y-4">
              {/* Cabina */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm md:text-base lg:text-lg mb-0.5 md:mb-1">
                      Cabina
                    </h3>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                      Cabina dormitorio techo alto, piso plano o estándar. Con
                      deflectores laterales y de techo
                    </p>
                  </div>
                </div>
              </div>

              {/* Motor */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Settings className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm md:text-base lg:text-lg mb-0.5 md:mb-1">
                      Motor
                    </h3>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                      Motor Cummins ISGe5, 12 litros. Potencias 430 hp / 2200 Nm
                      - 460 hp / 2300 Nm
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
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                      Caja de cambios ZF TraXon AMT, 12 marchas
                    </p>
                  </div>
                </div>
              </div>

              {/* Capacidad de carga */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm md:text-base lg:text-lg mb-0.5 md:mb-1">
                      Capacidad de carga
                    </h3>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                      CMT: 55.000 kg
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
            src="/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/LOGO/LOGO-AUMAN R-AUTO.png"
            alt="AUMAN R"
            width={400}
            height={240}
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
              { id: "interior", label: "INTERIOR Y CONFORT" },
              { id: "exterior", label: "SEGURIDAD" },
              { id: "componentes", label: "TREN MOTRIZ" },
              { id: "dimensiones", label: "DIMENSIONES Y CAPACIDAD" },
              { id: "versiones", label: "VERSIONES" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base transition-all duration-300 whitespace-nowrap ${
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

      {/* Sección INTERIOR Y CONFORT */}
      <section
        id="interior"
        className="py-10 md:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 scroll-mt-[140px]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              INTERIOR Y CONFORT
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
                  alt="Interior AUMAN R"
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
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-200">
                {interiorImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveInteriorImage(idx)}
                    className={`relative aspect-video rounded-md md:rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0 w-20 md:w-28 ${
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
              <h3 className="text-2xl md:text-3xl font-black text-white mb-4 md:mb-6">
                Diseño moderno y{" "}
                <span className="text-cyan-400">ergonómico</span>
              </h3>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-4">
                El nuevo Auman R cuenta con un interior moderno diseñado para
                otorgar la mayor experiencia de conducción.
              </p>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-4">
                Equipado con butaca de conductor con suspensión neumática
                ajustable y comandos estratégicamente posicionados, se logra una
                excelente ergonomía que reduce la fatiga en largos trayectos.
              </p>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                Con una pantalla digital full LCD de 12,3&quot; y un display
                secundario táctil de 10&quot;, el conductor cuenta con toda la
                información necesaria a su alcance. Para los momentos de
                descanso, cuenta con una confortable cama (opción de segunda
                litera).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección EXTERIOR */}
      <section
        id="exterior"
        className="py-10 md:py-20 bg-white scroll-mt-[140px]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              SEGURIDAD
            </h2>
            <div className="w-16 md:w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-7xl mx-auto">
            {/* Texto descriptivo */}
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 md:mb-6">
                Sistemas de seguridad{" "}
                <span className="text-cyan-600">avanzados</span>
              </h3>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4">
                El nuevo Auman R presenta sistemas de seguridad avanzados tales
                como:
              </p>
              <ul className="space-y-2 text-slate-700 text-base md:text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-500 mt-1">•</span>
                  <span>
                    TPMS (sensor de presión y temperatura de neumáticos)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-500 mt-1">•</span>
                  <span>LDWS (sistema de advertencia de cambio de carril)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-500 mt-1">•</span>
                  <span>FCW (advertencia de colisión frontal)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-500 mt-1">•</span>
                  <span>AEB (frenado de emergencia)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-500 mt-1">•</span>
                  <span>Cámaras 360°</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-500 mt-1">•</span>
                  <span>Sensor de fatiga</span>
                </li>
              </ul>
            </div>

            {/* Galería de imágenes */}
            <div className="space-y-3 md:space-y-4 order-1 lg:order-2">
              {/* Imagen principal */}
              <div
                className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={() =>
                  openLightbox(exteriorImages[activeExteriorImage])
                }
              >
                <Image
                  src={exteriorImages[activeExteriorImage]}
                  alt="Seguridad AUMAN R"
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
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextExteriorImage();
                  }}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
                </button>
              </div>

              {/* Miniaturas */}
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-200">
                {exteriorImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveExteriorImage(idx)}
                    className={`relative aspect-video rounded-md md:rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0 w-20 md:w-28 ${
                      activeExteriorImage === idx
                        ? "ring-2 md:ring-4 ring-cyan-500 scale-105"
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

      {/* Sección TREN MOTRIZ */}
      <section
        id="componentes"
        className="py-10 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 scroll-mt-[140px]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4">
              TREN MOTRIZ
            </h2>
            <div className="w-16 md:w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-7xl mx-auto">
            {/* Texto descriptivo */}
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-4 md:mb-6">
                Tecnología de{" "}
                <span className="text-cyan-400">alto rendimiento</span>
              </h3>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-4">
                El nuevo Auman R cuenta con un motor Cummins ISGe5 de 12 litros
                con potencias de 430 a 460 hp. Con 12 marchas automatizadas de
                avance, caja ZF Traxon AMT, permite una conducción suave y
                eficiente adaptándose a las demandas del terreno.
              </p>
              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-slate-200 text-sm md:text-base font-semibold">
                    Motor Cummins ISGe5 de 12 litros
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-slate-200 text-sm md:text-base font-semibold">
                    430 HP / 2200 Nm - 460 HP / 2300 Nm
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-slate-200 text-sm md:text-base font-semibold">
                    Caja ZF TraXon AMT de 12 marchas
                  </span>
                </div>
              </div>
            </div>

            {/* Galería de imágenes */}
            <div className="space-y-3 md:space-y-4 order-1 lg:order-2">
              {/* Imagen principal */}
              <div
                className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={() =>
                  openLightbox(componentesImages[activeComponentesImage])
                }
              >
                <Image
                  src={componentesImages[activeComponentesImage]}
                  alt="Tren Motriz AUMAN R"
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
                    prevComponentesImage();
                  }}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextComponentesImage();
                  }}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
                </button>
              </div>

              {/* Miniaturas */}
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-200">
                {componentesImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveComponentesImage(idx)}
                    className={`relative aspect-video rounded-md md:rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0 w-20 md:w-28 ${
                      activeComponentesImage === idx
                        ? "ring-2 md:ring-4 ring-cyan-500 scale-105"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Componente ${idx + 1}`}
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

      {/* Sección DIMENSIONES */}
      <section
        id="dimensiones"
        className="py-10 md:py-16 bg-white scroll-mt-[140px]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              DIMENSIONES Y CAPACIDAD DE CARGA
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
                  openLightbox(dimensionesImages[activeDimensionesImage])
                }
              >
                <Image
                  src={dimensionesImages[activeDimensionesImage]}
                  alt="Dimensiones AUMAN R"
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
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextDimensionesImage();
                  }}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
                </button>
              </div>

              {/* Miniaturas */}
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-200">
                {dimensionesImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDimensionesImage(idx)}
                    className={`relative aspect-video rounded-md md:rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0 w-20 md:w-28 ${
                      activeDimensionesImage === idx
                        ? "ring-2 md:ring-4 ring-cyan-500 scale-105"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Dimensión ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Texto descriptivo */}
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 md:mb-6">
                Diseñado para{" "}
                <span className="text-cyan-600">máxima eficiencia</span>
              </h3>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4">
                El nuevo Auman R presenta una capacidad máxima de tracción (CMT)
                de 55.000 kg.
              </p>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6">
                Con su distancia entre ejes de 3.300 mm, su configuración de
                ejes 6×2 Tractor y suspensión neumática de 4 fuelles por eje, el
                nuevo Auman R es ideal para escalabilidad.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm md:text-base font-semibold">
                    CMT: 55.000 kg
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm md:text-base font-semibold">
                    Distancia entre ejes: 3.300 mm
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm md:text-base font-semibold">
                    Configuración: 6×2 Tractor
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-700 text-sm md:text-base font-semibold">
                    Suspensión neumática 4 fuelles por eje
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección VERSIONES */}
      <section
        id="versiones"
        className="py-10 md:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden scroll-mt-[140px]"
      >
        {/* Efectos de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              VERSIONES
            </h2>
            <div className="w-16 md:w-20 h-1 bg-cyan-500 mx-auto"></div>
            <p className="text-slate-300 text-sm md:text-base mt-4 md:mt-6 max-w-2xl mx-auto px-4">
              Encuentra la configuración perfecta para tu operación de ruta
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
            {versiones.map((version) => (
              <div
                key={version.id}
                className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 border border-white/20 hover:border-cyan-500/50 hover:scale-105"
              >
                {/* Imagen */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 md:p-6">
                  <Image
                    src={version.imagen}
                    alt={version.nombre}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 text-center">
                    {version.nombre}
                  </h3>

                  {/* Botón abrir PDF */}
                  <a
                    href={version.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2.5 md:py-3 rounded-lg md:rounded-xl text-sm md:text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                  >
                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                    <span>+ INFO</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-10 md:py-20 bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6">
            ¿Interesado en el NUEVO AUMAN R?
          </h2>
          <p className="text-base md:text-xl text-cyan-50 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Contactanos para más información, cotizaciones y pruebas de manejo.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-white text-cyan-600 hover:bg-slate-100 font-bold px-8 md:px-10 py-3 md:py-4 text-sm md:text-base rounded-xl transition-all duration-300 hover:scale-105 shadow-xl"
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
        vehicleName="FOTON NUEVO AUMAN R"
        vehicleUrl="/foton/pesados-ruta/nuevo-auman-r"
        versions={versiones}
        variant="floating"
      />
    </div>
  );
}
