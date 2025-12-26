"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, LogIn, CheckCircle } from "lucide-react";
import { UsuarioService } from "@/services";
import { LoginRequest } from "@/types";
import { useRouter } from "next/navigation";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function LoginForm() {
  const router = useRouter();
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
      <Card className="border-2 border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              ¡Bienvenido!
            </h2>
            <p className="text-slate-600 mb-6">
              Has iniciado sesión correctamente. Redirigiendo...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gray-200 mx-4 md:mx-0">
      <CardHeader className="text-center px-4 md:px-6">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-6 h-6 md:w-8 md:h-8 text-cyan-600" />
        </div>
        <CardTitle className="text-xl md:text-2xl text-slate-800">
          Bienvenido de vuelta
        </CardTitle>
        <CardDescription className="text-sm md:text-base">
          Ingresa tus credenciales para acceder
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Error general */}
          {errors.general && (
            <div
              className={`border rounded-md p-3 flex items-start gap-2 ${
                rateLimitCountdown > 0
                  ? "bg-orange-50 border-orange-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <LogIn
                className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                  rateLimitCountdown > 0 ? "text-orange-500" : "text-red-500"
                }`}
              />
              <div className="flex-1">
                <span
                  className={`text-sm ${
                    rateLimitCountdown > 0 ? "text-orange-700" : "text-red-700"
                  }`}
                >
                  {errors.general}
                </span>
                {rateLimitCountdown > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="text-2xl font-bold text-orange-600">
                      {rateLimitCountdown}s
                    </div>
                    <div className="text-xs text-orange-600">restantes</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">
              Correo Electrónico
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className={`border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Tu contraseña"
                className={`border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 pr-10 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 md:py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || rateLimitCountdown > 0}
          >
            <LogIn className="w-4 h-4 mr-2" />
            {isLoading
              ? "Iniciando sesión..."
              : rateLimitCountdown > 0
              ? `Espera ${rateLimitCountdown}s`
              : "Iniciar Sesión"}
          </Button>

          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600">
              Acceso exclusivo para administradores autorizados
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
