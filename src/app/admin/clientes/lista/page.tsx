"use client";

import React from "react";
import { Plus } from "lucide-react";
import ListaClientes from "@/components/lista-clientes";
import { AdminButton, Breadcrumb } from "@/components/admin/kit";

export default function ClientesPage() {
  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Clientes", href: "/admin/clientes" },
          { label: "Lista" },
        ]}
      />

      <header className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-gray-900">
            Lista de clientes
          </h1>
          <p className="mt-1.5 text-[16px] text-gray-500">
            Administrá y buscá entre todos los clientes registrados
          </p>
        </div>
        <AdminButton variant="primary" icon={Plus} href="/admin/clientes/crear">
          Crear cliente
        </AdminButton>
      </header>

      <ListaClientes />
    </div>
  );
}
