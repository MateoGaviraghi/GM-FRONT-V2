"use client";

/**
 * MaskedInput — Mostrador (A0R). TextInput controlado con máscara automática
 * (teléfono / precio / patente / fecha), ver masks.ts. El label y el error los
 * sigue poniendo <Field/> — este componente sólo formatea el valor.
 */

import { applyMask, MASK_EXAMPLE, type MaskType } from "./masks";
import { TextInput, type TextInputProps } from "./form";

export type MaskedInputProps = Omit<TextInputProps, "onChange" | "value"> & {
  mask: MaskType;
  value: string;
  onChange: (formattedValue: string) => void;
  /** Muestra el ejemplo de formato debajo del campo si no hay placeholder propio. */
  showExample?: boolean;
};

export function MaskedInput({ mask, value, onChange, placeholder, showExample = true, ...props }: MaskedInputProps) {
  return (
    <TextInput
      {...props}
      inputMode={mask === "patente" ? "text" : "numeric"}
      value={value}
      placeholder={placeholder ?? (showExample ? MASK_EXAMPLE[mask] : undefined)}
      onChange={(e) => onChange(applyMask(mask, e.target.value))}
    />
  );
}

export { MASK_EXAMPLE };
