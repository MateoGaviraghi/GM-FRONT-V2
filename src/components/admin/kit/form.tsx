"use client";

/**
 * form.tsx — Soft SaaS (4R3). SOLO piel: lógica (react-hook-form/zod/handlers)
 * queda intacta en cada módulo. Label SIEMPRE arriba del campo, inputs h-11
 * rounded-lg text-16, error explica cómo corregir.
 */

import {
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- FormShell / FormSection ---------- */

export type FormShellProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

export function FormShell({ title, description, children, className }: FormShellProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-gray-900">{title}</h1>
        {description ? <p className="mt-1.5 text-[16px] text-gray-500">{description}</p> : null}
      </div>
      <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">{children}</div>
    </div>
  );
}

export type FormSectionProps = {
  title: string;
  index?: number;
  children: ReactNode;
  className?: string;
};

export function FormSection({ title, children, className }: FormSectionProps) {
  return (
    <section
      className={cn("col-span-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6", className)}
    >
      <h2 className="mb-5 text-[16.5px] font-semibold text-gray-900">{title}</h2>
      <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">{children}</div>
    </section>
  );
}

/* ---------- Field ---------- */

export type FieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

export function Field({ label, htmlFor, error, hint, required, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-[15.5px] font-semibold text-gray-800">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </label>
      {children}
      {error ? (
        <span className="flex items-start gap-1.5 text-[15px] font-medium text-red-600">
          <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden />
          {error}
        </span>
      ) : hint ? (
        <span className="text-[14.5px] text-gray-500">{hint}</span>
      ) : null}
    </div>
  );
}

/* ---------- Controles crudos ---------- */

const controlBase = cn(
  "h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-[16px] text-gray-900 placeholder:text-gray-400",
  "transition-[border-color,box-shadow] duration-150",
  "focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 focus:outline-none",
  "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60"
);

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

export function TextInput({ className, invalid, ...props }: TextInputProps) {
  return <input className={cn(controlBase, invalid && "border-red-500", className)} {...props} />;
}

export type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean };

export function TextareaField({ className, invalid, ...props }: TextareaFieldProps) {
  return (
    <textarea
      className={cn(controlBase, "h-auto min-h-32 resize-y py-3", invalid && "border-red-500", className)}
      {...props}
    />
  );
}

export type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean };

export function SelectField({ className, invalid, children, ...props }: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        className={cn(controlBase, "appearance-none pr-10", invalid && "border-red-500", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-gray-400"
        strokeWidth={2}
        aria-hidden
      />
    </div>
  );
}

/* ---------- SwitchField ---------- */

export type SwitchFieldProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export function SwitchField({ checked, onChange, label, disabled, className }: SwitchFieldProps) {
  return (
    <label className={cn("inline-flex select-none items-center gap-3", disabled && "opacity-50", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        style={{ minHeight: 26, maxHeight: 26 }}
        className={cn(
          "relative h-[26px] w-11 shrink-0 rounded-full border transition-colors duration-150 disabled:cursor-not-allowed",
          checked ? "border-gray-900 bg-gray-900" : "border-gray-200 bg-gray-100"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-1/2 left-0.5 size-[20px] -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-150",
            checked && "translate-x-[18px]"
          )}
        />
      </button>
      {label ? <span className="text-[16px] font-medium text-gray-900">{label}</span> : null}
    </label>
  );
}

/* ---------- AccordionSection ---------- */

export type AccordionSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
};

export function AccordionSection({ title, defaultOpen, children, className }: AccordionSectionProps) {
  const [open, setOpen] = useState(Boolean(defaultOpen));

  return (
    <div className={cn("rounded-2xl border border-gray-100 bg-white shadow-sm", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between px-5 py-4 text-[16.5px] font-semibold text-gray-900 transition-colors duration-150 hover:bg-gray-50",
          open ? "rounded-t-2xl" : "rounded-2xl"
        )}
      >
        {title}
        <ChevronRight
          aria-hidden
          className={cn("size-5 shrink-0 text-gray-400 transition-transform duration-150", open && "rotate-90")}
          strokeWidth={2}
        />
      </button>
      {open ? (
        <div className="grid gap-x-6 gap-y-6 border-t border-gray-100 px-5 py-6 md:grid-cols-2">{children}</div>
      ) : null}
    </div>
  );
}

/* ---------- AutocompleteFieldShell ---------- */

/**
 * Envoltorio VISUAL para los autocompletes existentes (SmartAutocomplete,
 * Dynamic*Autocomplete): reusa Field para dar label+error consistentes sin
 * tocar la lógica de esos componentes.
 */
export function AutocompleteFieldShell(props: FieldProps) {
  return <Field {...props} />;
}
