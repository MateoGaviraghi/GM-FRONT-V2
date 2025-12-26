"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { MediaFile } from "@/types";
import { Play, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface CloudinaryImageProps {
  mediaFile: MediaFile;
  size?: "small" | "medium" | "large" | "original";
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  onClick?: () => void;
  priority?: boolean;
}

interface CloudinaryVideoProps {
  mediaFile: MediaFile;
  className?: string;
  showThumbnail?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
}

interface MediaGalleryProps {
  images: MediaFile[];
  videos: MediaFile[];
  vehicleTitle: string;
  className?: string;
  showThumbnails?: boolean;
  maxImagesPreview?: number;
}

interface LightboxProps {
  images: MediaFile[];
  videos: MediaFile[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  vehicleTitle: string;
}

// Componente para imagen optimizada de Cloudinary
export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  mediaFile,
  size = "medium",
  alt,
  className = "",
  loading = "lazy",
  onClick,
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Obtener URL según el tamaño solicitado
  const getImageUrl = () => {
    if (size === "original") return mediaFile.secure_url;
    return mediaFile.thumbnails?.[size] || mediaFile.secure_url;
  };

  // Obtener dimensiones para el contenedor
  const getDimensions = () => {
    switch (size) {
      case "small":
        return { width: 300, height: 200 };
      case "medium":
        return { width: 600, height: 400 };
      case "large":
        return { width: 1200, height: 800 };
      default:
        return { width: mediaFile.width, height: mediaFile.height };
    }
  };

  const dimensions = getDimensions();

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ aspectRatio: `${dimensions.width}/${dimensions.height}` }}
      >
        <span className="text-gray-500 text-sm">Error al cargar imagen</span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden group ${className}`}
      onClick={onClick}
    >
      {/* Skeleton loader */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ aspectRatio: `${dimensions.width}/${dimensions.height}` }}
        />
      )}

      <Image
        src={getImageUrl()}
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        loading={loading}
        priority={priority}
        className={`transition-all duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${
          className?.includes("object-contain")
            ? "object-contain"
            : "object-cover"
        } w-full h-full ${
          onClick ? "group-hover:scale-105 cursor-pointer" : ""
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${dimensions.width}px`}
      />
    </div>
  );
};

// Componente para video optimizado de Cloudinary
export const CloudinaryVideo: React.FC<CloudinaryVideoProps> = ({
  mediaFile,
  className = "",
  showThumbnail = true,
  autoPlay = false,
  controls = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-500 text-sm">Error al cargar video</span>
      </div>
    );
  }

  if (!isPlaying && showThumbnail && mediaFile.thumbnail) {
    return (
      <div
        className={`relative cursor-pointer ${className}`}
        onClick={handlePlayClick}
      >
        <Image
          src={mediaFile.thumbnail}
          alt="Video preview"
          width={mediaFile.width}
          height={mediaFile.height}
          className="w-full h-full object-cover"
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-40 transition-all duration-200">
          <div className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all duration-200">
            <Play className="h-8 w-8 text-gray-800 ml-1" />
          </div>
        </div>

        {/* Duration badge */}
        {mediaFile.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {Math.floor(mediaFile.duration / 60)}:
            {(mediaFile.duration % 60).toFixed(0).padStart(2, "0")}
          </div>
        )}
      </div>
    );
  }

  return (
    <video
      src={mediaFile.secure_url}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      onError={() => setHasError(true)}
      preload="metadata"
    >
      Tu navegador no soporta la reproducción de videos.
    </video>
  );
};

// Lightbox para galería completa con zoom
const MediaLightbox: React.FC<LightboxProps> = ({
  images,
  videos,
  initialIndex,
  isOpen,
  onClose,
  vehicleTitle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = React.useRef<HTMLDivElement>(null);

  const totalMedia = images.length + videos.length;
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 5;
  const ZOOM_STEP = 0.5;

  const getCurrentMedia = () => {
    if (currentIndex < images.length) {
      return { type: "image", media: images[currentIndex] };
    } else {
      return { type: "video", media: videos[currentIndex - images.length] };
    }
  };

  // Reset zoom y posición cuando cambia la imagen
  React.useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalMedia);
  }, [totalMedia]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalMedia) % totalMedia);
  }, [totalMedia]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - ZOOM_STEP, MIN_ZOOM);
      if (newZoom === MIN_ZOOM) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Zoom con scroll del mouse
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isOpen) return;
      e.preventDefault();

      const delta = e.deltaY * -0.001;
      setZoom((prev) => {
        const newZoom = Math.min(Math.max(prev + delta, MIN_ZOOM), MAX_ZOOM);
        if (newZoom === MIN_ZOOM) {
          setPosition({ x: 0, y: 0 });
        }
        return newZoom;
      });
    },
    [isOpen]
  );

  // Drag para mover la imagen cuando está con zoom
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom > 1) {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      }
    },
    [zoom, position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && zoom > 1) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, dragStart, zoom]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          if (zoom === 1) goToNext();
          break;
        case "ArrowLeft":
          if (zoom === 1) goToPrevious();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
        case "_":
          handleZoomOut();
          break;
        case "0":
          handleResetZoom();
          break;
      }
    },
    [
      isOpen,
      onClose,
      goToNext,
      goToPrevious,
      zoom,
      handleZoomIn,
      handleZoomOut,
      handleResetZoom,
    ]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Event listener para wheel
  React.useEffect(() => {
    const imageElement = imageRef.current;
    if (imageElement && isOpen) {
      imageElement.addEventListener("wheel", handleWheel, { passive: false });
      return () => imageElement.removeEventListener("wheel", handleWheel);
    }
  }, [isOpen, handleWheel]);

  if (!isOpen) return null;

  const currentMedia = getCurrentMedia();

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black to-transparent z-10">
        <div className="flex justify-between items-center text-white">
          <h3 className="text-lg font-medium">{vehicleTitle}</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {currentIndex + 1} / {totalMedia}
            </span>
            {/* Zoom controls para imágenes */}
            {currentMedia.type === "image" && (
              <div className="flex items-center gap-2 bg-black bg-opacity-50 rounded-full px-3 py-1">
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= MIN_ZOOM}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Alejar (- o scroll)"
                >
                  <span className="text-xl font-bold">−</span>
                </button>
                <span className="text-xs min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= MAX_ZOOM}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Acercar (+ o scroll)"
                >
                  <span className="text-xl font-bold">+</span>
                </button>
                {zoom > 1 && (
                  <button
                    onClick={handleResetZoom}
                    className="ml-2 px-2 py-1 text-xs hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    title="Resetear zoom (0)"
                  >
                    Reset
                  </button>
                )}
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              title="Cerrar (ESC)"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Media content */}
      <div
        ref={imageRef}
        className={`flex-1 flex items-center justify-center p-4 md:p-8 ${
          zoom > 1 ? "overflow-auto" : "overflow-hidden"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
        }}
      >
        {currentMedia.type === "image" ? (
          <div
            className="relative inline-flex items-center justify-center transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
                position.y / zoom
              }px)`,
              transformOrigin: "center center",
              minWidth: zoom > 1 ? "100%" : "auto",
              minHeight: zoom > 1 ? "100%" : "auto",
            }}
          >
            <Image
              src={currentMedia.media.secure_url}
              alt={`${vehicleTitle} - Imagen ${currentIndex + 1}`}
              width={currentMedia.media.width}
              height={currentMedia.media.height}
              className="w-auto h-auto object-contain select-none"
              style={{
                maxHeight: zoom === 1 ? "85vh" : "none",
                maxWidth: zoom === 1 ? "85vw" : "none",
                height: zoom > 1 ? "85vh" : "auto",
                width: zoom > 1 ? "auto" : "auto",
              }}
              loading="eager"
              priority
              sizes="85vw"
              draggable={false}
            />
          </div>
        ) : (
          <CloudinaryVideo
            mediaFile={currentMedia.media}
            className="max-h-[85vh] max-w-[85vw] w-auto h-auto"
            showThumbnail={false}
            autoPlay={true}
          />
        )}
      </div>

      {/* Navigation buttons - solo si no hay zoom activo */}
      {totalMedia > 1 && zoom === 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-all duration-200"
            title="Anterior (←)"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-all duration-200"
            title="Siguiente (→)"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Indicador de ayuda para zoom (solo para imágenes) */}
      {currentMedia.type === "image" && zoom === 1 && (
        <div className="absolute top-20 right-4 bg-black bg-opacity-70 text-white text-xs px-3 py-2 rounded backdrop-blur-sm">
          <p className="font-medium mb-1">Controles de zoom:</p>
          <ul className="space-y-0.5">
            <li>• Scroll del mouse</li>
            <li>• Botones +/- (arriba)</li>
            <li>• Arrastrar cuando hay zoom</li>
          </ul>
        </div>
      )}

      {/* Thumbnails - solo visible cuando no hay zoom */}
      {zoom === 1 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <div className="flex gap-3 justify-center overflow-x-auto max-w-full pb-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
            {images.map((image, index) => (
              <button
                key={`img-${index}`}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-20 h-16 overflow-hidden rounded border-2 transition-all hover:scale-105 ${
                  currentIndex === index
                    ? "border-cyan-400 scale-105"
                    : "border-transparent opacity-60 hover:opacity-90"
                }`}
                title={`Imagen ${index + 1}`}
              >
                <CloudinaryImage
                  mediaFile={image}
                  size="small"
                  alt=""
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </button>
            ))}
            {videos.map((video, index) => (
              <button
                key={`vid-${index}`}
                onClick={() => setCurrentIndex(images.length + index)}
                className={`relative flex-shrink-0 w-20 h-16 overflow-hidden rounded border-2 transition-all hover:scale-105 ${
                  currentIndex === images.length + index
                    ? "border-cyan-400 scale-105"
                    : "border-transparent opacity-60 hover:opacity-90"
                }`}
                title={`Video ${index + 1}`}
              >
                {video.thumbnail && (
                  <Image
                    src={video.thumbnail}
                    alt=""
                    width={100}
                    height={75}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <Play className="h-5 w-5 text-white" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Galería principal de medios
export const MediaGallery: React.FC<MediaGalleryProps> = ({
  images,
  videos,
  vehicleTitle,
  className = "",
  showThumbnails = true,
  maxImagesPreview = 4,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentMainIndex, setCurrentMainIndex] = useState(0);

  const totalMedia = images.length + videos.length;
  const remainingCount = totalMedia - maxImagesPreview;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Función para obtener el media actual (imagen o video)
  const getCurrentMainMedia = () => {
    if (currentMainIndex < images.length) {
      return { type: "image" as const, media: images[currentMainIndex] };
    } else {
      return {
        type: "video" as const,
        media: videos[currentMainIndex - images.length],
      };
    }
  };

  const goToNextMain = useCallback(() => {
    if (totalMedia > 1) {
      setCurrentMainIndex((prev) => (prev + 1) % totalMedia);
    }
  }, [totalMedia]);

  const goToPreviousMain = useCallback(() => {
    if (totalMedia > 1) {
      setCurrentMainIndex((prev) => (prev - 1 + totalMedia) % totalMedia);
    }
  }, [totalMedia]);

  // Navegación con teclado para el carrusel principal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen && totalMedia > 1) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          goToNextMain();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          goToPreviousMain();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, totalMedia, goToNextMain, goToPreviousMain]);

  if (totalMedia === 0) {
    return (
      <div
        className={`bg-gray-200 aspect-video flex items-center justify-center ${className}`}
      >
        <span className="text-gray-500">No hay imágenes disponibles</span>
      </div>
    );
  }

  return (
    <>
      <div className={`${className}`}>
        {/* Media principal con carrusel (imágenes y videos) */}
        {totalMedia > 0 && (
          <div className="relative mb-4 group">
            {getCurrentMainMedia().type === "image" ? (
              <CloudinaryImage
                mediaFile={getCurrentMainMedia().media}
                size="large"
                alt={`${vehicleTitle} - Imagen ${currentMainIndex + 1}`}
                className="w-full aspect-video rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => openLightbox(currentMainIndex)}
                priority={true}
                loading="eager"
              />
            ) : (
              <div
                className="w-full aspect-video rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => openLightbox(currentMainIndex)}
              >
                <CloudinaryVideo
                  mediaFile={getCurrentMainMedia().media}
                  className="w-full h-full object-cover"
                  showThumbnail={true}
                  autoPlay={false}
                  controls={true}
                />
              </div>
            )}

            {/* Flechas de navegación */}
            {totalMedia > 1 && (
              <>
                <button
                  onClick={goToPreviousMain}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                <button
                  onClick={goToNextMain}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </>
            )}

            {/* Indicador de posición */}
            {totalMedia > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentMainIndex + 1} / {totalMedia}
              </div>
            )}

            {/* Botón de zoom/fullscreen */}
            <button
              onClick={() => openLightbox(currentMainIndex)}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Thumbnails grid - Centrado */}
        {showThumbnails && totalMedia > 1 && (
          <div className="flex justify-center items-center w-full overflow-x-auto">
            <div className="flex gap-3 max-w-full px-4">
              {/* Miniaturas de imágenes */}
              {images.slice(0, maxImagesPreview).map((image, index) => (
                <button
                  key={`thumb-img-${index}`}
                  onClick={() => {
                    setCurrentMainIndex(index);
                  }}
                  className={`w-32 sm:w-36 md:w-40 aspect-video rounded overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                    currentMainIndex === index
                      ? "border-cyan-500 opacity-100"
                      : "border-transparent opacity-100"
                  }`}
                >
                  <CloudinaryImage
                    mediaFile={image}
                    size="medium"
                    alt={`${vehicleTitle} - Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}

              {/* Video thumbnails */}
              {videos
                .slice(0, Math.max(0, maxImagesPreview - images.length))
                .map((video, index) => {
                  const videoIndex = images.length + index;
                  return (
                    <button
                      key={`thumb-vid-${index}`}
                      onClick={() => {
                        setCurrentMainIndex(videoIndex);
                      }}
                      className={`w-32 sm:w-36 md:w-40 aspect-video rounded overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                        currentMainIndex === videoIndex
                          ? "border-cyan-500 opacity-100"
                          : "border-transparent opacity-100"
                      }`}
                    >
                      <CloudinaryVideo
                        mediaFile={video}
                        className="w-full h-full object-cover"
                        showThumbnail={true}
                      />
                    </button>
                  );
                })}

              {/* "Ver más" overlay */}
              {remainingCount > 0 && (
                <button
                  onClick={() => openLightbox(maxImagesPreview)}
                  className="w-32 sm:w-36 md:w-40 aspect-video rounded bg-black bg-opacity-50 flex items-center justify-center text-white hover:bg-opacity-60 transition-all duration-200 border-2 border-transparent flex-shrink-0"
                >
                  <span className="text-sm font-medium">
                    +{remainingCount} más
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <MediaLightbox
        images={images}
        videos={videos}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        vehicleTitle={vehicleTitle}
      />
    </>
  );
};
