"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { MediaFile } from "@/types";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface HeroMediaGalleryProps {
  images: MediaFile[];
  videos: MediaFile[];
  vehicleTitle: string;
  className?: string;
}

export const HeroMediaGallery: React.FC<HeroMediaGalleryProps> = ({
  images,
  videos,
  vehicleTitle,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalMedia = images.length + videos.length;

  const getCurrentMedia = () => {
    if (currentIndex < images.length) {
      return { type: "image" as const, media: images[currentIndex] };
    } else {
      return {
        type: "video" as const,
        media: videos[currentIndex - images.length],
      };
    }
  };

  const goToNext = useCallback(() => {
    if (totalMedia > 1) {
      setCurrentIndex((prev) => (prev + 1) % totalMedia);
    }
  }, [totalMedia]);

  const goToPrevious = useCallback(() => {
    if (totalMedia > 1) {
      setCurrentIndex((prev) => (prev - 1 + totalMedia) % totalMedia);
    }
  }, [totalMedia]);

  // Navegación con teclado
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  if (totalMedia === 0) {
    return (
      <div
        className={`${className} bg-gradient-to-br from-gray-900 via-gray-800 to-black`}
      >
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-400 text-lg">
            No hay imágenes disponibles
          </span>
        </div>
      </div>
    );
  }

  const currentMedia = getCurrentMedia();

  return (
    <div className={`relative ${className} group`}>
      {/* Media de fondo */}
      <div className="absolute inset-0">
        {currentMedia.type === "image" ? (
          <Image
            src={currentMedia.media.secure_url}
            alt={`${vehicleTitle} - ${currentMedia.type} ${currentIndex + 1}`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="relative w-full h-full">
            <video
              src={currentMedia.media.secure_url}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        )}
      </div>

      {/* Controles de navegación */}
      {totalMedia > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 p-4 bg-black bg-opacity-30 hover:bg-opacity-60 text-white rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 p-4 bg-black bg-opacity-30 hover:bg-opacity-60 text-white rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Indicadores de posición */}
      {totalMedia > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
          {Array.from({ length: totalMedia }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white scale-110"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
            />
          ))}
        </div>
      )}

      {/* Indicador de tipo de media */}
      <div className="absolute top-6 left-6 z-30 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full text-sm backdrop-blur-sm">
        {currentMedia.type === "image" ? (
          <span>
            📷 {currentIndex + 1} / {totalMedia}
          </span>
        ) : (
          <span>
            🎥 {currentIndex + 1} / {totalMedia}
          </span>
        )}
      </div>

      {/* Indicador de video (si es video) */}
      {currentMedia.type === "video" && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="bg-black bg-opacity-50 rounded-full p-6 backdrop-blur-sm">
            <Play className="h-12 w-12 text-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};
