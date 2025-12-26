"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components";
import {
  LayoutDashboard,
  Users,
  Car,
  Truck,
  LogOut,
  Menu,
  X,
  ChevronRight,
  CarFront,
  Newspaper,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const navigationItems = [
    {
      name: "Dashboard Principal",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin",
      description: "Vista general del sistema",
    },
    {
      name: "Clientes",
      href: "/admin/clientes",
      icon: Users,
      current: pathname.includes("/admin/clientes"),
      description: "Gestión de clientes",
      submenu: [
        { name: "Dashboard", href: "/admin/clientes" },
        { name: "Ver Clientes", href: "/admin/clientes/lista" },
        { name: "Crear Cliente", href: "/admin/clientes/crear" },
      ],
    },
    {
      name: "Vehículos 0km",
      href: "/admin/vehiculos",
      icon: Car,
      current: pathname.includes("/admin/vehiculos"),
      description: "Catálogo de vehículos",
      submenu: [
        { name: "Dashboard", href: "/admin/vehiculos" },
        {
          name: "Gestión Avanzada",
          href: "/admin/vehiculos/lista-avanzada",
        },
        { name: "Crear Vehículo", href: "/admin/vehiculos/crear" },
      ],
    },
    {
      name: "Vehículos Usados",
      href: "/admin/usados",
      icon: CarFront,
      current: pathname.includes("/admin/usados"),
      description: "Inventario de usados",
      submenu: [
        { name: "Dashboard", href: "/admin/usados" },
        {
          name: "Gestión Avanzada",
          href: "/admin/usados/lista-avanzada",
        },
        { name: "Crear Vehículo", href: "/admin/usados/crear" },
      ],
    },
    {
      name: "Remolques",
      href: "/admin/remolques",
      icon: Truck,
      current: pathname.includes("/admin/remolques"),
      description: "Inventario de remolques",
      submenu: [
        { name: "Dashboard", href: "/admin/remolques" },
        {
          name: "Gestión Avanzada",
          href: "/admin/remolques/lista-avanzada",
        },
        { name: "Crear Remolque", href: "/admin/remolques/crear" },
      ],
    },
    {
      name: "Novedades",
      href: "/admin/novedades",
      icon: Newspaper,
      current: pathname.includes("/admin/novedades"),
      description: "Gestión de novedades",
      submenu: [
        { name: "Dashboard", href: "/admin/novedades" },
        { name: "Ver Todas", href: "/admin/novedades/lista" },
        { name: "Eliminadas", href: "/admin/novedades/eliminadas" },
        { name: "Crear Novedad", href: "/admin/novedades/crear" },
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
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar móvil */}
        <div className={`lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
          <div className="fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />

            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                <div className="flex items-center gap-3 px-4 mb-6">
                  <div className="h-10 w-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <LayoutDashboard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-gray-800">
                      Panel Admin
                    </span>
                    <p className="text-xs text-gray-500">Guzman Motors</p>
                  </div>
                </div>

                <nav className="space-y-1 px-3">
                  {navigationItems.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-all ${
                          item.current
                            ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-sm"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <div className="flex items-center">
                          <item.icon
                            className={`mr-3 h-5 w-5 ${
                              item.current
                                ? "text-cyan-600"
                                : "text-gray-400 group-hover:text-gray-600"
                            }`}
                          />
                          <div>
                            <div>{item.name}</div>
                            <div className="text-xs text-gray-500">
                              {item.description}
                            </div>
                          </div>
                        </div>
                        {item.submenu && (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </Link>

                      {/* Submenu móvil */}
                      {item.submenu && item.current && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.href}
                              href={subitem.href}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-cyan-600 hover:bg-gray-50 rounded-md transition-colors"
                              onClick={() => setSidebarOpen(false)}
                            >
                              {subitem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Logout móvil */}
              <div className="px-3 pb-4 border-t border-gray-200 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col lg:bg-white lg:shadow-xl lg:border-r lg:border-gray-200">
          <div className="flex min-h-0 flex-1 flex-col">
            {/* Header del sidebar */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
              <div className="h-12 w-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <LayoutDashboard className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-800 block">
                  Panel Admin
                </span>
                <p className="text-xs text-gray-600">Guzman Motors</p>
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <nav className="flex-1 space-y-2 px-4">
                {navigationItems.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                        item.current
                          ? "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-sm border border-cyan-100"
                          : "text-gray-700 hover:bg-gray-50 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center flex-1">
                        <div
                          className={`p-2 rounded-lg mr-3 ${
                            item.current
                              ? "bg-cyan-100"
                              : "bg-gray-100 group-hover:bg-gray-200"
                          }`}
                        >
                          <item.icon
                            className={`h-5 w-5 ${
                              item.current
                                ? "text-cyan-600"
                                : "text-gray-500 group-hover:text-gray-700"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      {item.submenu && (
                        <ChevronRight
                          className={`h-4 w-4 ${
                            item.current ? "text-cyan-600" : "text-gray-400"
                          }`}
                        />
                      )}
                    </Link>

                    {/* Submenu desktop */}
                    {item.submenu && item.current && (
                      <div className="ml-12 mt-2 space-y-1 border-l-2 border-cyan-200 pl-4">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                              pathname === subitem.href
                                ? "text-cyan-700 bg-cyan-50 font-medium"
                                : "text-gray-600 hover:text-cyan-600 hover:bg-gray-50"
                            }`}
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Sección inferior con logout */}
              <div className="px-4 pt-4 border-t border-gray-200 mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full group flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all hover:shadow-sm"
                >
                  <div className="p-2 rounded-lg mr-3 bg-red-50 group-hover:bg-red-100">
                    <LogOut className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Cerrar Sesión</div>
                    <div className="text-xs text-red-500">
                      Salir del sistema
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="lg:pl-72">
          {/* Header móvil */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
            <button
              type="button"
              className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-cyan-600" />
              <span className="text-lg font-semibold text-gray-800">
                Dashboard
              </span>
            </div>
            <div className="w-10" /> {/* Spacer para centrar */}
          </div>

          {/* Contenido de la página */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
