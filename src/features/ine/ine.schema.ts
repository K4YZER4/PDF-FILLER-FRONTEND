/**
 * Archivo: features/ine/ine.schema.ts
 * Propósito: Esquema de validación Zod para el formulario de la INE.
 * Define las reglas de validación para datos personales y domicilio.
 */
import { z } from "zod"

/** Esquema para la sección de domicilio */
const domicilioSchema = z.object({
  calle: z.string().min(1, "Calle es requerido"),
  numeroCasa: z.string().min(1, "No. Ext es requerido"),
  colonia: z.string().min(1, "Colonia es requerido"),
  codigoPostal: z.string().regex(/^\d{5}$/, "CP debe tener 5 dígitos"),
  municipio: z.string().min(1, "Municipio es requerido"),
  estado: z.string().min(1, "Estado es requerido"),
})

/** Esquema principal para todos los datos de la INE */
const ineSchema = z.object({
  nombre1: z.string().min(1, "Primer nombre es requerido"),
  nombre2: z.string().optional(),
  apellidoPaterno: z.string().min(1, "Apellido paterno es requerido"),
  apellidoMaterno: z.string().min(1, "Apellido materno es requerido"),
  curp: z
    .string()
    .length(18, "CURP debe tener 18 caracteres")
    .regex(/^[A-Z0-9]+$/, "CURP solo permite letras y números"),
  sexo: z.enum(["H", "M", ""]).optional(),
  fechaNac: z.string().min(1, "Fecha de nacimiento es requerida"),
  claveElector: z.string().max(18).optional(),
  domicilio: domicilioSchema,
  seccion: z.string().max(4).optional(),
  vigencia: z.string().max(4).optional(),
  numEmision: z.string().max(2).optional(),
})

export { ineSchema }
export type INEFormData = z.infer<typeof ineSchema>
