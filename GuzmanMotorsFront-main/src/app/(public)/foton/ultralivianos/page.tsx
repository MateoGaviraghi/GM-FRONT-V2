"use client";

import Image from "next/image";
import { ArrowLeft, Truck, Package, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UltrallivianosPage() {
  const router = useRouter();

  const vehicles = [
    {
      id: "tm",
      name: "TM",
      subtitle: "Versatilidad para tu negocio",
      description:
        "El TM es el vehículo comercial ideal para los trabajos en ciudad. Baja tara que permite maximizar la carga, radio de giro mínimo, confort y distintas opciones de configuración permiten encontrar el vehículo ideal para cada aplicación de última milla.",
      image: "/images/FOTON/TM/hero/tm1hero -grande.png",
      badge: "URBANO",
      gradient: "from-blue-500 to-cyan-600",
      specs: [
        { icon: Zap, label: "Eficiente" },
        { icon: Package, label: "Alta Carga" },
        { icon: Truck, label: "Urbano" },
      ],
      href: "/foton/ultralivianos/tm",
    },
    {
      id: "wonder",
      name: "WONDER",
      subtitle: "Habla de vos",
      description:
        "El Foton Wonder es un camión ultraliviano que combina fuerza, eficiencia y versatilidad, ideal para los desafíos de la ciudad. Su diseño italiano, colores innovadores y versatilidad incomparable lo convierten en una herramienta clave para potenciar tu negocio.",
      image:
        "/images/FOTON/cateogries/ultralivianos/WONDER/FOTOCARD/FOTON CARD-WONDER.webp",
      badge: "URBANO",
      gradient: "from-blue-500 to-cyan-600",
      specs: [
        { icon: Zap, label: "120 HP" },
        { icon: Truck, label: "Urbano" },
        { icon: Package, label: "Eficiente" },
      ],
      href: "/foton/ultralivianos/wonder",
    },
    {
      id: "ztruck",
      name: "Z-Truck",
      subtitle: "Siempre llegás a tiempo",
      description:
        "El Z-Truck de Zanella destaca como el compañero perfecto para labores urbanas. Su ligereza optimiza la carga, su maniobrabilidad es insuperable, ofrece comodidad y diversas configuraciones para adaptarse a cada necesidad.",
      image:
        "/images/FOTON/cateogries/ultralivianos/WONDER/ZTruck/FOTOCARD/FOTOCARD-ZTRUCK.jpeg",
      badge: "URBANO",
      gradient: "from-blue-500 to-cyan-600",
      specs: [
        { icon: Truck, label: "690 kg" },
        { icon: Zap, label: "Urbano" },
        { icon: Package, label: "Compacto" },
      ],
      href: "/foton/ultralivianos/ztruck",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/FOTON/cateogries/ultralivianos/Foto-Cateogries-Foton-Ultralivianos2.jpg"
            alt="Ultralivianos FOTON"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-slate-900/80 to-cyan-900/90"></div>
        </div>

        {/* Efectos de fondo */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative container mx-auto px-4">
          {/* Breadcrumb */}
          <button
            onClick={() => router.push("/foton")}
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Volver a FOTON</span>
          </button>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <Truck className="w-5 h-5 text-blue-400" />
              <span className="text-blue-200 font-medium">Ultralivianos</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                Ultralivianos FOTON
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-8">
              Eficiencia urbana y capacidad de carga óptima.
              <br className="hidden md:block" />
              Soluciones comerciales para la última milla y distribución en
              ciudad.
            </p>

            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">3</div>
                <div className="text-slate-300">Modelos</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">Urbano</div>
                <div className="text-slate-300">Aplicación</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  Eficiente
                </div>
                <div className="text-slate-300">Consumo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Primera fila: TM y WONDER */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {vehicles.slice(0, 2).map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-200"
                >
                  {/* Imagen del vehículo */}
                  <div className="relative h-80 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${vehicle.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                    ></div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-blue-800">
                      {vehicle.badge}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-8">
                    <h3 className="text-3xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {vehicle.name}
                    </h3>
                    <h4 className="text-lg font-semibold text-blue-600 mb-4">
                      {vehicle.subtitle}
                    </h4>
                    <p className="text-slate-700 mb-6 leading-relaxed">
                      {vehicle.description}
                    </p>

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {vehicle.specs.map((spec, index) => {
                        const IconComponent = spec.icon;
                        return (
                          <div
                            key={index}
                            className="flex flex-col items-center text-center p-3 bg-slate-50 rounded-xl"
                          >
                            <IconComponent className="w-6 h-6 text-blue-600 mb-2" />
                            <span className="text-sm font-semibold text-slate-900">
                              {spec.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => router.push(vehicle.href)}
                      className={`block w-full bg-gradient-to-r ${vehicle.gradient} hover:brightness-110 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center`}
                    >
                      VER MODELO
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Segunda fila: Z-Truck centrado */}
            {vehicles.length > 2 && (
              <div className="flex justify-center">
                <div className="w-full md:w-[calc(50%-1rem)]">
                  {vehicles.slice(2).map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-200"
                    >
                      {/* Imagen del vehículo */}
                      <div className="relative h-80 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                        <Image
                          src={vehicle.image}
                          alt={vehicle.name}
                          fill
                          className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-t ${vehicle.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                        ></div>
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-blue-800">
                          {vehicle.badge}
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="p-8">
                        <h3 className="text-3xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {vehicle.name}
                        </h3>
                        <h4 className="text-lg font-semibold text-blue-600 mb-4">
                          {vehicle.subtitle}
                        </h4>
                        <p className="text-slate-700 mb-6 leading-relaxed">
                          {vehicle.description}
                        </p>

                        {/* Specs */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          {vehicle.specs.map((spec, index) => {
                            const IconComponent = spec.icon;
                            return (
                              <div
                                key={index}
                                className="flex flex-col items-center text-center p-3 bg-slate-50 rounded-xl"
                              >
                                <IconComponent className="w-6 h-6 text-blue-600 mb-2" />
                                <span className="text-sm font-semibold text-slate-900">
                                  {spec.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => router.push(vehicle.href)}
                          className={`block w-full bg-gradient-to-r ${vehicle.gradient} hover:brightness-110 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center`}
                        >
                          VER MODELO
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Próximamente */}
            <div className="mt-12">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-10 border-2 border-dashed border-blue-200 text-center">
                <Truck className="w-14 h-14 text-blue-400 mx-auto mb-4 opacity-60" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  Más modelos próximamente
                </h3>
                <p className="text-slate-600 text-sm">
                  Estamos trabajando para traerte más opciones en la categoría
                  de ultralivianos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Por qué elegir un{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                Ultraliviano FOTON?
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Package className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Alta Capacidad</h3>
                <p className="text-slate-300">
                  Baja tara para maximizar la carga útil en tus operaciones
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Eficiencia</h3>
                <p className="text-slate-300">
                  Consumo optimizado para reducir costos operativos
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Truck className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Versatilidad</h3>
                <p className="text-slate-300">
                  Múltiples configuraciones para cada tipo de negocio
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
