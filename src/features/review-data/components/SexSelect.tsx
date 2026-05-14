/** Selector de sexo con opciones M (Masculino) y F (Femenino).
 *  Usa select nativo estilizado para mejor UX en móvil. */
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
              !error &&
                value &&
                "border-success focus:border-success focus:ring-success/15",
              error && "border-error focus:border-error focus:ring-error/15",
            )}
            aria-invalid={!!error}
            aria-required={required}
          >
            <option value="" disabled>
              Seleccionar
            </option>
            <option value="H">H — Hombre</option>
            <option value="M">M — Mujer</option>
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-text-secondary"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="max-md:hidden flex items-center gap-1 text-xs text-error"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

SexSelect.displayName = "SexSelect";
export { SexSelect };
