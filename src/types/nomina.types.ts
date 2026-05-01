/**
 * Archivo: types/nomina.types.ts
 * Propósito: Define los tipos para datos de nómina y cuentas bancarias.
 * Utilizado para el escaneo OCR de recibos de nómina y estados de cuenta.
 */

/** Opciones disponibles de bancos en México */
const BANCO_OPTIONS = [
  "BBVA",
  "SANTANDER",
  "BANAMEX",
  "BANORTE",
  "HSBC",
  "SCOTIABANK",
  "INBURSA",
  "AZTECA",
  "BIENESTAR",
  "OTRO",
] as const

/** Tipo derivado de las opciones de banco */
type Banco = (typeof BANCO_OPTIONS)[number]

/** Datos extraídos del recibo de nómina mediante OCR */
interface NominaData {
  rfc: string              // Registro Federal de Contribuyentes
  noEmpleado: string       // Número de empleado
  dependencia: string      // Dependencia o entidad donde trabaja
  departamento: string     // Departamento o área
  puesto: string           // Puesto de trabajo
  ingresoMensual: number  // Salario mensual (en pesos mexicanos)
}

/** Datos extraídos del estado de cuenta bancario */
interface EstadoCuentaData {
  numeroCuenta: string     // Número de cuenta bancaria
  clabe: string            // CLABE interbancaria (18 dígitos)
  banco: Banco | ""        // Banco seleccionado
  rfc: string              // RFC asociado a la cuenta
}

/** Respuesta del API al escanear una nómina */
type ScanNominaResponse = {
  datos: NominaData
}

/** Respuesta del API al escanear un estado de cuenta */
type ScanEstadoCuentaResponse = {
  datos: EstadoCuentaData
}

export type {
  BANCO_OPTIONS,
  Banco,
  NominaData,
  EstadoCuentaData,
  ScanNominaResponse,
  ScanEstadoCuentaResponse,
}
