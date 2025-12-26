"use client";

import Link from "next/link";
import { Tag, Newspaper, TrendingUp } from "lucide-react";
import { useNovedadOptions } from "@/hooks";

interface NovedadesCategoriasWidgetProps {
  showCount?: boolean;
  maxCategorias?: number;
}

export function NovedadesCategoriasWidget({
  showCount = false,
  maxCategorias = 10,
}: NovedadesCategoriasWidgetProps) {
  const { categorias, loading, error } = useNovedadOptions();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Categorías</h2>
          </div>
        </div>
        <div className="p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Cargando categorías...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || categorias.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Categorías</h2>
          </div>
        </div>
        <div className="p-12 text-center bg-slate-50">
          <Newspaper className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">
            No hay categorías disponibles
          </p>
        </div>
      </div>
    );
  }

  const categoriasAMostrar = categorias.slice(0, maxCategorias);

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl shadow-purple-500/30">
            <Tag className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Categorías</h2>
            <p className="text-slate-400 text-sm mt-1">
              Explora novedades por temas
            </p>
          </div>
        </div>
      </div>

      {/* Lista de categorías mejorada */}
      <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex flex-wrap gap-3">
          {categoriasAMostrar.map((categoria, idx) => (
            <Link
              key={categoria}
              href={`/novedades?categoria=${encodeURIComponent(
                categoria
              )}`}
              className="group relative"
            >
              <div className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-600 border-2 border-slate-200 hover:border-transparent text-slate-700 hover:text-white rounded-2xl transition-all duration-300 font-bold text-sm shadow-md hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105">
                <Tag className="h-4 w-4" />
                {categoria}
                {showCount && (
                  <span className="px-2.5 py-0.5 bg-slate-200 group-hover:bg-white/20 text-slate-600 group-hover:text-white rounded-full text-xs font-bold transition-colors">
                    {/* Aquí se podría mostrar el conteo si el backend lo provee */}
                  </span>
                )}
                {idx === 0 && (
                  <TrendingUp className="h-4 w-4 text-purple-500 group-hover:text-white" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer mejorado */}
      <div className="p-5 bg-white border-t border-slate-200">
        <Link
          href="/novedades"
          className="block text-center px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105"
        >
          Ver todas las novedades →
        </Link>
      </div>
    </div>
  );
}
