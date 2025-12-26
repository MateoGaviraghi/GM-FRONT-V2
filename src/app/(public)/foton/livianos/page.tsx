"use client";

import Image from "next/image";
import { ArrowLeft, Truck, Package, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LivianosPage() {
  const router = useRouter();

  const vehicles = [
    {
      id: "aumark",
      name: "AUMARK",
      subtitle: "El camión liviano más vendido del mundo",
      description:
        "Diseñado para la logística de corta distancia, es parte de la última evolución del camión liviano más vendido del mundo. Se caracteriza por su moderno diseño, alta calidad y tren motriz eficiente con motor Cummins, transmisión ZF, electrónica Bosch y frenos a disco en todas sus ruedas.",
      image:
        "/images/FOTON/cateogries/livianos/AUMARK/FOTOCARD/FOTOCARD-AUMARK.jpg",
      badge: "PREMIUM",
      gradient: "from-blue-500 to-cyan-600",
      specs: [
        { icon: Zap, label: "Cummins" },
        { icon: Truck, label: "6,000 kg" },
        { icon: Package, label: "2 Versiones" },
      ],
      href: "/foton/livianos/aumark",
    },
    {
      id: "nuevo-aumark-615",
      name: "Nuevo Aumark 615",
      subtitle: "El futuro del transporte urbano",
      description:
        "El Nuevo Aumark 615 representa la evolución del camión liviano. Con motor Cummins de última generación, transmisión ZF y un diseño moderno, es la solución perfecta para logística urbana y distribución eficiente.",
      image:
        "/images/FOTON/cateogries/livianos/NUEVO AUMARK/FOTOCARD/FOTOCARD-NuevoAumark.jpg",
      badge: "NUEVO",
      gradient: "from-blue-500 to-cyan-600",
      specs: [
        { icon: Zap, label: "Cummins" },
        { icon: Truck, label: "Eficiente" },
        { icon: Package, label: "Moderno" },
      ],
      href: "/foton/livianos/nuevo-aumark-615",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/FOTON/cateogries/livianos/NUEVO AUMARK/HERO/hero-NuevoAumark.jpg"
            alt="Livianos FOTON"
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
            <span>Volver a Livianos</span>
          </button>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <Truck className="w-5 h-5 text-blue-400" />
              <span className="text-blue-200 font-medium">Livianos</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                Livianos FOTON
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-8">
              Rendimiento superior y tecnología de vanguardia.
              <br className="hidden md:block" />
              La solución ideal para transporte urbano y logística de corta
              distancia.
            </p>

            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">2</div>
                <div className="text-slate-300">Modelos</div>
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Necesitás más información?
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Nuestro equipo está listo para ayudarte a encontrar el vehículo
              ideal para tu negocio.
            </p>
            <a
              href="https://wa.me/5493424216850?text=Hola!%20Estoy%20interesado%20en%20los%20vehículos%20livianos%20FOTON.%20Me%20gustaría%20recibir%20más%20información."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <Package className="w-5 h-5" />
              CONTACTAR POR WHATSAPP
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
