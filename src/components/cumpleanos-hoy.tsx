"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClienteService } from "@/services";
import { Cake, Phone, Mail, Calendar } from "lucide-react";
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
    <Card className="border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-pink-700">
          <Cake className="w-5 h-5" />
          🎉 ¡Cumpleaños de hoy! ({cumpleanos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {cumpleanos.map((cliente) => (
            <div
              key={cliente._id}
              className="bg-white p-4 rounded-lg border border-pink-100 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎂</span>
                    <div>
                      <h3 className="font-bold text-slate-800">
                        {cliente.nombreCompleto}
                      </h3>
                      <p className="text-sm text-pink-600">
                        Cumple {calcularEdad(cliente.fechaNacimiento!)} años
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {cliente.telefonoCelular && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Phone className="w-3 h-3" />
                        <span>{cliente.telefonoCelular}</span>
                      </div>
                    )}
                    {cliente.correoElectronico && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Mail className="w-3 h-3" />
                        <span>{cliente.correoElectronico}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Nació el{" "}
                      {new Date(cliente.fechaNacimiento!).toLocaleDateString(
                        "es-ES"
                      )}
                    </span>
                  </div>
                </div>

                <div className="text-4xl animate-bounce">🎈</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-pink-600 font-medium">
            ¡No olvides felicitar a{" "}
            {cumpleanos.length > 1 ? "estos clientes" : "este cliente"}! 🎁
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default CumpleanosHoy;
