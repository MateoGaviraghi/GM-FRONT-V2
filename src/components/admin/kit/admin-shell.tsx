"use client";

/**
 * AdminShell — Soft SaaS (4R3). Sidebar blanca + fondo gris suave.
 */

import { useState, type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminNavIcon = ComponentType<{
  className?: string;
  strokeWidth?: number;
}>;

export type AdminNavChild = {
  label: string;
  href: string;
};

export type AdminNavItem = {
  label: string;
  href: string;
  icon?: AdminNavIcon;
  children?: AdminNavChild[];
};

export type AdminShellProps = {
  children: ReactNode;
  navItems: AdminNavItem[];
  /** Logo de la marca, arriba de la sidebar (el módulo real pasa <Image/> con su propia compensación -ml). */
  logoSlot?: ReactNode;
  /** Slot al pie de la sidebar, con borde superior — logout. */
  sidebarFooterSlot?: ReactNode;
  /** Breadcrumb del topbar. */
  breadcrumbSlot?: ReactNode;
  /** Email de usuario + logout del topbar. */
  userSlot?: ReactNode;
  className?: string;
};

function isItemActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  children,
  navItems,
  logoSlot,
  sidebarFooterSlot,
  breadcrumbSlot,
  userSlot,
  className,
}: AdminShellProps) {
  const pathname = usePathname() ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const active = isItemActive(pathname, item.href);
        return (
          <div key={item.href}>
            {index === 0 ? (
              <p className="px-3 pt-2 pb-2 text-[12px] font-semibold uppercase tracking-wide text-gray-400">
                Menú principal
              </p>
            ) : null}
            {index === 1 ? (
              <p className="px-3 pt-5 pb-2 text-[12px] font-semibold uppercase tracking-wide text-gray-400">
                Módulos
              </p>
            ) : null}
            <Link
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex h-11 items-center gap-3 rounded-lg px-3 text-[15.5px] font-medium transition-colors duration-150",
                active
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {Icon ? (
                <Icon
                  className={cn("size-5 shrink-0", active ? "text-gray-700" : "text-gray-400")}
                  strokeWidth={1.75}
                />
              ) : null}
              <span className="truncate">{item.label}</span>
            </Link>

            {item.children && item.children.length > 0 ? (
              <div className="ml-8 flex flex-col gap-0.5">
                {item.children.map((child) => {
                  const childActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex h-10 items-center rounded-lg px-3 text-[15px] transition-colors duration-150",
                        childActive
                          ? "bg-gray-50 font-medium text-gray-900"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className={cn("min-h-screen bg-[#F6F7F9]", className)}>
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-gray-100 bg-white lg:flex">
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-gray-100 px-5">{logoSlot}</div>
        {nav}
        {sidebarFooterSlot ? (
          <div className="border-t border-gray-100 p-3">{sidebarFooterSlot}</div>
        ) : null}
      </aside>

      {/* Sidebar mobile (overlay) */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-gray-900/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[300px] flex-col border-r border-gray-100 bg-white">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-5">
              {logoSlot}
              <button
                type="button"
                className="flex h-11 items-center gap-1.5 text-[16px] font-semibold text-gray-500 transition-colors duration-150 hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-5" strokeWidth={2} />
                Cerrar
              </button>
            </div>
            {nav}
            {sidebarFooterSlot ? (
              <div className="border-t border-gray-100 p-3">{sidebarFooterSlot}</div>
            ) : null}
          </aside>
        </div>
      ) : null}

      {/* Columna de contenido */}
      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-gray-100 bg-white px-6 lg:px-8">
          <button
            type="button"
            className="flex h-11 items-center gap-1.5 text-[16px] font-semibold text-gray-700 transition-colors duration-150 hover:text-gray-900 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" strokeWidth={2} />
            Menú
          </button>

          <div className="flex min-w-0 items-center gap-2 truncate">
            {breadcrumbSlot}
          </div>

          <div className="flex-1" />

          {userSlot}
        </header>

        <main className="mx-auto w-full max-w-[1240px] px-6 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
