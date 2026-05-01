/**
 * Archivo: features/credito/credito.schema.ts
 * Propósito: Esquemas de validación Zod para la pestaña de Crédito.
 * Define reglas para: solicitud de crédito, asesor, contacto, antigüedad y referencias.
 */
import { z } from "zod"

/** Opciones de plazo en quincenas */
const PLAZO_OPTIONS = [24, 36, 48, 72, 96, 120] as const

/** Esquema para solicitud de crédito (monto y plazo) */
const creditoSchema = z.object({
  montoNeto: z.coerce
    .number()
    .min(1000, "Monto mínimo $1,000")
    .max(200000, "Monto máximo $200,000"),
  plazoQuincenas: z.enum(PLAZO_OPTIONS.map(String) as [string, ...string[]]).optional(),
})

/** Esquema para datos del asesor/vendedor */
const asesorSchema = z.object({
  folio: z.string().optional(),
  sucursal: z.string().optional(),
  numVendedor: z.string().optional(),
  vendedor: z.string().optional(),
  fechaContrato: z.string().optional(),
  fechaArranque: z.string().optional(),
  lugarFecha: z.string().optional(),
  mesDescuento: z.string().optional(),
  añoDescuento: z.string().max(4).optional(),
})

/** Esquema para información de contacto y estado civil */
const contactoSchema = z.object({
  telefonoCelular: z.string().regex(/^\d{0,10}$/, "Teléfono: 10 dígitos").optional(),
  telefonoCasa: z.string().regex(/^\d{0,10}$/, "Teléfono: 10 dígitos").optional(),
  mail: z.string().email("Correo inválido").or(z.literal("")).optional(),
  estadoCivil: z.enum(["SOLTERO", "CASADO", "DIVORCIADO", "VIUDO", "UNION LIBRE", ""]).optional(),
})

/** Esquema para antigüedad laboral */
const antiguedadSchema = z.object({
  fechaIngreso: z.string().optional(),
  mesesAntiguedad: z.coerce.number().min(0).optional(),
  anosAntiguedad: z.coerce.number().min(0).optional(),
})

/** Esquema para una referencia personal */
const referenciaSchema = z.object({
  nombre: z.string().optional(),
  telefono: z.string().regex(/^\d{0,10}$/, "Teléfono: 10 dígitos").optional(),
})

/** Esquema para las 3 referencias personales */
const referenciasSchema = z.object({
  referencia1: referenciaSchema,
  referencia2: referenciaSchema,
  referencia3: referenciaSchema,
})

export {
  creditoSchema,
  asesorSchema,
  contactoSchema,
  antiguedadSchema,
  referenciasSchema,
  referenciaSchema,
  PLAZO_OPTIONS,
}
export type CreditoFormData = z.infer<typeof creditoSchema>
export type AsesorFormData = z.infer<typeof asesorSchema>
export type ContactoFormData = z.infer<typeof contactoSchema>
export type AntiguedadFormData = z.infer<typeof antiguedadSchema>
export type ReferenciasFormData = z.infer<typeof referenciasSchema>
export type ReferenciaFormData = z.infer<typeof referenciaSchema>
