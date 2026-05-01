/**
 * Archivo: types/tabla.types.ts
 * Propósito: Define los tipos para la tabla de cálculo crediticio.
 * Estos datos se utilizan para calcular montos, intereses y descuentos quincenales.
 */

/** Datos resultantes del cálculo del crédito */
interface TablaCreditoData {
  montoPagare: number      // Monto total a pagar (con intereses)
  descuentoQuincenal: number // Cantidad a descontar cada quincena
  cat: number              // Costo Anual Total (porcentaje)
  tasaMensual: number      // Tasa de interés mensual (porcentaje)
  importeInteres?: number  // Importe total de intereses (opcional)
}

/** Datos necesarios para solicitar un cálculo de crédito al API */
interface TablaCreditoRequest {
  monto: number            // Monto solicitado del préstamo
  quincenas: PlazoQuincenas // Plazo en número de quincenas
}

/** Opciones de plazo disponibles (en quincenas) */
const PLAZO_OPTIONS = [24, 36, 48, 72, 96, 120] as const
/** Tipo derivado de las opciones de plazo */
type PlazoQuincenas = (typeof PLAZO_OPTIONS)[number]

export type {
  TablaCreditoData,
  TablaCreditoRequest,
  PLAZO_OPTIONS,
  PlazoQuincenas,
}
