"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminButton,
  DraftBanner,
  Field,
  FormSection,
  FormShell,
  MaskedInput,
  TextInput,
  TextareaField,
  mapApiError,
  useFormDraft,
  useToast,
  useUnsavedGuard,
} from "@/components/admin/kit";
import { ClienteService, CreateClienteRequest } from "@/services";
import { User, CheckCircle, AlertCircle } from "lucide-react";
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

const AUTOCOMPLETE_CLASS =
  "h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-[16px] text-gray-900 placeholder:text-gray-400 transition-[border-color,box-shadow] duration-150 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60";

export function CrearClienteForm() {
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Un ÚNICO useWatch global; los valores puntuales se derivan de él (4R2.f-5)
  const allValues = useWatch({ control });
  const provinciaValue = allValues.provincia || "";
  const localidadValue = allValues.localidad || "";
  const tipoVehiculoValue = allValues.tipoVehiculo || "";
  const marcaValue = allValues.marca || "";
  const modeloValue = allValues.modelo || "";
  const tipoClienteValue = allValues.tipoCliente || "";
  const telefonoCelularValue = allValues.telefonoCelular || "";
  const telefonoFijoValue = allValues.telefonoFijo || "";

  const { hasDraft, restoreDraft, dismissDraft } = useFormDraft<FormData>(
    "cliente-crear",
    allValues as FormData,
    (draft) => reset(draft)
  );
  useUnsavedGuard(isDirty);

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
      showToast({ variant: "success", message: "El cliente se guardó correctamente." });

      // Limpiar formulario después de un momento
      setTimeout(() => {
        reset();
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Error al crear cliente:", err);
      const message = err instanceof Error ? err.message : "Error al crear cliente";
      setError(message);
      showToast({ variant: "danger", message: mapApiError(err) });
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar mensaje de éxito
  if (success) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle className="size-7" strokeWidth={1.75} aria-hidden />
        </span>
        <h3 className="mb-2 text-[20px] font-semibold text-gray-900">¡Cliente creado exitosamente!</h3>
        <p className="text-[16px] text-gray-500">El cliente ha sido registrado en el sistema.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hasDraft ? <DraftBanner onRestore={restoreDraft} onDismiss={dismissDraft} /> : null}

      <FormShell eyebrow="Clientes" title="Crear cliente" description="Completá los datos del cliente. Los campos vacíos se pueden dejar en blanco.">
        {error && (
          <div className="col-span-full flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" strokeWidth={2} aria-hidden />
            <span className="text-[16px] font-medium text-red-600">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="contents">
          <FormSection title="Datos personales" index={1}>
            <Field label="Nombre completo" htmlFor="nombreCompleto" error={errors.nombreCompleto?.message}>
              <TextInput
                id="nombreCompleto"
                {...register("nombreCompleto")}
                placeholder="Nombre completo del cliente"
                invalid={!!errors.nombreCompleto}
              />
            </Field>

            <Field label="Fecha de nacimiento" htmlFor="fechaNacimiento">
              <TextInput id="fechaNacimiento" {...register("fechaNacimiento")} type="date" />
            </Field>

            <Field label="Correo electrónico" htmlFor="correoElectronico" error={errors.correoElectronico?.message}>
              <TextInput
                id="correoElectronico"
                {...register("correoElectronico")}
                type="email"
                placeholder="cliente@email.com"
                invalid={!!errors.correoElectronico}
              />
            </Field>

            <Field label="Teléfono celular" htmlFor="telefonoCelular">
              <MaskedInput
                id="telefonoCelular"
                mask="telefono"
                value={telefonoCelularValue}
                onChange={(v) => setValue("telefonoCelular", v, { shouldDirty: true })}
              />
            </Field>

            <Field label="Teléfono fijo" htmlFor="telefonoFijo">
              <MaskedInput
                id="telefonoFijo"
                mask="telefono"
                value={telefonoFijoValue}
                onChange={(v) => setValue("telefonoFijo", v, { shouldDirty: true })}
              />
            </Field>

            <Field label="Provincia" htmlFor="provincia">
              <AutocompleteInput
                id="provincia"
                name="provincia"
                value={provinciaValue}
                onChange={(value) => setValue("provincia", value, { shouldDirty: true })}
                options={PROVINCIAS_ARGENTINA}
                placeholder="Escribir o seleccionar provincia..."
                className={AUTOCOMPLETE_CLASS}
                allowCustom={true}
              />
            </Field>

            <Field label="Localidad" htmlFor="localidad">
              <AutocompleteInput
                id="localidad"
                name="localidad"
                value={localidadValue}
                onChange={(value) => setValue("localidad", value, { shouldDirty: true })}
                options={LOCALIDADES_PRINCIPALES}
                placeholder="Escribir o seleccionar localidad..."
                className={AUTOCOMPLETE_CLASS}
                allowCustom={true}
              />
            </Field>

            <Field label="Dirección" htmlFor="direccion" className="md:col-span-2">
              <TextInput id="direccion" {...register("direccion")} placeholder="Dirección completa" />
            </Field>
          </FormSection>
        </form>

        <FormSection title="Datos del vehículo" index={2}>
          <Field label="Tipo de vehículo" htmlFor="tipoVehiculo">
            <AutocompleteInput
              id="tipoVehiculo"
              name="tipoVehiculo"
              value={tipoVehiculoValue}
              onChange={(value) => setValue("tipoVehiculo", value, { shouldDirty: true })}
              options={TIPOS_VEHICULO}
              placeholder="Escribir o seleccionar tipo de vehículo..."
              className={AUTOCOMPLETE_CLASS}
              allowCustom={true}
            />
          </Field>

          <Field label="Año de compra" htmlFor="anioCompra">
            <TextInput
              id="anioCompra"
              {...register("anioCompra")}
              type="number"
              min="1900"
              max="2100"
              placeholder="2023"
            />
          </Field>

          <Field label="Marca" htmlFor="marca">
            <AutocompleteInput
              id="marca"
              name="marca"
              value={marcaValue}
              onChange={(value) => {
                setValue("marca", value, { shouldDirty: true });
                // Limpiar modelo cuando cambia la marca
                setValue("modelo", "", { shouldDirty: true });
              }}
              options={MARCAS_VEHICULOS}
              placeholder="Escribir o seleccionar marca..."
              className={AUTOCOMPLETE_CLASS}
              allowCustom={true}
            />
          </Field>

          <Field label="Modelo" htmlFor="modelo">
            <AutocompleteInput
              id="modelo"
              name="modelo"
              value={modeloValue}
              onChange={(value) => setValue("modelo", value, { shouldDirty: true })}
              options={getModelosPorMarca(marcaValue)}
              placeholder="Escribir o seleccionar modelo..."
              className={AUTOCOMPLETE_CLASS}
              allowCustom={true}
              noOptionsText={
                marcaValue ? "No hay modelos disponibles para esta marca" : "Primero selecciona una marca"
              }
            />
          </Field>

          <Field label="Tipo de cliente" htmlFor="tipoCliente">
            <AutocompleteInput
              id="tipoCliente"
              name="tipoCliente"
              value={tipoClienteValue}
              onChange={(value) => setValue("tipoCliente", value, { shouldDirty: true })}
              options={TIPOS_CLIENTE}
              placeholder="Escribir o seleccionar tipo de cliente..."
              className={AUTOCOMPLETE_CLASS}
              allowCustom={true}
            />
          </Field>

          <Field label="Observaciones" htmlFor="observaciones" className="md:col-span-2">
            <TextareaField
              id="observaciones"
              {...register("observaciones")}
              placeholder="Notas adicionales sobre el cliente..."
              rows={3}
            />
          </Field>

          <div className="col-span-full">
            <AdminButton
              variant="primary"
              icon={User}
              className="w-full"
              disabled={isLoading || isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              {isLoading ? "Creando cliente…" : "Crear cliente"}
            </AdminButton>
          </div>
        </FormSection>
      </FormShell>
    </div>
  );
}

export default CrearClienteForm;
