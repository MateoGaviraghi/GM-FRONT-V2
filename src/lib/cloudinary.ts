// 🖼️ Utilidades para Cloudinary - Optimización de imágenes y videos

/**
 * Configuración base de Cloudinary para Guzmán Motors
 */
export const CLOUDINARY_CONFIG = {
  cloudName: "demdyjvk8", // Basado en la documentación
  baseUrl: "https://res.cloudinary.com/demdyjvk8",
  folders: {
    vehiculos: "vehiculos0km/images",
    videos: "vehiculos0km/videos",
  },
};

/**
 * Opciones de transformación para diferentes usos
 */
export const TRANSFORM_PRESETS = {
  thumbnail: "c_fill,f_auto,h_200,q_auto,w_300",
  card: "c_fill,f_auto,h_400,q_auto,w_600",
  detail: "c_fill,f_auto,h_800,q_auto,w_1200",
  hero: "c_fill,f_auto,h_600,q_auto,w_1920",

  // Para diferentes dispositivos
  mobile: "c_fill,f_auto,h_300,q_auto,w_400",
  tablet: "c_fill,f_auto,h_500,q_auto,w_800",
  desktop: "c_fill,f_auto,h_600,q_auto,w_1200",
};

/**
 * Genera URL optimizada de imagen desde Cloudinary
 */
export function getCloudinaryImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: "auto" | "low" | "medium" | "high" | number;
    format?: "auto" | "webp" | "jpg" | "png";
    crop?: "fill" | "fit" | "scale" | "crop" | "pad";
    gravity?: "auto" | "center" | "face" | "faces";
    preset?: keyof typeof TRANSFORM_PRESETS;
  } = {}
): string {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "auto",
    preset,
  } = options;

  // Si se especifica un preset, úsalo directamente
  if (preset && TRANSFORM_PRESETS[preset]) {
    return `${CLOUDINARY_CONFIG.baseUrl}/image/upload/${TRANSFORM_PRESETS[preset]}/v1/${publicId}`;
  }

  // Construir transformaciones manuales
  const transformations = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity && crop === "fill") transformations.push(`g_${gravity}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);

  const transformString = transformations.join(",");

  return `${CLOUDINARY_CONFIG.baseUrl}/image/upload/${transformString}/v1/${publicId}`;
}

/**
 * Genera URL de video desde Cloudinary
 */
export function getCloudinaryVideoUrl(
  publicId: string,
  options: {
    quality?: "auto" | "low" | "medium" | "high";
    format?: "auto" | "mp4" | "webm";
    width?: number;
    height?: number;
  } = {}
): string {
  const { quality = "auto", format = "auto", width, height } = options;

  const transformations = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);

  const transformString = transformations.join(",");

  return `${CLOUDINARY_CONFIG.baseUrl}/video/upload/${transformString}/v1/${publicId}`;
}

/**
 * Genera thumbnail de video
 */
export function getVideoThumbnail(
  videoPublicId: string,
  options: {
    time?: string; // ej: '10p' para 10% del video, '30s' para 30 segundos
    width?: number;
    height?: number;
    quality?: "auto" | "low" | "medium" | "high";
  } = {}
): string {
  const {
    time = "10p", // 10% del video por defecto
    width = 600,
    height = 400,
    quality = "auto",
  } = options;

  return `${CLOUDINARY_CONFIG.baseUrl}/video/upload/so_${time},f_jpg,q_${quality},w_${width},h_${height},c_fill/v1/${videoPublicId}.jpg`;
}

/**
 * Genera srcSet para imágenes responsive
 */
export function getResponsiveSrcSet(
  publicId: string,
  options: {
    baseWidth?: number;
    baseHeight?: number;
    crop?: "fill" | "fit" | "scale";
    quality?: "auto" | "low" | "medium" | "high";
    format?: "auto" | "webp" | "jpg";
  } = {}
): string {
  const {
    baseWidth = 600,
    baseHeight = 400,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options;

  const breakpoints = [320, 480, 768, 1024, 1200, 1600];

  const srcSet = breakpoints
    .map((width) => {
      const height = Math.round((baseHeight * width) / baseWidth);
      const url = getCloudinaryImageUrl(publicId, {
        width,
        height,
        crop,
        quality,
        format,
      });
      return `${url} ${width}w`;
    })
    .join(", ");

  return srcSet;
}

/**
 * Valida si un archivo es una imagen válida
 */
export function isValidImage(file: File): boolean {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 20 * 1024 * 1024; // 20MB (actualizado para Cloudinary)

  return validTypes.includes(file.type) && file.size <= maxSize;
}

/**
 * Valida si un archivo es un video válido
 */
export function isValidVideo(file: File): boolean {
  const validTypes = ["video/mp4", "video/mov", "video/avi"];
  const maxSize = 50 * 1024 * 1024; // 50MB

  return validTypes.includes(file.type) && file.size <= maxSize;
}

/**
 * Formatea el tamaño de archivo para mostrar
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Extrae el public_id de una URL de Cloudinary
 */
export function extractPublicId(cloudinaryUrl: string): string {
  try {
    // Ejemplo: https://res.cloudinary.com/demdyjvk8/image/upload/v1/vehiculos0km/images/abc123.jpg
    // Resultado: vehiculos0km/images/abc123

    const urlParts = cloudinaryUrl.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) return "";

    // Omitir la versión (v1, v123456789, etc.)
    const pathAfterVersion = urlParts.slice(uploadIndex + 2);

    // Unir las partes y remover la extensión
    const publicIdWithExtension = pathAfterVersion.join("/");
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");

    return publicId;
  } catch (error) {
    console.error("Error extrayendo public_id:", error);
    return "";
  }
}

/**
 * Hook para previsualizar imágenes antes de subir
 */
export function useImagePreview(files: File[]): string[] {
  const previews: string[] = [];

  files.forEach((file) => {
    if (isValidImage(file)) {
      previews.push(URL.createObjectURL(file));
    }
  });

  return previews;
}

/**
 * Configuración de transformaciones automáticas por contexto
 */
export const CONTEXT_TRANSFORMS = {
  // Para listados/grids de vehículos
  vehicleGrid: {
    width: 400,
    height: 300,
    crop: "fill" as const,
    quality: "auto" as const,
    format: "auto" as const,
  },

  // Para vista detallada
  vehicleDetail: {
    width: 1200,
    height: 800,
    crop: "fill" as const,
    quality: "auto" as const,
    format: "auto" as const,
  },

  // Para hero/banner
  vehicleHero: {
    width: 1920,
    height: 600,
    crop: "fill" as const,
    quality: "high" as const,
    format: "auto" as const,
  },

  // Para thumbnails pequeños
  vehicleThumbnail: {
    width: 200,
    height: 150,
    crop: "fill" as const,
    quality: "auto" as const,
    format: "auto" as const,
  },
};

/**
 * Obtiene la URL optimizada según el contexto
 */
export function getContextualImageUrl(
  publicId: string,
  context: keyof typeof CONTEXT_TRANSFORMS
): string {
  const config = CONTEXT_TRANSFORMS[context];
  return getCloudinaryImageUrl(publicId, config);
}
