"use client";

import React from "react";
import { CrearClienteForm } from "@/components/crear-cliente-form";
import { Breadcrumb } from "@/components/admin/kit";

export default function CrearClientePage() {
  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Clientes", href: "/admin/clientes" },
          { label: "Crear cliente" },
        ]}
      />

      <CrearClienteForm />
    </div>
  );
}
