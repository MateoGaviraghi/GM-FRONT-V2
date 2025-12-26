import React from "react";
import { AutocompleteInput } from "./autocomplete-input";
import {
  useVehiculoOptions,
  useModelosByMarca,
  getOptionsFromData,
} from "@/hooks/useVehiculoOptions";
import { Loader2 } from "lucide-react";

interface DynamicAutocompleteProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  field:
    | "marcas"
    | "tipos"
    | "combustibles"
    | "transmisiones"
    | "tracciones"
    | "estados";
  placeholder?: string;
  className?: string;
  allowCustom?: boolean;
  disabled?: boolean;
  isAdmin?: boolean;
  noOptionsText?: string;
}

interface DynamicModeloAutocompleteProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  marca: string;
  placeholder?: string;
  className?: string;
  allowCustom?: boolean;
  disabled?: boolean;
  isAdmin?: boolean;
  noOptionsText?: string;
}

// Componente para campos simples (marca, tipos, combustible, etc.)
export const DynamicAutocomplete: React.FC<DynamicAutocompleteProps> = ({
  id,
  name,
  value,
  onChange,
  field,
  placeholder = "Escribir o seleccionar...",
  className = "px-4 py-3",
  allowCustom = true,
  disabled = false,
  isAdmin = false,
  noOptionsText = "No se encontraron opciones",
}) => {
  const { options, loading, error } = useVehiculoOptions({
    isAdmin,
    enableFallback: true,
  });

  // Mostrar loader mientras carga
  if (loading) {
    return (
      <div
        className={`relative ${
          className.includes("border")
            ? className
            : `border border-gray-300 rounded-lg ${className}`
        }`}
      >
        <div className="flex items-center justify-center h-12">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-500">
            Cargando opciones...
          </span>
        </div>
      </div>
    );
  }

  // Mostrar error si ocurrió (pero con fallback)
  if (error && !options) {
    return (
      <div
        className={`relative ${
          className.includes("border")
            ? className
            : `border border-red-300 rounded-lg ${className}`
        }`}
      >
        <div className="flex items-center justify-center h-12">
          <span className="text-sm text-red-600">Error cargando opciones</span>
        </div>
      </div>
    );
  }

  const fieldOptions = getOptionsFromData(options, field);

  return (
    <AutocompleteInput
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      options={fieldOptions}
      placeholder={placeholder}
      className={className}
      allowCustom={allowCustom}
      disabled={disabled}
      noOptionsText={noOptionsText}
    />
  );
};

// Componente específico para modelos (depende de la marca)
export const DynamicModeloAutocomplete: React.FC<
  DynamicModeloAutocompleteProps
> = ({
  id,
  name,
  value,
  onChange,
  marca,
  placeholder = "Escribir o seleccionar modelo...",
  className = "px-4 py-3",
  allowCustom = true,
  disabled = false,
  isAdmin = false,
  noOptionsText,
}) => {
  const { options, loading, error } = useVehiculoOptions({
    isAdmin,
    enableFallback: true,
  });
  const modelosDisponibles = useModelosByMarca(marca, options);

  // Determinar el texto cuando no hay opciones
  const defaultNoOptionsText = !marca
    ? "Primero selecciona una marca"
    : "No hay modelos disponibles para esta marca";

  // Mostrar loader mientras carga
  if (loading) {
    return (
      <div
        className={`relative ${
          className.includes("border")
            ? className
            : `border border-gray-300 rounded-lg ${className}`
        }`}
      >
        <div className="flex items-center justify-center h-12">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-500">
            Cargando modelos...
          </span>
        </div>
      </div>
    );
  }

  // Mostrar error si ocurrió (pero con fallback)
  if (error && !options) {
    return (
      <div
        className={`relative ${
          className.includes("border")
            ? className
            : `border border-red-300 rounded-lg ${className}`
        }`}
      >
        <div className="flex items-center justify-center h-12">
          <span className="text-sm text-red-600">Error cargando modelos</span>
        </div>
      </div>
    );
  }

  return (
    <AutocompleteInput
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      options={modelosDisponibles}
      placeholder={placeholder}
      className={className}
      allowCustom={allowCustom}
      disabled={disabled || !marca}
      noOptionsText={noOptionsText || defaultNoOptionsText}
    />
  );
};

// Componente wrapper que determina automáticamente el tipo
interface SmartAutocompleteProps
  extends Omit<DynamicAutocompleteProps, "field"> {
  field:
    | "marcas"
    | "modelos"
    | "tipos"
    | "combustibles"
    | "transmisiones"
    | "tracciones"
    | "estados";
  marca?: string; // Solo necesario para el campo 'modelos'
}

export const SmartAutocomplete: React.FC<SmartAutocompleteProps> = ({
  field,
  marca,
  ...props
}) => {
  if (field === "modelos") {
    if (!marca) {
      console.warn('SmartAutocomplete: marca is required when field="modelos"');
    }
    return <DynamicModeloAutocomplete {...props} marca={marca || ""} />;
  }

  return <DynamicAutocomplete {...props} field={field} />;
};
