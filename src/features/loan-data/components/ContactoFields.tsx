/**
 * Sección "Contacto y Estado Civil" del accordion.
 *
 * Renderiza los campos tel, celular, telCasa, correo y estadoCivil mediante
 * el patrón config-driven:
 *   - La definición de los campos está en constants.ts (loanSections[0])
 *   - Cada campo se renderiza con renderLoanField según su tipo
 *   - Lee/escribe directamente en el store de Zustand (sin estado local)
 *
 * Flujo de datos:
 *   - Lectura: store.formData.contactoData (Zustand selector)
 *   - Escritura: setFormData("contactoData", ...) con getState() para evitar
 *     stale closures al actualizar un campo individual dentro del objeto.
 *
 * Validación: getFieldError retorna "Deben ser 10 dígitos" para tel/celular/telCasa
 *             cuando hay contenido pero longitud distinta de 10.
 *
 * Uso:
 *   <ContactoFields />
 */

import { useCallback } from "react"
import { useContractStore } from "@/store/useContractStore"
import { loanSections } from "../constants"
import { renderLoanField } from "../utils/fieldRenderer"
import type { ContactoData } from "../types"

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

function getFieldError(fieldId: string, value: string): string | undefined {
  if (!value) return undefined

  switch (fieldId) {
    case "celular":
    case "telCasa":
      return value.length !== 10 ? "Deben ser 10 dígitos" : undefined
    case "correo":
      if (value.length > 150) return "Máximo 150 caracteres"
      return !EMAIL_REGEX.test(value.trim()) ? "Correo inválido (ej: usuario@correo.com)" : undefined
    case "dependientesEconomicos": {
      const num = Number(value)
      if (isNaN(num) || num < 0 || num > 20) return "Debe ser entre 0 y 20"
      return undefined
    }
    case "entreCalles":
      return value.length > 100 ? "Máximo 100 caracteres" : undefined
    default:
      return undefined
  }
}

function isFieldFilled(fieldId: string, value: string): boolean {
  if (!value) return false
  const trimmed = value.trim()
  if (!trimmed) return false

  switch (fieldId) {
    case "celular":
    case "telCasa":
      return trimmed.length === 10
    case "correo":
      return trimmed.length <= 150 && EMAIL_REGEX.test(trimmed)
    case "dependientesEconomicos": {
      const num = Number(trimmed)
      return !isNaN(num) && num >= 0 && num <= 20
    }
    case "entreCalles":
      return trimmed.length > 0 && trimmed.length <= 100
    default:
      return trimmed.length > 0
  }
}

function ContactoFields() {
  const setFormData = useContractStore((s) => s.setFormData)
  const contactoData = useContractStore((s) => s.formData.contactoData)

  const update = useCallback(
    (key: keyof ContactoData, value: string) => {
      const current = useContractStore.getState().formData.contactoData
      setFormData("contactoData", { ...current, [key]: value })
    },
    [setFormData],
  )

  const section = loanSections[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {section.fields.map((field) => {
        const val = contactoData[field.id as keyof ContactoData] ?? ""
        const filled = isFieldFilled(field.id, val)
        const error = getFieldError(field.id, val)
        const isRequired = field.required !== false
        const invalid = isRequired && !filled
        return (
          <div key={field.id} className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              {field.label} {isRequired && <span className="text-error">*</span>}
            </label>
            {renderLoanField(
              field,
              val,
              filled,
              (v) => update(field.id as keyof ContactoData, v),
              error,
              invalid,
            )}
          </div>
        )
      })}
    </div>
  )
}

export { ContactoFields }
