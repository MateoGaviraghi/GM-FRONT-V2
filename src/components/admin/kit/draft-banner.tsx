"use client";

/**
 * DraftBanner — Soft SaaS (4R3). Aviso "Restaurar borrador" para usar junto a
 * useFormDraft. Texto explícito, dos botones con texto (Restaurar / Descartar).
 */

import { FileClock } from "lucide-react";

export type DraftBannerProps = {
  onRestore: () => void;
  onDismiss: () => void;
  className?: string;
};

export function DraftBanner({ onRestore, onDismiss, className }: DraftBannerProps) {
  return (
    <div
      className={
        "flex flex-col gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-[15.5px] text-indigo-700 sm:flex-row sm:items-center sm:justify-between " +
        (className ?? "")
      }
    >
      <div className="flex items-start gap-3">
        <FileClock className="mt-0.5 size-5 shrink-0 text-indigo-600" strokeWidth={2} aria-hidden />
        <p className="text-[15.5px] text-indigo-700">
          Encontramos cambios sin guardar de una carga anterior. ¿Querés continuar donde lo dejaste?
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onDismiss}
          className="h-12 text-[15.5px] font-semibold text-gray-500 transition-colors duration-150 hover:text-gray-700"
        >
          Descartar
        </button>
        <button
          type="button"
          onClick={onRestore}
          className="h-12 text-[15.5px] font-semibold text-indigo-700"
        >
          Restaurar borrador
        </button>
      </div>
    </div>
  );
}
