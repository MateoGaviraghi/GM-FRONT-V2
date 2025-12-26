"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Newspaper,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
} from "lucide-react";
import { novedadService } from "@/services";
import type { Novedad } from "@/types";

interface NovedadesDestacadasWidgetProps {
  limite?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function NovedadesDestacadasWidget({
  limite = 5,
  autoPlay = true,
  autoPlayInterval = 5000,
}: NovedadesDestacadasWidgetProps) {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const cargarNovedades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await novedadService.public.getFeatured(limite);
      setNovedades(data);
    } catch (err) {
      console.error("Error cargando novedades destacadas:", err);
      setError("Error al cargar novedades destacadas");
    } finally {
      setLoading(false);
    }
  }, [limite]);

  useEffect(() => {
    cargarNovedades();
  }, [cargarNovedades]);

  useEffect(() => {
    if (!autoPlay || novedades.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, autoPlayInterval, novedades.length, currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === novedades.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? novedades.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Novedades Destacadas
            </h2>
          </div>
        </div>
        <div className="aspect-[16/9] bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Cargando novedades...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || novedades.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Novedades Destacadas
            </h2>
          </div>
        </div>
        <div className="p-12 text-center bg-slate-50">
          <Newspaper className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">
            No hay novedades destacadas disponibles
          </p>
        </div>
      </div>
    );
  }

  const novedadActual = novedades[currentIndex];

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl shadow-orange-500/30">
              <Star className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">
              Novedades Destacadas
            </h2>
          </div>
          <Link
            href="/novedades?destacada=true"
            className="text-cyan-400 hover:text-cyan-300 font-bold text-sm flex items-center gap-1.5 transition-colors"
          >
            Ver todas
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Carousel mejorado */}
      <div className="relative group">
        {/* Imagen principal con mejor calidad */}
        <Link href={`/novedades/${novedadActual._id}`}>
          <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
            {novedadActual.imagenes &&
            novedadActual.imagenes.length > 0 &&
            novedadActual.imagenes[0].thumbnails?.large ? (
              <Image
                src={novedadActual.imagenes[0].thumbnails.large}
                alt={novedadActual.titulo}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                quality={100}
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                <Newspaper className="h-28 w-28 text-slate-400" />
              </div>
            )}

            {/* Overlay gradient mejorado */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/50 to-transparent"></div>

            {/* Contenido sobre la imagen mejorado */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              {/* Badge destacada mejorado */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-black rounded-full shadow-2xl shadow-orange-500/50">
                  <Sparkles className="h-5 w-5" />
                  Destacada
                </span>
                {novedadActual.categoria && (
                  <span className="inline-block px-5 py-2 bg-cyan-500/90 backdrop-blur-sm text-white text-sm font-bold rounded-full shadow-lg">
                    {novedadActual.categoria}
                  </span>
                )}
              </div>

              {/* Título */}
              <h3 className="text-3xl font-black mb-3 line-clamp-2">
                {novedadActual.titulo}
              </h3>

              {/* Resumen */}
              {novedadActual.resumen && (
                <p className="text-slate-200 text-base mb-4 line-clamp-2">
                  {novedadActual.resumen}
                </p>
              )}

              {/* Metadatos */}
              <div className="flex items-center gap-5 text-sm text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(novedadActual.fechaPublicacion)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {novedadActual.vistas}
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Controles de navegación mejorados */}
        {novedades.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/95 hover:bg-white rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-7 w-7 text-slate-900" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/95 hover:bg-white rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-7 w-7 text-slate-900" />
            </button>
          </>
        )}

        {/* Indicadores de slides mejorados */}
        {novedades.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5">
            {novedades.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white w-10 shadow-xl"
                    : "bg-white/40 w-2.5 hover:bg-white/70 hover:w-6"
                }`}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails de otras novedades mejorados */}
      {novedades.length > 1 && (
        <div className="p-6 bg-gradient-to-br from-slate-50 to-white border-t border-slate-200">
          <div className="grid grid-cols-4 gap-4">
            {novedades.slice(0, 4).map((novedad, index) => (
              <button
                key={novedad._id}
                onClick={() => goToSlide(index)}
                className={`relative aspect-video rounded-2xl overflow-hidden transition-all duration-300 border-2 ${
                  currentIndex === index
                    ? "ring-4 ring-cyan-500 scale-95 border-cyan-500 shadow-xl shadow-cyan-500/50"
                    : "opacity-70 hover:opacity-100 hover:scale-95 border-slate-300 hover:border-cyan-400 shadow-lg"
                }`}
              >
                {novedad.imagenes &&
                novedad.imagenes.length > 0 &&
                novedad.imagenes[0].thumbnails?.small ? (
                  <Image
                    src={novedad.imagenes[0].thumbnails.small}
                    alt={novedad.titulo}
                    fill
                    className="object-cover"
                    quality={100}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <Newspaper className="h-8 w-8 text-slate-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
