/**
 * ──────────────────────────────────────────────────────────────────────────────
 * DateInput.tsx  —  Input de fecha con calendario nativo del navegador
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * ¿Qué hace?
 *   Renderiza un <input type="date"> con el calendario nativo del navegador.
 *   El rango de fechas válido es:
 *     - Mínimo: 1935-01-01  (fecha razonable para una persona viva)
 *     - Máximo: Hoy - 18 años (solo mayores de edad)
 *
 * ¿Por qué type="date" nativo?
 *   - Funciona en todos los navegadores modernos
 *   - En móvil abre el date picker nativo del SO
 *   - No requiere librerías de calendario
 *   - Maneja automáticamente la validación de fechas inválidas
 *
 * Props:
 *   onChange: (isoValue: string) => void   →  "YYYY-MM-DD"
 *
 * Uso en RevisionDatos:
 *   <DateInput {...shared} onChange={(v) => update("ine", "fechaNacimiento", v)} />
 */

import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/ui";

/**
 * Fecha máxima permitida: hoy menos 18 años.
 * Se calcula una sola vez al cargar el módulo.
 */
const MAX_DATE = new Date(new Date().setFullYear(new Date().getFullYear() - 18))
  .toISOString()
  .split("T")[0];

type DateInputProps = Omit<InputProps, "onChange" | "type"> & {
  onChange?: (isoValue: string) => void;
};

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ onChange, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        min="1935-01-01"
        max={MAX_DATE}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
    );
  },
);

DateInput.displayName = "DateInput";
export { DateInput };
