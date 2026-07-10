"use client";

/**
 * Toast — Soft SaaS (4R3). ToastProvider monta el stack bottom-right; useToast()
 * expone showToast(). Card blanca rounded-xl con chip de ícono tintado a la
 * izquierda (reemplaza el borde izquierdo de color). Entrada y:16→0 + fade
 * 200ms. Auto-dismiss 5s (más tiempo de lectura para el público objetivo) con
 * línea de progreso; hover pausa.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "warn" | "danger";

export type ToastInput = {
  title?: string;
  message: string;
  variant?: ToastVariant;
};

type ToastData = ToastInput & { id: string };

type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DURATION = 5000;

function iconFor(variant?: ToastVariant) {
  switch (variant) {
    case "success":
      return CheckCircle2;
    case "warn":
      return AlertTriangle;
    case "danger":
      return XCircle;
    default:
      return Info;
  }
}

function chipFor(variant?: ToastVariant) {
  switch (variant) {
    case "success":
      return "bg-emerald-50 text-emerald-600";
    case "warn":
      return "bg-amber-50 text-amber-600";
    case "danger":
      return "bg-red-50 text-red-600";
    default:
      return "bg-indigo-50 text-indigo-600";
  }
}

function barFor(variant?: ToastVariant) {
  switch (variant) {
    case "success":
      return "text-emerald-600";
    case "warn":
      return "text-amber-600";
    case "danger":
      return "text-red-600";
    default:
      return "text-indigo-600";
  }
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = useRef(DURATION);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    timeoutRef.current = setTimeout(() => onDismiss(toast.id), remainingRef.current);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePause() {
    setPaused(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startRef.current));
  }

  function handleResume() {
    setPaused(false);
    startRef.current = Date.now();
    timeoutRef.current = setTimeout(() => onDismiss(toast.id), remainingRef.current);
  }

  const Icon = iconFor(toast.variant);

  return (
    <div
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      className="animate-[gm-toast-in_200ms_ease-out] relative w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <span
          className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", chipFor(toast.variant))}
          aria-hidden
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <div className="flex-1 space-y-0.5">
          {toast.title ? <p className="text-[15.5px] font-semibold text-gray-900">{toast.title}</p> : null}
          <p className="text-[15.5px] text-gray-900">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="flex shrink-0 items-center gap-1 text-[15.5px] font-semibold text-gray-400 transition-colors duration-150 hover:text-gray-600"
        >
          <X className="size-4" strokeWidth={2} />
          Cerrar
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-100">
        <div
          className={cn("h-full bg-current", barFor(toast.variant))}
          style={{
            animationName: "gm-toast-drain",
            animationDuration: `${DURATION}ms`,
            animationTimingFunction: "linear",
            animationFillMode: "forwards",
            animationPlayState: paused ? "paused" : "running",
          }}
        />
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((input: ToastInput) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...input, id }]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
