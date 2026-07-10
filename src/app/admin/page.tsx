"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Shield,
  AlertCircle,
  Check,
  Users,
  Truck,
  CarFront,
  Newspaper,
  List,
  Plus,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/hooks";
import { Badge, Breadcrumb, Skeleton, AdminButton } from "@/components/admin/kit";
import {
  ClienteService,
  remolqueService,
  usadosService,
  novedadAdminService,
} from "@/services";

type StatKey = "clientes" | "remolques" | "usados" | "novedades";

const statCards: {
  key: StatKey;
  label: string;
  href: string;
  icon: LucideIcon;
  chip: string;
}[] = [
  {
    key: "clientes",
    label: "Clientes",
    href: "/admin/clientes",
    icon: Users,
    chip: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "remolques",
    label: "Remolques",
    href: "/admin/remolques/lista-avanzada",
    icon: Truck,
    chip: "bg-indigo-50 text-indigo-600",
  },
  {
    key: "usados",
    label: "Usados",
    href: "/admin/usados/lista-avanzada",
    icon: CarFront,
    chip: "bg-amber-50 text-amber-600",
  },
  {
    key: "novedades",
    label: "Novedades",
    href: "/admin/novedades",
    icon: Newspaper,
    chip: "bg-violet-50 text-violet-600",
  },
];

const moduleCards: {
  icon: LucideIcon;
  chip: string;
  title: string;
  description: string;
  listHref: string;
  createHref: string;
  extra?: { label: string; href: string; icon: LucideIcon };
}[] = [
  {
    icon: Users,
    chip: "bg-emerald-50 text-emerald-600",
    title: "Clientes",
    description: "Alta, edición y búsqueda de clientes.",
    listHref: "/admin/clientes/lista",
    createHref: "/admin/clientes/crear",
  },
  {
    icon: Truck,
    chip: "bg-indigo-50 text-indigo-600",
    title: "Remolques",
    description: "Alta, edición y gestión del catálogo de remolques.",
    listHref: "/admin/remolques/lista-avanzada",
    createHref: "/admin/remolques/crear",
  },
  {
    icon: CarFront,
    chip: "bg-amber-50 text-amber-600",
    title: "Vehículos Usados",
    description: "Alta, edición y gestión de vehículos usados.",
    listHref: "/admin/usados/lista-avanzada",
    createHref: "/admin/usados/crear",
  },
  {
    icon: Newspaper,
    chip: "bg-violet-50 text-violet-600",
    title: "Novedades",
    description: "Publicación y gestión de novedades del sitio.",
    listHref: "/admin/novedades/lista",
    createHref: "/admin/novedades/crear",
    extra: { label: "Eliminadas", href: "/admin/novedades/eliminadas", icon: Trash2 },
  },
];

const adminFeatures = [
  "Gestión completa de clientes (crear, editar, eliminar)",
  "Gestión de vehículos 0km, remolques y usados",
  "Subida y gestión de imágenes (Cloudinary)",
  "Acceso a estadísticas y reportes completos",
];

