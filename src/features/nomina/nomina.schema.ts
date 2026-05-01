/**
 * Archivo: features/nomina/nomina.schema.ts
 * Propósito: Esquemas de validación Zod para nómina y datos bancarios.
 * Define reglas para formularios de información laboral y cuenta bancaria.
 */
import { z } from "zod"

/** Opciones de bancos disponibles */
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

/** Esquema para datos de nómina */
const nominaSchema = z.object({
  rfc: z.string().optional(),
  noEmpleado: z.string().optional(),
  dependencia: z.string().optional(),
  departamento: z.string().optional(),
  puesto: z.string().optional(),
  ingresoMensual: z.coerce.number().min(0).optional(),
})

/** Esquema para datos de cuenta bancaria */
const cuentaSchema = z.object({
  numeroCuenta: z.string().optional(),
  banco: z.enum([...BANCO_OPTIONS, ""] as const).optional(),
  clabe: z.string().regex(/^\d{0,18}$/, "CLABE solo permite números (máx 18)").optional(),
})

export { nominaSchema, cuentaSchema, BANCO_OPTIONS }
export type NominaFormData = z.infer<typeof nominaSchema>
export type CuentaFormData = z.infer<typeof cuentaSchema>
