// 🚛 Hook para opciones dinámicas de Remolques
import { useState, useEffect, useMemo } from "react";
import { RemolqueOptions } from "@/services";
import { useOptionsCache } from "@/contexts/OptionsCacheContext";

// Opciones de fallback cuando falla la API
const FALLBACK_OPTIONS: RemolqueOptions = {
  marcas: ["Ford", "Chevrolet", "International", "Freightliner", "Volvo"],
  modelos: {
    Ford: ["F-Series", "Transit", "E-Series"],
    Chevrolet: ["Silverado", "Express"],
    International: ["Durastar", "WorkStar"],
    Freightliner: ["Cascadia", "M2"],
    Volvo: ["VNL", "VHD"],
  },
  categorias: ["Plataforma", "Caja Seca", "Refrigerado", "Tanque", "Volteo"],
  condiciones: ["0KM", "Usado"],
  tiposCarroceria: [
    "Plataforma",
    "Caja Seca",
    "Refrigerado",
    "Tanque",
    "Volteo",
  ],
  estados: ["Disponible", "Reservado"],
};

interface UseRemolqueOptionsConfig {
  isAdmin?: boolean;
  enableFallback?: boolean;
}

export function useRemolqueOptions(config: UseRemolqueOptionsConfig = {}) {
  const { isAdmin = false, enableFallback = true } = config;
  const { getRemolqueOptions } = useOptionsCache();

  const [options, setOptions] = useState<RemolqueOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getRemolqueOptions(isAdmin);

        if (isMounted) {
          setOptions(data);
        }
      } catch (err) {
        console.error("Error fetching remolque options:", err);
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Error al cargar las opciones"
          );
          // Si falla y está habilitado el fallback, usar opciones por defecto
          if (enableFallback) {
            setOptions(FALLBACK_OPTIONS);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOptions();

    return () => {
      isMounted = false;
    };
  }, [isAdmin, enableFallback, getRemolqueOptions]);

  return { options, loading, error };
}

// Hook para obtener modelos por marca
export function useModelosByMarca(
  marca: string,
  options: RemolqueOptions | null
): string[] {
  return useMemo(() => {
    if (!options || !marca) return [];
    return options.modelos[marca] || [];
  }, [marca, options]);
}

// Función helper para extraer opciones de un campo específico
export function getOptionsFromData(
  data: RemolqueOptions | null,
  field: keyof Omit<RemolqueOptions, "modelos">
): string[] {
  if (!data) return [];
  return data[field] || [];
}

// Función helper para extraer todas las marcas
export function getMarcasFromData(data: RemolqueOptions | null): string[] {
  if (!data) return [];
  return data.marcas || [];
}

// Función helper para extraer todos los modelos de una marca
export function getModelosFromData(
  data: RemolqueOptions | null,
  marca: string
): string[] {
  if (!data || !marca) return [];
  return data.modelos[marca] || [];
}
