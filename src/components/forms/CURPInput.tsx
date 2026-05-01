/**
 * Archivo: components/forms/CURPInput.tsx
 * Propósito: Input para CURP con validación en tiempo real.
 * Convierte a mayúsculas, elimina caracteres especiales, límite 18 caracteres.
 */
import { forwardRef, useState, useCallback } from "react"
import { Input } from "@/components/ui"

interface CURPInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  error?: string
  autofilled?: boolean
  onChange?: (value: string) => void
}

/** Input especializado para CURP (18 caracteres alfanuméricos) */
const CURPInput = forwardRef<HTMLInputElement, CURPInputProps>(
  ({ error, autofilled, id, onChange, value, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(value as string || "")

    /** Convierte a mayúsculas y elimina caracteres no alfanuméricos */
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const upper = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")
        setDisplayValue(upper)
        onChange?.(upper)
      },
      [onChange]
    )

    return (
      <Input
        ref={ref}
        id={id}
        value={displayValue}
        onChange={handleChange}
        maxLength={18}
        placeholder="GALO800101HSLRPN01"
        error={error}
        autofilled={autofilled}
        {...props}
      />
    )
  }
)

CURPInput.displayName = "CURPInput"

export { CURPInput }
export type { CURPInputProps }
