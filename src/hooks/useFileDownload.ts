import { useState } from "react";

interface UseFileDownloadReturn {
  downloadFile: (blob: Blob, filename: string) => void;
  downloading: boolean;
  error: string | null;
}

export const useFileDownload = (): UseFileDownloadReturn => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadFile = (blob: Blob, filename: string) => {
    try {
      setDownloading(true);
      setError(null);

      // Crear URL temporal para el blob
      const url = window.URL.createObjectURL(blob);

      // Crear elemento <a> temporal para la descarga
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      // Agregar al DOM, hacer clic y remover
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar URL temporal
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al descargar archivo:", err);
      setError("Error al descargar el archivo");
    } finally {
      setDownloading(false);
    }
  };

  return {
    downloadFile,
    downloading,
    error,
  };
};
