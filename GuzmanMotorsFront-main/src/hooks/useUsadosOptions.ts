// 🚗 Hook para opciones dinámicas de Vehículos Usados
import { useState, useEffect, useMemo } from "react";
import { UsadosOptions } from "@/services";
import { useOptionsCache } from "@/contexts/OptionsCacheContext";

// Opciones de fallback cuando falla la API
const FALLBACK_OPTIONS: UsadosOptions = {
  marcas: ["Toyota", "Ford", "Chevrolet", "Volkswagen", "Fiat", "Renault"],
  modelos: {
    Toyota: ["Hilux", "Corolla", "RAV4", "Etios", "Yaris"],
    Ford: ["Ranger", "Focus", "Fiesta", "EcoSport", "Mondeo"],
    Chevrolet: ["S10", "Cruze", "Onix", "Tracker", "Spin"],
    Volkswagen: ["Amarok", "Gol", "Polo", "Vento", "Tiguan"],
    Fiat: ["Toro", "Cronos", "Argo", "Strada", "Mobi"],
    Renault: ["Duster", "Sandero", "Logan", "Kangoo", "Captur"],
  },
  versiones: ["Base", "XL", "XLT", "Limited", "Platinum", "SRV", "Highline"],
  tiposVehiculo: [], // Se llenan dinámicamente desde la BD
  combustibles: ["Diesel", "Nafta", "GNC", "Híbrido", "Eléctrico"],
  transmisiones: ["Manual", "Automática", "CVT", "Secuencial"],
  tracciones: ["4x2", "4x4", "AWD", "FWD", "RWD"],
};

interface UseUsadosOptionsConfig {
  isAdmin?: boolean;
  enableFallback?: boolean;
}

export function useUsadosOptions(config: UseUsadosOptionsConfig = {}) {
  const { isAdmin = false, enableFallback = true } = config;
  const { getUsadosOptions } = useOptionsCache();

  const [options, setOptions] = useState<UsadosOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getUsadosOptions(isAdmin);

        if (isMounted) {
          setOptions(data);
        }
      } catch (err) {
        console.error("Error fetching usados options:", err);
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
  }, [isAdmin, enableFallback, getUsadosOptions]);

  return { options, loading, error };
}

// Hook para obtener modelos por marca
export function useModelosByMarca(
  marca: string,
  options: UsadosOptions | null
): string[] {
  return useMemo(() => {
    if (!options || !marca) return [];
    return options.modelos[marca] || [];
  }, [marca, options]);
}

// Función helper para extraer opciones de un campo específico
export function getOptionsFromData(
  data: UsadosOptions | null,
  field: keyof Omit<UsadosOptions, "modelos">
): string[] {
  if (!data) return [];
  return data[field] || [];
}

// Función helper para extraer todas las marcas
export function getMarcasFromData(data: UsadosOptions | null): string[] {
  if (!data) return [];
  return data.marcas || [];
}

// Función helper para extraer todos los modelos de una marca
export function getModelosFromData(
  data: UsadosOptions | null,
  marca: string
): string[] {
  if (!data || !marca) return [];
  return data.modelos[marca] || [];
}
