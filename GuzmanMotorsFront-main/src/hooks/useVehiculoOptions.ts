import { useState, useEffect, useCallback } from "react";
import { VehiculoOptions } from "@/services";
import {
  MARCAS_VEHICULOS,
  MODELOS_POR_MARCA,
  TIPOS_VEHICULO,
  TIPOS_COMBUSTIBLE,
  TIPOS_TRANSMISION,
  TIPOS_TRACCION,
} from "@/data/autocomplete-options";
import { useOptionsCache } from "@/contexts/OptionsCacheContext";

interface UseVehiculoOptionsProps {
  isAdmin?: boolean;
  enableFallback?: boolean;
}

interface UseVehiculoOptionsReturn {
  options: VehiculoOptions | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Opciones de fallback en caso de error
const FALLBACK_OPTIONS: VehiculoOptions = {
  marcas: MARCAS_VEHICULOS,
  modelos: MODELOS_POR_MARCA,
  tipos: TIPOS_VEHICULO,
  combustibles: TIPOS_COMBUSTIBLE,
  transmisiones: TIPOS_TRANSMISION,
  tracciones: TIPOS_TRACCION,
  estados: ["Disponible", "Reservado", "Vendido"],
};

export const useVehiculoOptions = ({
  isAdmin = false,
  enableFallback = true,
}: UseVehiculoOptionsProps = {}): UseVehiculoOptionsReturn => {
  const { getVehiculoOptions } = useOptionsCache();
  const [options, setOptions] = useState<VehiculoOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getVehiculoOptions(isAdmin);

      setOptions(data);
    } catch (err) {
      console.error("Error loading vehicle options:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);

      // Usar opciones de fallback si está habilitado
      if (enableFallback) {
        console.log("Using fallback options due to error");
        setOptions(FALLBACK_OPTIONS);
      }
    } finally {
      setLoading(false);
    }
  }, [isAdmin, enableFallback, getVehiculoOptions]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  return {
    options,
    loading,
    error,
    refetch: fetchOptions,
  };
};

// Hook más específico para obtener modelos por marca
export const useModelosByMarca = (
  marca: string,
  options: VehiculoOptions | null
): string[] => {
  if (!options || !marca) return [];
  return options.modelos[marca] || [];
};

// Función helper para obtener opciones específicas
export const getOptionsFromData = (
  options: VehiculoOptions | null,
  field: keyof VehiculoOptions
): string[] => {
  if (!options) return [];

  const fieldData = options[field];

  // Para el campo modelos, retornar array vacío ya que es un objeto
  if (field === "modelos") return [];

  return Array.isArray(fieldData) ? fieldData : [];
};
