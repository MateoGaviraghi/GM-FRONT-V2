"use client";

import Image from "next/image";
import { ArrowLeft, Truck, Mountain, Gauge } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PickUpsPage() {
  const router = useRouter();

  const vehicles = [
    {
      id: "tunland-g7",
      name: "TUNLAND G7",
      subtitle: "Potencia y capacidad de carga",
      description:
        "La Tunland G7 combina resistencia y durabilidad. Con motor diesel de 161 HP, transmisión ZF de 8 velocidades y tracción 4x4, es perfecta para trabajos pesados y aventuras off-road. Capacidad de carga de 1.000 kg.",
      image: "/images/FOTON/TUNDLAND.G7/FOTO-PARA-CARD/FOTO-CARD-TUNDLAND.webp",
      badge: "4X4 OFF-ROAD",
      gradient: "from-cyan-500 to-blue-600",
      specs: [
        { icon: Gauge, label: "161 HP" },
        { icon: Mountain, label: "4x4" },
        { icon: Truck, label: "1.000 kg" },
      ],
      href: "/foton/pick-ups/tunland-g7",
    },
    {
      id: "tunland-v9",
      name: "TUNLAND V9",
      subtitle: "Tecnología mild-hybrid",
      description:
        "La nueva V9 híbrida combina un motor diesel Aucan 2.0L con sistema mild-hybrid de 48V (175 HP), transmisión ZF de 8 marchas y tracción 4x4. Mayor eficiencia, menor consumo y amigable con el medio ambiente. Capacidad: 720 kg.",
      image: "/images/FOTON/TUNDLAND.V9/FOTOCARD/FotoCarfTunlandV9.jpeg",
      badge: "HÍBRIDA",
      gradient: "from-blue-500 to-cyan-600",
      specs: [
        { icon: Gauge, label: "175 HP" },
        { icon: Mountain, label: "4x4" },
        { icon: Truck, label: "720 kg" },
      ],
      href: "/foton/pick-ups/tunland-v9",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/FOTON/cateogries/pickups/Foto-Cateogries-Foton-PickUps2.webp"
            alt="Pick Ups FOTON"
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
              <span className="text-cyan-200 font-medium">Pick Ups</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Pick Ups FOTON
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-8">
              Potencia, versatilidad y capacidad para trabajo y aventura.
              <br className="hidden md:block" />
              Las pick-ups FOTON combinan rendimiento off-road con tecnología
              avanzada.
            </p>

            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">2</div>
                <div className="text-slate-300">Modelos</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">4x4</div>
                <div className="text-slate-300">Tracción</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">161-175</div>
                <div className="text-slate-300">HP</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Por qué elegir una{" "}
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                Pick Up FOTON?
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Mountain className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Todo Terreno</h3>
                <p className="text-slate-300">
                  Tracción 4x4 y alta capacidad off-road para cualquier desafío
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Gauge className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Potencia</h3>
                <p className="text-slate-300">
                  Motores diesel de alto rendimiento y eficiencia
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Truck className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Carga</h3>
                <p className="text-slate-300">
                  Capacidad de hasta 1.000 kg para trabajos pesados
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
