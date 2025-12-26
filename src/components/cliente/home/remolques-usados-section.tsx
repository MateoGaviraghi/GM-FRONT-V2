"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Mail, MessageCircle, Phone } from "lucide-react";
import type { Remolque, Usados } from "@/types";
import { remolqueService, usadosService } from "@/services";

export function RemolquesUsadosSection() {
  const [currentSlideRemolques, setCurrentSlideRemolques] = useState(0);
  const [currentSlideUsados, setCurrentSlideUsados] = useState(0);
  const [remolques, setRemolques] = useState<Remolque[]>([]);
  const [usados, setUsados] = useState<Usados[]>([]);

  // Cargar remolques desde la API usando el servicio
  useEffect(() => {
    const loadRemolques = async () => {
      try {
        const response = await remolqueService.getPublicRemolques({ limit: 6 });
        setRemolques(response?.items || []);
      } catch (error) {
        console.error("Error cargando remolques:", error);
        setRemolques([]);
      }
    };
    loadRemolques();
  }, []);

  // Cargar usados desde la API usando el servicio
  useEffect(() => {
    const loadUsados = async () => {
      try {
        const response = await usadosService.getPublicUsados({ limit: 6 });
        setUsados(response?.items || []);
      } catch (error) {
        console.error("Error cargando usados:", error);
        setUsados([]);
      }
    };
    loadUsados();
  }, []);

  const itemsPerSlide = 3;
  const totalSlidesRemolques = Math.ceil(remolques.length / itemsPerSlide);
  const totalSlidesUsados = Math.ceil(usados.length / itemsPerSlide);

  const nextSlideRemolques = () => {
    setCurrentSlideRemolques((prev) => (prev + 1) % totalSlidesRemolques);
  };

  const prevSlideRemolques = () => {
    setCurrentSlideRemolques(
      (prev) => (prev - 1 + totalSlidesRemolques) % totalSlidesRemolques
    );
  };

  const nextSlideUsados = () => {
    setCurrentSlideUsados((prev) => (prev + 1) % totalSlidesUsados);
  };

  const prevSlideUsados = () => {
    setCurrentSlideUsados(
      (prev) => (prev - 1 + totalSlidesUsados) % totalSlidesUsados
    );
  };

  return (
    <>
      {/* REMOLQUES - Fondo Oscuro */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div>
            {/* Header con diseño mejorado */}
            <div className="text-center mb-16">
              {/* Logos de empresas de remolques - Responsive */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10 lg:gap-14 mb-8 px-4">
                {/* Logo Red Alcorta */}
                <div className="flex items-center justify-center transition-transform duration-300 hover:scale-110 w-20 h-10 sm:w-28 sm:h-14 md:w-36 md:h-18 lg:w-[240px] lg:h-[120px]">
                  <Image
                    src="/images/logos empresas/logo- RED ALCORTA.png"
                    alt="RED ALCORTA"
                    width={240}
                    height={120}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Logo Sol y Brusa */}
                <div className="flex items-center justify-center transition-transform duration-300 hover:scale-110 w-20 h-10 sm:w-28 sm:h-14 md:w-36 md:h-18 lg:w-[240px] lg:h-[120px]">
                  <Image
                    src="/images/logos empresas/LOGO SOLO Y BRUSA.png"
                    alt="SOL Y BRUSA"
                    width={240}
                    height={120}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Logo Lambert */}
                <div className="flex items-center justify-center transition-transform duration-300 hover:scale-110 w-20 h-10 sm:w-28 sm:h-14 md:w-36 md:h-18 lg:w-[240px] lg:h-[120px]">
                  <Image
                    src="/images/logos empresas/LOGO LAMBERT.png"
                    alt="LAMBERT"
                    width={240}
                    height={120}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <h2 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-white via-cyan-400 to-white bg-clip-text text-transparent mb-6 tracking-tight">
                REMOLQUES
              </h2>

              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-cyan-400 to-cyan-500 rounded-full"></div>
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                <div className="h-1 w-32 bg-gradient-to-l from-transparent via-cyan-400 to-cyan-500 rounded-full"></div>
              </div>
            </div>

            {/* Carrusel de Remolques */}
            {remolques.length > 0 ? (
              <div className="relative">
                {totalSlidesRemolques > 1 && (
                  <button
                    onClick={prevSlideRemolques}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-600 hover:via-cyan-700 hover:to-blue-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 hover:scale-110 -translate-x-8 group"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                  </button>
                )}

                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                      transform: `translateX(-${currentSlideRemolques * 100}%)`,
                    }}
                  >
                    {Array.from({ length: totalSlidesRemolques }).map(
                      (_, slideIndex) => {
                        const itemsInSlide = remolques.slice(
                          slideIndex * itemsPerSlide,
                          (slideIndex + 1) * itemsPerSlide
                        );
                        const shouldCenter =
                          itemsInSlide.length < itemsPerSlide;

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
                              justifyContent: shouldCenter
                                ? "center"
                                : "stretch",
                            }}
                          >
                            {itemsInSlide.map((remolque) => (
                              <Link
                                key={remolque._id}
                                href={`/remolques/${remolque._id}`}
                                className="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 hover:-translate-y-2 max-w-md mx-auto w-full"
                              >
                                {/* Imagen de fondo */}
                                <div className="absolute inset-0">
                                  <Image
                                    src={
                                      remolque.imagenes?.[0]?.secure_url ||
                                      "/images/remolques/alcortaRemolque.webp"
                                    }
                                    alt={remolque.titulo || "Remolque"}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                  />
                                  {/* Overlay oscuro */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-slate-900/40"></div>
                                </div>

                                {/* Contenido sobre la imagen */}
                                <div className="relative h-full min-h-[400px] flex flex-col justify-between p-7">
                                  {/* Badge superior */}
                                  <div className="flex justify-end">
                                    <div className="bg-cyan-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                      Disponible
                                    </div>
                                  </div>

                                  {/* Info inferior */}
                                  <div>
                                    <h3 className="text-2xl font-extrabold text-white mb-4 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
                                      {remolque.titulo}
                                    </h3>
                                    <div className="flex items-center gap-3 flex-wrap mb-4">
                                      {remolque.marca && (
                                        <span className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold text-sm border border-white/20">
                                          {remolque.marca}
                                        </span>
                                      )}
                                      {remolque.tipoCarroceria && (
                                        <span className="bg-cyan-500/20 backdrop-blur-sm text-cyan-300 px-4 py-2 rounded-full font-semibold text-sm border border-cyan-400/30">
                                          {remolque.tipoCarroceria}
                                        </span>
                                      )}
                                    </div>
                                    {/* Botón de ver más */}
                                    <div className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 group-hover:gap-3 shadow-lg">
                                      <span>Ver detalles</span>
                                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {totalSlidesRemolques > 1 && (
                  <button
                    onClick={nextSlideRemolques}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-600 hover:via-cyan-700 hover:to-blue-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 hover:scale-110 -translate-x-8 group"
                    aria-label="Siguiente"
                  >
                    <ChevronRight className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl border-2 border-dashed border-slate-300">
                <div className="max-w-lg mx-auto">
                  <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-10 h-10 text-cyan-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    ¿Buscás un remolque específico?
                  </h3>
                  <p className="text-slate-600 mb-6 text-lg">
                    En este momento no tenemos remolques en stock, pero si te
                    comunicás con nosotros podemos ayudarte a encontrar
                    exactamente lo que necesitás
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                    <a
                      href="https://wa.me/+5493424216850?text=Hola!%20Me%20interesa%20consultar%20sobre%20remolques%20disponibles."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>WHATSAPP</span>
                    </a>
                    <Link
                      href="/contacto"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-4 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>CONTACTANOS</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Botón Ver Más - solo si hay remolques */}
            {remolques.length > 0 && (
              <div className="text-center mt-12 px-4">
                <Link
                  href="/remolques"
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-6 py-3.5 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-xl font-bold text-base sm:text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  <span>VER MÁS REMOLQUES</span>
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* USADOS - Fondo Blanco */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div>
            {/* Header con diseño mejorado */}
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-slate-900 via-cyan-800 to-slate-900 bg-clip-text text-transparent mb-6 tracking-tight">
                USADOS
              </h2>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-cyan-500 to-cyan-600 rounded-full"></div>
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                <div className="h-1 w-32 bg-gradient-to-l from-transparent via-cyan-500 to-cyan-600 rounded-full"></div>
              </div>
            </div>

            {/* Carrusel de Usados */}
            {usados.length > 0 ? (
              <div className="relative">
                {totalSlidesUsados > 1 && (
                  <button
                    onClick={prevSlideUsados}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-600 hover:via-cyan-700 hover:to-blue-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 hover:scale-110 -translate-x-8 group"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                  </button>
                )}

                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                      transform: `translateX(-${currentSlideUsados * 100}%)`,
                    }}
                  >
                    {Array.from({ length: totalSlidesUsados }).map(
                      (_, slideIndex) => {
                        const itemsInSlide = usados.slice(
                          slideIndex * itemsPerSlide,
                          (slideIndex + 1) * itemsPerSlide
                        );
                        const shouldCenter =
                          itemsInSlide.length < itemsPerSlide;

                        return (
                          <div
                            key={slideIndex}
                            className={`min-w-full grid grid-cols-1 md:grid-cols-${
                              itemsInSlide.length
                            } gap-8 px-4 ${
                              shouldCenter ? "justify-items-center" : ""
                            }`}
                            style={{
                              gridTemplateColumns:
                                itemsInSlide.length < 3
                                  ? `repeat(${itemsInSlide.length}, minmax(0, 400px))`
                                  : "repeat(3, minmax(0, 1fr))",
                              justifyContent: shouldCenter
                                ? "center"
                                : "stretch",
                            }}
                          >
                            {itemsInSlide.map((usado) => (
                              <Link
                                key={usado._id}
                                href={`/usados/${usado._id}`}
                                className="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 hover:-translate-y-2 max-w-md mx-auto w-full"
                              >
                                {/* Imagen de fondo */}
                                <div className="absolute inset-0">
                                  <Image
                                    src={
                                      usado.imagenes?.[0]?.secure_url ||
                                      "/images/usados/FotonUsado.webp"
                                    }
                                    alt={usado.titulo || "Vehículo usado"}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                  />
                                  {/* Overlay oscuro */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-slate-900/40"></div>
                                </div>

                                {/* Contenido sobre la imagen */}
                                <div className="relative h-full min-h-[400px] flex flex-col justify-between p-7">
                                  {/* Badge superior */}
                                  <div className="flex justify-end">
                                    <div className="bg-cyan-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                      {usado.anio instanceof Date
                                        ? usado.anio.getFullYear()
                                        : usado.anio}
                                    </div>
                                  </div>

                                  {/* Info inferior */}
                                  <div>
                                    <h3 className="text-2xl font-extrabold text-white mb-4 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
                                      {usado.titulo}
                                    </h3>
                                    <div className="flex items-center gap-3 flex-wrap mb-4">
                                      <span className="bg-cyan-500/20 backdrop-blur-sm text-cyan-300 px-4 py-2 rounded-full font-semibold text-sm border border-cyan-400/30">
                                        {usado.marca}
                                      </span>
                                      {usado.modelo && (
                                        <span className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold text-sm border border-white/20">
                                          {usado.modelo}
                                        </span>
                                      )}
                                    </div>
                                    {/* Botón de ver más */}
                                    <div className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 group-hover:gap-3 shadow-lg">
                                      <span>Ver detalles</span>
                                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {totalSlidesUsados > 1 && (
                  <button
                    onClick={nextSlideUsados}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-600 hover:via-cyan-700 hover:to-blue-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 hover:scale-110 translate-x-8 group"
                    aria-label="Siguiente"
                  >
                    <ChevronRight className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl border-2 border-dashed border-slate-300">
                <div className="max-w-lg mx-auto">
                  <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-10 h-10 text-cyan-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    ¿Buscás un vehículo usado?
                  </h3>
                  <p className="text-slate-600 mb-6 text-lg">
                    En este momento no tenemos vehículos usados en stock, pero
                    si te comunicás con nosotros podemos ayudarte a encontrar
                    exactamente lo que necesitás
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                    <a
                      href="https://wa.me/5493424216850?text=Hola!%20Me%20interesa%20consultar%20sobre%20veh%C3%ADculos%20usados%20disponibles."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>WHATSAPP</span>
                    </a>
                    <Link
                      href="/contacto"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-4 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>CONTACTANOS</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Botón Ver Más - solo si hay usados */}
            {usados.length > 0 && (
              <div className="text-center mt-12 px-4">
                <Link
                  href="/usados"
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-6 py-3.5 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-xl font-bold text-base sm:text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  <span>VER MÁS USADOS</span>
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
