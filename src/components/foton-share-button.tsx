"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { FotonShareModal } from "./foton-share-modal";
import { cn } from "@/lib/utils";

interface Version {
  id: string;
  nombre: string;
  pdf?: string;
}

interface FotonShareButtonProps {
  vehicleName: string;
  vehicleUrl: string;
  versions?: Version[];
  className?: string;
  variant?: "floating" | "inline";
}

export function FotonShareButton({
  vehicleName,
  vehicleUrl,
  versions = [],
  className = "",
  variant = "floating",
}: FotonShareButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (variant === "floating") {
    return (
      <>
        {/* Control flotante — lenguaje GM (hairline + carbono, sin bordes redondos) */}
        <button
          onClick={() => setIsModalOpen(true)}
          aria-label="Compartir vehículo"
          className={cn(
            "group fixed right-6 z-[9998] flex size-12 items-center justify-center border border-line-dark-2 bg-carbon-0/70 text-platinum backdrop-blur-md transition-colors duration-300 hover:border-platinum hover:bg-platinum hover:text-carbon-0",
            className
          )}
          style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <Share2 className="size-5" strokeWidth={1.5} />
        </button>

        <FotonShareModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          vehicleName={vehicleName}
          vehicleUrl={vehicleUrl}
          versions={versions}
        />
      </>
    );
  }

  // Variante inline (botón dentro del contenido)
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "inline-flex items-center gap-2.5 border border-line-dark-2 bg-transparent px-6 py-3 text-platinum transition-colors hover:border-platinum hover:bg-platinum hover:text-carbon-0",
          className
        )}
      >
        <Share2 className="size-5" strokeWidth={1.5} />
        <span className="gm-label">Compartir vehículo</span>
      </button>

      <FotonShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicleName={vehicleName}
        vehicleUrl={vehicleUrl}
        versions={versions}
      />
    </>
  );
}
