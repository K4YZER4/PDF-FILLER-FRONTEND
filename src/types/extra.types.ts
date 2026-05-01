/**
 * Archivo: types/extra.types.ts
 * Propósito: Define tipos para datos adicionales del contrato.
 * Incluye información del cliente, vendedor, contacto y referencias personales.
 */

/** Opciones disponibles para el estado civil */
const ESTADO_CIVIL_OPTIONS = [
  "SOLTERO",
  "CASADO",
  "DIVORCIADO",
  "VIUDO",
  "UNION LIBRE",
] as const

/** Tipo derivado de las opciones de estado civil */
type EstadoCivil = (typeof ESTADO_CIVIL_OPTIONS)[number]

/** Referencia personal proporcionada por el cliente */
interface PersonalReference {
  nombre: string
  telefono: string
}

/** Datos adicionales necesarios para la generación del contrato */
interface ExtraData {
  folio: string                   // Folio del contrato
  sucursal: string                // Sucursal donde se tramita
  numVendedor: string             // Número del vendedor
  vendedor: string                // Nombre del vendedor
  fechaContrato: string           // Fecha de firma del contrato
  fechaArranque: string           // Fecha de inicio de descuentos
  lugarFecha: string              // Lugar y fecha para el contrato
  mesDescuento: string            // Mes en que inician los descuentos
  anioDescuento: string           // Año de inicio de descuentos
  telefonoCelular: string         // Teléfono celular del cliente
  telefonoCasa: string            // Teléfono de casa del cliente
  mail: string                    // Correo electrónico
  estadoCivil: EstadoCivil | ""    // Estado civil del cliente
  fechaIngreso: string            // Fecha de ingreso al trabajo
  mesesAntiguedad: number         // Meses de antigüedad laboral
  anosAntiguedad: number          // Años de antigüedad laboral
  referencias: PersonalReference[] // Lista de referencias personales (3)
}

export type {
  ESTADO_CIVIL_OPTIONS,
  EstadoCivil,
  PersonalReference,
  ExtraData,
}
