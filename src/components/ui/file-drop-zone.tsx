// 📁 Componente avanzado de Drag & Drop para archivos
// Soporta arrastrar y soltar archivos con validaciones

import React, { useCallback, useState } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";

interface FileDropZoneProps {
  onFilesSelected: (files: FileList) => void;
  accept: string;
  multiple?: boolean;
  maxFiles?: number;
  currentCount?: number;
  children?: React.ReactNode;
  disabled?: boolean;
  error?: string;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesSelected,
  accept,
  multiple = true,
  maxFiles = 10,
  currentCount = 0,
  children,
  disabled = false,
  error,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      setIsDragActive(true);
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      // Solo cambiar estado si salimos del dropzone
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragActive(false);
        setIsDragOver(false);
      }
    },
    [disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      e.dataTransfer.dropEffect = "copy";
    },
    [disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      setIsDragActive(false);
      setIsDragOver(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFilesSelected(e.dataTransfer.files);
      }
    },
    [disabled, onFilesSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFilesSelected(e.target.files);
      }
    },
    [onFilesSelected]
  );

  const canAddMore = currentCount < maxFiles;
  const isAtLimit = currentCount >= maxFiles;

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
        ${
          error
            ? "border-red-300 bg-red-50"
            : isDragOver && canAddMore
            ? "border-cyan-400 bg-cyan-50"
            : isDragActive && canAddMore
            ? "border-cyan-300 bg-cyan-25"
            : isAtLimit
            ? "border-gray-200 bg-gray-50"
            : "border-gray-300 hover:border-cyan-300 hover:bg-cyan-25"
        }
        ${disabled || isAtLimit ? "cursor-not-allowed" : "cursor-pointer"}
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileInput}
        disabled={disabled || isAtLimit}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />

      <div className="pointer-events-none">
        {children || (
          <>
            {error ? (
              <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
            ) : isAtLimit ? (
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-3" />
            ) : (
              <Upload
                className={`h-8 w-8 mx-auto mb-3 transition-colors ${
                  isDragOver ? "text-cyan-600" : "text-gray-400"
                }`}
              />
            )}

            <div className="space-y-2">
              {error ? (
                <>
                  <p className="text-sm font-medium text-red-700">
                    Error de validación
                  </p>
                  <p className="text-xs text-red-600">{error}</p>
                </>
              ) : isAtLimit ? (
                <>
                  <p className="text-sm font-medium text-green-700">
                    Límite alcanzado
                  </p>
                  <p className="text-xs text-green-600">
                    {currentCount}/{maxFiles} archivos subidos
                  </p>
                </>
              ) : isDragOver ? (
                <>
                  <p className="text-sm font-medium text-cyan-700">
                    Suelta los archivos aquí
                  </p>
                  <p className="text-xs text-cyan-600">
                    Se validarán automáticamente
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentCount}/{maxFiles} archivos
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileDropZone;
