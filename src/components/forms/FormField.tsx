/**
 * Archivo: components/forms/FormField.tsx
 * Propósito: Componentes para envolver campos de formulario con etiqueta y validación.
 * Proporciona estructura visual consistente para inputs y selects.
 */
import { Input, Select } from "@/components/ui"
import type { SelectOption } from "@/components/ui"

/** Props base para FormField */
interface FormFieldProps {
  id: string
  label: string
  required?: boolean     // Si el campo es obligatorio
  error?: string         // Mensaje de error
  autofilled?: boolean   // Si fue llenado por OCR
  hint?: string          // Texto de ayuda adicional
  children: React.ReactNode
}

/** Props para FormFieldInput (envuelve un Input) */
interface FormFieldInputProps extends Omit<FormFieldProps, "children"> {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

/** Props para FormFieldSelect (envuelve un Select) */
interface FormFieldSelectProps extends Omit<FormFieldProps, "children"> {
  options: SelectOption[]
  placeholder?: string
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement>
}

/** Contenedor visual para campos de formulario con etiqueta y estados */
function FormField({
  id,
  label,
  required,
  error,
  autofilled,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-0.5 ${error ? "has-error" : ""}`}>
      <label htmlFor={id} className="text-xs font-medium text-stone-500 flex items-center gap-1">
        {label}
        {required && <span className="text-red-600 text-[10px]">*</span>}
        {/* Badge que indica si el campo fue autollenado por OCR */}
        {autofilled && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-success-tint text-success border border-success-tint">
            Auto
          </span>
        )}
        {hint && (
          <span className="font-normal text-stone-400">{hint}</span>
        )}
      </label>
      {children}
    </div>
  )
}

/** FormField que contiene un Input */
function FormFieldInput({
  id,
  label,
  required,
  error,
  autofilled,
  hint,
  inputProps,
}: FormFieldInputProps) {
  return (
    <FormField id={id} label={label} required={required} error={error} autofilled={autofilled} hint={hint}>
      <Input id={id} error={error} autofilled={autofilled} {...inputProps} />
    </FormField>
  )
}

/** FormField que contiene un Select */
function FormFieldSelect({
  id,
  label,
  required,
  error,
  autofilled,
  hint,
  options,
  placeholder,
  selectProps,
}: FormFieldSelectProps) {
  return (
    <FormField id={id} label={label} required={required} error={error} autofilled={autofilled} hint={hint}>
      <Select
        id={id}
        error={error}
        autofilled={autofilled}
        options={options}
        placeholder={placeholder}
        {...selectProps}
      />
    </FormField>
  )
}

export { FormField, FormFieldInput, FormFieldSelect }
export type { FormFieldProps, FormFieldInputProps, FormFieldSelectProps }
