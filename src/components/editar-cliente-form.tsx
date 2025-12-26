"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClienteService, CreateClienteRequest } from "@/services";
import { User, Car, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";
import { Cliente } from "@/types/cliente";

// Schema sin campos requeridos - todos opcionales
const schema = z.object({
  nombreCompleto: z.string().optional(),
  correoElectronico: z
    .string()
    .email("Email inválido")
    .or(z.literal(""))
    .optional(),
  telefonoCelular: z.string().optional(),
  telefonoFijo: z.string().optional(),
  provincia: z.string().optional(),
  localidad: z.string().optional(),
  direccion: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  tipoVehiculo: z.string().optional(),
  productoServicio: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  anioCompra: z.string().optional(),
  tipoCliente: z.string().optional(),
  observaciones: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditarClienteFormProps {
  clienteId: string;
}

export function EditarClienteForm({ clienteId }: EditarClienteFormProps) {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCliente, setLoadingCliente] = useState(true);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Cargar datos del cliente
  useEffect(() => {
    const cargarCliente = async () => {
      try {
        setLoadingCliente(true);
        setError(null);

        const clienteData = await ClienteService.getById(clienteId);
        setCliente(clienteData);

        // Pre-poblar el formulario
        setValue("nombreCompleto", clienteData.nombreCompleto || "");
        setValue("correoElectronico", clienteData.correoElectronico || "");
        setValue("telefonoCelular", clienteData.telefonoCelular || "");
        setValue("telefonoFijo", clienteData.telefonoFijo || "");
        setValue("provincia", clienteData.provincia || "");
        setValue("localidad", clienteData.localidad || "");
        setValue("direccion", clienteData.direccion || "");
        setValue("tipoVehiculo", clienteData.tipoVehiculo || "");
        setValue("productoServicio", clienteData.productoServicio || "");
        setValue("marca", clienteData.marca || "");
        setValue("modelo", clienteData.modelo || "");
        setValue("anioCompra", clienteData.anioCompra?.toString() || "");
        setValue("tipoCliente", clienteData.tipoCliente || "");
        setValue("observaciones", clienteData.observaciones || "");

        // Formatear fecha de nacimiento para input date
        if (clienteData.fechaNacimiento) {
          const fecha = new Date(clienteData.fechaNacimiento);
          const fechaFormateada = fecha.toISOString().split("T")[0];
          setValue("fechaNacimiento", fechaFormateada);
        }
      } catch (err) {
        console.error("Error al cargar cliente:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al cargar los datos del cliente");
        }
      } finally {
        setLoadingCliente(false);
      }
    };

    if (clienteId) {
      cargarCliente();
    }
  }, [clienteId, setValue]);

  const onSubmit = async (data: FormData) => {
    setSuccess(null);
    setError(null);
    setIsLoading(true);

    try {
      // Validar y convertir año manualmente
      let anioCompraNumero: number | undefined = undefined;
      if (data.anioCompra && data.anioCompra.trim() !== "") {
        const year = parseInt(data.anioCompra, 10);
        if (isNaN(year)) {
          setError("El año de compra debe ser un número válido");
          setIsLoading(false);
          return;
        }
        if (year < 1900 || year > 2100) {
          setError("El año de compra debe estar entre 1900 y 2100");
          setIsLoading(false);
          return;
        }
        anioCompraNumero = year;
      }

      // Preparar datos para enviar (igual que en crear cliente)
      const clienteData: CreateClienteRequest = {};

      // Solo agregar campos que tienen valor
      if (data.nombreCompleto && data.nombreCompleto.trim()) {
        clienteData.nombreCompleto = data.nombreCompleto.trim();
      }
      if (data.correoElectronico && data.correoElectronico.trim()) {
        clienteData.correoElectronico = data.correoElectronico.trim();
      }
      if (data.telefonoCelular && data.telefonoCelular.trim()) {
        clienteData.telefonoCelular = data.telefonoCelular.trim();
      }
      if (data.telefonoFijo && data.telefonoFijo.trim()) {
        clienteData.telefonoFijo = data.telefonoFijo.trim();
      }
      if (data.provincia && data.provincia.trim()) {
        clienteData.provincia = data.provincia.trim();
      }
      if (data.localidad && data.localidad.trim()) {
        clienteData.localidad = data.localidad.trim();
      }
      if (data.direccion && data.direccion.trim()) {
        clienteData.direccion = data.direccion.trim();
      }
      if (data.tipoVehiculo && data.tipoVehiculo.trim()) {
        clienteData.tipoVehiculo = data.tipoVehiculo.trim();
      }
      if (data.marca && data.marca.trim()) {
        clienteData.marca = data.marca.trim();
      }
      if (data.modelo && data.modelo.trim()) {
        clienteData.modelo = data.modelo.trim();
      }
      if (data.fechaNacimiento && data.fechaNacimiento.trim()) {
        clienteData.fechaNacimiento = data.fechaNacimiento.trim();
      }
      if (anioCompraNumero !== undefined) {
        clienteData.anioCompra = anioCompraNumero;
      }
      if (data.tipoCliente && data.tipoCliente.trim()) {
        clienteData.tipoCliente = data.tipoCliente.trim();
      }
      if (data.observaciones && data.observaciones.trim()) {
        clienteData.observaciones = data.observaciones.trim();
      }

      await ClienteService.update(clienteId, clienteData);
      setSuccess("Cliente actualizado exitosamente.");

      // Redirigir después de un momento
      setTimeout(() => {
        router.push("/admin/clientes/lista");
      }, 2000);
    } catch (err) {
      console.error("Error al actualizar cliente:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al actualizar cliente");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/clientes/lista");
  };

  // Mostrar loading mientras carga el cliente
  if (loadingCliente) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-500 mx-auto mb-4" />
            <p className="text-slate-600">Cargando datos del cliente...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mostrar error si no se pudo cargar
  if (error && !cliente) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Error al cargar cliente
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleCancel} variant="outline">
                Volver a la Lista
              </Button>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mostrar mensaje de éxito
  if (success) {
    return (
      <Card className="border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              ¡Cliente actualizado exitosamente!
            </h3>
            <p className="text-slate-600 mb-4">
              Los cambios han sido guardados correctamente.
            </p>
            <p className="text-sm text-slate-500">
              Redirigiendo a la lista de clientes...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información actual del cliente */}
      {cliente && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">
              Editando: {cliente.nombreCompleto || "Cliente sin nombre"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-700">Email:</span>{" "}
                {cliente.correoElectronico || "No especificado"}
              </div>
              <div>
                <span className="font-medium text-blue-700">Teléfono:</span>{" "}
                {cliente.telefonoCelular || "No especificado"}
              </div>
              <div>
                <span className="font-medium text-blue-700">Ubicación:</span>{" "}
                {[cliente.localidad, cliente.provincia]
                  .filter(Boolean)
                  .join(", ") || "No especificado"}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Datos Personales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-600" />
            Datos Personales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Error general */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="nombreCompleto"
                  className="text-slate-700 font-medium"
                >
                  Nombre Completo
                </Label>
                <Input
                  id="nombreCompleto"
                  {...register("nombreCompleto")}
                  placeholder="Nombre completo del cliente"
                  className={`border-slate-300 focus:border-cyan-400 focus:ring-cyan-400 ${
                    errors.nombreCompleto
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {errors.nombreCompleto && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nombreCompleto.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="fechaNacimiento"
                  className="text-slate-700 font-medium"
                >
                  Fecha de Nacimiento
                </Label>
                <Input
                  id="fechaNacimiento"
                  {...register("fechaNacimiento")}
                  type="date"
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="correoElectronico"
                className="text-slate-700 font-medium"
              >
                Correo Electrónico
              </Label>
              <Input
                id="correoElectronico"
                {...register("correoElectronico")}
                type="email"
                placeholder="cliente@email.com"
                className={`border-slate-300 focus:border-cyan-400 focus:ring-cyan-400 ${
                  errors.correoElectronico
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {errors.correoElectronico && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.correoElectronico.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="telefonoCelular"
                  className="text-slate-700 font-medium"
                >
                  Teléfono Celular
                </Label>
                <Input
                  id="telefonoCelular"
                  {...register("telefonoCelular")}
                  placeholder="Número de celular"
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="telefonoFijo"
                  className="text-slate-700 font-medium"
                >
                  Teléfono Fijo
                </Label>
                <Input
                  id="telefonoFijo"
                  {...register("telefonoFijo")}
                  placeholder="Número fijo"
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="provincia"
                  className="text-slate-700 font-medium"
                >
                  Provincia
                </Label>
                <Input
                  id="provincia"
                  {...register("provincia")}
                  placeholder="Provincia"
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="localidad"
                  className="text-slate-700 font-medium"
                >
                  Localidad
                </Label>
                <Input
                  id="localidad"
                  {...register("localidad")}
                  placeholder="Ciudad o localidad"
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion" className="text-slate-700 font-medium">
                Dirección
              </Label>
              <Input
                id="direccion"
                {...register("direccion")}
                placeholder="Dirección completa"
                className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Datos del Vehículo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-green-600" />
            Datos del Vehículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="tipoVehiculo"
                  className="text-slate-700 font-medium"
                >
                  Tipo de Vehículo
                </Label>
                <Input
                  id="tipoVehiculo"
                  {...register("tipoVehiculo")}
                  placeholder="Ej: Auto, Moto, Camioneta"
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="anioCompra"
                  className="text-slate-700 font-medium"
                >
                  Año de Compra
                </Label>
                <Input
                  id="anioCompra"
                  {...register("anioCompra")}
                  type="number"
                  min="1900"
                  max="2100"
                  placeholder="2023"
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marca" className="text-slate-700 font-medium">
                  Marca
                </Label>
                <Input
                  id="marca"
                  {...register("marca")}
                  placeholder="Ej: Toyota, Ford, Honda"
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelo" className="text-slate-700 font-medium">
                  Modelo
                </Label>
                <Input
                  id="modelo"
                  {...register("modelo")}
                  placeholder="Ej: Corolla, Focus, Civic"
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="tipoCliente"
                  className="text-slate-700 font-medium"
                >
                  Tipo de Cliente
                </Label>
                <select
                  id="tipoCliente"
                  {...register("tipoCliente")}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-cyan-400 focus:ring-cyan-400"
                >
                  <option value="">Seleccionar tipo...</option>
                  <option value="Comprador">Comprador</option>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Consultor">Consultor</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="observaciones"
                className="text-slate-700 font-medium"
              >
                Observaciones
              </Label>
              <textarea
                id="observaciones"
                {...register("observaciones")}
                placeholder="Notas adicionales sobre el cliente..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-cyan-400 focus:ring-cyan-400 min-h-[80px] resize-y"
                rows={3}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 mt-8 pt-4 border-t border-slate-200">
              <Button
                onClick={handleSubmit(onSubmit)}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3"
                disabled={isLoading || isSubmitting}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                disabled={isLoading || isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditarClienteForm;
