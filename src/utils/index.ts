/**
 * Archivo: utils/index.ts
 * Propósito: Archivo barrel que re-exporta todas las utilidades de la aplicación.
 */

// Funciones de formateo
export { formatCurrency, formatPercentage, downloadBlob } from "./format"

// Funciones de manejo de fechas
export { convertToISO, calculateSeniority, getDefaultDischargeMonth } from "./date"

// Funciones de validación
export {
  REQUIRED_INE_FIELDS,
  REQUIRED_DOMICILIO_FIELDS,
  REQUIRED_FIELD_MAP,
  getMissingRequiredFields,
  validateCURP,
  validateCLABE,
  validatePhone,
  validateCP,
} from "./validation"
