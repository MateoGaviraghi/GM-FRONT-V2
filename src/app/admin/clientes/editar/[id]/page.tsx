"use client";

import React from "react";
import { useParams } from "next/navigation";
import { EditarClienteForm } from "@/components/editar-cliente-form";
import { Breadcrumb } from "@/components/admin/kit";

export default function EditarClientePage() {
  const params = useParams();
  const clienteId = params.id as string;

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Clientes", href: "/admin/clientes" },
          { label: "Lista", href: "/admin/clientes/lista" },
          { label: "Editar cliente" },
        ]}
      />

      <EditarClienteForm clienteId={clienteId} />
    </div>
  );
}
