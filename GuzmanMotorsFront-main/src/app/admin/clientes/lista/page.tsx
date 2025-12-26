"use client";

import React from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ListaClientes from "@/components/lista-clientes";

export default function ClientesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación - Responsive */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-16 py-4 sm:py-0 gap-4 sm:gap-0">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Link href="/admin">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-800 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Volver al Dashboard</span>
                  <span className="sm:hidden">Volver</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-300 hidden sm:block"></div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-800">
                Gestión de Clientes
              </h1>
            </div>
            <Link href="/admin/clientes/crear" className="w-full sm:w-auto">
              <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                Crear Cliente
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido Principal - Responsive */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              Lista de Clientes
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Administra y busca entre todos los clientes registrados
            </p>
          </div>

          <ListaClientes />
        </div>
      </main>
    </div>
  );
}
