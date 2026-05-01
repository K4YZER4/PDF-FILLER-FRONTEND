/**
 * Archivo: features/credito/index.ts
 * Propósito: Archivo barrel que re-exporta componentes y tipos de la feature Crédito.
 * Incluye pantalla principal, esquemas de validación y tipos TypeScript.
 */

export { CreditoScreen } from "./CreditoScreen"

export {
  creditoSchema,
  asesorSchema,
  contactoSchema,
  antiguedadSchema,
  referenciasSchema,
  referenciaSchema,
  PLAZO_OPTIONS,
} from "./credito.schema"

export type {
  CreditoFormData,
  AsesorFormData,
  ContactoFormData,
  AntiguedadFormData,
  ReferenciasFormData,
  ReferenciaFormData,
} from "./credito.schema"
