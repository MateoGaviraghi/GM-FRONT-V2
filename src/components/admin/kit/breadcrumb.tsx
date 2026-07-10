/**
 * Breadcrumb — Soft SaaS (4R3). Sentence-case 14px gris, separador "/", actual en gris oscuro.
 */

import Link from "next/link";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-2 text-[14px] text-gray-400", className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className="transition-colors duration-150 hover:text-gray-900">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-medium text-gray-900" : undefined}>{item.label}</span>
            )}
            {!isLast ? (
              <span aria-hidden className="text-gray-300">
                /
              </span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}
