"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProtectedRoute } from "@/components";
import {
  LayoutDashboard,
  Users,
  Truck,
  LogOut,
  CarFront,
  Newspaper,
} from "lucide-react";
import { AdminShell, ToastProvider, type AdminNavItem } from "@/components/admin/kit";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    setUserEmail(localStorage.getItem("userEmail"));
  }, []);

  // Si estamos en la página de login, solo renderizar children sin sidebar
  const isLoginPage = pathname === "/admin/login";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    // Borrar cookie del token
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/admin/login";
  };

  const navigationItems: AdminNavItem[] = [
    {
      label: "Dashboard Principal",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Clientes",
      href: "/admin/clientes",
      icon: Users,
      children: [
        { label: "Dashboard", href: "/admin/clientes" },
        { label: "Ver Clientes", href: "/admin/clientes/lista" },
        { label: "Crear Cliente", href: "/admin/clientes/crear" },
      ],
    },
    {
      label: "Vehículos Usados",
      href: "/admin/usados",
      icon: CarFront,
      children: [
        { label: "Dashboard", href: "/admin/usados" },
        {
          label: "Gestión Avanzada",
          href: "/admin/usados/lista-avanzada",
        },
        { label: "Crear Vehículo", href: "/admin/usados/crear" },
      ],
    },
    {
      label: "Remolques",
      href: "/admin/remolques",
      icon: Truck,
      children: [
        { label: "Dashboard", href: "/admin/remolques" },
        {
          label: "Gestión Avanzada",
          href: "/admin/remolques/lista-avanzada",
        },
        { label: "Crear Remolque", href: "/admin/remolques/crear" },
      ],
    },
    {
      label: "Novedades",
      href: "/admin/novedades",
      icon: Newspaper,
      children: [
        { label: "Dashboard", href: "/admin/novedades" },
        { label: "Ver Todas", href: "/admin/novedades/lista" },
        { label: "Eliminadas", href: "/admin/novedades/eliminadas" },
        { label: "Crear Novedad", href: "/admin/novedades/crear" },
      ],
    },
  ];

  // Si es página de login, renderizar sin sidebar pero sin quitarle protección aquí
  // (el login no necesita protección, pero las demás rutas sí)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Para todas las demás rutas, aplicar ProtectedRoute
  return (
    <ProtectedRoute>
      <ToastProvider>
      <AdminShell
        navItems={navigationItems}
        logoSlot={
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image
              src="/images/logo/logoGM-Photoroom.png"
              alt="Guzmán Motors"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-[17px] font-semibold tracking-tight text-gray-900">
              Guzmán Motors
            </span>
          </Link>
        }
        sidebarFooterSlot={
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-[15.5px] font-medium text-gray-600 transition-colors duration-150 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="size-5" strokeWidth={1.75} />
            Cerrar sesión
          </button>
        }
        userSlot={
          userEmail ? (
            <span className="text-[14px] text-gray-500">{userEmail}</span>
          ) : null
        }
      >
        {children}
      </AdminShell>
      </ToastProvider>
    </ProtectedRoute>
  );
}
