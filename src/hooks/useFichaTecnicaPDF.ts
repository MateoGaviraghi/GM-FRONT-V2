/**
 * Hook personalizado para descargar ficha técnica de vehículos usados
 * Soporta diferentes modos: descargar, abrir en nueva pestaña, o blob
 */

import { useState } from "react";
import { usadosService } from "@/services";

export type PDFDownloadMode = "download" | "newTab" | "blob";

interface UseFichaTecnicaPDFOptions {
  mode?: PDFDownloadMode;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseFichaTecnicaPDFReturn {
  downloading: boolean;
  error: Error | null;
  download: (usadoId: string, titulo?: string) => Promise<void>;
  openInNewTab: (usadoId: string) => void;
  getBlob: (usadoId: string) => Promise<Blob>;
}

export const useFichaTecnicaPDF = (
  options: UseFichaTecnicaPDFOptions = {}
): UseFichaTecnicaPDFReturn => {
  const { onSuccess, onError } = options;
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Obtener la URL base de la API
   */
  const getAPIBaseUrl = (): string => {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
  };

  /**
   * Opción 1: Abrir PDF en nueva pestaña (recomendado)
   * Más simple y eficiente, deja que el navegador maneje el PDF
   */
  const openInNewTab = (usadoId: string): void => {
    const url = `${getAPIBaseUrl()}/usados/public/${usadoId}/ficha-tecnica`;
    window.open(url, "_blank");
    onSuccess?.();
  };

  /**
   * Opción 2: Descargar PDF como archivo
   * Usa el servicio de usados para descargar y guardar el PDF
   */
  const download = async (
    usadoId: string,
    titulo: string = "Vehiculo"
  ): Promise<void> => {
    setDownloading(true);
    setError(null);

    try {
      await usadosService.downloadAndSavePDF(usadoId, titulo);
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Error desconocido");
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setDownloading(false);
    }
  };

  /**
   * Opción 3: Obtener Blob del PDF
   * Útil si necesitas manipular el PDF o mostrarlo de forma custom
   */
  const getBlob = async (usadoId: string): Promise<Blob> => {
    setDownloading(true);
    setError(null);

    try {
      const blob = await usadosService.downloadFichaTecnicaPDF(usadoId);
      onSuccess?.();
      return blob;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Error desconocido");
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setDownloading(false);
    }
  };

  return {
    downloading,
    error,
    download,
    openInNewTab,
    getBlob,
  };
};
