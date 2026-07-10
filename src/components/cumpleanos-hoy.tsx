"use client";

import React, { useState, useEffect } from "react";
import { Cake, Phone, Mail, Calendar } from "lucide-react";
import { ClienteService } from "@/services";
import { Cliente } from "@/types/cliente";

export function CumpleanosHoy() {
  const [cumpleanos, setCumpleanos] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarCumpleanos();
  }, []);

  const cargarCumpleanos = async () => {
    try {
      setLoading(true);
      setError(null);
      const clientes = await ClienteService.getCumpleanosHoy();
      setCumpleanos(clientes);
    } catch (err) {
      console.error("Error al cargar cumpleaños:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar cumpleaños"
      );
    } finally {
      setLoading(false);
    }
  };

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimiento = nacimiento.getMonth();

    if (
      mesActual < mesNacimiento ||
      (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())
    ) {
      edad--;
    }

    return edad;
  };

  // Si no hay cumpleaños, no mostrar nada
  if (loading || error || cumpleanos.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3 text-[16.5px] font-semibold text-gray-900">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <Cake className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
        🎉 ¡Cumpleaños de hoy! ({cumpleanos.length})
      </div>

      <div className="space-y-3">
        {cumpleanos.map((cliente) => (
          <div key={cliente._id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden>
                    🎂
                  </span>
                  <div>
                    <h3 className="text-[16.5px] font-semibold text-gray-900">{cliente.nombreCompleto}</h3>
                    <p className="text-[16px] font-medium text-amber-700">
                      Cumple {calcularEdad(cliente.fechaNacimiento!)} años
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 text-[16px] md:grid-cols-2">
                  {cliente.telefonoCelular && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Phone className="size-4 shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
                      <span>{cliente.telefonoCelular}</span>
                    </div>
                  )}
                  {cliente.correoElectronico && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Mail className="size-4 shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
                      <span>{cliente.correoElectronico}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[16px] text-gray-500">
                  <Calendar className="size-4 shrink-0 text-gray-400" strokeWidth={2} aria-hidden />
                  <span>
                    Nació el {new Date(cliente.fechaNacimiento!).toLocaleDateString("es-ES")}
                  </span>
                </div>
              </div>

              <div className="text-4xl" aria-hidden>
                🎈
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-[16px] font-semibold text-amber-700">
          ¡No olvides felicitar a {cumpleanos.length > 1 ? "estos clientes" : "este cliente"}! 🎁
        </p>
      </div>
    </div>
  );
}

export default CumpleanosHoy;
