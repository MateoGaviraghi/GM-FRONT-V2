"use client";

import Image from "next/image";
import { ArrowLeft, Truck, Package, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PesadosVocacionalesPage() {
  const router = useRouter();

  const vehicles = [
    {
      id: "auman-c",
      name: "AUMAN C",
      subtitle: "Para altas exigencias",
      description:
        "La línea AUMAN C es ideal para los trabajos más severos de Construcción y Minería, donde la robustez, disponibilidad y eficiencia son claves para la actividad.",
      image:
        "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/FOTOCARD/FOTOCARD-AUMAN C.jpg",
      badge: "CONSTRUCCIÓN",
      gradient: "from-cyan-500 to-blue-600",
      specs: [
        { icon: Zap, label: "400-460 CV" },
        { icon: Package, label: "35-50 Ton" },
        { icon: Truck, label: "Pesado" },
      ],
      href: "/foton/pesados-vocacionales/auman-c",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/FOTON/cateogries/PesadosVocacionales/Foto-Cateogries-Foton-PesadosVocacionales2.png"
            alt="Pesados Vocacionales FOTON"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/90 via-slate-900/80 to-blue-900/90"></div>
        </div>

        {/* Efectos de fondo */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative container mx-auto px-4">
          {/* Breadcrumb */}
          <button
            onClick={() => router.push("/foton")}
            className="inline-flex items-center gap-2 text-cyan-200 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Volver a FOTON</span>
          </button>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <Truck className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-200 font-medium">
                Pesados Vocacionales
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Pesados Vocacionales FOTON
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-8">
              Soluciones robustas para trabajos severos.
              <br className="hidden md:block" />
              Construcción, minería y aplicaciones de alta exigencia.
            </p>

            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">1</div>
                <div className="text-slate-300">Modelo</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">Pesado</div>
                <div className="text-slate-300">Categoría</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">Robusto</div>
                <div className="text-slate-300">Durabilidad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Card del AUMAN C */}
            <div className="flex justify-center">
              <div className="w-full md:w-[calc(50%-1rem)]">
                {vehicles.map((vehicle) => (
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
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-cyan-800">
                        {vehicle.badge}
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-8">
                      <h3 className="text-3xl font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors duration-300">
                        {vehicle.name}
                      </h3>
                      <h4 className="text-lg font-semibold text-cyan-600 mb-4">
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
                              <IconComponent className="w-6 h-6 text-cyan-600 mb-2" />
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

            {/* Próximamente */}
            <div className="mt-12">
              <div className="bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl p-10 border-2 border-dashed border-cyan-200 text-center">
                <Truck className="w-14 h-14 text-cyan-400 mx-auto mb-4 opacity-60" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  Más modelos próximamente
                </h3>
                <p className="text-slate-600 text-sm">
                  Estamos trabajando para traerte más opciones en la categoría
                  de pesados vocacionales
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Por qué elegir un{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                Pesado Vocacional FOTON?
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Package className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Alta Capacidad</h3>
                <p className="text-slate-300">
                  Capacidad de 35 a 50 toneladas para trabajos exigentes
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Potencia Cummins</h3>
                <p className="text-slate-300">
                  Motores de 400 a 460 CV para máximo rendimiento
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Truck className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Durabilidad</h3>
                <p className="text-slate-300">
                  Diseñado para construcción, minería y trabajos severos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            ¿Necesitas un camión para trabajos pesados?
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Los camiones pesados vocacionales FOTON están diseñados para las
            condiciones más exigentes. Contáctanos para encontrar la solución
            perfecta para tu operación.
          </p>
          <button
            onClick={() => router.push("/contacto")}
            className="inline-flex items-center gap-2 bg-white text-cyan-600 hover:bg-slate-100 font-bold px-10 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl"
          >
            CONTACTAR AHORA
          </button>
        </div>
      </section>
    </div>
  );
}
