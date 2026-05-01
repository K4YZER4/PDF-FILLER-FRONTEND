/**
 * Archivo: types/index.ts
 * Propósito: Archivo barrel que re-exporta todos los tipos de la aplicación.
 * Centraliza las importaciones de tipos para facilitar su uso en otros módulos.
 */

// Tipos relacionados con la INE (identificación oficial mexicana)
export type { INEDomicilio, INEData, ScanINEFields } from "./ine.types"

// Tipos relacionados con nómina y datos bancarios
export type {
  BANCO_OPTIONS,
  Banco,
  NominaData,
  EstadoCuentaData,
  ScanNominaResponse,
  ScanEstadoCuentaResponse,
} from "./nomina.types"

// Tipos para la tabla de crédito y cálculos financieros
export type {
  TablaCreditoData,
  TablaCreditoRequest,
  PLAZO_OPTIONS,
  PlazoQuincenas,
} from "./tabla.types"

// Tipos para datos adicionales del contrato (referencias, contacto, etc.)
export type {
  ESTADO_CIVIL_OPTIONS,
  EstadoCivil,
  PersonalReference,
  ExtraData,
} from "./extra.types"

// Tipos para la comunicación con la API y estados de la aplicación
export type {
  ScanStatus,
  TabStatus,
  ApiResponse,
  ApiError,
  ContractGenerationPayload,
} from "./api.types"
