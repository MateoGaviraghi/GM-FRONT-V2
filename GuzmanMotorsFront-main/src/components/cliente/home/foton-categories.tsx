"use client";

import {
  Truck,
  TruckIcon,
  Package,
  Container,
  Boxes,
  Factory,
  Zap,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function FotonCategories() {
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
    <div className="bg-gradient-to-b from-slate-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Explorá las{" "}
            <span className="text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text">
              Categorías
            </span>
          </h2>
          <p className="text-slate-700 text-base max-w-2xl mx-auto">
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
                            {category.modelsCount === 1 ? "Modelo" : "Modelos"}
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
                            {category.modelsCount === 1 ? "Modelo" : "Modelos"}
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
    </div>
  );
}
