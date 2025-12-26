/**
 * Hook para obtener opciones de filtros de Novedades
 * Incluye cache automático y manejo de estados
 */

import { useOptionsCache } from "@/contexts/OptionsCacheContext";
import { useState, useEffect, useCallback } from "react";

interface UseNovedadOptionsReturn {
  categorias: string[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useNovedadOptions = (): UseNovedadOptionsReturn => {
  const { getNovedadOptions } = useOptionsCache();
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getNovedadOptions();

      setCategorias(data?.categorias || []);
    } catch (err: unknown) {
      console.error("Error al cargar opciones de novedades:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar opciones";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getNovedadOptions]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  return {
    categorias,
    loading,
    error,
    refetch: fetchOptions,
  };
};