const userFeatures = [
  "Visualización de información de clientes",
  "Consulta de catálogos de vehículos",
  "Edición y eliminación de registros (requiere admin)",
  "Gestión de imágenes (requiere admin)",
];

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [counts, setCounts] = useState<Record<StatKey, number | null> | null>(null);

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      ClienteService.count(),
      remolqueService.getAllRemolques({ page: 1, limit: 1 }),
      usadosService.getAllUsados({ page: 1, limit: 1 }),
      novedadAdminService.list({ page: 1, limit: 1 }),
    ]).then(([clientes, remolques, usados, novedades]) => {
      if (!active) return;
      setCounts({
        clientes: clientes.status === "fulfilled" ? clientes.value : null,
        remolques: remolques.status === "fulfilled" ? remolques.value.total : null,
        usados: usados.status === "fulfilled" ? usados.value.total : null,
        novedades: novedades.status === "fulfilled" ? novedades.value.total : null,
      });
    });

    return () => {
      active = false;
    };
  }, []);

  // El loading ya lo maneja ProtectedRoute en el layout
  // Solo verificamos que user exista
  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
          <p className="text-[16px] text-gray-500">Cargando información...</p>
        </div>
      </div>
    );
  }

  const fecha = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="pb-16">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Dashboard" }]} />

      {/* Header */}
      <div className="mt-8">
        <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-gray-900">
          Bienvenido, {user.nombre} 👋
        </h1>
        <p className="mt-1.5 text-[16px] text-gray-500">Panel de administración - Guzman Motors</p>
        <p className="mt-0.5 text-[15px] text-gray-400">{fecha}</p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.key} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[14px] text-gray-500">{stat.label}</p>
              <div className={`flex size-10 items-center justify-center rounded-lg ${stat.chip}`}>
                <stat.icon className="size-5" strokeWidth={1.75} />
              </div>
            </div>
            {counts === null ? (
              <Skeleton className="mt-2 h-9 w-16" />
            ) : (
              <p className="mt-2 text-[28px] font-semibold tracking-tight text-gray-900">
                {counts[stat.key] ?? "—"}
              </p>
            )}
            <Link
              className="mt-4 inline-block text-[14.5px] font-medium text-gray-500 hover:text-gray-900"
              href={stat.href}
            >
              Ver todos →
            </Link>
          </div>
        ))}
      </div>

      {/* Accesos rápidos */}
      <section className="mt-10">
        <h2 className="text-[16.5px] font-semibold text-gray-900">Accesos rápidos</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {moduleCards.map((mod) => (
            <div
              key={mod.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className={`flex size-10 items-center justify-center rounded-lg ${mod.chip}`}>
                <mod.icon className="size-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-[16.5px] font-semibold text-gray-900">{mod.title}</h3>
              <p className="mt-1 text-[15px] text-gray-500">{mod.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <AdminButton variant="secondary" icon={List} href={mod.listHref}>
                  Ver lista
                </AdminButton>
                <AdminButton variant="primary" icon={Plus} href={mod.createHref}>
                  Crear nuevo
                </AdminButton>
                {mod.extra ? (
                  <AdminButton variant="secondary" icon={mod.extra.icon} href={mod.extra.href}>
                    {mod.extra.label}
                  </AdminButton>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tu cuenta — Información del Usuario */}
      <section className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <User className="size-6 text-gray-400" strokeWidth={2} />
          <div>
            <h2 className="text-[16.5px] font-semibold text-gray-900">Información del usuario</h2>
            <p className="mt-0.5 text-[16px] text-gray-500">Datos de tu cuenta en el sistema</p>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <dt className="text-[13px] font-medium text-gray-400">Nombre</dt>
            <dd className="mt-1 text-[16px] text-gray-900">{user.nombre}</dd>
          </div>
          <div>
            <dt className="text-[13px] font-medium text-gray-400">Email</dt>
            <dd className="mt-1 text-[16px] text-gray-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-[13px] font-medium text-gray-400">Rol</dt>
            <dd className="mt-1 flex items-center gap-2 text-[16px] text-gray-900">
              <Shield className="size-5 text-gray-400" strokeWidth={2} />
              <Badge variant={user.role === "admin" ? "success" : "petrol"}>
                {user.role === "admin" ? "Administrador" : "Usuario"}
              </Badge>
            </dd>
          </div>
        </dl>
      </section>

      {/* Tu acceso — mensaje por rol + funcionalidades disponibles */}
      <section className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {isAdmin ? (
          <div className="flex items-start gap-3">
            <Shield className="mt-1 size-6 shrink-0 text-gray-400" strokeWidth={2} />
            <div>
              <h3 className="mb-2 text-[16.5px] font-semibold text-gray-900">
                Panel de administrador
              </h3>
              <p className="text-[16px] text-gray-500">
                Tenés acceso completo a todas las funcionalidades del sistema. Usá el menú
                lateral para navegar entre las diferentes secciones: Clientes, Vehículos 0km,
                Remolques y Usados.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-1 size-6 shrink-0 text-amber-600" strokeWidth={2} />
            <div>
              <h3 className="mb-2 text-[16.5px] font-semibold text-amber-700">Acceso limitado</h3>
              <p className="mb-3 text-[16px] text-gray-500">
                Tu cuenta tiene permisos de usuario. Solo podés acceder a funciones de consulta y
                visualización de información.
              </p>
              <p className="text-[16px] font-semibold text-amber-700">
                Para solicitar permisos de administrador, contactá al administrador del sistema.
              </p>
            </div>
          </div>
        )}

        <h3 className="mt-6 mb-2 text-[16.5px] font-semibold text-gray-900">
          Funcionalidades disponibles
        </h3>
        <ul>
          {(isAdmin ? adminFeatures : userFeatures).map((text) => (
            <li key={text} className="flex items-center gap-3 py-3">
              <Check className="size-5 text-emerald-600" strokeWidth={2} />
              <span className="text-[16px] text-gray-900">{text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
