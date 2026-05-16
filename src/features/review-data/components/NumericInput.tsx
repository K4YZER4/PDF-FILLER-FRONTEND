/**
 * ──────────────────────────────────────────────────────────────────────────────
 * NumericInput.tsx  —  Input que solo acepta dígitos numéricos
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * ¿Qué hace?
 *   Renderiza un <input> que descarta cualquier carácter no numérico (0-9).
 *   Usa inputMode="numeric" para abrir el teclado numérico en móvil.
 *
 * ¿Para qué campos se usa?
 *   - Código Postal    (maxLength=5)
 *   - No. Exterior     (maxLength=6)
 *   - Teléfono         (maxLength=10)
 *   - Ingreso Mensual  (maxLength=10)
 *   - No. Cuenta       (maxLength=10)
 *   - No. Empleado     (maxLength=10)
 *
 * Props:
 *   maxLength?: number  →  Longitud máxima (se pasa desde RevisionDatos)
 *   onChange: (value: string) => void  →  Solo dígitos
 *
 * Diferencia con Input base:
 *   - onChange recibe string en lugar de ChangeEvent
 *   - Filtra automáticamente \D (no dígitos)
 *   - inputMode="numeric" + pattern="[0-9]*" para UX móvil
 *   - autoCorrect="off" evita autocorrecciones en iOS
 */

import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/ui";

type NumericInputProps = Omit<InputProps, "onChange"> & {
  onChange?: (value: string) => void;
};

const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ onChange, maxLength, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleaned = e.target.value.replace(/\D/g, "");
      const limited = maxLength ? cleaned.slice(0, maxLength) : cleaned;
      onChange?.(limited);
    };

    return (
      <Input
        ref={ref}
        type="text"
        step={1}
        inputMode="numeric"
        pattern="[0-9]*"
        autoCorrect="off"
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />
    );
  },
);

NumericInput.displayName = "NumericInput";
export { NumericInput };
