"use client";

import React from "react";
import { CreateUserForm } from "@/components/create-user-form";
import { Breadcrumb } from "@/components/admin/kit";
import { AdminRoute } from "@/components/auth";

export default function CrearUsuarioPage() {
  return (
    <AdminRoute>
      <div className="space-y-8 pb-16">
        <Breadcrumb
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Usuarios" },
            { label: "Crear usuario" },
          ]}
        />

        <CreateUserForm />
      </div>
    </AdminRoute>
  );
}
