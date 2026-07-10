"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  AdminButton,
  DraftBanner,
  Field,
  formatTelefonoAR,
  FormSection,
  FormShell,
  MaskedInput,
  SelectField,
  Skeleton,
  TextareaField,
  TextInput,
  mapApiError,
  useFormDraft,
  useToast,
  useUnsavedGuard,
} from "@/components/admin/kit";
import { ClienteService, CreateClienteRequest } from "@/services";
import { CheckCircle, AlertCircle, X } from "lucide-react";
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
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Un ÚNICO useWatch global; los valores puntuales se derivan de él (4R2.f-5)
  const allValues = useWatch({ control });
  const telefonoCelularValue = allValues.telefonoCelular || "";
  const telefonoFijoValue = allValues.telefonoFijo || "";

  const { hasDraft, restoreDraft, dismissDraft } = useFormDraft<FormData>(
    `cliente-editar-${clienteId}`,
    allValues as FormData,
    (draft) => reset(draft)
  );
  useUnsavedGuard(isDirty);

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
        setValue("telefonoCelular", formatTelefonoAR(clienteData.telefonoCelular || ""));
        setValue("telefonoFijo", formatTelefonoAR(clienteData.telefonoFijo || ""));
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
        showToast({ variant: "danger", message: mapApiError(err) });
      } finally {
        setLoadingCliente(false);
      }
    };

    if (clienteId) {
      cargarCliente();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      showToast({ variant: "success", message: "Los cambios se guardaron correctamente." });

      // Redirigir después de un momento
      setTimeout(() => {
        router.push("/admin/clientes/lista");
      }, 2000);
    } catch (err) {
      console.error("Error al actualizar cliente:", err);
      const message = err instanceof Error ? err.message : "Error al actualizar cliente";
      setError(message);
      showToast({ variant: "danger", message: mapApiError(err) });
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
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <Skeleton className="h-7 w-64" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>
        <p className="text-center text-[16px] text-gray-500">Cargando datos del cliente…</p>
      </div>
    );
  }

  // Mostrar error si no se pudo cargar
  if (error && !cliente) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle className="size-7" strokeWidth={1.75} aria-hidden />
        </span>
        <h3 className="mb-2 text-[20px] font-semibold text-gray-900">Error al cargar cliente</h3>
        <p className="mb-4 text-[16px] font-medium text-red-600">{error}</p>
        <div className="flex justify-center gap-3">
          <AdminButton variant="secondary" onClick={handleCancel}>
            Volver a la lista
          </AdminButton>
          <AdminButton variant="primary" onClick={() => window.location.reload()}>
            Reintentar
          </AdminButton>
        </div>
      </div>
    );
  }

  // Mostrar mensaje de éxito
  if (success) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle className="size-7" strokeWidth={1.75} aria-hidden />
        </span>
        <h3 className="mb-2 text-[20px] font-semibold text-gray-900">¡Cliente actualizado exitosamente!</h3>
        <p className="mb-4 text-[16px] text-gray-500">Los cambios han sido guardados correctamente.</p>
        <p className="text-[16px] text-gray-500">Redirigiendo a la lista de clientes…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hasDraft ? <DraftBanner onRestore={restoreDraft} onDismiss={dismissDraft} /> : null}

      {/* Información actual del cliente */}
      {cliente && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-[16.5px] font-semibold text-gray-900">
            Editando: {cliente.nombreCompleto || "Cliente sin nombre"}
          </h2>
          <div className="grid grid-cols-1 gap-3 text-[16px] text-gray-500 md:grid-cols-3">
            <div>
              <span className="font-semibold text-gray-900">Email:</span>{" "}
              {cliente.correoElectronico || "No especificado"}
            </div>
            <div>
              <span className="font-semibold text-gray-900">Teléfono:</span>{" "}
              {cliente.telefonoCelular || "No especificado"}
            </div>
            <div>
              <span className="font-semibold text-gray-900">Ubicación:</span>{" "}
              {[cliente.localidad, cliente.provincia].filter(Boolean).join(", ") || "No especificado"}
            </div>
          </div>
        </div>
      )}

      <FormShell eyebrow="Clientes" title="Editar cliente" description="Modificá los datos del cliente. Los campos vacíos se pueden completar.">
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
              <TextInput id="provincia" {...register("provincia")} placeholder="Provincia" />
            </Field>

            <Field label="Localidad" htmlFor="localidad">
              <TextInput id="localidad" {...register("localidad")} placeholder="Ciudad o localidad" />
            </Field>

            <Field label="Dirección" htmlFor="direccion" className="md:col-span-2">
              <TextInput id="direccion" {...register("direccion")} placeholder="Dirección completa" />
            </Field>
          </FormSection>
        </form>

        <FormSection title="Datos del vehículo" index={2}>
          <Field label="Tipo de vehículo" htmlFor="tipoVehiculo">
            <TextInput
              id="tipoVehiculo"
              {...register("tipoVehiculo")}
              placeholder="Ej: Auto, Moto, Camioneta"
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
            <TextInput id="marca" {...register("marca")} placeholder="Ej: Toyota, Ford, Honda" />
          </Field>

          <Field label="Modelo" htmlFor="modelo">
            <TextInput id="modelo" {...register("modelo")} placeholder="Ej: Corolla, Focus, Civic" />
          </Field>

          <Field label="Tipo de cliente" htmlFor="tipoCliente">
            <SelectField id="tipoCliente" {...register("tipoCliente")}>
              <option value="">Seleccionar tipo...</option>
              <option value="Comprador">Comprador</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Consultor">Consultor</option>
            </SelectField>
          </Field>

          <Field label="Observaciones" htmlFor="observaciones" className="md:col-span-2">
            <TextareaField
              id="observaciones"
              {...register("observaciones")}
              placeholder="Notas adicionales sobre el cliente..."
              rows={3}
            />
          </Field>

          <div className="col-span-full flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">
            <AdminButton
              variant="primary"
              icon={CheckCircle}
              className="flex-1"
              disabled={isLoading || isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              {isLoading ? "Actualizando…" : "Guardar cambios"}
            </AdminButton>

            <AdminButton
              variant="secondary"
              icon={X}
              className="flex-1"
              disabled={isLoading || isSubmitting}
              onClick={handleCancel}
            >
              Cancelar
            </AdminButton>
          </div>
        </FormSection>
      </FormShell>
    </div>
  );
}

export default EditarClienteForm;
