"use client";

import Image from "next/image";
import {
  Truck,
  TruckIcon,
  Package,
  Container,
  Boxes,
  Factory,
  Zap,
  ArrowRight,
  ChevronRight,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function FotonPage() {
  const router = useRouter();

  const categories = [
    {
      id: "pick-ups",
      name: "Pick Ups",
      description: "Potencia y versatilidad 4x4",
      icon: Truck,
      image:
        "/images/FOTON/cateogries/pickups/Foto-Cateogries-Foton-PickUps1.jpg",
      gradient: "from-emerald-600/90 to-teal-700/90",
      modelsCount: 2,
      badge: "4X4",
      href: "/foton/pick-ups",
    },
    {
      id: "ultralivianos",
      name: "Ultralivianos",
      description: "Eficiencia urbana",
      icon: TruckIcon,
      image:
        "/images/FOTON/cateogries/ultralivianos/Foto-Cateogries-Foton-Ultralivianos1.webp",
      gradient: "from-blue-600/90 to-cyan-700/90",
      modelsCount: 3,
      badge: "URBANO",
      href: "/foton/ultralivianos",
    },
    {
      id: "livianos",
      name: "Livianos",
      description: "Distribución versátil",
      icon: Package,
      image:
        "/images/FOTON/cateogries/livianos/Foto-Cateogries-Foton-Livianos1.png",
      gradient: "from-blue-600/90 to-cyan-700/90",
      modelsCount: 2,
      badge: "LOGÍSTICA",
      href: "/foton/livianos",
    },
    {
      id: "medianos",
      name: "Medianos",
      description: "Cargas medianas",
      icon: Container,
      image:
        "/images/FOTON/cateogries/medianos/Foto-Cateogries-Foton-Medianos1.jpg",
      gradient: "from-orange-600/90 to-red-700/90",
      modelsCount: 1,
      badge: "CARGA",
      href: "/foton/medianos",
    },
    {
      id: "pesados-ruta",
      name: "Pesados Ruta",
      description: "Largas distancias",
      icon: Boxes,
      image:
        "/images/FOTON/cateogries/PesadosRuta/Foto-Cateogries-Foton-PesadosRuta1.jpg",
      gradient: "from-slate-700/90 to-slate-900/90",
      modelsCount: 2,
      badge: "RUTA",
      href: "/foton/pesados-ruta",
    },
    {
      id: "pesados-vocacionales",
      name: "Pesados Vocacionales",
      description: "Trabajos especializados",
      icon: Factory,
      image:
        "/images/FOTON/cateogries/PesadosVocacionales/Foto-Cateogries-Foton-PesadosVocacionales1.jpg",
      gradient: "from-amber-600/90 to-orange-700/90",
      modelsCount: 1,
      badge: "VOCACIONAL",
      href: "/foton/pesados-vocacionales",
    },
    {
      id: "electricos",
      name: "Eléctricos",
      description: "Sustentabilidad",
      icon: Zap,
      image:
        "/images/FOTON/cateogries/Electricos/Foto-Cateogries-Foton-Electricos1.jpg",
      gradient: "from-green-600/90 to-emerald-700/90",
      modelsCount: 1,
      badge: "ELÉCTRICO",
      href: "/foton/electricos",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/FOTON/camionesFoton.webp"
            alt="Camiones Foton"
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
              Vehículos Comerciales Premium
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
            FOTON
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-10">
            Líderes en soluciones de transporte con tecnología de vanguardia.
            Encuentra el vehículo perfecto para tu negocio.
          </p>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-cyan-400 mb-2">7</div>
              <div className="text-sm text-slate-300">Categorías</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-blue-400 mb-2">13+</div>
              <div className="text-sm text-slate-300">Modelos Disponibles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-sm text-slate-300">Garantía Oficial</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-teal-400 mb-2">2024</div>
              <div className="text-sm text-slate-300">Última Tecnología</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías de Vehículos */}
      <section
        id="categorias"
        className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Explora por <span className="text-cyan-400">Categoría</span>
            </h2>
            <p className="text-slate-300 text-base max-w-2xl mx-auto">
              Encuentra el vehículo perfecto según tus necesidades de transporte
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Primera fila: 4 cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {categories.slice(0, 4).map((category) => {
                const IconComponent = category.icon;

                return (
                  <div
                    key={category.id}
                    onClick={() => router.push(category.href)}
                    className="group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1"
                    style={{ height: "280px" }}
                  >
                    {/* Imagen de fondo */}
                    <div className="absolute inset-0">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Overlay sutil solo en la parte inferior para legibilidad del texto */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    </div>

                    {/* Contenido */}
                    <div className="relative h-full flex flex-col justify-between p-5">
                      {/* Header con icono y badge */}
                      <div className="flex items-start justify-between">
                        <div className="p-3 bg-cyan-500/30 backdrop-blur-sm rounded-lg border border-cyan-400/40">
                          <IconComponent className="w-6 h-6 text-cyan-300" />
                        </div>
                        <span className="px-3 py-1 text-xs font-bold bg-cyan-500/30 backdrop-blur-sm text-cyan-300 rounded-full border border-cyan-400/40">
                          {category.badge}
                        </span>
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                          {category.name}
                        </h3>
                        <p className="text-slate-200 text-sm mb-4 drop-shadow-md">
                          {category.description}
                        </p>

                        {/* Footer con modelos y flecha */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-cyan-300">
                            <Truck className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                              {category.modelsCount}{" "}
                              {category.modelsCount === 1
                                ? "Modelo"
                                : "Modelos"}
                            </span>
                          </div>
                          <div className="p-2 bg-cyan-500/30 backdrop-blur-sm rounded-full border border-cyan-400/40 transition-transform duration-300 group-hover:translate-x-1">
                            <ChevronRight className="w-5 h-5 text-cyan-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Segunda fila: 3 cards centradas */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {categories.slice(4).map((category) => {
                const IconComponent = category.icon;

                return (
                  <div
                    key={category.id}
                    onClick={() => router.push(category.href)}
                    className="group relative overflow-hidden rounded-xl shadow-md transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1"
                    style={{ height: "280px" }}
                  >
                    {/* Imagen de fondo */}
                    <div className="absolute inset-0">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Overlay sutil solo en la parte inferior para legibilidad del texto */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    </div>

                    {/* Contenido */}
                    <div className="relative h-full flex flex-col justify-between p-5">
                      {/* Header con icono y badge */}
                      <div className="flex items-start justify-between">
                        <div className="p-3 bg-cyan-500/30 backdrop-blur-sm rounded-lg border border-cyan-400/40">
                          <IconComponent className="w-6 h-6 text-cyan-300" />
                        </div>
                        <span className="px-3 py-1 text-xs font-bold bg-cyan-500/30 backdrop-blur-sm text-cyan-300 rounded-full border border-cyan-400/40">
                          {category.badge}
                        </span>
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                          {category.name}
                        </h3>
                        <p className="text-slate-200 text-sm mb-4 drop-shadow-md">
                          {category.description}
                        </p>

                        {/* Footer con modelos y flecha */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-cyan-300">
                            <Truck className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                              {category.modelsCount}{" "}
                              {category.modelsCount === 1
                                ? "Modelo"
                                : "Modelos"}
                            </span>
                          </div>
                          <div className="p-2 bg-cyan-500/30 backdrop-blur-sm rounded-full border border-cyan-400/40 transition-transform duration-300 group-hover:translate-x-1">
                            <ChevronRight className="w-5 h-5 text-cyan-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ACERCA DE CVN Y FOTON */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Contenido */}
              <div>
                <div className="mb-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                    ACERCA DE{" "}
                    <span className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                      CVN Y FOTON
                    </span>
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mb-8"></div>
                </div>

                <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
                  <p>
                    <strong className="text-blue-600">CVN Motors</strong>{" "}
                    distribuye y comercializa en Argentina vehículos comerciales
                    de la reconocida marca &ldquo;Foton&rdquo;.
                    <strong className="text-slate-800">
                      {" "}
                      Beiqi Foton Motor Co. Ltd.
                    </strong>
                    , es líder internacional en la fabricación de{" "}
                    <strong className="text-cyan-600">
                      camiones livianos, medianos y pesados, vans, pickups,
                      buses y vehículos especiales
                    </strong>{" "}
                    para la construcción.
                  </p>

                  <p>
                    La firma fue fundada el{" "}
                    <strong className="text-blue-600">
                      28 de agosto de 1996
                    </strong>
                    , tiene su sede central en{" "}
                    <strong className="text-slate-800">Beijing, China</strong>,
                    y es el resultado de la fusión de dos Joint Ventures{" "}
                    <strong className="text-cyan-600">
                      Beijing Foton Daimler Automotive Co., Ltd.
                    </strong>{" "}
                    y{" "}
                    <strong className="text-cyan-600">
                      Beijing Foton Cummins Engine Co. Ltd.
                    </strong>
                  </p>

                  <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border-l-4 border-blue-500">
                    <blockquote className="italic text-slate-600 text-xl">
                      &ldquo;La excelencia en vehículos comerciales es nuestro
                      compromiso diario&rdquo;
                    </blockquote>
                    <cite className="block mt-4 text-sm font-semibold text-blue-600">
                      — MIKEY DIOKLES, President of Motors
                    </cite>
                  </div>
                </div>
              </div>

              {/* Imagen */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/FOTON/imagen foton 1.webp"
                    alt="Fábrica Foton - Líder en vehículos comerciales"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-2xl shadow-lg"
                  />
                  <div className="p-4">
                    <p className="text-sm text-slate-600 text-center font-medium">
                      Instalaciones de Beiqi Foton Motor Co. Ltd. en Beijing,
                      China
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOTON EN EL MUNDO */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Contenido */}
              <div>
                <div className="mb-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    FOTON EN EL{" "}
                    <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                      MUNDO
                    </span>
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mb-8"></div>
                </div>

                <div className="space-y-6 text-lg text-slate-200 leading-relaxed">
                  <p>
                    <strong className="text-cyan-400">FOTON</strong> es en la
                    actualidad el fabricante chino de vehículos comerciales con
                    el rango más amplio de modelos con más de{" "}
                    <strong className="text-cyan-400">
                      8 millones de unidades producidas
                    </strong>
                    , y cuenta además con{" "}
                    <strong className="text-blue-400">70 representantes</strong>{" "}
                    y más de{" "}
                    <strong className="text-blue-400">
                      1,000 distributores oficiales
                    </strong>{" "}
                    en todo el mundo.
                  </p>

                  <p>
                    Sus productos y servicios se extienden hacia{" "}
                    <strong className="text-cyan-400">más de 110 países</strong>{" "}
                    en todos los continentes.{" "}
                    <strong className="text-blue-400">CVN MOTORS</strong> es una
                    de la más recientes unidades de negocio de{" "}
                    <strong className="text-white">Grupo Iraola</strong>, un
                    grupo empresario de capitales nacionales, con{" "}
                    <strong className="text-cyan-400">
                      50 años de trayectoria industrial
                    </strong>{" "}
                    en el país, y una sólida estructura comercial y
                    administrativa, orientada a la satisfacción del cliente.
                  </p>

                  {/* Estadísticas destacadas */}
                  <div className="grid md:grid-cols-3 gap-6 mt-10">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-cyan-400 mb-2">
                        8M+
                      </div>
                      <div className="text-sm text-slate-300">
                        Unidades Producidas
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        110+
                      </div>
                      <div className="text-sm text-slate-300">Países</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        50
                      </div>
                      <div className="text-sm text-slate-300">
                        Años de Experiencia
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Imagen */}
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/FOTON/imagen foton 2.webp"
                    alt="Logo FOTON - Presencia mundial"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-2xl"
                  />
                  <div className="p-4">
                    <p className="text-sm text-slate-300 text-center font-medium">
                      FOTON: Líder mundial en vehículos comerciales
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACERCA DEL GRUPO IRAOLA */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Imagen */}
              <div className="relative lg:order-1">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/FOTON/imagen foton 3.webp"
                    alt="Grupo Iraola - Mapa mundial de operaciones"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-2xl shadow-lg"
                  />
                  <div className="p-4">
                    <p className="text-sm text-slate-700 text-center font-medium">
                      Grupo Iraola: Presencia estratégica en Argentina
                    </p>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="lg:order-2">
                <div className="mb-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                    ACERCA DEL{" "}
                    <span className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                      GRUPO IRAOLA
                    </span>
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mb-8"></div>
                </div>

                <div className="space-y-6 text-lg text-slate-800 leading-relaxed">
                  <p>
                    <strong className="text-blue-600">Grupo Iraola</strong> está
                    integrado por distintas unidades de negocios enfocadas en el
                    mercado de{" "}
                    <strong className="text-slate-900">
                      Autopartes, Motos, Agropecuario, Energético, Bienes Raíces
                    </strong>
                    , y recientemente ha sumado una división automotriz,{" "}
                    <strong className="text-cyan-600">CVN Motors</strong>.
                  </p>

                  <p>
                    Grupo Iraola posee sus centros fabriles estratégicamente
                    ubicados en la ciudad de{" "}
                    <strong className="text-blue-600">
                      Venado Tuerto, Provincia de Santa Fe
                    </strong>
                    , y además, cuenta con un importante{" "}
                    <strong className="text-cyan-600">
                      Centro Logístico y Administrativo
                    </strong>{" "}
                    en la localidad de{" "}
                    <strong className="text-slate-900">
                      La Reja, Buenos Aires
                    </strong>
                    , en expansión.
                  </p>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-l-4 border-blue-500 mt-8 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          800+
                        </div>
                        <div className="text-sm text-slate-700 font-medium">
                          Empleados Directos
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-800 font-medium">
                      El grupo emplea a más de{" "}
                      <strong className="text-blue-600">800 personas</strong> en
                      forma directa, consolidándose como un importante actor en
                      la industria nacional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              ¿Listo para encontrar tu{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                vehículo ideal?
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Nuestros expertos están listos para asesorarte y encontrar la
              solución perfecta para tu negocio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/contacto")}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-cyan-500/20"
              >
                Contactar Ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#categorias"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 border border-white/20"
              >
                Ver Categorías
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
