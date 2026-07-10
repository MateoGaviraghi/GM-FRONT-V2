"use client";

/**
 * Tabs — Soft SaaS (4R3). Píldoras rounded-lg: inactiva gris, activa bg-gray-100.
 */

import { cn } from "@/lib/utils";

export type TabItem = {
  id: string;
  label: string;
};

export type TabsProps = {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
};

export function Tabs({ items, active, onChange, className }: TabsProps) {
  return (
    <div role="tablist" className={cn("flex gap-1.5", className)}>
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={cn(
              "inline-flex h-10 items-center rounded-lg px-4 text-[15.5px] font-medium transition-colors duration-150",
              isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
