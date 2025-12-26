"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClienteService, CreateClienteRequest } from "@/services";
import { User, Car, CheckCircle } from "lucide-react";
import { AutocompleteInput } from "@/components/autocomplete-input";
import {
  PROVINCIAS_ARGENTINA,
  LOCALIDADES_PRINCIPALES,
  MARCAS_VEHICULOS,
  TIPOS_VEHICULO,
  TIPOS_CLIENTE,
  getModelosPorMarca,
} from "@/data/autocomplete-options";

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
  marca: z.string().optional(),
  modelo: z.string().optional(),
  anioCompra: z.string().optional(),
  tipoCliente: z.string().optional(),
  observaciones: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function CrearClienteForm() {
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Watch para autocompletado
  const provinciaValue = useWatch({ control, name: "provincia" }) || "";
  const localidadValue = useWatch({ control, name: "localidad" }) || "";
  const tipoVehiculoValue = useWatch({ control, name: "tipoVehiculo" }) || "";
  const marcaValue = useWatch({ control, name: "marca" }) || "";
  const modeloValue = useWatch({ control, name: "modelo" }) || "";
  const tipoClienteValue = useWatch({ control, name: "tipoCliente" }) || "";
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

      // Preparar datos para enviar
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

      await ClienteService.create(clienteData);
      setSuccess("Cliente creado exitosamente.");

      // Limpiar formulario después de un momento
      setTimeout(() => {
        reset();
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Error al crear cliente:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al crear cliente");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar mensaje de éxito
  if (success) {
    return (
      <Card className="border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              ¡Cliente creado exitosamente!
            </h3>
            <p className="text-slate-600">
              El cliente ha sido registrado en el sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Datos Personales */}
      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <User className="w-4 h-4 md:w-5 md:h-5 text-cyan-600" />
            Datos Personales
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Error general */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
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
                <AutocompleteInput
                  id="provincia"
                  name="provincia"
                  value={provinciaValue}
                  onChange={(value) => setValue("provincia", value)}
                  options={PROVINCIAS_ARGENTINA}
                  placeholder="Escribir o seleccionar provincia..."
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                  allowCustom={true}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="localidad"
                  className="text-slate-700 font-medium"
                >
                  Localidad
                </Label>
                <AutocompleteInput
                  id="localidad"
                  name="localidad"
                  value={localidadValue}
                  onChange={(value) => setValue("localidad", value)}
                  options={LOCALIDADES_PRINCIPALES}
                  placeholder="Escribir o seleccionar localidad..."
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                  allowCustom={true}
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
                <AutocompleteInput
                  id="tipoVehiculo"
                  name="tipoVehiculo"
                  value={tipoVehiculoValue}
                  onChange={(value) => setValue("tipoVehiculo", value)}
                  options={TIPOS_VEHICULO}
                  placeholder="Escribir o seleccionar tipo de vehículo..."
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                  allowCustom={true}
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
                <AutocompleteInput
                  id="marca"
                  name="marca"
                  value={marcaValue}
                  onChange={(value) => {
                    setValue("marca", value);
                    // Limpiar modelo cuando cambia la marca
                    setValue("modelo", "");
                  }}
                  options={MARCAS_VEHICULOS}
                  placeholder="Escribir o seleccionar marca..."
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                  allowCustom={true}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelo" className="text-slate-700 font-medium">
                  Modelo
                </Label>
                <AutocompleteInput
                  id="modelo"
                  name="modelo"
                  value={modeloValue}
                  onChange={(value) => setValue("modelo", value)}
                  options={getModelosPorMarca(marcaValue)}
                  placeholder="Escribir o seleccionar modelo..."
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                  allowCustom={true}
                  noOptionsText={
                    marcaValue
                      ? "No hay modelos disponibles para esta marca"
                      : "Primero selecciona una marca"
                  }
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
                <AutocompleteInput
                  id="tipoCliente"
                  name="tipoCliente"
                  value={tipoClienteValue}
                  onChange={(value) => setValue("tipoCliente", value)}
                  options={TIPOS_CLIENTE}
                  placeholder="Escribir o seleccionar tipo de cliente..."
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                  allowCustom={true}
                />
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

            <Button
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 mt-6"
              disabled={isLoading || isSubmitting}
            >
              <User className="w-4 h-4 mr-2" />
              {isLoading ? "Creando cliente..." : "Crear Cliente"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CrearClienteForm;
