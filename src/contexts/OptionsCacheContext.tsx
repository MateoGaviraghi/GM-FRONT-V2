"use client";

/**
 * 🗄️ Contexto de Caché para Opciones de API
 * Centraliza y cachea las opciones de todos los servicios para evitar peticiones duplicadas
 */

import React, { createContext, useContext, useRef, ReactNode } from "react";
import { vehiculoService, VehiculoOptions } from "@/services";
import { remolqueService, RemolqueOptions } from "@/services";
import { usadosService, UsadosOptions } from "@/services";
import { novedadService } from "@/services";
import type { NovedadesOptionsResponse } from "@/types";

// ========================================
// TIPOS
// ========================================

interface CacheEntry<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  promise: Promise<T | null> | null; // Promise actual para evitar duplicados
}

interface CacheData {
  vehiculos: {
    admin: CacheEntry<VehiculoOptions>;
    public: CacheEntry<VehiculoOptions>;
  };
  remolques: {
    admin: CacheEntry<RemolqueOptions>;
    public: CacheEntry<RemolqueOptions>;
  };
  usados: {
    admin: CacheEntry<UsadosOptions>;
    public: CacheEntry<UsadosOptions>;
  };
  novedades: CacheEntry<NovedadesOptionsResponse>;
}

interface OptionsCacheContextValue {
  getVehiculoOptions: (isAdmin: boolean) => Promise<VehiculoOptions | null>;
  getRemolqueOptions: (isAdmin: boolean) => Promise<RemolqueOptions | null>;
  getUsadosOptions: (isAdmin: boolean) => Promise<UsadosOptions | null>;
  getNovedadOptions: () => Promise<NovedadesOptionsResponse | null>;
  clearCache: () => void;
}

// ========================================
// CONSTANTES
// ========================================

// Tiempo de vida del caché: 5 minutos
const CACHE_TTL = 5 * 60 * 1000;

// Estado inicial del caché
const createInitialCacheEntry = <T,>(): CacheEntry<T> => ({
  data: null,
  loading: false,
  error: null,
  lastFetch: null,
  promise: null,
});

const createInitialCache = (): CacheData => ({
  vehiculos: {
    admin: createInitialCacheEntry(),
    public: createInitialCacheEntry(),
  },
  remolques: {
    admin: createInitialCacheEntry(),
    public: createInitialCacheEntry(),
  },
  usados: {
    admin: createInitialCacheEntry(),
    public: createInitialCacheEntry(),
  },
  novedades: createInitialCacheEntry(),
});

// ========================================
// CONTEXTO
// ========================================

const OptionsCacheContext = createContext<OptionsCacheContextValue | undefined>(
  undefined
);

// ========================================
// PROVIDER
// ========================================

