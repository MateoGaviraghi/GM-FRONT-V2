// 🎯 Hook personalizado para validaciones de vehículos
// Proporciona lógica de validación reutilizable

import { useState, useCallback } from "react";

export interface ValidationErrors {
  [key: string]: string;
}

export interface VehicleFormData {
  titulo: string;
  tipos: string;
  variantes: string;
  marca: string;
  modelo: string;
  kilometraje: string;
  tipoCombustible: string;
  motor: string;
  anio: string;
  transmisiones: string;
  tracciones: string;
  potenciaMaxima: string;
  capacidadCarga: string;
  sistemaFrenado: string;
  ejes: string;
  estado: string;
  descripcion: string;
}

export const useVehicleValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = useCallback((formData: VehicleFormData): boolean => {
    const newErrors: ValidationErrors = {};

    // Campos requeridos
    if (!formData.marca.trim()) newErrors.marca = "La marca es requerida";
    if (!formData.modelo.trim()) newErrors.modelo = "El modelo es requerido";
    if (!formData.tipos.trim())
      newErrors.tipos = "El tipo de vehículo es requerido";
    if (!formData.tipoCombustible.trim())
      newErrors.tipoCombustible = "El tipo de combustible es requerido";
    if (!formData.transmisiones.trim())
      newErrors.transmisiones = "El tipo de transmisión es requerido";

    // Validar kilometraje
    const km = parseFloat(formData.kilometraje);
    if (isNaN(km) || km < 0) {
      newErrors.kilometraje =
        "El kilometraje debe ser un número válido mayor o igual a 0";
    }

    // Validar año
    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.anio);
    if (isNaN(year) || year < 2020 || year > currentYear + 1) {
      newErrors.anio = `El año debe estar entre 2020 y ${currentYear + 1}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateForm,
    clearError,
    clearAllErrors,
    setErrors,
  };
};
