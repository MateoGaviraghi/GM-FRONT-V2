/**
 * Botón para descargar/ver ficha técnica de vehículos usados
 * Puede usarse en modo compacto (con solo ícono) o expandido (con texto)
 */

import React from "react";
import { FileText } from "lucide-react";
import { useFichaTecnicaPDF } from "@/hooks";

interface FichaTecnicaButtonProps {
  usadoId: string;
  variant?: "primary" | "secondary" | "outline" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
  text?: string;
  mode?: "download" | "newTab";
}

export const FichaTecnicaButton: React.FC<FichaTecnicaButtonProps> = ({
  usadoId,
  variant = "primary",
  size = "md",
  className = "",
  showIcon = true,
  showText = true,
  text = "Ficha Técnica",
  mode = "newTab",
}) => {
  const { downloading, openInNewTab, download } = useFichaTecnicaPDF({
    onError: (error) => {
      console.error("Error al obtener PDF:", error);
      alert(
        "Error al obtener la ficha técnica. Por favor, intente nuevamente."
      );
    },
  });

  const handleClick = () => {
    if (mode === "newTab") {
      openInNewTab(usadoId);
    } else {
      download(usadoId, `vehiculo-${usadoId}`);
    }
  };

  // Estilos base según variante
  const baseStyles = {
    primary:
      "bg-cyan-500 hover:bg-cyan-600 text-white shadow-md hover:shadow-lg",
    secondary:
      "bg-slate-700 hover:bg-slate-800 text-white shadow-md hover:shadow-lg",
    outline:
      "bg-transparent border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white",
    icon: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm",
  };

  // Tamaños
  const sizes = {
    sm: showText ? "px-3 py-1.5 text-xs gap-1.5" : "p-1.5 w-7 h-7 min-w-[28px]",
    md: showText ? "px-4 py-2 text-sm gap-2" : "p-2 w-9 h-9 min-w-[36px]",
    lg: showText ? "px-6 py-3 text-base gap-2" : "p-3 w-11 h-11 min-w-[44px]",
  };

  // Tamaños de ícono
  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <button
      onClick={handleClick}
      disabled={downloading}
      className={`
        inline-flex items-center justify-center
        ${baseStyles[variant]}
        ${sizes[size]}
        rounded-lg
        font-semibold
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:scale-105 active:scale-95
        ${className}
      `}
      title={text}
    >
      {showIcon && (
        <FileText
          className={`${iconSizes[size]} ${downloading ? "animate-pulse" : ""}`}
        />
      )}
      {showText && (
        <span className="whitespace-nowrap">
          {downloading ? "Cargando..." : text}
        </span>
      )}
    </button>
  );
};

/**
 * Variante compacta - Solo ícono redondo
 */
interface FichaTecnicaIconButtonProps {
  usadoId: string;
  className?: string;
}

export const FichaTecnicaIconButton: React.FC<FichaTecnicaIconButtonProps> = ({
  usadoId,
  className = "",
}) => {
  return (
    <FichaTecnicaButton
      usadoId={usadoId}
      variant="icon"
      size="md"
      showText={false}
      className={`rounded-full ${className}`}
    />
  );
};

/**
 * Botón para cards de vehículos
 */
interface FichaTecnicaCardButtonProps {
  usadoId: string;
  className?: string;
}

export const FichaTecnicaCardButton: React.FC<FichaTecnicaCardButtonProps> = ({
  usadoId,
  className = "",
}) => {
  return (
    <FichaTecnicaButton
      usadoId={usadoId}
      variant="outline"
      size="sm"
      text="Ver Ficha"
      className={className}
    />
  );
};
