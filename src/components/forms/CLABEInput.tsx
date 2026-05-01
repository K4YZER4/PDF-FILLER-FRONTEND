/**
 * Archivo: components/forms/CLABEInput.tsx
 * Propósito: Input para CLABE interbancaria con validación numérica.
 * Solo acepta dígitos, límite de 18 caracteres.
 */
import { forwardRef, useState, useCallback } from "react"
import { Input } from "@/components/ui"

interface CLABEInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  error?: string
  autofilled?: boolean
  onChange?: (value: string) => void
}

/** Input especializado para CLABE (18 dígitos numéricos) */
const CLABEInput = forwardRef<HTMLInputElement, CLABEInputProps>(
  ({ error, autofilled, id, onChange, value, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(value as string || "")

    /** Solo permite dígitos numéricos */
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "")
        setDisplayValue(digits)
        onChange?.(digits)
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
        placeholder="021180012345678901"
        error={error}
        autofilled={autofilled}
        inputMode="numeric"
        {...props}
      />
    )
  }
)

CLABEInput.displayName = "CLABEInput"

export { CLABEInput }
export type { CLABEInputProps }
