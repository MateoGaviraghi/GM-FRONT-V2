"use client";

import Image from "next/image";
import { ArrowLeft, Truck, Zap, Leaf, Settings, Gauge } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ElectricosPage() {
  const router = useRouter();

  const vehicles = [
    {
      id: "eaumark",
      name: "eAumark",
      subtitle: "Logística 100% eléctrica",
      badge: "100% ELÉCTRICO",
      description: "El eAumark L6 es el primer camión eléctrico urbano del país, formando parte del cambio de la logística hacia la neutralidad de emisiones. Alta tecnología, seguridad y eficiencia son los principales atributos de este gran camión",
      gradient: "from-cyan-600 to-blue-600",
      image:
        "/images/FOTON/cateogries/Electricos/EAUMARK/FOTOCARD/FOTOCARD-E AUMARK.jpg",
      href: "/foton/electricos/eaumark",
      specs: [
        { icon: Settings, label: "115 kW / 154 HP" },
        { icon: Truck, label: "6.000 kg" },
        { icon: Gauge, label: "~200 km autonomía" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/FOTON/cateogries/Electricos/Foto-Cateogries-Foton-Electricos1.jpg"
            alt="Eléctricos FOTON"
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
              <Zap className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-200 font-medium">Eléctricos</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Eléctricos FOTON
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-8">
              Movilidad sustentable para el futuro.
              <br className="hidden md:block" />
              Los vehículos eléctricos FOTON combinan tecnología de punta con
              cero emisiones.
            </p>

            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">1</div>
                <div className="text-slate-300">Modelo</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">115 kW</div>
                <div className="text-slate-300">Potencia</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">~200 km</div>
                <div className="text-slate-300">Autonomía</div>
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
                  <Zap className="w-12 h-12 text-cyan-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Próximamente
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Estamos preparando la información de nuestros vehículos
                  eléctricos. Pronto tendrás toda la información disponible.
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
                    <div className="relative h-80 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex items-center justify-center p-8">
                      <Image
                        src={vehicle.image}
                        alt={vehicle.name}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-700"
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
                Eléctricos FOTON?
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">100% Eléctrico</h3>
                <p className="text-slate-300">
                  Tecnología de punta sin emisiones contaminantes
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Leaf className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Sustentable</h3>
                <p className="text-slate-300">
                  Contribuye al cuidado del medio ambiente
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Truck className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Eficiencia</h3>
                <p className="text-slate-300">
                  Menores costos operativos y mantenimiento reducido
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
