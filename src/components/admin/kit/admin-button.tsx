"use client";

/**
 * AdminButton — Soft SaaS (4R3). Botón propio del kit admin (NO se toca GmButton,
 * que es del sitio público). h-11 (≥44px), texto SIEMPRE, ícono opcional 20px,
 * texto 15.5px semibold, foco ring gray-900/10, transición ≤200ms.
 *
 * Variantes: primary (bg gray-900, texto blanco) · secondary (bordeado,
 * fondo blanco) · danger (bg red-600 texto blanco, para confirmar eliminaciones).
 */

import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AdminButtonIcon = ComponentType<{
  className?: string;
  strokeWidth?: number;
  "aria-hidden"?: boolean;
}>;

export type AdminButtonVariant = "primary" | "secondary" | "danger";

const variantClass: Record<AdminButtonVariant, string> = {
  primary: "bg-gray-900 text-white hover:bg-gray-700",
  secondary: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export type AdminButtonProps = {
  children: ReactNode;
  variant?: AdminButtonVariant;
  icon?: AdminButtonIcon | null;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
};

export function AdminButton({
  children,
  variant = "secondary",
  icon: Icon,
  href,
  type = "button",
  onClick,
  disabled,
  className,
  ariaLabel,
}: AdminButtonProps) {
  const classes = cn(
    "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg px-5 text-[15.5px] font-semibold",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-900/10",
    "disabled:pointer-events-none disabled:opacity-50",
    variantClass[variant],
    className
  );

  const content = (
    <>
      {Icon ? <Icon className="size-5 shrink-0" strokeWidth={2} aria-hidden /> : null}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} aria-label={ariaLabel}>
      {content}
    </button>
  );
}