export const OptionsCacheProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Usar useRef para mantener el caché sin causar re-renders
  const cacheRef = useRef<CacheData>(createInitialCache());

  /**
   * Verifica si el caché es válido (no ha expirado)
   */
  const isCacheValid = (lastFetch: number | null): boolean => {
    if (!lastFetch) return false;
    return Date.now() - lastFetch < CACHE_TTL;
  };

  /**
   * Obtiene opciones de vehículos con caché
   */
  const getVehiculoOptions = async (
    isAdmin: boolean
  ): Promise<VehiculoOptions | null> => {
    const scope = isAdmin ? "admin" : "public";
    const cached = cacheRef.current.vehiculos[scope];

    // Si hay datos en caché y son válidos, retornarlos inmediatamente
    if (cached.data && isCacheValid(cached.lastFetch)) {
      console.log(`✅ Cache hit: vehiculos ${scope}`);
      return cached.data;
    }

    // Si ya hay una petición en curso, esperar a que termine
    if (cached.promise) {
      console.log(`⏳ Esperando petición en curso: vehiculos ${scope}`);
      return cached.promise;
    }

    // Crear nueva petición
    console.log(`🔄 Fetching: vehiculos ${scope}`);
    cached.loading = true;

    const promise = (async () => {
      try {
        const data = isAdmin
          ? await vehiculoService.getAdminOptions()
          : await vehiculoService.getPublicOptions();

        cached.data = data;
        cached.loading = false;
        cached.error = null;
        cached.lastFetch = Date.now();
        cached.promise = null;

        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error al cargar opciones";

        cached.loading = false;
        cached.error = errorMessage;
        cached.promise = null;

        throw error;
      }
    })();

    cached.promise = promise;
    return promise;
  };

  /**
   * Obtiene opciones de remolques con caché
   */
  const getRemolqueOptions = async (
    isAdmin: boolean
  ): Promise<RemolqueOptions | null> => {
    const scope = isAdmin ? "admin" : "public";
    const cached = cacheRef.current.remolques[scope];

    if (cached.data && isCacheValid(cached.lastFetch)) {
      console.log(`✅ Cache hit: remolques ${scope}`);
      return cached.data;
    }

    if (cached.promise) {
      console.log(`⏳ Esperando petición en curso: remolques ${scope}`);
      return cached.promise;
    }

    console.log(`🔄 Fetching: remolques ${scope}`);
    cached.loading = true;

    const promise = (async () => {
      try {
        const data = isAdmin
          ? await remolqueService.getAdminOptions()
          : await remolqueService.getPublicOptions();

        cached.data = data;
        cached.loading = false;
        cached.error = null;
        cached.lastFetch = Date.now();
        cached.promise = null;

        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error al cargar opciones";

        cached.loading = false;
        cached.error = errorMessage;
        cached.promise = null;

        throw error;
      }
    })();

    cached.promise = promise;
    return promise;
  };

  /**
   * Obtiene opciones de usados con caché
   */
  const getUsadosOptions = async (
    isAdmin: boolean
  ): Promise<UsadosOptions | null> => {
    const scope = isAdmin ? "admin" : "public";
    const cached = cacheRef.current.usados[scope];

    if (cached.data && isCacheValid(cached.lastFetch)) {
      console.log(`✅ Cache hit: usados ${scope}`);
      return cached.data;
    }

    if (cached.promise) {
      console.log(`⏳ Esperando petición en curso: usados ${scope}`);
      return cached.promise;
    }

    console.log(`🔄 Fetching: usados ${scope}`);
    cached.loading = true;

    const promise = (async () => {
      try {
        const data = isAdmin
          ? await usadosService.getAdminOptions()
          : await usadosService.getPublicOptions();

        console.log(
          `📦 Datos recibidos desde backend (usados ${scope}):`,
          data
        );

        cached.data = data;
        cached.loading = false;
        cached.error = null;
        cached.lastFetch = Date.now();
        cached.promise = null;

        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error al cargar opciones";

        cached.loading = false;
        cached.error = errorMessage;
        cached.promise = null;

        throw error;
      }
    })();

    cached.promise = promise;
    return promise;
  };

  /**
   * Obtiene opciones de novedades con caché
   */
  const getNovedadOptions =
    async (): Promise<NovedadesOptionsResponse | null> => {
      const cached = cacheRef.current.novedades;

      if (cached.data && isCacheValid(cached.lastFetch)) {
        console.log(`✅ Cache hit: novedades`);
        return cached.data;
      }

      if (cached.promise) {
        console.log(`⏳ Esperando petición en curso: novedades`);
        return cached.promise;
      }

      console.log(`🔄 Fetching: novedades`);
      cached.loading = true;

      const promise = (async () => {
        try {
          const data = await novedadService.public.getOptions();

          cached.data = data;
          cached.loading = false;
          cached.error = null;
          cached.lastFetch = Date.now();
          cached.promise = null;

          return data;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Error al cargar opciones";

          cached.loading = false;
          cached.error = errorMessage;
          cached.promise = null;

          throw error;
        }
      })();

      cached.promise = promise;
      return promise;
    };

  /**
   * Limpia todo el caché
   */
  const clearCache = () => {
    console.log("🗑️ Limpiando caché completo");
    cacheRef.current = createInitialCache();
  };

  return (
    <OptionsCacheContext.Provider
      value={{
        getVehiculoOptions,
        getRemolqueOptions,
        getUsadosOptions,
        getNovedadOptions,
        clearCache,
      }}
    >
      {children}
    </OptionsCacheContext.Provider>
  );
};

// ========================================
// HOOK
// ========================================

export const useOptionsCache = (): OptionsCacheContextValue => {
  const context = useContext(OptionsCacheContext);
  if (!context) {
    throw new Error(
      "useOptionsCache debe ser usado dentro de OptionsCacheProvider"
    );
  }
  return context;
};
