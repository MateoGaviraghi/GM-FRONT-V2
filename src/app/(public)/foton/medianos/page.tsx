"use client";

import Image from "next/image";
import { ArrowLeft, Truck, Package, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MedianosPage() {
  const router = useRouter();

  const vehicles = [
    {
      id: "auman-d",
      name: "AUMAN D",
      subtitle: "Potencia y eficiencia para cargas medianas",
      description:
        "El AUMAN D es un camión de carga mediana diseñado para brindar potencia, durabilidad y eficiencia en el transporte de mercancías. Equipado con motor Cummins, transmisión Fast y tecnología de última generación, es ideal para operaciones de logística y distribución.",
      image:
        "/images/FOTON/cateogries/medianos/AUMAN D/FOTOCARD/FOTOCARD-AUMAN D.png",
      badge: "PREMIUM",
      gradient: "from-blue-500 to-cyan-600",
      specs: [
        { icon: Zap, label: "Cummins" },
        { icon: Truck, label: "16,000 kg" },
        { icon: Package, label: "2 Versiones" },
      ],
      href: "/foton/medianos/auman-d",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/FOTON/cateogries/medianos/AUMAN D/HERO/HERO-AUMAN D.jpg"
            alt="Medianos FOTON"
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
              <span className="text-blue-200 font-medium">Medianos</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                Medianos FOTON
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-8">
              Potencia y capacidad de carga para operaciones logísticas de alto
              rendimiento.
              <br className="hidden md:block" />
              La mejor opción para transporte de cargas medianas con máxima
              eficiencia.
            </p>

            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">1</div>
                <div className="text-slate-300">Modelo</div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">Premium</div>
                <div className="text-slate-300">Calidad</div>
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
            <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
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
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-blue-800">
                      {vehicle.badge}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-8">
                    <h3 className="text-3xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {vehicle.name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm mb-4">
                      {vehicle.subtitle}
                    </p>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {vehicle.description}
                    </p>

                    {/* Especificaciones */}
                    <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-200">
                      {vehicle.specs.map((spec, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-slate-700"
                        >
                          <spec.icon className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium">
                            {spec.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Botón */}
                    <button
                      onClick={() => router.push(vehicle.href)}
                      className={`w-full bg-gradient-to-r ${vehicle.gradient} text-white py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2`}
                    >
                      <span>VER MODELO</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Información adicional */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              ¿Por qué elegir FOTON Medianos?
            </h2>
            <p className="text-lg text-slate-300 mb-12">
              Los camiones medianos FOTON ofrecen la combinación perfecta de
              potencia, capacidad de carga y eficiencia operativa para tu
              negocio.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Motor Cummins</h3>
                <p className="text-slate-400">
                  Potencia y durabilidad garantizada con motores de clase
                  mundial.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Alta Capacidad</h3>
                <p className="text-slate-400">
                  Diseñados para transportar cargas de hasta 16,000 kg con
                  seguridad.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Eficiencia</h3>
                <p className="text-slate-400">
                  Bajo consumo de combustible y costos operativos reducidos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
