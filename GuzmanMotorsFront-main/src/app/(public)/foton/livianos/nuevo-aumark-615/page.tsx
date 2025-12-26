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
  Zap,
  Gauge,
  Users,
  X,
} from "lucide-react";
import { FotonShareButton } from "@/components";

export default function NuevoAumark615Page() {
  const [activeSection, setActiveSection] = useState("interior");
  const [activeInteriorImage, setActiveInteriorImage] = useState(0);
  const [activeExteriorImage, setActiveExteriorImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");

  // Imágenes del interior
  const interiorImages = [
    "/images/FOTON/cateogries/livianos/NUEVO AUMARK/INTERIOR/Interior-NuevoAumark-1.jpg",
    "/images/FOTON/cateogries/livianos/NUEVO AUMARK/INTERIOR/Interior-NuevoAumark-2.jpg",
    "/images/FOTON/cateogries/livianos/NUEVO AUMARK/INTERIOR/Interior-NuevoAumark-3.jpg",
    "/images/FOTON/cateogries/livianos/NUEVO AUMARK/INTERIOR/Interior-NuevoAumark-4.jpg",
    "/images/FOTON/cateogries/livianos/NUEVO AUMARK/INTERIOR/Interior-NuevoAumark-5.jpg",
  ];

  // Imágenes del exterior
  const exteriorImages = [
    "/images/FOTON/cateogries/livianos/NUEVO AUMARK/EXTERIOR/Exterior-NuevoAumark-1.png",
    "/images/FOTON/cateogries/livianos/NUEVO AUMARK/EXTERIOR/Exterior-NuevoAumark-2.jpg",
    "/images/FOTON/cateogries/livianos/NUEVO AUMARK/EXTERIOR/Exterior-NuevoAumark-3.jpg",
    "/images/FOTON/cateogries/livianos/NUEVO AUMARK/EXTERIOR/Exterior-NuevoAumark-4.png",
    "/images/FOTON/cateogries/livianos/NUEVO AUMARK/EXTERIOR/Exterior-NuevoAumark-5.jpg",
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

  // Función para scroll suave a secciones
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Intersection Observer para detectar sección activa
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-140px 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const sections = ["interior", "exterior", "componentes"];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative min-h-screen md:min-h-[700px] lg:min-h-[800px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/FOTON/cateogries/livianos/NUEVO AUMARK/HERO/hero-NuevoAumark.jpg"
            alt="Nuevo Aumark 615"
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
              Volver a Livianos
            </span>
          </Link>
        </div>

        {/* Contenido Hero */}
        <div className="relative h-full container mx-auto px-4 pt-28 pb-12 md:pt-32 md:pb-16 lg:pt-24 lg:pb-20 flex items-center">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center w-full">
            {/* Lado izquierdo - Texto */}
            <div className="text-white space-y-4 md:space-y-6">
              {/* Logo Nuevo Aumark como título principal */}
              <div>
                <Image
                  src="/images/FOTON/cateogries/livianos/NUEVO AUMARK/LOGO/logo-letras-nuevoAumark.png"
                  alt="Nuevo Aumark 615 Logo"
                  width={400}
                  height={160}
                  className="object-contain w-full max-w-[200px] sm:max-w-[280px] md:max-w-[350px] lg:max-w-[400px]"
                  priority
                />
              </div>

              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-200">
                EL FUTURO DEL TRANSPORTE URBANO
              </h1>

              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl">
                Diseñado para la logística de corta distancia, es parte de la
                última evolución del camión liviano más vendido del mundo. Se
                caracteriza por su moderno diseño, alta calidad y tren motriz
                eficiente. Equipado con un motor Cummins, transmisión ZF,
                electrónica Bosch, frenos a disco en todas sus ruedas, embrague
                Sachs, entre otros, que garantizan un gran rendimiento y
                disponibilidad.
              </p>

              {/* Botones */}
              <div className="pt-2">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <a
                    href="https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20el%20Nuevo%20Aumark%20615.%20Me%20gustaría%20recibir%20más%20información."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50 text-sm md:text-base"
                  >
                    CONSULTAR
                  </a>

                  <a
                    href="/images/FOTON/cateogries/livianos/NUEVO AUMARK/PDF-PRINCIPAL/615-NuevoAumark-.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 text-sm md:text-base"
                  >
                    <Download className="w-5 h-5" />
                    FICHA TÉCNICA
                  </a>
                </div>
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
                      Nueva cabina, más espaciosa, con alta calidad de
                      materiales, ergonómica y con capacidad para 3 pasajeros.
                    </p>
                  </div>
                </div>
              </div>

              {/* Motor */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm md:text-base lg:text-lg mb-0.5 md:mb-1">
                      Motor
                    </h3>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                      Cummins ISF 2.8: performance, peso reducido, mínimos
                      costos operativos, confiabilidad y durabilidad.
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
                      Transmisión ZF Ecolite 5S, con comando manual de 5
                      velocidades, liviana, larga vida útil y fácil
                      mantenimiento.
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
                      PBT: 6.000 kg
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
            src="/images/FOTON/cateogries/livianos/NUEVO AUMARK/LOGO/LOGO-NuevoAumarkAuto.png"
            alt="Nuevo Aumark 615"
            width={320}
            height={192}
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
              { id: "componentes", label: "COMPONENTES" },
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

      {/* Sección INTERIOR */}
      <section
        id="interior"
        className="py-10 md:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 scroll-mt-[140px]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
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
                  alt="Interior Nuevo Aumark 615"
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
              <h3 className="text-2xl md:text-3xl font-black text-white mb-4 md:mb-6">
                Confort de <span className="text-cyan-400">cabina</span>
              </h3>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                El interior del Nuevo Aumark 615 fue completamente renovado, con
                mayor capacidad para 3 personas y diseño de estilo automotriz.
                Incluye butacas más cómodas con logo Aumark y función cama,
                volante multifunción, tablero con computadora de a bordo,
                display táctil HD con cámara de retroceso, múltiples
                portaobjetos y puertos USB y 12V. La cabina ofrece excelente
                aislación térmica y acústica gracias a sus burletes dobles.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-200 font-semibold">
                    Diseño de estilo automotriz
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-200 font-semibold">
                    Display táctil HD con cámara
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-200 font-semibold">
                    Excelente aislación térmica y acústica
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
        className="py-10 md:py-20 bg-white scroll-mt-[140px]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              EXTERIOR
            </h2>
            <div className="w-16 md:w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-7xl mx-auto">
            {/* Texto descriptivo */}
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 md:mb-6">
                Diseño <span className="text-cyan-500">funcional</span>
              </h3>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                El exterior del Nuevo Aumark presenta un diseño más moderno y
                aerodinámico. Incorpora nueva parrilla con efecto diamante,
                retrovisores eléctricos y calefaccionados, faros con DRL con
                fondo negro, y reubicación de componentes para permitir más
                espacio lateral para el carrozado.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-700 font-semibold">
                    Parrilla con efecto diamante
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-700 font-semibold">
                    Retrovisores eléctricos y calefaccionados
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-700 font-semibold">
                    Diseño aerodinámico moderno
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
                  openLightbox(exteriorImages[activeExteriorImage])
                }
              >
                <Image
                  src={exteriorImages[activeExteriorImage]}
                  alt="Exterior Nuevo Aumark 615"
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
              <div className="grid grid-cols-5 gap-2 md:gap-4">
                {exteriorImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveExteriorImage(idx)}
                    className={`relative aspect-video rounded-md md:rounded-lg overflow-hidden transition-all duration-300 ${
                      activeExteriorImage === idx
                        ? "ring-2 md:ring-4 ring-cyan-500 scale-105"
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

      {/* Sección COMPONENTES */}
      <section
        id="componentes"
        className="py-10 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white scroll-mt-[140px]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4">
              COMPONENTES
            </h2>
            <div className="w-16 md:w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
            {/* Motor */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-8 border border-white/10 hover:border-cyan-500/50 transition-all duration-300">
              <div className="relative h-48 md:h-64 rounded-lg md:rounded-xl overflow-hidden">
                <Image
                  src="/images/FOTON/cateogries/livianos/NUEVO AUMARK/COMPONENTES/Motor-NuevoAumark-.png"
                  alt="Motor Nuevo Aumark 615"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 text-cyan-400">
                  Motor
                </h3>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                  Cuenta con su conocido motor Cummins ISF 2.8 – Euro 5 (SCR) el
                  cual equipa al Nuevo Foton Aumark y resulta ideal para la
                  aplicación en este tipo de vehículos comerciales,
                  constituyendo uno de los motores más livianos y robustos en su
                  categoría.
                </p>
              </div>
            </div>

            {/* Caja de cambios */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-300">
              <div className="order-2 md:order-1">
                <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 text-blue-400">
                  Caja de cambios
                </h3>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                  Las Transmisiones ZF Ecolite 5S368 con comando manual de 5
                  velocidades, resultan muy livianas y confiables,
                  caracterizadas a su vez por su larga vida útil y fácil
                  mantenimiento. Por su suavidad de operación, garantizan una
                  conducción más descansada y placentera por más tiempo en su
                  Nuevo Foton Aumark.
                </p>
              </div>
              <div className="relative h-48 md:h-64 rounded-lg md:rounded-xl overflow-hidden order-1 md:order-2">
                <Image
                  src="/images/FOTON/cateogries/livianos/NUEVO AUMARK/COMPONENTES/CajaCambios-NuevoAumark-.png"
                  alt="Caja de cambios Nuevo Aumark 615"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Botón cerrar */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 z-50"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Imagen */}
          <div className="relative max-w-7xl max-h-full">
            <Image
              src={lightboxImage}
              alt="Vista ampliada"
              width={1920}
              height={1080}
              quality={100}
              className="max-h-[90vh] w-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* Botón de compartir flotante */}
      <FotonShareButton
        vehicleName="FOTON Nuevo Aumark 615"
        vehicleUrl="/foton/livianos/nuevo-aumark-615"
        variant="floating"
      />
    </div>
  );
}
