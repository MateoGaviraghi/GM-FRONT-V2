"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AutocompleteInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  options: string[];
  disabled?: boolean;
  maxHeight?: string;
  allowCustom?: boolean;
  loading?: boolean;
  noOptionsText?: string;
}

export function AutocompleteInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder = "Escribir o seleccionar...",
  className = "",
  options = [],
  disabled = false,
  maxHeight = "200px",
  allowCustom = true,
  loading = false,
  noOptionsText = "No se encontraron opciones",
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [textoLocal, setTextoLocal] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sincronizar el texto local si el value cambia desde afuera
  useEffect(() => {
    setTextoLocal(value);
  }, [value]);

  // Limpiar el debounce pendiente al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Filtrar opciones basado en el texto ingresado
  const filteredOptions = useMemo(() => {
    if (!textoLocal) {
      return options;
    }
    return options.filter((option) =>
      option.toLowerCase().includes(textoLocal.toLowerCase())
    );
  }, [textoLocal, options]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [textoLocal, options]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTextoLocal(newValue);
    setIsOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, 150);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Pequeño delay para permitir clicks en las opciones
    setTimeout(() => {
      if (onBlur) onBlur();
    }, 150);
  };

  const handleOptionSelect = (option: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setTextoLocal(option);
    onChange(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        } else if (allowCustom && textoLocal) {
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      case "Tab":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleToggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      inputRef.current?.focus();
    }
  };

  const clearValue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setTextoLocal("");
    onChange("");
    inputRef.current?.focus();
  };

  // Scroll automático para la opción resaltada
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  const showOptions = isOpen && !loading && filteredOptions.length > 0;
  const showNoOptions =
    isOpen && !loading && filteredOptions.length === 0 && textoLocal;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input principal */}
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          value={textoLocal}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`pr-20 ${className}`}
          autoComplete="off"
        />

        {/* Botones de control */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {textoLocal && !disabled && (
            <button
              type="button"
              onClick={clearValue}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              <X className="h-3 w-3" />
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleDropdown}
            disabled={disabled}
            className={`p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors ${
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
            tabIndex={-1}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown de opciones */}
      {(showOptions || showNoOptions || loading) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg">
          {loading && (
            <div className="p-3 text-center text-slate-500">
              <div className="inline-flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-600"></div>
                Cargando opciones...
              </div>
            </div>
          )}

          {showOptions && (
            <ul
              ref={listRef}
              className="py-1 overflow-y-auto"
              style={{ maxHeight }}
            >
              {filteredOptions.map((option, index) => (
                <li key={`${option}-${index}`}>
                  <button
                    type="button"
                    className={`w-full text-left px-3 py-2 hover:bg-cyan-50 focus:bg-cyan-50 focus:outline-none transition-colors ${
                      index === highlightedIndex
                        ? "bg-cyan-100 text-cyan-900"
                        : "text-slate-700"
                    }`}
                    onClick={() => handleOptionSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {showNoOptions && allowCustom && (
            <div className="p-3 text-slate-500 text-sm">
              <div className="flex flex-col gap-2">
                <span>{noOptionsText}</span>
                <span className="text-xs text-slate-400">
                  Puedes escribir un valor personalizado
                </span>
              </div>
            </div>
          )}

          {showNoOptions && !allowCustom && (
            <div className="p-3 text-slate-500 text-sm">{noOptionsText}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default AutocompleteInput;
