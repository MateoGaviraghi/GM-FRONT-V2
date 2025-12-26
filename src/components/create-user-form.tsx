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
import { UserPlus, Eye, EyeOff, CheckCircle } from "lucide-react";
import { UsuarioService } from "@/services";
import { CreateUsuarioRequest } from "@/types";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  nombre: string;
  role: "user" | "admin";
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  nombre?: string;
  general?: string;
}

export function CreateUserForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    role: "user",
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar email solo si se proporciona
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Email inválido";
    }

    // Validar contraseña solo si se proporciona
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    // Validar confirmación de contraseña solo si hay contraseña
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
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
      const userData: CreateUsuarioRequest = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        nombre: formData.nombre.trim(),
        role: formData.role,
      };

      // Llamar al servicio
      await UsuarioService.create(userData);

      setIsSuccess(true);

      // Limpiar formulario después de un momento
      setTimeout(() => {
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          nombre: "",
          role: "user",
        });
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setErrors({
        general:
          error instanceof Error ? error.message : "Error al crear usuario",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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
      <Card className="border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              ¡Usuario creado exitosamente!
            </h3>
            <p className="text-slate-600">
              El nuevo usuario ya puede acceder al sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-cyan-600" />
          Crear Nuevo Usuario
        </CardTitle>
        <CardDescription>
          Completa los datos para crear un nuevo usuario en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error general */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <span className="text-red-700 text-sm">{errors.general}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-slate-700 font-medium">
              Nombre Completo
            </Label>
            <Input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Nombre completo del usuario"
              value={formData.nombre}
              onChange={handleChange}
              className={`border-slate-300 focus:border-cyan-400 focus:ring-cyan-400 ${
                errors.nombre
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">
              Correo Electrónico
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="usuario@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              className={`border-slate-300 focus:border-cyan-400 focus:ring-cyan-400 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-slate-700 font-medium">
              Rol del Usuario
            </Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-background px-3 py-2 text-sm focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
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
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={handleChange}
                className={`border-slate-300 focus:border-cyan-400 focus:ring-cyan-400 pr-10 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-slate-700 font-medium"
            >
              Confirmar Contraseña
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repite la contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`border-slate-300 focus:border-cyan-400 focus:ring-cyan-400 pr-10 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 mt-6"
            disabled={isLoading}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {isLoading ? "Creando usuario..." : "Crear Usuario"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
