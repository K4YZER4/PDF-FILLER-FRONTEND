/**
 * Archivo: components/forms/DateInput.tsx
 * Propósito: Input para fechas que convierte automáticamente a formato ISO.
 * Acepta formato DD/MM/YYYY y lo convierte a YYYY-MM-DD.
 */
import { forwardRef, useCallback } from "react"
import { Input } from "@/components/ui"

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  error?: string
  autofilled?: boolean
  onChange?: (value: string) => void
}

/** Convierte una fecha a formato ISO (YYYY-MM-DD) */
function convertToISO(raw: string): string {
  if (!raw) return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
    const [dd, mm, yyyy] = raw.split("/")
    return `${yyyy}-${mm}-${dd}`
  }
  return raw
}

/** Input que convierte fechas a formato ISO automáticamente */
const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ error, autofilled, id, onChange, value, ...props }, ref) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const iso = convertToISO(e.target.value)
        onChange?.(iso)
      },
      [onChange]
    )

    return (
      <Input
        ref={ref}
        id={id}
        type="date"
        value={value as string}
        onChange={handleChange}
        error={error}
        autofilled={autofilled}
        {...props}
      />
    )
  }
)

DateInput.displayName = "DateInput"

export { DateInput }
export type { DateInputProps }
