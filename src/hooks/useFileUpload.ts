// 📁 Hook para manejo de archivos de vehículos
// Gestiona upload, preview y validaciones de imágenes/videos

import { useState, useCallback, useMemo } from "react";

export interface FilePreview {
  file: File;
  url: string;
  type: "image" | "video";
}

export interface FileValidationConfig {
  maxImages: number;
  maxVideos: number;
  maxImageSize: number; // bytes
  maxVideoSize: number; // bytes
  allowedImageFormats: string[];
  allowedVideoFormats: string[];
}

const DEFAULT_CONFIG: FileValidationConfig = {
  maxImages: 10,
  maxVideos: 5,
  maxImageSize: 20 * 1024 * 1024, // 20MB (actualizado para Cloudinary)
  maxVideoSize: 50 * 1024 * 1024, // 50MB
  allowedImageFormats: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  allowedVideoFormats: ["video/mp4", "video/mov", "video/avi"],
};

export const useFileUpload = (config: Partial<FileValidationConfig> = {}) => {
  const finalConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config]
  );

  const [imageFiles, setImageFiles] = useState<FilePreview[]>([]);
  const [videoFiles, setVideoFiles] = useState<FilePreview[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateFile = useCallback(
    (file: File, type: "image" | "video"): string | null => {
      const maxSize =
        type === "image" ? finalConfig.maxImageSize : finalConfig.maxVideoSize;
      const allowedFormats =
        type === "image"
          ? finalConfig.allowedImageFormats
          : finalConfig.allowedVideoFormats;

      if (file.size > maxSize) {
        const sizeMB = type === "image" ? "20MB" : "50MB";
        return `El archivo excede el tamaño máximo de ${sizeMB}`;
      }

      if (!allowedFormats.includes(file.type)) {
        return `Formato no permitido. Use: ${allowedFormats.join(", ")}`;
      }

      return null;
    },
    [finalConfig]
  );

  const addImageFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      if (imageFiles.length + fileArray.length > finalConfig.maxImages) {
        setErrors((prev) => ({
          ...prev,
          imagenes: `Máximo ${finalConfig.maxImages} imágenes permitidas`,
        }));
        return;
      }

      const validFiles: FilePreview[] = [];
      let hasErrors = false;

      fileArray.forEach((file) => {
        const error = validateFile(file, "image");
        if (error) {
          setErrors((prev) => ({
            ...prev,
            imagenes: error,
          }));
          hasErrors = true;
          return;
        }

        validFiles.push({
          file,
          url: URL.createObjectURL(file),
          type: "image",
        });
      });

      if (!hasErrors) {
        setImageFiles((prev) => [...prev, ...validFiles]);
        setErrors((prev) => ({
          ...prev,
          imagenes: "",
        }));
      }
    },
    [imageFiles.length, finalConfig.maxImages, validateFile]
  );

  const addVideoFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      if (videoFiles.length + fileArray.length > finalConfig.maxVideos) {
        setErrors((prev) => ({
          ...prev,
          videos: `Máximo ${finalConfig.maxVideos} videos permitidos`,
        }));
        return;
      }

      const validFiles: FilePreview[] = [];
      let hasErrors = false;

      fileArray.forEach((file) => {
        const error = validateFile(file, "video");
        if (error) {
          setErrors((prev) => ({
            ...prev,
            videos: error,
          }));
          hasErrors = true;
          return;
        }

        validFiles.push({
          file,
          url: URL.createObjectURL(file),
          type: "video",
        });
      });

      if (!hasErrors) {
        setVideoFiles((prev) => [...prev, ...validFiles]);
        setErrors((prev) => ({
          ...prev,
          videos: "",
        }));
      }
    },
    [videoFiles.length, finalConfig.maxVideos, validateFile]
  );

  const removeFile = useCallback(
    (index: number, type: "image" | "video") => {
      if (type === "image") {
        const newFiles = [...imageFiles];
        URL.revokeObjectURL(newFiles[index].url);
        newFiles.splice(index, 1);
        setImageFiles(newFiles);
      } else {
        const newFiles = [...videoFiles];
        URL.revokeObjectURL(newFiles[index].url);
        newFiles.splice(index, 1);
        setVideoFiles(newFiles);
      }
    },
    [imageFiles, videoFiles]
  );

  const clearAllFiles = useCallback(() => {
    // Limpiar URLs de objetos para evitar memory leaks
    imageFiles.forEach((file) => URL.revokeObjectURL(file.url));
    videoFiles.forEach((file) => URL.revokeObjectURL(file.url));

    setImageFiles([]);
    setVideoFiles([]);
    setErrors({});
  }, [imageFiles, videoFiles]);

  const validateFiles = useCallback((): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (imageFiles.length > finalConfig.maxImages) {
      newErrors.imagenes = `Máximo ${finalConfig.maxImages} imágenes permitidas`;
    }

    if (videoFiles.length > finalConfig.maxVideos) {
      newErrors.videos = `Máximo ${finalConfig.maxVideos} videos permitidos`;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [imageFiles.length, videoFiles.length, finalConfig]);

  // Cleanup effect para evitar memory leaks
  const cleanup = useCallback(() => {
    imageFiles.forEach((file) => URL.revokeObjectURL(file.url));
    videoFiles.forEach((file) => URL.revokeObjectURL(file.url));
  }, [imageFiles, videoFiles]);

  return {
    imageFiles,
    videoFiles,
    errors,
    addImageFiles,
    addVideoFiles,
    removeFile,
    clearAllFiles,
    validateFiles,
    cleanup,
    config: finalConfig,
  };
};
