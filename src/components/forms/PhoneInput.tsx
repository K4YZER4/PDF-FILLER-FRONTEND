/**
 * Archivo: components/forms/PhoneInput.tsx
 * Propósito: Input para números telefónicos con validación numérica.
 * Solo acepta dígitos, límite de 10 caracteres (formato mexicano).
 */
import { forwardRef, useState, useCallback } from "react"
import { Input } from "@/components/ui"

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  error?: string
  autofilled?: boolean
  onChange?: (value: string) => void
}

/** Input especializado para teléfonos (10 dígitos) */
const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
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
        type="tel"
        value={displayValue}
        onChange={handleChange}
        maxLength={10}
        placeholder="6671234567"
        error={error}
        autofilled={autofilled}
        inputMode="numeric"
        {...props}
      />
    )
  }
)

PhoneInput.displayName = "PhoneInput"

export { PhoneInput }
export type { PhoneInputProps }
