"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminButton,
  Field,
  FormSection,
  FormShell,
  SelectField,
  TextInput,
  mapApiError,
  useToast,
  useUnsavedGuard,
} from "@/components/admin/kit";
import { UsuarioService } from "@/services";
import { CreateUsuarioRequest } from "@/types";
import { UserPlus, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

const schema = z
  .object({
    nombre: z.string().optional(),
    email: z.string().trim().min(1, "Ingresá el correo electrónico").email("Revisá el correo: falta el @ o el dominio"),
    role: z.enum(["user", "admin"]),
    password: z.string().min(8, "La contraseña tiene que tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Repetí la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const DEFAULT_VALUES: FormData = {
  nombre: "",
  email: "",
  role: "user",
  password: "",
  confirmPassword: "",
};

type PasswordInputProps = React.ComponentProps<typeof TextInput>;

function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <TextInput {...props} type={visible ? "text" : "password"} className={`pr-12 ${className ?? ""}`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-700"
      >
        {visible ? (
          <EyeOff className="size-5" strokeWidth={1.75} aria-hidden />
        ) : (
          <Eye className="size-5" strokeWidth={1.75} aria-hidden />
        )}
      </button>
    </div>
  );
}

export function CreateUserForm() {
  const [createdEmail, setCreatedEmail] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  useUnsavedGuard(isDirty && !createdEmail);

  const onSubmit = async (data: FormData) => {
    setError(null);

    try {
      const userData: CreateUsuarioRequest = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
        nombre: data.nombre?.trim() || undefined,
        role: data.role,
      };

      await UsuarioService.create(userData);

      reset(DEFAULT_VALUES);
      setCreatedEmail(userData.email);
      showToast({ variant: "success", message: "Usuario creado." });
    } catch (err) {
      console.error("Error al crear usuario:", err);
      // UsuarioService ya traduce 409/400 a mensajes propios
      const message = err instanceof Error && err.message ? err.message : mapApiError(err);
      setError(message);
      showToast({ variant: "danger", message });
    }
  };

  if (createdEmail) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle className="size-7" strokeWidth={1.75} aria-hidden />
        </span>
        <h3 className="mb-2 text-[20px] font-semibold text-gray-900">¡Usuario creado!</h3>
        <p className="mb-6 text-[16px] text-gray-500">
          <span className="font-medium text-gray-700">{createdEmail}</span> ya puede ingresar al sistema.
        </p>
        <AdminButton variant="secondary" icon={UserPlus} onClick={() => setCreatedEmail(null)}>
          Crear otro usuario
        </AdminButton>
      </div>
    );
  }

  return (
    <FormShell
      eyebrow="Usuarios"
      title="Crear usuario"
      description="Cargá los datos de acceso. La persona entra con este correo y contraseña."
    >
      {error && (
        <div className="col-span-full flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" strokeWidth={2} aria-hidden />
          <span className="text-[16px] font-medium text-red-600">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="contents" noValidate>
        <FormSection title="Datos de la persona" index={1}>
          <Field label="Nombre completo" htmlFor="nombre" error={errors.nombre?.message}>
            <TextInput id="nombre" {...register("nombre")} placeholder="Nombre y apellido" autoComplete="off" />
          </Field>

          <Field label="Rol" htmlFor="role" hint="El administrador puede gestionar todo el panel.">
            <SelectField id="role" {...register("role")}>
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </SelectField>
          </Field>

          <Field
            label="Correo electrónico"
            htmlFor="email"
            required
            error={errors.email?.message}
            className="md:col-span-2"
          >
            <TextInput
              id="email"
              {...register("email")}
              type="email"
              placeholder="usuario@guzmanmotors.com.ar"
              autoComplete="off"
              invalid={!!errors.email}
            />
          </Field>
        </FormSection>

        <FormSection title="Contraseña" index={2}>
          <Field
            label="Contraseña"
            htmlFor="password"
            required
            error={errors.password?.message}
            hint="Mínimo 8 caracteres."
          >
            <PasswordInput
              id="password"
              {...register("password")}
              autoComplete="new-password"
              invalid={!!errors.password}
            />
          </Field>

          <Field label="Repetir contraseña" htmlFor="confirmPassword" required error={errors.confirmPassword?.message}>
            <PasswordInput
              id="confirmPassword"
              {...register("confirmPassword")}
              autoComplete="new-password"
              invalid={!!errors.confirmPassword}
            />
          </Field>

          <div className="col-span-full">
            <AdminButton type="submit" variant="primary" icon={UserPlus} className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creando usuario…" : "Crear usuario"}
            </AdminButton>
          </div>
        </FormSection>
      </form>
    </FormShell>
  );
}

export default CreateUserForm;
