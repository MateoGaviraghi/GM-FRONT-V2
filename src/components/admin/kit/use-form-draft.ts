"use client";

/**
 * use-form-draft.ts — Mostrador (A0R). Cero pérdida de datos para usuarios
 * grandes: autosave de borrador en localStorage (debounce 1s) + guard de
 * beforeunload si hay cambios sin guardar.
 *
 * useFormDraft(key, values, restore) guarda `values` automáticamente y expone
 * hasDraft/restoreDraft/clearDraft para pintar el banner "Restaurar borrador".
 * `restore` es el callback que el módulo usa para volcar el borrador
 * encontrado sobre su propio estado de formulario (setState/reset de RHF).
 */

import { useCallback, useEffect, useRef, useState } from "react";

const PREFIX = "gm-admin-draft:";

export type UseFormDraftResult = {
  hasDraft: boolean;
  restoreDraft: () => void;
  clearDraft: () => void;
  /** Descarta el aviso sin aplicar el borrador (lo deja guardado igual). */
  dismissDraft: () => void;
};

export function useFormDraft<T>(
  key: string,
  values: T,
  restore: (draft: T) => void,
  debounceMs = 1000
): UseFormDraftResult {
  const storageKey = `${PREFIX}${key}`;
  const [hasDraft, setHasDraft] = useState(false);
  const restoreRef = useRef(restore);
  restoreRef.current = restore;
  const valuesRef = useRef(values);
  valuesRef.current = values;

  // Al montar: si hay un borrador guardado, avisar (una sola vez).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setHasDraft(true);
    } catch {
      // localStorage no disponible (SSR / navegación privada): sin autosave.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Autosave debounced de los valores actuales. Mientras haya un borrador sin
  // resolver (hasDraft=true) NO autoguardamos: si no, el timer pisaría el
  // borrador guardado con el estado vacío/actual antes de que el usuario
  // llegue a tocar "Restaurar borrador" — pérdida de datos silenciosa.
  useEffect(() => {
    if (hasDraft) return;
    const intervalId = setInterval(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(valuesRef.current));
      } catch {
        // Falla silenciosa: no bloquea la carga por un error de storage.
      }
    }, debounceMs);
    return () => clearInterval(intervalId);
  }, [hasDraft, storageKey, debounceMs]);

  const restoreDraft = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const draft = JSON.parse(raw) as T;
      restoreRef.current(draft);
    } catch {
      // Borrador corrupto: se ignora.
    } finally {
      setHasDraft(false);
    }
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // no-op
    }
    setHasDraft(false);
  }, [storageKey]);

  const dismissDraft = useCallback(() => setHasDraft(false), []);

  return { hasDraft, restoreDraft, clearDraft, dismissDraft };
}

/**
 * Bloquea el cierre/recarga accidental de la pestaña cuando hay cambios sin
 * guardar (dirty = true). Los navegadores modernos ignoran el texto custom y
 * muestran su propio mensaje nativo — igual se llama a preventDefault.
 */
export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    function handler(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
}
