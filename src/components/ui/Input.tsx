/**
 * Archivo: /components/ui/Input.tsx
 * Propósito: Input reutilizable con todos los estados del diseño CREDIFOM.
 * Agnóstico al dominio — no sabe si captura CURP, email o contraseña.
 */
import { forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  // Muestra un asterisco rojo junto al label para indicar que el campo es obligatorio
  required?: boolean;
  // Muestra el borde rojo sin mensaje (campo obligatorio vacío)
  invalid?: boolean;
  // Mensaje de error que se muestra debajo del input y cambia el estilo a estado error
  error?: string;
  // Muestra el borde verde cuando el campo está correctamente lleno
  success?: boolean;
  // Texto de ayuda que se muestra debajo del input cuando no hay error
  hint?: string;
  // Muestra un badge "Auto ✓" para indicar que el campo fue autollenado por el navegador (ej: con contraseña guardada)
  autofilled?: boolean;
  // Permite pasar un ícono personalizado que se muestra a la derecha del input (ej: ícono de búsqueda)
  rightIcon?: React.ReactNode;
  // Permite pasar un ícono personalizado que se muestra a la izquierda del input (ej: ícono de búsqueda)
  leftIcon?: React.ReactNode;
  // Muestra el conteo de caracteres (ej: "12/50") a la derecha del input
  showCount?: boolean;
  // Tamaños reutilizables del input
  inputSize?: "sm" | "md" | "lg";
}

/**
 * Variantes de tamaño reutilizables.
 * Permiten adaptar el input según el contexto:
 * - sm → tablas, filtros, formularios densos
 * - md → tamaño estándar
 * - lg → formularios importantes / auth
 */
const sizeStyles = {
  sm: "py-2 text-sm",
  md: "py-2.5 text-[16px]",
  lg: "py-3 text-base",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      required = false,
      invalid = false,
      error,
      success = false,
      hint,
      autofilled = false,
      rightIcon,
      leftIcon,
      type = "text",
      inputSize = "md",
      className = "",
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    const hasRightSlot = isPassword || rightIcon;
    const hasLeftSlot = !!leftIcon;

    return (
      <div className="flex flex-col gap-1">
        {/* Label */}
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={id}
              className={cn(
                "text-sm font-medium",
                disabled ? "text-text-tertiary" : "text-text-primary",
              )}
            >
              {label}
              {required && (
                <span className="text-error ml-0.5" aria-hidden="true">
                  *
                </span>
              )}
            </label>

            {/* Badge autollenado */}
            {autofilled && !error && (
              <span className="text-xs font-medium bg-success-tint text-success px-2 py-0.5 rounded-full">
                Auto ✓
              </span>
            )}
          </div>
        )}

        {/* Input wrapper */}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={inputType}
            disabled={disabled}
            // Inputs numéricos:
            // - No permiten negativos
            // - Incrementan de 1000 en 1000 con las flechas
            min={type === "number" ? 0 : props.min}
            step={type === "number" ? 1000 : props.step}
            className={cn(
              // Base
              "w-full rounded-md border text-base transition-all duration-150",
              "placeholder:text-text-tertiary",
              // Padding — deja espacio si hay ícono derecho
              sizeStyles[inputSize],
              hasLeftSlot ? "pl-10" : "pl-3",
              hasRightSlot ? "pr-11" : "pr-3",
              // Estado default
              !error && !invalid && !autofilled && !success && !disabled && [
                  "border-border bg-surface text-text-primary",
                  "hover:border-border-secondary",
                  "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15",
                ],
              // Estado error (con mensaje)
              error && [
                "border-error text-text-primary",
                "focus:outline-none focus:border-error focus:ring-2 focus:ring-error/15",
              ],
              // Estado inválido (solo borde rojo, sin mensaje)
              invalid && !error && [
                "border-error text-text-primary",
                "focus:outline-none focus:border-error focus:ring-2 focus:ring-error/15",
              ],
              // Estado éxito (campo lleno)
              success && !error && !invalid && !autofilled && [
                "border-success text-text-primary",
                "focus:outline-none focus:border-success focus:ring-2 focus:ring-success/15",
              ],
              // Estado autollenado
              autofilled &&
                !error && [
                  "border-success text-success",
                  "focus:outline-none focus:border-success focus:ring-2 focus:ring-success/15",
                ],
              // Estado disabled
              disabled && [
                "border-border bg-bg text-text-tertiary",
                "cursor-not-allowed opacity-60",
              ],
              className,
            )}
            aria-invalid={!!error || invalid}
            aria-describedby={
              error ? `${id}-error` : hint ? `${id}-hint` : undefined
            }
            {...props}
          />

          {/* Ícono derecho — custom o toggle contraseña */}
          {hasRightSlot && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-text-tertiary hover:text-text-secondary transition-colors p-0.5"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
          {/* Icono izquierdo */}
          {hasLeftSlot && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {leftIcon}
            </div>
          )}
        </div>

        {/* Mensaje de error — oculto en móvil para reducir scroll */}
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="max-md:hidden flex items-center gap-1 text-xs text-error"
          >
            <AlertCircle size={13} aria-hidden="true" />
            {error}
          </p>
        )}

        {/* Hint — solo si no hay error */}
        {hint && !error && (
          <p id={`${id}-hint`} className="text-xs text-text-tertiary">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
