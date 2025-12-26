"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { FotonShareModal } from "./foton-share-modal";

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
        {/* Botón flotante */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={`fixed bottom-28 right-6 z-[9998] group bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-5 rounded-full shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110 ${className}`}
          aria-label="Compartir vehículo"
        >
          <Share2 className="w-7 h-7" />

          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Compartir vehículo
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-slate-900"></div>
          </div>
        </button>

        {/* Modal */}
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

  // Variante inline (botón en el contenido)
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 ${className}`}
      >
        <Share2 className="w-5 h-5" />
        Compartir Vehículo
      </button>

      {/* Modal */}
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
