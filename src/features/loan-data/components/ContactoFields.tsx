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

function getFieldError(fieldId: string, value: string): string | undefined {
  switch (fieldId) {
    case "tel": case "celular": case "telCasa":
      return value.length > 0 && value.length !== 10 ? "Deben ser 10 dígitos" : undefined
    default:
      return undefined
  }
}

function isFieldFilled(fieldId: string, value: string): boolean {
  if (!value) return false
  switch (fieldId) {
    case "tel": case "celular": case "telCasa": return value.length === 10
    case "correo": return value.includes("@")
    default: return value.length > 0
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
        return (
          <div key={field.id} className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              {field.label} <span className="text-error">*</span>
            </label>
            {renderLoanField(field, val, filled, (v) => update(field.id as keyof ContactoData, v), error)}
          </div>
        )
      })}
    </div>
  )
}

export { ContactoFields }
