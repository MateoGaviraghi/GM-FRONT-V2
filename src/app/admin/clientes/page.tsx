"use client";

import React from "react";
import { Eye, Plus } from "lucide-react";
import { EstadisticasClientes, CumpleanosHoy } from "@/components";
import { AdminButton, Breadcrumb } from "@/components/admin/kit";

export default function ClientesDashboardPage() {
  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Clientes" }]} />

      {/* Header */}
      <header>
        <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-gray-900">Dashboard de clientes</h1>
        <p className="mt-1.5 text-[16px] text-gray-500">Vista general y estadísticas de clientes</p>
      </header>

      {/* Estadísticas de Clientes */}
      <EstadisticasClientes />

      {/* Widget de Cumpleaños */}
      <CumpleanosHoy />

      {/* Acciones de Gestión de Clientes */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-[16.5px] font-semibold text-gray-900">Gestión de clientes</h2>
        <p className="mb-6 text-[16px] text-gray-500">Registrar y administrar clientes.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AdminButton variant="secondary" icon={Eye} href="/admin/clientes/lista" className="h-auto w-full justify-start py-4">
            Ver clientes
          </AdminButton>
          <AdminButton variant="primary" icon={Plus} href="/admin/clientes/crear" className="h-auto w-full justify-start py-4">
            Crear cliente
          </AdminButton>
        </div>
      </section>
    </div>
  );
}
