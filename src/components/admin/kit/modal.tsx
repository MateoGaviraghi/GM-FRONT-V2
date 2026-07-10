"use client";

/**
 * Modal — Soft SaaS (4R3). Panel blanco rounded-2xl con shadow-xl (sin borde
 * visible), overlay gray-900/40, entrada fade+scale 140ms, ESC + click-fuera,
 * focus trap básico. ConfirmDialog reusa Modal + AdminButton.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminButton } from "./admin-button";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    lastFocused.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      lastFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl outline-none",
          "animate-[gm-modal-in_140ms_ease-out]",
          className
        )}
      >
        {title ? (
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 className="text-[20px] font-semibold text-gray-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex shrink-0 items-center gap-1.5 text-[16px] font-semibold text-gray-500 transition-colors duration-150 hover:text-gray-700"
            >
              <X className="size-5" strokeWidth={2} />
              Cerrar
            </button>
          </div>
        ) : null}
        <div className="text-[16px] text-gray-600">{children}</div>
        {footer ? <div className="mt-6 flex justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}

export type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  danger,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-[16px] text-gray-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <AdminButton variant="secondary" onClick={onClose}>
          Cancelar
        </AdminButton>
        <AdminButton
          variant={danger ? "danger" : "primary"}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </AdminButton>
      </div>
    </Modal>
  );
}
