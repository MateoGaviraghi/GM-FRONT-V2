"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative text-white py-20 md:py-32 overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image
          src="/images/inicio/entrada neogcio gumzan motors.webp"
          alt="Guzman Motors"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay para mejorar la legibilidad del texto */}
        <div className="absolute inset-0 bg-slate-900/70"></div>
      </div>

      {/* Efectos de fondo animados (más sutiles) */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 text-center pt-8">
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
          <Building2 className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-200 font-medium">Desde 1987</span>
        </div>

        <div className="max-w-5xl mx-auto mb-12">
          <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight drop-shadow-2xl">
            Agencia de Venta y Consignación
          </h1>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl px-8 py-5 inline-block border border-cyan-500/20 mb-8">
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 leading-relaxed">
              Distribuidores{" "}
              <span className="text-cyan-400 font-bold drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
                FOTON
              </span>{" "}
              — Camiones y Pickups
            </p>
          </div>
          <p className="text-slate-200 text-xl md:text-3xl lg:text-4xl font-medium drop-shadow-lg">
            Camiones, Utilitarios y Remolques — 0km y Usados
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl font-bold text-cyan-400 mb-2">38+</div>
            <div className="text-sm text-slate-300">Años de Experiencia</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl font-bold text-blue-400 mb-2">1500+</div>
            <div className="text-sm text-slate-300">Unidades Vendidas</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl font-bold text-green-400 mb-2">4</div>
            <div className="text-sm text-slate-300">Categorías</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl font-bold text-teal-400 mb-2">100%</div>
            <div className="text-sm text-slate-300">Garantía</div>
          </div>
        </div>
      </div>
    </section>
  );
}
