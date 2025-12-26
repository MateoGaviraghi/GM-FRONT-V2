"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Newspaper, Calendar, Eye, Clock, Sparkles } from "lucide-react";
import { novedadService } from "@/services";
import type { Novedad } from "@/types";

interface NovedadesRecientesWidgetProps {
  limite?: number;
  showImage?: boolean;
}

export function NovedadesRecientesWidget({
  limite = 5,
  showImage = true,
}: NovedadesRecientesWidgetProps) {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarNovedades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await novedadService.public.getRecent(limite);
      setNovedades(data);
    } catch (err) {
      console.error("Error cargando novedades recientes:", err);
      setError("Error al cargar novedades recientes");
    } finally {
      setLoading(false);
    }
  }, [limite]);

  useEffect(() => {
    cargarNovedades();
  }, [cargarNovedades]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysAgo = (date: Date | string) => {
    const now = new Date();
    const publishDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - publishDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return formatDate(date);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Novedades Recientes
            </h2>
          </div>
        </div>
        <div className="p-12">
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
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Novedades Recientes
            </h2>
          </div>
        </div>
        <div className="p-12 text-center bg-slate-50">
          <Newspaper className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">
            No hay novedades recientes disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-xl shadow-cyan-500/30">
              <Clock className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">
              Novedades Recientes
            </h2>
          </div>
          <Link
            href="/novedades"
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

      {/* Lista de novedades mejorada */}
      <div className="divide-y divide-slate-200">
        {novedades.map((novedad, idx) => (
          <Link
            key={novedad._id}
            href={`/novedades/${novedad._id}`}
            className={`block p-6 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 group ${
              idx === 0 ? "bg-gradient-to-r from-cyan-50/50 to-blue-50/50" : ""
            }`}
          >
            <div className="flex gap-5">
              {/* Imagen con mejor calidad */}
              {showImage && (
                <div className="relative w-32 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  {novedad.imagenes &&
                  novedad.imagenes.length > 0 &&
                  novedad.imagenes[0].thumbnails?.small ? (
                    <Image
                      src={novedad.imagenes[0].thumbnails.small}
                      alt={novedad.titulo}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      quality={100}
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                      <Newspaper className="h-10 w-10 text-slate-400" />
                    </div>
                  )}
                  {/* Overlay en hover */}
                  <div className="absolute inset-0 bg-cyan-600/0 group-hover:bg-cyan-600/20 transition-colors duration-300"></div>
                </div>
              )}

              {/* Contenido mejorado */}
              <div className="flex-1 min-w-0">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {idx === 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      Nuevo
                    </span>
                  )}
                  {novedad.destacada && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                      <Sparkles className="h-3 w-3 fill-current" />
                      Destacada
                    </span>
                  )}
                  {novedad.categoria && (
                    <span className="px-2.5 py-1 bg-slate-200 group-hover:bg-cyan-200 text-slate-700 group-hover:text-cyan-800 text-xs font-bold rounded-full transition-colors">
                      {novedad.categoria}
                    </span>
                  )}
                </div>

                {/* Título mejorado */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition-colors mb-2 line-clamp-2 leading-tight">
                  {novedad.titulo}
                </h3>

                {/* Resumen si existe */}
                {novedad.resumen && (
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {novedad.resumen}
                  </p>
                )}

                {/* Meta info mejorada */}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    {getDaysAgo(novedad.fechaPublicacion)}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Eye className="h-3.5 w-3.5" />
                    {novedad.vistas}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer mejorado */}
      <div className="p-5 bg-gradient-to-br from-slate-50 to-white border-t border-slate-200">
        <Link
          href="/novedades"
          className="block text-center px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-105"
        >
          Ver todas las novedades →
        </Link>
      </div>
    </div>
  );
}
