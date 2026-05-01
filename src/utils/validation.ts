/**
 * Archivo: utils/validation.ts
 * Propósito: Funciones de validación para campos del formulario.
 * Incluye validaciones de formato (CURP, CLABE, teléfono) y campos requeridos.
 */

/** Campos obligatorios de la INE */
const REQUIRED_INE_FIELDS = [
  "nombre1",
  "apellidoPaterno",
  "apellidoMaterno",
  "curp",
  "fechaNac",
] as const

/** Campos obligatorios del domicilio */
const REQUIRED_DOMICILIO_FIELDS = [
  "calle",
  "numeroCasa",
  "colonia",
  "codigoPostal",
  "municipio",
  "estado",
] as const

/** Interfaz para mapeo de campos requeridos con etiquetas legibles */
interface ValidationField {
  id: string
  label: string
}

/** Mapa de campos requeridos con sus etiquetas para mostrar al usuario */
const REQUIRED_FIELD_MAP: ValidationField[] = [
  { id: "nombre1", label: "Primer Nombre" },
  { id: "apellidoPaterno", label: "Apellido Paterno" },
  { id: "apellidoMaterno", label: "Apellido Materno" },
  { id: "curp", label: "CURP" },
  { id: "fechaNac", label: "Fecha de Nacimiento" },
  { id: "calle", label: "Calle" },
  { id: "numeroCasa", label: "No. Ext" },
  { id: "colonia", label: "Colonia" },
  { id: "codigoPostal", label: "CP" },
  { id: "municipio", label: "Municipio" },
  { id: "estado", label: "Estado" },
]

/**
 * Verifica qué campos requeridos no han sido llenados.
 * @param ineData - Datos de la INE
 * @param domicilioData - Datos del domicilio
 * @returns Array con los nombres de los campos faltantes
 */
function getMissingRequiredFields(
  ineData: Record<string, unknown>,
  domicilioData: Record<string, unknown>
): string[] {
  const missing: string[] = []

  for (const field of REQUIRED_INE_FIELDS) {
    if (!ineData[field] || String(ineData[field]).trim() === "") {
      missing.push(field)
    }
  }

  for (const field of REQUIRED_DOMICILIO_FIELDS) {
    if (!domicilioData[field] || String(domicilioData[field]).trim() === "") {
      missing.push(field)
    }
  }

  return missing
}

/**
 * Valida que una CURP tenga el formato correcto.
 * Formato: 4 letras + 6 dígitos + H/M + 5 letras + 2 alfanuméricos
 */
function validateCURP(curp: string): boolean {
  return /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2}$/.test(curp)
}

/**
 * Valida que una CLABE interbancaria tenga 18 dígitos.
 */
function validateCLABE(clabe: string): boolean {
  return /^\d{18}$/.test(clabe)
}

/**
 * Valida que un número telefónico tenga 10 dígitos.
 */
function validatePhone(phone: string): boolean {
  return /^\d{10}$/.test(phone)
}

/**
 * Valida que un código postal tenga 5 dígitos.
 */
function validateCP(cp: string): boolean {
  return /^\d{5}$/.test(cp)
}

export {
  REQUIRED_INE_FIELDS,
  REQUIRED_DOMICILIO_FIELDS,
  REQUIRED_FIELD_MAP,
  getMissingRequiredFields,
  validateCURP,
  validateCLABE,
  validatePhone,
  validateCP,
}
