"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function ListaVehiculos() {
  const router = useRouter();

  useEffect(() => {
    // Redireccionar a la nueva página avanzada
    router.replace("/admin/vehiculos/lista-avanzada");
  }, [router]);

  return (
    <div className="p-6 flex items-center justify-center min-h-96">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 animate-spin text-cyan-600 mx-auto mb-2" />
        <p className="text-gray-600">
          Redirigiendo a la página de gestión avanzada...
        </p>
      </div>
    </div>
  );
}
