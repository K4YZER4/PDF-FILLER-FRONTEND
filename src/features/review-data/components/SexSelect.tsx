/**
 * ──────────────────────────────────────────────────────────────────────────────
 * SexSelect.tsx  —  Selector de sexo estilizado (H / M)
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * ¿Qué hace?
 *   Renderiza un <select> nativo con las opciones "H — Hombre" y "M — Mujer".
 *   Usa un select nativo (no un custom dropdown) porque:
 *     1. En móvil abre el selector nativo del SO (mejor UX)
 *     2. Es accesible por defecto (screen readers, teclado)
 *     3. No requiere librerías adicionales
 *
 * Props:
 *   id, value, onChange, error, required, disabled
 *   onChange: (value: string) => void   →  H o M
 *
 * Estilo visual:
 *   - Flecha chevron SVG personalizada reemplazando la nativa (appearance-none)
 *   - Borde verde si hay valor, rojo si hay error, por defecto si está vacío
 *   - Mensaje de error oculto en móvil (max-md:hidden) para no ocupar espacio vertical
 *     (el error se ve en el borde rojo)
 *
 * Uso en RevisionDatos:
 *   Notar que NO usa el Input base, sino un <select> nativo directamente,
 *   porque Input está diseñado para <input> y no para <select>.
 */

import { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface SexSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const SexSelect = forwardRef<HTMLSelectElement, SexSelectProps>(
  ({ id, value, onChange, error, required, disabled }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <div className="relative">
          <select
            ref={ref}
            id={id}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "w-full rounded-md border px-3 py-2 text-sm",
              "bg-surface text-text-primary",
              "transition-all duration-150",
              "focus:outline-none focus:ring-2",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              "appearance-none pr-8",
              !error && !value && "border-border",
              !error && value && "border-success focus:border-success focus:ring-success/15",
              error && "border-error focus:border-error focus:ring-error/15",
            )}
            aria-invalid={!!error}
            aria-required={required}
          >
            <option value="" disabled>Seleccionar</option>
            <option value="H">H — Hombre</option>
            <option value="M">M — Mujer</option>
          </select>

          {/* Chevron personalizado que reemplaza la flecha nativa del select */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {error && (
          <p role="alert" className="max-md:hidden flex items-center gap-1 text-xs text-error">
            {error}
          </p>
        )}
      </div>
    );
  },
);

SexSelect.displayName = "SexSelect";
export { SexSelect };
