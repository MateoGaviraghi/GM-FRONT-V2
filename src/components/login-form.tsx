"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Eye, EyeOff, LogIn, CheckCircle, AlertCircle } from "lucide-react";
import { UsuarioService } from "@/services";
import { LoginRequest } from "@/types";
import { useRouter } from "next/navigation";
import { AdminButton, Field, TextInput } from "@/components/admin/kit";
import { cn } from "@/lib/utils";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function LoginForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Efecto para el countdown del rate limit
  React.useEffect(() => {
    if (rateLimitCountdown > 0) {
      const timer = setTimeout(() => {
        setRateLimitCountdown(rateLimitCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [rateLimitCountdown]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Preparar datos para el endpoint
      const loginData: LoginRequest = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      // Llamar al servicio de login
      await UsuarioService.login(loginData);

      // Guardar token en cookie para el middleware
      const token = localStorage.getItem("token");
      if (token) {
        // Establecer cookie con el token (expira en 7 días)
        document.cookie = `token=${token}; path=/; max-age=${
          7 * 24 * 60 * 60
        }; SameSite=Strict`;
      }

      setIsSuccess(true);

      // Limpiar formulario
      setFormData({
        email: "",
        password: "",
      });

      // Redirigir después de un momento
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      // Detectar error de rate limit (429)
      const errorMessage =
        error instanceof Error ? error.message : "Error al iniciar sesión";

      if (
        errorMessage.includes("Demasiados intentos") ||
        errorMessage.includes("rate limit")
      ) {
        setRateLimitCountdown(60); // 60 segundos de espera
        setErrors({
          general:
            "Demasiados intentos de inicio de sesión. Por favor espera 1 minuto antes de intentar nuevamente.",
        });
      } else {
        setErrors({
          general: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F7F9] px-4">
        <div className="w-full max-w-[420px] rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <CheckCircle className="mx-auto mb-4 size-12 text-emerald-500" strokeWidth={1.75} />
          <h2 className="text-[24px] font-semibold tracking-tight text-gray-900">¡Bienvenido!</h2>
          <p className="mt-1.5 text-[16px] text-gray-500">
            Iniciaste sesión correctamente. Te estamos llevando al panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F7F9] px-4">
      <div className="w-full max-w-[420px] rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Image
            src="/images/logo/logoGM-Photoroom.png"
            alt="Guzmán Motors"
            width={36}
            height={36}
            className="h-9 w-auto"
          />
          <span className="text-[17px] font-semibold tracking-tight text-gray-900">
            Guzmán Motors
          </span>
        </div>

        <h1 className="mt-7 text-[24px] font-semibold tracking-tight text-gray-900">
          Iniciar sesión
        </h1>
        <p className="mt-1.5 text-[16px] text-gray-500">Ingresá tus datos para entrar al panel</p>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-7 space-y-5">
          {/* Error general */}
          {errors.general && (
            <div
              className={cn(
                "flex items-start gap-2 rounded-xl border p-3.5",
                rateLimitCountdown > 0
                  ? "border-amber-100 bg-amber-50"
                  : "border-red-100 bg-red-50"
              )}
            >
              <AlertCircle
                className={cn("mt-0.5 size-5 shrink-0", rateLimitCountdown > 0 ? "text-amber-700" : "text-red-600")}
                strokeWidth={2}
              />
              <div className="flex-1">
                <span className={cn("text-[15px] font-medium", rateLimitCountdown > 0 ? "text-amber-700" : "text-red-600")}>
                  {errors.general}
                </span>
                {rateLimitCountdown > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-2xl font-bold text-amber-700">{rateLimitCountdown}s</span>
                    <span className="text-[15px] font-medium text-amber-700">restantes</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <Field label="Email" htmlFor="email" required error={errors.email}>
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              invalid={!!errors.email}
              required
            />
          </Field>

          <Field label="Contraseña" htmlFor="password" required error={errors.password}>
            <div className="relative">
              <TextInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Tu contraseña"
                invalid={!!errors.password}
                required
                className="pr-28"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 text-[16px] font-semibold text-gray-500 transition-colors duration-150 hover:text-gray-900"
              >
                {showPassword ? <EyeOff className="size-4" strokeWidth={2} /> : <Eye className="size-4" strokeWidth={2} />}
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </Field>

          <AdminButton
            variant="primary"
            icon={LogIn}
            type="submit"
            className={cn(
              "w-full",
              (isLoading || rateLimitCountdown > 0) && "pointer-events-none opacity-50"
            )}
            onClick={() => {
              if (isLoading || rateLimitCountdown > 0) return;
              formRef.current?.requestSubmit();
            }}
          >
            {isLoading
              ? "Iniciando sesión..."
              : rateLimitCountdown > 0
              ? `Esperá ${rateLimitCountdown}s`
              : "Iniciar sesión"}
          </AdminButton>
        </form>

        <p className="mt-6 text-center text-[14px] text-gray-400">
          Acceso exclusivo para administradores autorizados
        </p>
      </div>
    </div>
  );
}
