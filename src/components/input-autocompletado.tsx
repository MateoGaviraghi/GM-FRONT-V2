"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClienteService } from "@/services";
import { Search, ChevronDown } from "lucide-react";

interface InputAutocompletadoProps {
  campo: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
}

export function InputAutocompletado({
  campo,
  label,
  value,
  onChange,
  placeholder = "",
  disabled = false,
  required = false,
  className = "",
  error,
}: InputAutocompletadoProps) {
  const [sugerencias, setSugerencias] = useState<string[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [indiceSugerencia, setIndiceSugerencia] = useState(-1);
  const [cargando, setCargando] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Buscar sugerencias cuando cambia el valor
  useEffect(() => {
    const buscarSugerencias = async () => {
      if (!value || value.length < 2) {
        setSugerencias([]);
        setMostrarSugerencias(false);
        return;
      }

      try {
        setCargando(true);
        const resultados = await ClienteService.suggestions(campo, value, 8);

        // Filtrar para mostrar solo las que no son exactamente iguales al valor actual
        const sugerenciasFiltradas = resultados.filter(
          (s) => s.toLowerCase() !== value.toLowerCase()
        );

        setSugerencias(sugerenciasFiltradas);
        setMostrarSugerencias(sugerenciasFiltradas.length > 0);
        setIndiceSugerencia(-1);
      } catch (err) {
        console.error("Error al buscar sugerencias:", err);
        setSugerencias([]);
        setMostrarSugerencias(false);
      } finally {
        setCargando(false);
      }
    };

    // Debounce: esperar 300ms después de que el usuario deje de escribir
    const timeoutId = setTimeout(buscarSugerencias, 300);

    return () => clearTimeout(timeoutId);
  }, [value, campo]);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setMostrarSugerencias(false);
        setIndiceSugerencia(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const seleccionarSugerencia = (sugerencia: string) => {
    onChange(sugerencia);
    setMostrarSugerencias(false);
    setIndiceSugerencia(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!mostrarSugerencias || sugerencias.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIndiceSugerencia((prev) =>
          prev < sugerencias.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setIndiceSugerencia((prev) =>
          prev > 0 ? prev - 1 : sugerencias.length - 1
        );
        break;

      case "Enter":
        e.preventDefault();
        if (indiceSugerencia >= 0) {
          seleccionarSugerencia(sugerencias[indiceSugerencia]);
        }
        break;

      case "Escape":
        setMostrarSugerencias(false);
        setIndiceSugerencia(-1);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleInputFocus = () => {
    if (sugerencias.length > 0) {
      setMostrarSugerencias(true);
    }
  };

  return (
    <div ref={containerRef} className="relative space-y-2">
      <Label htmlFor={campo} className="text-slate-700 font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {cargando && (
          <span className="text-xs text-slate-400 ml-2">(buscando...)</span>
        )}
      </Label>

      <div className="relative">
        <Input
          ref={inputRef}
          id={campo}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`${className} ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : ""
          } pr-8`}
          autoComplete="off"
        />

        {/* Icono de búsqueda/dropdown */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {cargando ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
          ) : (
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${
                mostrarSugerencias ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>

      {/* Lista de sugerencias */}
      {mostrarSugerencias && sugerencias.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <ul
            ref={listRef}
            className="bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {sugerencias.map((sugerencia, index) => (
              <li
                key={index}
                className={`px-3 py-2 cursor-pointer text-sm transition-colors ${
                  index === indiceSugerencia
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => seleccionarSugerencia(sugerencia)}
                onMouseEnter={() => setIndiceSugerencia(index)}
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3 h-3 text-slate-400" />
                  <span>{sugerencia}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-500 text-xs">{error}</p>}

      {/* Ayuda del usuario */}
      {value.length > 0 && value.length < 2 && (
        <p className="text-slate-400 text-xs">
          Escribe al menos 2 caracteres para ver sugerencias
        </p>
      )}
    </div>
  );
}

export default InputAutocompletado;
