/**
 * Badge — Soft SaaS (4R3). Pill rounded-full 13px, tinte pastel por estado,
 * sin borde ni mono ni uppercase.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "success" | "warn" | "danger" | "petrol";

const variantClass: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-600",
  success: "bg-emerald-50 text-emerald-700",
  warn: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-600",
  petrol: "bg-indigo-50 text-indigo-600",
};

export type BadgeProps = {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium",
        variantClass[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
