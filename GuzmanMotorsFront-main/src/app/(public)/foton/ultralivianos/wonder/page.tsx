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
  Gauge,
  Users,
  Zap,
  X,
} from "lucide-react";
import { FotonShareButton } from "@/components";

export default function FotonWonderPage() {
  const [activeInteriorImage, setActiveInteriorImage] = useState(0);
  const [activeExteriorImage, setActiveExteriorImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");
  const [activeSection, setActiveSection] = useState("interior");

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

  // Imágenes del interior
  const interiorImages = [
    "/images/FOTON/cateogries/ultralivianos/WONDER/INTERIOR/interior-WONDER-1.jpg",
    "/images/FOTON/cateogries/ultralivianos/WONDER/INTERIOR/interior-WONDER-2.jpg",
    "/images/FOTON/cateogries/ultralivianos/WONDER/INTERIOR/interior-WONDER-3.jpg",
    "/images/FOTON/cateogries/ultralivianos/WONDER/INTERIOR/interior-WONDER-4.jpg",
    "/images/FOTON/cateogries/ultralivianos/WONDER/INTERIOR/interior-WONDER-5.jpg",
    "/images/FOTON/cateogries/ultralivianos/WONDER/INTERIOR/interior-WONDER-6.jpg",
  ];

  // Imágenes del exterior
  const exteriorImages = [
    "/images/FOTON/cateogries/ultralivianos/WONDER/EXTERIOR/exterior-WONDER-1.png",
    "/images/FOTON/cateogries/ultralivianos/WONDER/EXTERIOR/exterior-WONDER-2.jpg",
    "/images/FOTON/cateogries/ultralivianos/WONDER/EXTERIOR/exterior-WONDER-3.png",
    "/images/FOTON/cateogries/ultralivianos/WONDER/EXTERIOR/exterior-WONDER-4.jpg",
    "/images/FOTON/cateogries/ultralivianos/WONDER/EXTERIOR/exterior-WONDER-5.png",
  ];

  // Versiones del WONDER
  const versiones = [
    {
      id: "cabina-simple-flatbed",
      nombre: "Cabina Simple Flatbed",
      imagen:
        "/images/FOTON/cateogries/ultralivianos/WONDER/VERSIONES/Wonder-Cabina Simple Flatbed/Wonder-Cabina Simple Flatbed.png",
      pdf: "/images/FOTON/cateogries/ultralivianos/WONDER/VERSIONES/Wonder-Cabina Simple Flatbed/Wonder-Cabina Simple Flatbed.pdf",
    },
    {
      id: "cabina-doble-flatbed",
      nombre: "Cabina Doble Flatbed",
      imagen:
        "/images/FOTON/cateogries/ultralivianos/WONDER/VERSIONES/Wonder-Cabina doble Flatbed/Wonder-Cabina doble Flatbed.png",
      pdf: "/images/FOTON/cateogries/ultralivianos/WONDER/VERSIONES/Wonder-Cabina doble Flatbed/Wonder-Cabina doble Flatbed.pdf",
    },
    {
      id: "cabina-simple-box",
      nombre: "Cabina Simple Box",
      imagen:
        "/images/FOTON/cateogries/ultralivianos/WONDER/VERSIONES/Cabina Simple Box WONDER/Cabina Simple Box WONDER.png",
      pdf: "/images/FOTON/cateogries/ultralivianos/WONDER/VERSIONES/Cabina Simple Box WONDER/Cabina Simple Box WONDER.pdf",
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

  // Detección de sección activa con Intersection Observer
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
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

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative min-h-screen md:min-h-[700px] lg:min-h-[800px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/FOTON/cateogries/ultralivianos/WONDER/HERO/WONDER-HERO.jpg"
            alt="FOTON WONDER"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
        </div>

        {/* Botón volver */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
          <Link
            href="/foton/ultralivianos"
            className="group flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 md:px-4 md:py-2 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-white font-medium text-sm md:text-base">
              Volver a Ultralivianos
            </span>
          </Link>
        </div>

        {/* Contenido Hero */}
        <div className="relative h-full container mx-auto px-4 pt-28 pb-12 md:pt-32 md:pb-16 lg:pt-24 lg:pb-20 flex items-center">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start md:items-center w-full">
            {/* Lado izquierdo - Texto */}
            <div className="text-white space-y-4 md:space-y-6">
              {/* Logo WONDER como título principal */}
              <div className="">
                <Image
                  src="/images/FOTON/cateogries/ultralivianos/WONDER/LOGO/wonder-LOGO-LETRAS.png"
                  alt="WONDER Logo"
                  width={350}
                  height={140}
                  className="object-contain w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px]"
                  priority
                />
              </div>

              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-200">
                Habla de vos
              </h1>

              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl">
                El Foton Wonder es un camión ultraliviano que combina fuerza,
                eficiencia y versatilidad, ideal para los desafíos de la ciudad.
                Su diseño italiano, colores innovadores y versatilidad
                incomparable lo convierten en una herramienta clave para
                potenciar tu negocio. Disponible en versiones de cabina simple,
                doble y simple carrozado (cargo box).
              </p>

              {/* Botón consultar */}
              <div className="pt-2">
                <a
                  href="https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20el%20FOTON%20WONDER.%20Me%20gustaría%20recibir%20más%20información."
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
                      Cabina con opciones simple (2 pasajeros) o doble (5
                      pasajeros)
                    </p>
                  </div>
                </div>
              </div>

              {/* Motor */}
              <div className="bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm md:text-base lg:text-lg mb-0.5 md:mb-1">
                      Motor
                    </h3>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                      DAM16NS, 4 Cilindros en Línea, 16 Válvulas (inyección
                      electrónica multipunto), 1,6L Euro 5. Potencia de 120hp.
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
                      Transmisión manual de 5 velocidades + Reversa
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
                    <p className="text-slate-300 text-xs md:text-sm">
                      PBT: 2.550 kg
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
            src="/images/FOTON/cateogries/ultralivianos/WONDER/LOGO/WONDER-LOGO-AUTO.png"
            alt="WONDER"
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

      {/* Sección INTERIOR */}
      <section
        id="interior"
        className="py-10 md:py-20 bg-white scroll-mt-[140px]"
      >
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
                  alt="Interior WONDER"
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
              <div className="grid grid-cols-6 gap-2 md:gap-4">
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
                Confort de <span className="text-cyan-500">cabina</span>
              </h3>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                El Wonder ofrece un interior moderno y tecnológico, generando un
                equilibrio entre funcionalidad y diseño.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-700 font-semibold">
                    Interior moderno y funcional
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-700 font-semibold">
                    Asientos cómodos para largas jornadas
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-slate-700 font-semibold">
                    Diseño ergonómico
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
        className="py-10 md:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 scroll-mt-[140px]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              EXTERIOR
            </h2>
            <div className="w-16 md:w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-7xl mx-auto">
            {/* Texto descriptivo */}
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-4 md:mb-6">
                Diseño <span className="text-cyan-500">Europeo</span>
              </h3>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                Diseñado por el estudio italiano ICONA, este vehículo logra un
                equilibrio perfecto entre simplicidad, funcionalidad y estilo.
                Sus líneas geométricas suaves le aportan dinamismo y emoción,
                realzadas por una paleta de colores pasteles que refuerzan su
                carácter distintivo.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-white font-semibold">
                    Diseño italiano ICONA
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-white font-semibold">
                    Líneas geométricas suaves
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-white font-semibold">
                    Colores innovadores
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
                  alt="Exterior WONDER"
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
        className="py-10 md:py-16 bg-white scroll-mt-[140px]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 text-slate-900">
              COMPONENTES
            </h2>
            <div className="w-16 md:w-20 h-1 bg-cyan-500 mx-auto"></div>
          </div>

          <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
            {/* Motor */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl md:rounded-2xl p-4 md:p-8 border border-cyan-200 hover:border-cyan-500/50 transition-all duration-300">
              <div className="relative h-48 md:h-64 rounded-lg md:rounded-xl overflow-hidden">
                <Image
                  src="/images/FOTON/cateogries/ultralivianos/WONDER/COMPONENTES/componentes-WONDER-Motor.png"
                  alt="Motor WONDER"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 text-cyan-600">
                  Motor
                </h3>
                <p className="text-slate-700 text-xs md:text-sm leading-relaxed mb-3 md:mb-4">
                  Los motores DAM a Gasolina de 1,6L, son motores muy eficientes
                  de 4 tiempos con 16 valvulas y sistema DOHC. Tienen un bajo
                  consumo de combustible, gracias a su curva de motor mejoradas
                  y son de peso ligero.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-slate-700 text-xs md:text-sm font-semibold">
                      Potencia de 120hp
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-slate-700 text-xs md:text-sm font-semibold">
                      Torque de 158Nm
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Caja de cambios */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl md:rounded-2xl p-4 md:p-8 border border-blue-200 hover:border-blue-500/50 transition-all duration-300">
              <div className="order-2 md:order-1">
                <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 text-blue-600">
                  Caja de cambios
                </h3>
                <p className="text-slate-700 text-xs md:text-sm leading-relaxed">
                  La Caja de Cambio del Wonder es una caja DAT 18R manual de 5
                  Velocidades adelante y una de retroceso. Una caja
                  sincronizada, suave y de poco esfuerzo para las largas
                  jornadas de trabajo en la ciudad o en el campo.
                </p>
              </div>
              <div className="relative h-48 md:h-64 rounded-lg md:rounded-xl overflow-hidden order-1 md:order-2">
                <Image
                  src="/images/FOTON/cateogries/ultralivianos/WONDER/COMPONENTES/componentes-WONDER-CajaDeCambios.png"
                  alt="Caja de cambios WONDER"
                  fill
                  className="object-contain"
                />
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
              Encuentra la configuración perfecta para tu negocio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto">
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
        vehicleName="FOTON Wonder"
        vehicleUrl="/foton/ultralivianos/wonder"
        versions={versiones}
        variant="floating"
      />
    </div>
  );
}
