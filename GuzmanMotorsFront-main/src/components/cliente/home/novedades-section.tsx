"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Mail, Newspaper } from "lucide-react";
import { novedadService } from "@/services";
import type { Novedad } from "@/types";

export function NovedadesSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [novedades, setNovedades] = useState<Novedad[]>([]);

  // Cargar novedades desde la API
  useEffect(() => {
    const loadNovedades = async () => {
      try {
        const params = {
          page: 1,
          limit: 6,
          sortBy: "createdAt" as const,
          sortOrder: "desc" as const,
        };
        const response = await novedadService.public.list(params);
        setNovedades(response?.items || []);
      } catch (error) {
        console.error("Error cargando novedades:", error);
        setNovedades([]);
      }
    };
    loadNovedades();
  }, []);

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(novedades.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-6 tracking-tight">
            NOVEDADES
          </h2>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-cyan-400 to-blue-400 rounded-full"></div>
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="h-1 w-32 bg-gradient-to-l from-transparent via-cyan-400 to-blue-400 rounded-full"></div>
          </div>
          <p className="text-cyan-200 text-lg max-w-2xl mx-auto">
            Mantente al día con las últimas actualizaciones y lanzamientos
          </p>
        </div>

        {/* Carrusel de Novedades */}
        {novedades.length > 0 ? (
          <div className="relative">
            {totalSlides > 1 && (
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 -translate-x-8 group border border-white/20"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              </button>
            )}

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                  const itemsInSlide = novedades.slice(
                    slideIndex * itemsPerSlide,
                    (slideIndex + 1) * itemsPerSlide
                  );
                  const shouldCenter = itemsInSlide.length < itemsPerSlide;

                  return (
                    <div
                      key={slideIndex}
                      className={`min-w-full grid gap-8 px-4 ${
                        shouldCenter ? "justify-items-center" : ""
                      }`}
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          itemsInSlide.length < 3
                            ? `repeat(${itemsInSlide.length}, minmax(0, 400px))`
                            : "repeat(3, minmax(0, 1fr))",
                        justifyContent: shouldCenter ? "center" : "stretch",
                      }}
                    >
                      {itemsInSlide.map((novedad) => (
                        <Link
                          key={novedad._id}
                          href={`/novedades/${novedad._id}`}
                          className="group bg-slate-800/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:-translate-y-2 max-w-md mx-auto w-full border border-slate-700/50"
                        >
                          {/* Imagen */}
                          <div className="relative h-64 bg-slate-700 overflow-hidden">
                            {novedad.imagenes &&
                            novedad.imagenes.length > 0 &&
                            novedad.imagenes[0]?.thumbnails?.large ? (
                              <Image
                                src={novedad.imagenes[0].thumbnails.large}
                                alt={novedad.titulo || "Novedad"}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                quality={100}
                                unoptimized
                                sizes="(max-width: 768px) 100vw, 400px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-700">
                                <Newspaper className="w-16 h-16 text-slate-500" />
                              </div>
                            )}
                            {/* Badge de categoría sobre la imagen */}
                            {novedad.categoria && (
                              <div className="absolute top-4 left-4 bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
                                {novedad.categoria}
                              </div>
                            )}
                          </div>

                          {/* Contenido */}
                          <div className="p-6">
                            <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2 min-h-[56px]">
                              {novedad.titulo}
                            </h3>

                            {novedad.resumen && (
                              <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                                {novedad.resumen}
                              </p>
                            )}

                            {/* Botón de leer más */}
                            <button className="inline-flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-cyan-400 hover:text-cyan-300 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 group-hover:gap-3 border border-slate-600/50">
                              <span>Leer más</span>
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </Link>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {totalSlides > 1 && (
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 translate-x-8 group border border-white/20"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-3xl border-2 border-dashed border-white/20">
            <div className="max-w-lg mx-auto">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Próximamente nuevas novedades
              </h3>
              <p className="text-cyan-200 mb-6 text-lg">
                Mantente informado sobre las últimas actualizaciones
              </p>
            </div>
          </div>
        )}

        {/* Botón Ver Más */}
        {novedades.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/novedades"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-600 hover:via-blue-600 hover:to-blue-700 text-white px-10 py-5 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/50"
            >
              <span>VER TODAS LAS NOVEDADES</span>
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
