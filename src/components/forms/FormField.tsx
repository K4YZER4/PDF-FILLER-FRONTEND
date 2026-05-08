/**
 * Archivo: components/forms/FormField.tsx
 * Propósito: Campo de formulario con label y input.
 */
import { Input } from "@/components/ui"

interface FormFieldProps {
  id: string
  label: string
  value: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
}

function FormField({ id, label, value, onChange, placeholder, type = "text" }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium text-stone-600 block">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  )
}

export { FormField }
