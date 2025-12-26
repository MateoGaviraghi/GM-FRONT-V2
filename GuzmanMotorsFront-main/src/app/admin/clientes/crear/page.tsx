"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrearClienteForm } from "@/components/crear-cliente-form";
import Link from "next/link";

export default function CrearClientePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
                  <ArrowLeft className="w-4 h-4" />
                  Volver al Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-xl font-bold text-slate-800">
                Crear Nuevo Cliente
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Agregar Cliente
            </h2>
            <p className="text-slate-600">
              Complete el formulario para registrar un nuevo cliente en el sistema
            </p>
          </div>
          
          <CrearClienteForm />
        </div>
      </main>
    </div>
  );
}