"use client";

import Image from "next/image";
import { ArrowLeft, Truck, Mountain, Gauge } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PesadosRutaPage() {
  const router = useRouter();

  const vehicles = [
    {
      id: "nuevo-auman-r",
      name: "NUEVO AUMAN R",
      subtitle: "Tecnología y eficiencia de ruta",
      description:
        "La nueva línea AUMAN R representa un avance excepcional, cumpliendo con los más altos estándares europeos. Fruto de la alianza entre FOTON y Daimler, este camión destaca por su eficiencia en largas distancias. Motor Cummins ISGe5 de 430-460 HP, caja ZF TraXon AMT de 12 marchas.",
      image:
        "/images/FOTON/cateogries/PesadosRuta/NUEVO AUMAN R/FOTOCARD/FOTOCARD-AUMAN R-.jpg",
      badge: "ALTA TECNOLOGÍA",
      gradient: "from-cyan-500 to-blue-600",
      specs: [
        { icon: Gauge, label: "430-460 HP" },
        { icon: Truck, label: "55.000 kg" },
        { icon: Mountain, label: "6x2" },
      ],
      href: "/foton/pesados-ruta/nuevo-auman-r",
    },
    {
      id: "auman-r",
      name: "AUMAN R",
      subtitle: "Máxima potencia para largas distancias",
      description:
        "La línea AUMAN R es un exitoso desarrollo con los estándares europeos más exigentes. Fruto de la alianza entre FOTON y Daimler, este potente camión cuenta con altos estándares de eficiencia. Motor Cummins ISG12 y X13 de 430 a 560 CV, caja ZF TraXon AMT de 12 marchas.",
      image:
        "/images/FOTON/cateogries/PesadosRuta/AUMAN R/FOTOCARD/FOTO-CARD-AUMAN R.jpg",
      badge: "MÁXIMA POTENCIA",
      gradient: "from-cyan-500 to-blue-600",
      specs: [
        { icon: Gauge, label: "430-560 CV" },
        { icon: Truck, label: "45.000-75.000 kg" },
        { icon: Mountain, label: "Larga distancia" },
      ],
      href: "/foton/pesados-ruta/auman-r",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/FOTON/cateogries/PesadosRuta/Foto-Cateogries-Foton-PesadosRuta2.png"
            alt="Pesados Ruta FOTON"
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
              <span className="text-cyan-200 font-medium">Pesados Ruta</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Pesados Ruta FOTON
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-8">
              Potencia y confiabilidad para largas distancias.
              <br className="hidden md:block" />
              Los vehículos pesados de ruta FOTON están diseñados para el máximo
              rendimiento.
            </p>

            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">2</div>
                <div className="text-slate-300">Modelos</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">430-560</div>
                <div className="text-slate-300">CV</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">Ruta</div>
                <div className="text-slate-300">Aplicación</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {vehicles.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-cyan-100 rounded-full mb-6">
                  <Truck className="w-12 h-12 text-cyan-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Próximamente
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Estamos preparando la información de nuestros vehículos
                  pesados de ruta. Pronto tendrás toda la información
                  disponible.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
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
                        {vehicle.specs.map((spec, index: number) => {
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
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Por qué elegir{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                Pesados Ruta FOTON?
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Gauge className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Alta Potencia</h3>
                <p className="text-slate-300">
                  Motores Cummins de hasta 460 CV para máximo rendimiento
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Truck className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Gran Capacidad</h3>
                <p className="text-slate-300">
                  Diseñados para transportar grandes cargas en largas distancias
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Mountain className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Confort</h3>
                <p className="text-slate-300">
                  Cabinas espaciosas para viajes de larga duración
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
